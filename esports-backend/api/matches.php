<?php
/**
 * MATCHES API
 * 
 * GET /api/matches.php?status=live     → Live matches (for hero section)
 * GET /api/matches.php?tournament=5    → Matches by tournament
 * GET /api/matches.php                 → All matches
 * 
 * POST /api/matches.php               → Create match (admin)
 * PUT  /api/matches.php                → Update score (admin)
 */

require_once '../config/database.php';
require_once '../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// ============================================
// GET - Fetch Matches
// ============================================
if ($method === 'GET') {
    try {
        $sql = "
            SELECT 
                m.*,
                g.name as game_name,
                t1.name as team1_name,
                t1.logo as team1_logo,
                t2.name as team2_name,
                t2.logo as team2_logo,
                tour.title as tournament_title
            FROM matches m
            JOIN games g ON m.game_id = g.id
            JOIN teams t1 ON m.team1_id = t1.id
            JOIN teams t2 ON m.team2_id = t2.id
            LEFT JOIN tournaments tour ON m.tournament_id = tour.id
            WHERE 1=1
        ";
        $params = [];
        
        // Filter by status (live, scheduled, completed)
        if (!empty($_GET['status'])) {
            $sql .= " AND m.status = ?";
            $params[] = sanitize($_GET['status']);
        }
        
        // Filter by tournament
        if (!empty($_GET['tournament'])) {
            $sql .= " AND m.tournament_id = ?";
            $params[] = intval($_GET['tournament']);
        }
        
        // Filter by game
        if (!empty($_GET['game'])) {
            $sql .= " AND g.slug = ?";
            $params[] = sanitize($_GET['game']);
        }
        
        $sql .= " ORDER BY m.match_date DESC";
        
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $matches = $stmt->fetchAll();
        
        // Format response for frontend
        foreach ($matches as &$match) {
            $match['team1'] = [
                'id' => $match['team1_id'],
                'name' => $match['team1_name'],
                'logo' => $match['team1_logo']
            ];
            $match['team2'] = [
                'id' => $match['team2_id'],
                'name' => $match['team2_name'],
                'logo' => $match['team2_logo']
            ];
            
            // Determine winner
            if ($match['status'] === 'completed') {
                $match['winner'] = $match['team1_score'] > $match['team2_score'] ? $match['team1_id'] : 
                                   ($match['team2_score'] > $match['team1_score'] ? $match['team2_id'] : null);
            }
            
            // Is live now?
            $match['is_live'] = $match['status'] === 'live';
        }
        
        jsonResponse(['success' => true, 'data' => $matches]);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Failed to fetch matches'], 500);
    }
}

// ============================================
// POST - Create Match (Admin)
// ============================================
if ($method === 'POST') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['game_id', 'team1_id', 'team2_id', 'match_date']);
    
    try {
        $stmt = $db->prepare("
            INSERT INTO matches 
            (tournament_id, game_id, team1_id, team2_id, best_of, stream_url, match_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $data['tournament_id'] ?? null,
            intval($data['game_id']),
            intval($data['team1_id']),
            intval($data['team2_id']),
            intval($data['best_of'] ?? 3),
            sanitize($data['stream_url'] ?? ''),
            $data['match_date']
        ]);
        
        jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Failed to create match'], 400);
    }
}

// ============================================
// PUT - Update Score / Status (Admin)
// ============================================
if ($method === 'PUT') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id'])) {
        jsonResponse(['error' => 'Match ID required'], 400);
    }
    
    try {
        $fields = [];
        $values = [];
        
        if (isset($data['team1_score'])) {
            $fields[] = "team1_score = ?";
            $values[] = intval($data['team1_score']);
        }
        if (isset($data['team2_score'])) {
            $fields[] = "team2_score = ?";
            $values[] = intval($data['team2_score']);
        }
        if (isset($data['status'])) {
            $fields[] = "status = ?";
            $values[] = sanitize($data['status']);
        }
        if (isset($data['stream_url'])) {
            $fields[] = "stream_url = ?";
            $values[] = sanitize($data['stream_url']);
        }
        
        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }
        
        $values[] = intval($data['id']);
        $sql = "UPDATE matches SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        
        // Auto-update match status based on score
        if (isset($data['team1_score']) && isset($data['team2_score'])) {
            $stmt = $db->prepare("SELECT best_of FROM matches WHERE id = ?");
            $stmt->execute([$data['id']]);
            $match = $stmt->fetch();
            
            $winThreshold = ceil($match['best_of'] / 2);
            if ($data['team1_score'] >= $winThreshold || $data['team2_score'] >= $winThreshold) {
                $stmt = $db->prepare("UPDATE matches SET status = 'completed' WHERE id = ?");
                $stmt->execute([$data['id']]);
            }
        }
        
        jsonResponse(['success' => true, 'message' => 'Match updated']);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Update failed'], 500);
    }
}

jsonResponse(['error' => 'Method not allowed'], 405);
?>
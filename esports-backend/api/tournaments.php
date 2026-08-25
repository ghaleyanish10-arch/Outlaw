<?php
/**
 * TOURNAMENTS API
 * 
 * GET  /api/tournaments.php              → All upcoming tournaments
 * GET  /api/tournaments.php?game=valorant → Filter by game
 * GET  /api/tournaments.php?id=5         → Single tournament
 * POST /api/tournaments.php              → Create tournament (admin)
 */

require_once '../config/database.php';
require_once '../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// ============================================
// GET - Fetch Tournaments
// ============================================
if ($method === 'GET') {
    try {
        // Single tournament
        if (!empty($_GET['id'])) {
            $stmt = $db->prepare("
                SELECT t.*, g.name as game_name, g.slug as game_slug 
                FROM tournaments t
                JOIN games g ON t.game_id = g.id
                WHERE t.id = ?
            ");
            $stmt->execute([intval($_GET['id'])]);
            $tournament = $stmt->fetch();
            
            if (!$tournament) {
                jsonResponse(['error' => 'Tournament not found'], 404);
            }
            
            // Get registered teams/players
            $stmt2 = $db->prepare("
                SELECT r.*, tm.name as team_name 
                FROM registrations r
                LEFT JOIN teams tm ON r.team_id = tm.id
                WHERE r.tournament_id = ?
            ");
            $stmt2->execute([$tournament['id']]);
            $tournament['registrations'] = $stmt2->fetchAll();
            
            jsonResponse(['success' => true, 'data' => $tournament]);
        }
        
        // List tournaments
        $sql = "
            SELECT 
                t.*,
                g.name as game_name,
                g.slug as game_slug,
                COUNT(r.id) as actual_registered
            FROM tournaments t
            JOIN games g ON t.game_id = g.id
            LEFT JOIN registrations r ON t.id = r.tournament_id AND r.status = 'approved'
            WHERE 1=1
        ";
        $params = [];
        
        // Filter by game slug
        if (!empty($_GET['game'])) {
            $sql .= " AND g.slug = ?";
            $params[] = sanitize($_GET['game']);
        }
        
        // Filter by status
        if (!empty($_GET['status'])) {
            $sql .= " AND t.status = ?";
            $params[] = sanitize($_GET['status']);
        }
        
        $sql .= " GROUP BY t.id ORDER BY t.start_date ASC";
        
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $tournaments = $stmt->fetchAll();
        
        // Format for frontend (matches your card design)
        foreach ($tournaments as &$t) {
            $t['spots_left'] = $t['max_teams'] - ($t['actual_registered'] ?? 0);
            $t['is_full'] = $t['spots_left'] <= 0;
            $t['registration_percentage'] = round(
                (($t['actual_registered'] ?? 0) / $t['max_teams']) * 100
            );
        }
        
        jsonResponse(['success' => true, 'count' => count($tournaments), 'data' => $tournaments]);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
}

// ============================================
// POST - Create Tournament (Admin Only)
// ============================================
if ($method === 'POST') {
    requireAdmin();
    
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['title', 'game_id', 'start_date', 'prize_pool']);
    
    try {
        $slug = sanitize($data['slug'] ?? strtolower(str_replace(' ', '-', $data['title'])));
        
        $stmt = $db->prepare("
            INSERT INTO tournaments 
            (title, slug, game_id, description, prize_pool, max_teams, start_date, end_date, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            sanitize($data['title']),
            $slug,
            intval($data['game_id']),
            sanitize($data['description'] ?? ''),
            sanitize($data['prize_pool']),
            intval($data['max_teams'] ?? 16),
            $data['start_date'],
            $data['end_date'] ?? null,
            verifyToken()
        ]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Tournament created',
            'id' => $db->lastInsertId()
        ], 201);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Failed to create tournament: ' . $e->getMessage()], 400);
    }
}

// ============================================
// PUT - Update Tournament
// ============================================
if ($method === 'PUT') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id'])) {
        jsonResponse(['error' => 'Tournament ID required'], 400);
    }
    
    try {
        $fields = [];
        $values = [];
        
        $allowed = ['title', 'description', 'prize_pool', 'max_teams', 'status', 'registration_open'];
        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = ?";
                $values[] = is_int($data[$field]) ? $data[$field] : sanitize($data[$field]);
            }
        }
        
        if (empty($fields)) {
            jsonResponse(['error' => 'No fields to update'], 400);
        }
        
        $values[] = intval($data['id']);
        $sql = "UPDATE tournaments SET " . implode(', ', $fields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        
        jsonResponse(['success' => true, 'message' => 'Tournament updated']);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Update failed'], 500);
    }
}

jsonResponse(['error' => 'Method not allowed'], 405);
?>
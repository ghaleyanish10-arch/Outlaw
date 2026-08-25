<?php
/**
 * TOURNAMENT REGISTRATION API
 * "Ready to Compete? Sign Up Now" button
 * 
 * POST /api/register.php
 *   Body: {tournament_id, player_name, player_email, player_discord, team_id?}
 * 
 * GET /api/register.php?tournament=5
 *   Returns registrations for a tournament
 */

require_once '../config/database.php';
require_once '../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// ============================================
// GET - Check registrations
// ============================================
if ($method === 'GET') {
    if (empty($_GET['tournament'])) {
        jsonResponse(['error' => 'Tournament ID required'], 400);
    }
    
    try {
        $stmt = $db->prepare("
            SELECT r.*, t.name as team_name 
            FROM registrations r
            LEFT JOIN teams t ON r.team_id = t.id
            WHERE r.tournament_id = ?
            ORDER BY r.registered_at DESC
        ");
        $stmt->execute([intval($_GET['tournament'])]);
        
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Failed to fetch registrations'], 500);
    }
}

// ============================================
// POST - Sign up for tournament
// ============================================
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['tournament_id', 'player_name', 'player_email']);
    
    $tournamentId = intval($data['tournament_id']);
    
    try {
        // Check if tournament exists and has space
        $stmt = $db->prepare("
            SELECT t.*, COUNT(r.id) as registered 
            FROM tournaments t
            LEFT JOIN registrations r ON t.id = r.tournament_id AND r.status = 'approved'
            WHERE t.id = ?
            GROUP BY t.id
        ");
        $stmt->execute([$tournamentId]);
        $tournament = $stmt->fetch();
        
        if (!$tournament) {
            jsonResponse(['error' => 'Tournament not found'], 404);
        }
        
        if ($tournament['status'] !== 'upcoming') {
            jsonResponse(['error' => 'Registration closed for this tournament'], 400);
        }
        
        if ($tournament['registered'] >= $tournament['max_teams']) {
            jsonResponse(['error' => 'Tournament is full'], 400);
        }
        
        // Check if already registered
        $stmt = $db->prepare("
            SELECT id FROM registrations 
            WHERE tournament_id = ? AND player_email = ?
        ");
        $stmt->execute([$tournamentId, sanitize($data['player_email'])]);
        if ($stmt->fetch()) {
            jsonResponse(['error' => 'You are already registered for this tournament'], 409);
        }
        
        // Get user ID if logged in
        $userId = null;
        $headers = getallheaders();
        if (!empty($headers['Authorization'])) {
            try {
                $userId = verifyToken();
            } catch (Exception $e) {
                // Not logged in is okay
            }
        }
        
        // Create registration
        $stmt = $db->prepare("
            INSERT INTO registrations 
            (tournament_id, user_id, team_id, player_name, player_email, player_discord, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        ");
        
        $stmt->execute([
            $tournamentId,
            $userId,
            !empty($data['team_id']) ? intval($data['team_id']) : null,
            sanitize($data['player_name']),
            sanitize($data['player_email']),
            sanitize($data['player_discord'] ?? '')
        ]);
        
        jsonResponse([
            'success' => true,
            'message' => 'Registration successful! Waiting for approval.',
            'registration_id' => $db->lastInsertId()
        ], 201);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Registration failed: ' . $e->getMessage()], 500);
    }
}

jsonResponse(['error' => 'Method not allowed'], 405);
?>
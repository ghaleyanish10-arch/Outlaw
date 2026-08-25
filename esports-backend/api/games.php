<?php
/**
 * GET /api/games.php
 * Returns: All games (Valorant, CS2, PUBG, etc.)
 * 
 * EXAMPLE RESPONSE:
 * {
 *   "success": true,
 *   "data": [
 *     {"id": 1, "name": "Valorant", "slug": "valorant", ...},
 *     ...
 *   ]
 * }
 */

require_once '../config/database.php';
require_once '../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    try {
        $stmt = $db->query("SELECT * FROM games WHERE is_active = 1 ORDER BY name");
        $games = $stmt->fetchAll();
        jsonResponse(['success' => true, 'data' => $games]);
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Failed to fetch games'], 500);
    }
}

// Admin: Add new game
if ($method === 'POST') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['name', 'slug']);
    
    try {
        $stmt = $db->prepare("INSERT INTO games (name, slug) VALUES (?, ?)");
        $stmt->execute([sanitize($data['name']), sanitize($data['slug'])]);
        jsonResponse(['success' => true, 'message' => 'Game added', 'id' => $db->lastInsertId()], 201);
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Game already exists or invalid data'], 400);
    }
}

jsonResponse(['error' => 'Method not allowed'], 405);
?>

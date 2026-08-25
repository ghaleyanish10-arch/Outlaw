<?php
/**
 * AUTHENTICATION API
 * 
 * POST /api/auth.php?action=register
 *   Body: {username, email, password}
 * 
 * POST /api/auth.php?action=login
 *   Body: {email, password}
 * 
 * GET  /api/auth.php?action=me
 *   Header: Authorization: Bearer <token>
 */

require_once '../config/database.php';
require_once '../includes/functions.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method !== 'POST' && $method !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$action = $_GET['action'] ?? '';

// ============================================
// REGISTER
// ============================================
if ($action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['username', 'email', 'password']);
    
    $username = sanitize($data['username']);
    $email = sanitize($data['email']);
    $password = $data['password'];
    
    // Validation
    if (strlen($username) < 3) {
        jsonResponse(['error' => 'Username must be at least 3 characters'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email format'], 400);
    }
    if (strlen($password) < 6) {
        jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
    }
    
    $hash = password_hash($password, PASSWORD_BCRYPT);
    
    try {
        $stmt = $db->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $hash]);
        
        $userId = $db->lastInsertId();
        $token = generateToken($userId);
        
        jsonResponse([
            'success' => true,
            'message' => 'Registration successful',
            'token' => $token,
            'user' => ['id' => $userId, 'username' => $username, 'email' => $email, 'role' => 'player']
        ], 201);
        
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            jsonResponse(['error' => 'Username or email already exists'], 409);
        }
        jsonResponse(['error' => 'Registration failed'], 500);
    }
}

// ============================================
// LOGIN
// ============================================
if ($action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['email', 'password']);
    
    $email = sanitize($data['email']);
    
    try {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($data['password'], $user['password'])) {
            jsonResponse(['error' => 'Invalid email or password'], 401);
        }
        
        $token = generateToken($user['id']);
        
        jsonResponse([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'avatar' => $user['avatar']
            ]
        ]);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Login failed'], 500);
    }
}

// ============================================
// GET CURRENT USER
// ============================================
if ($action === 'me') {
    $userId = verifyToken();
    
    try {
        $stmt = $db->prepare("SELECT id, username, email, role, avatar, created_at FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            jsonResponse(['error' => 'User not found'], 404);
        }
        
        jsonResponse(['success' => true, 'user' => $user]);
        
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Failed to fetch user'], 500);
    }
}

jsonResponse(['error' => 'Invalid action'], 400);
?>
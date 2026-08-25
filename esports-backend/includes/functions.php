<?php
/**
 * Helper Functions
 * 
 * These make your life easier when building APIs
 */

// Send JSON response
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }
    
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit;
}

// Validate required fields
function validateRequired($data, $fields) {
    $missing = [];
    foreach ($fields as $field) {
        if (empty($data[$field])) {
            $missing[] = $field;
        }
    }
    if (!empty($missing)) {
        jsonResponse(['error' => 'Missing required fields', 'fields' => $missing], 400);
    }
}

// Sanitize input
function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Generate JWT-like simple token (for beginners)
function generateToken($userId) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $time = time();
    $payload = json_encode([
        'iss' => 'esports-api',
        'iat' => $time,
        'exp' => $time + (86400 * 7), // 7 days
        'sub' => $userId
    ]);
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, 'your-secret-key-change-this', true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

// Verify token and return user_id
function verifyToken() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        jsonResponse(['error' => 'Unauthorized - No token provided'], 401);
    }
    
    $token = $matches[1];
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        jsonResponse(['error' => 'Invalid token format'], 401);
    }
    
    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
    
    if (!$payload || $payload['exp'] < time()) {
        jsonResponse(['error' => 'Token expired'], 401);
    }
    
    return $payload['sub'];
}

// Check if user is admin
function requireAdmin() {
    $userId = verifyToken();
    $db = getDB();
    $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user || $user['role'] !== 'admin') {
        jsonResponse(['error' => 'Admin access required'], 403);
    }
    return $userId;
}

// Upload image helper
function uploadImage($file, $directory = 'uploads/') {
    if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
        return null;
    }
    
    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowed)) {
        jsonResponse(['error' => 'Only JPG, PNG, GIF, WEBP images allowed'], 400);
    }
    
    if ($file['size'] > 5 * 1024 * 1024) { // 5MB max
        jsonResponse(['error' => 'Image too large. Max 5MB'], 400);
    }
    
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
    
    $filename = uniqid() . '_' . basename($file['name']);
    $path = $directory . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $path)) {
        return $path;
    }
    return null;
}
?>
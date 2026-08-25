<?php
/**
 * Database Configuration
 * 
 * HOW TO USE:
 * 1. Create database 'esports_db' in phpMyAdmin
 * 2. Run the SQL above
 * 3. Update credentials below
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'esports_db');
define('DB_USER', 'root');      // Change if different
define('DB_PASS', '');          // Your MySQL password
define('DB_CHARSET', 'utf8mb4');

class Database {
    private $connection;
    
    public function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
}

// Helper function to get DB instance
function getDB() {
    static $db = null;
    if ($db === null) {
        $db = new Database();
    }
    return $db->getConnection();
}
?>
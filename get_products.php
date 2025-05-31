<?php
header('Content-Type: application/json');


$host = 'localhost';
$dbname = 'techMe_db';
$username = 'root';
$password = '';

try {
    
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    
    $stmt = $conn->query("SELECT * FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
} catch(PDOException $e) {
    
    error_log("Database error: " . $e->getMessage());
    echo json_encode([]);
}
?>
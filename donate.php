<?php

/// get the form data
$name = $_POST['name'];
$mobile = $_POST['mobile'];
$amount = $_POST['amount'];

// get other information
$created_at = date('Y-m-d H:i:s');
$ip_address = $_SERVER['REMOTE_ADDR'];
$user_agent = $_SERVER['HTTP_USER_AGENT'];
$referrer = $_SERVER['HTTP_REFERER'];
$session_id = session_id();

// validate the form data
if (empty($name) || empty($mobile) || empty($amount)) {
    die('Error: Please fill out all required fields.');
}

// connect to the database
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "dbname";

$conn = new mysqli($servername, $username, $password, $dbname);

// check for errors
if ($conn->connect_error) {
    die('Error: Could not connect to the database.');
}

// prepare the SQL query
$stmt = $conn->prepare("INSERT INTO donations (name, mobile, amount, created_at, ip_address, user_agent, referrer, session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssisssss", $name, $mobile, $amount, $created_at, $ip_address, $user_agent, $referrer, $session_id);

// execute the SQL query
if ($stmt->execute()) {
    // success
    $response = array('success' => true);
} else {
    // error
    $response = array('success' => false, 'message' => 'Error: Could not save the donation.');
}

// return the response
header('Content-Type: application/json');
echo json_encode($response);

// close the database connection
$conn->close();

?>

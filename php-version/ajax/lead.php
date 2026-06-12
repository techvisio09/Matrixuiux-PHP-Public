<?php
// Lead capture from the chat widget form (name/email/phone + callback choice)
require_once __DIR__ . '/../includes/functions.php';

header('Content-Type: application/json');
$in = json_decode(file_get_contents('php://input'), true) ?: [];
$sessionId = substr(preg_replace('/[^a-zA-Z0-9_-]/', '', $in['session_id'] ?? ''), 0, 64);
$name = trim($in['name'] ?? '');
$email = trim($in['email'] ?? '');
$phone = trim($in['phone'] ?? '');
$callback = !empty($in['callback_requested']);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($phone) < 7) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please provide your name, a valid email and phone number.']);
    exit;
}

$stmt = db()->prepare('INSERT INTO chat_leads (session_id, name, email, phone, callback_requested, message) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$sessionId, $name, $email, $phone, $callback ? 1 : 0, $callback ? 'Callback requested via chat form' : 'Chat form contact']);
echo json_encode(['ok' => true]);

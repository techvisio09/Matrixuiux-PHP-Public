<?php
require_once __DIR__ . '/includes/functions.php';
require_admin();
$stmt = db()->prepare('SELECT html FROM email_outbox WHERE id = ?');
$stmt->execute([(int)($_GET['id'] ?? 0)]);
$row = $stmt->fetch();
if (!$row) { http_response_code(404); exit('Email not found'); }
header('Content-Type: text/html; charset=utf-8');
echo $row['html'];

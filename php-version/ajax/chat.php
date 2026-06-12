<?php
// Ask AI chat endpoint.
// Uses OpenAI if OPENAI_API_KEY is set in config.php, otherwise returns a contact fallback.
require_once __DIR__ . '/../includes/functions.php';

header('Content-Type: application/json');
$in = json_decode(file_get_contents('php://input'), true) ?: [];
$message = trim($in['message'] ?? '');
$sessionId = substr(preg_replace('/[^a-zA-Z0-9_-]/', '', $in['session_id'] ?? ''), 0, 64);

if ($message === '') {
    echo json_encode(['reply' => 'Please type a message.']);
    exit;
}

// Save a lead row if the message contains an email or phone number
$email = null;
$phone = null;
if (preg_match('/[\w.+-]+@[\w-]+\.[\w.]+/', $message, $m)) $email = $m[0];
if (preg_match('/\+?[\d][\d\s().-]{7,}\d/', $message, $m)) $phone = $m[0];
if ($email || $phone) {
    $stmt = db()->prepare('INSERT INTO chat_leads (session_id, email, phone, message) VALUES (?, ?, ?, ?)');
    $stmt->execute([$sessionId, $email, $phone, $message]);
}

if (OPENAI_API_KEY === '') {
    echo json_encode([
        'reply' => "Thanks for reaching out! Our live AI assistant is currently offline.\n\nYou can reach our team directly:\n📞 " . SITE_PHONE . " (" . SITE_HOURS . ")\n✉️ " . SITE_EMAIL . "\n\nLeave your email or phone number here and we'll get back to you within one business day.",
        'fallback' => true,
    ]);
    exit;
}

// Keep short conversation history in session
if (!isset($_SESSION['chat_history'])) $_SESSION['chat_history'] = [];
$_SESSION['chat_history'][] = ['role' => 'user', 'content' => $message];
$_SESSION['chat_history'] = array_slice($_SESSION['chat_history'], -10);

$system = 'You are Max, a friendly sales assistant for ' . SITE_LEGAL . ', an authorized reseller of genuine Microsoft software licenses (Office 2024/2021/2019 for PC & Mac, Windows 10/11, Project, Visio) and antivirus (Bitdefender, McAfee). '
    . 'Keep answers brief and helpful. Licenses are lifetime/perpetual one-time purchases with instant email delivery in 15-30 minutes. '
    . 'If the customer shows buying interest or needs support, politely ask for their name, email and phone (one at a time), and offer our toll-free number ' . SITE_PHONE . ' (' . SITE_HOURS . ').';

$payload = json_encode([
    'model' => OPENAI_MODEL,
    'messages' => array_merge([['role' => 'system', 'content' => $system]], $_SESSION['chat_history']),
    'max_tokens' => 400,
]);

$ch = curl_init(rtrim(OPENAI_BASE_URL, '/') . '/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . OPENAI_API_KEY],
    CURLOPT_TIMEOUT => 30,
]);
$res = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err || !$res) {
    error_log('OpenAI chat request failed: ' . ($err ?: 'empty response'));
    echo json_encode(['reply' => 'Sorry, I could not reach the assistant right now. Please call ' . SITE_PHONE . ' or email ' . SITE_EMAIL . '.']);
    exit;
}

$data = json_decode($res, true);
$reply = $data['choices'][0]['message']['content'] ?? ('Sorry, something went wrong. Please call ' . SITE_PHONE . '.');
$_SESSION['chat_history'][] = ['role' => 'assistant', 'content' => $reply];
echo json_encode(['reply' => $reply]);

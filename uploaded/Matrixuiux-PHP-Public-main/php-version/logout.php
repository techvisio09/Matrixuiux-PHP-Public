<?php
require_once __DIR__ . '/includes/functions.php';
unset($_SESSION['user_id']);
session_regenerate_id(true);
header('Location: index.php');
exit;

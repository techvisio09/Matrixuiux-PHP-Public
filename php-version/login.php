<?php
require_once __DIR__ . '/includes/functions.php';
ensure_admin();
$pageTitle = 'Sign In | ' . SITE_BRAND;
$next = preg_replace('/[^a-z0-9.\-]/i', '', $_GET['next'] ?? ($_POST['next'] ?? 'account.php'));
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';
    $_SESSION['login_attempts'] = ($_SESSION['login_attempts'] ?? 0);
    if ($_SESSION['login_attempts'] >= 8) {
        $error = 'Too many failed attempts. Please try again later.';
    } else {
        $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            unset($_SESSION['login_attempts']);
            header('Location: ' . ($next ?: 'account.php'));
            exit;
        }
        $_SESSION['login_attempts']++;
        $error = 'Invalid email or password.';
    }
}

include __DIR__ . '/includes/header.php';
?>
<div class="container py-5" style="max-width: 460px;">
  <div class="card p-4 p-md-5">
    <h1 class="h4 fw-bold mb-1">Welcome back</h1>
    <p class="text-secondary small mb-4">Sign in to view your orders and license keys.</p>
    <?php if ($error): ?><div class="alert alert-danger py-2 small" data-testid="login-error"><?= esc($error) ?></div><?php endif; ?>
    <form method="post">
      <input type="hidden" name="next" value="<?= esc($next) ?>">
      <div class="mb-3"><label class="form-label">Email Address</label><input name="email" type="email" required class="form-control" placeholder="your@email.com" data-testid="login-email"></div>
      <div class="mb-4"><label class="form-label">Password</label><input name="password" type="password" required class="form-control" placeholder="••••••••" data-testid="login-password"></div>
      <button class="btn btn-primary w-100 rounded-pill" data-testid="login-submit">Sign In</button>
    </form>
    <p class="small text-secondary text-center mt-4 mb-0">New here? <a href="register.php" class="fw-semibold">Create an account</a></p>
  </div>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

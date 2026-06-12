<?php
require_once __DIR__ . '/includes/functions.php';
ensure_admin();
$pageTitle = 'Create Account | ' . SITE_BRAND;
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
        $error = 'Please provide your name, a valid email and a password of at least 6 characters.';
    } else {
        $stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'An account with this email already exists.';
        } else {
            $ins = db()->prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)');
            $ins->execute([$email, $name, password_hash($password, PASSWORD_DEFAULT)]);
            $_SESSION['user_id'] = (int)db()->lastInsertId();
            header('Location: account.php');
            exit;
        }
    }
}

include __DIR__ . '/includes/header.php';
?>
<div class="container py-5" style="max-width: 460px;">
  <div class="card p-4 p-md-5">
    <h1 class="h4 fw-bold mb-1">Create your account</h1>
    <p class="text-secondary small mb-4">Track orders and access your license keys anytime.</p>
    <?php if ($error): ?><div class="alert alert-danger py-2 small" data-testid="register-error"><?= esc($error) ?></div><?php endif; ?>
    <form method="post">
      <div class="mb-3"><label class="form-label">Full Name</label><input name="name" required class="form-control" placeholder="John Doe" value="<?= esc($_POST['name'] ?? '') ?>" data-testid="register-name"></div>
      <div class="mb-3"><label class="form-label">Email Address</label><input name="email" type="email" required class="form-control" placeholder="your@email.com" value="<?= esc($_POST['email'] ?? '') ?>" data-testid="register-email"></div>
      <div class="mb-4"><label class="form-label">Password</label><input name="password" type="password" minlength="6" required class="form-control" placeholder="••••••••" data-testid="register-password"></div>
      <button class="btn btn-primary w-100 rounded-pill" data-testid="register-submit">Create Account</button>
    </form>
    <p class="small text-secondary text-center mt-4 mb-0">Already have an account? <a href="login.php" class="fw-semibold">Sign in</a></p>
  </div>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

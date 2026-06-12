<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/email.php';
$user = current_user();
$pageTitle = 'My Account | ' . SITE_BRAND;

function verification_email_html(string $code): string
{
    return '<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#f1f5f9;font-family:Segoe UI,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="480" style="max-width:480px;background:#fff;border-radius:14px;padding:8px;">
      <tr><td style="padding:28px 32px;">
        <div style="font-size:17px;font-weight:800;color:#0f172a;">Matrixuiux <span style="color:#0284c7;">Software</span></div>
        <h1 style="font-size:19px;color:#0f172a;margin:18px 0 8px;">Your verification code</h1>
        <p style="font-size:13px;color:#475569;margin:0 0 16px;">Use this code to access your orders and license keys. It expires in 15 minutes.</p>
        <div style="border:2px dashed #059669;border-radius:10px;background:#ecfdf5;padding:16px;text-align:center;font-family:Courier New,monospace;font-size:26px;font-weight:bold;letter-spacing:6px;color:#047857;">' . esc($code) . '</div>
        <p style="font-size:11px;color:#94a3b8;margin:18px 0 0;">If you didn\'t request this code, you can safely ignore this email.</p>
      </td></tr></table></td></tr></table></body></html>';
}

$guestError = '';
$guestInfo = '';
if (!$user && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'send_code') {
        $email = strtolower(trim($_POST['email'] ?? ''));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $guestError = 'Please enter a valid email address.';
        } else {
            $code = (string)random_int(100000, 999999);
            $_SESSION['acct_verify'] = ['email' => $email, 'code' => $code, 'exp' => time() + 900];
            send_email($email, 'Your verification code — ' . SITE_BRAND, verification_email_html($code));
            $guestInfo = 'We\'ve sent a 6-digit verification code to ' . esc($email) . '. Enter it below to view your orders.';
        }
    } elseif ($action === 'verify_code') {
        $v = $_SESSION['acct_verify'] ?? null;
        $code = preg_replace('/\D/', '', $_POST['code'] ?? '');
        if (!$v || time() > $v['exp']) {
            $guestError = 'That code has expired — please request a new one.';
            unset($_SESSION['acct_verify']);
        } elseif (!hash_equals($v['code'], $code)) {
            $guestError = 'Incorrect code. Please check your email and try again.';
        } else {
            $_SESSION['verified_email'] = $v['email'];
            unset($_SESSION['acct_verify']);
        }
    } elseif ($action === 'guest_signout') {
        unset($_SESSION['verified_email'], $_SESSION['acct_verify']);
    }
}
$verifiedEmail = $user ? null : ($_SESSION['verified_email'] ?? null);
$awaitingCode = !$user && !$verifiedEmail && isset($_SESSION['acct_verify']);

// Load orders for logged-in user OR verified guest email
$orders = [];
$itemsByOrder = [];
$keysByOrder = [];
if ($user || $verifiedEmail) {
    if ($user) {
        $stmt = db()->prepare('SELECT * FROM orders WHERE user_id = ? OR email = ? ORDER BY created_at DESC');
        $stmt->execute([$user['id'], $user['email']]);
    } else {
        $stmt = db()->prepare('SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC');
        $stmt->execute([$verifiedEmail]);
    }
    $orders = $stmt->fetchAll();
    if ($orders) {
        $ids = array_column($orders, 'id');
        $in = implode(',', array_fill(0, count($ids), '?'));
        $it = db()->prepare("SELECT * FROM order_items WHERE order_id IN ($in)");
        $it->execute($ids);
        foreach ($it->fetchAll() as $row) $itemsByOrder[$row['order_id']][] = $row;
        $kq = db()->prepare("SELECT order_id, product_slug, license_key FROM license_keys WHERE order_id IN ($in)");
        $kq->execute($ids);
        foreach ($kq->fetchAll() as $k) $keysByOrder[$k['order_id']][] = $k;
    }
}
$badges = ['paid' => 'success', 'pending' => 'warning', 'delivered' => 'primary', 'refunded' => 'secondary', 'cancelled' => 'secondary'];

include __DIR__ . '/includes/header.php';
?>
<div class="container py-5" style="max-width: 860px;">

<?php if (!$user && !$verifiedEmail): ?>
  <!-- Guest: email verification flow -->
  <div class="text-center mb-4">
    <h1 class="fw-bold h2" data-testid="account-title">My Account</h1>
    <p class="text-secondary">View your orders, access license keys, and manage refund requests.</p>
  </div>

  <div class="card p-4 p-lg-5 mx-auto" style="max-width: 520px;" data-testid="verify-email-card">
    <div class="text-center mb-3">
      <span class="logo-mark mx-auto" style="width:52px;height:52px;font-size:1.3rem;"><i class="bi bi-envelope-check"></i></span>
      <h2 class="h5 fw-bold mt-3 mb-1">Verify Your Email</h2>
      <p class="text-secondary small mb-0">Enter the email address you used for your order. We'll send you a verification code to confirm your identity.</p>
    </div>

    <?php if ($guestError): ?><div class="alert alert-danger py-2 small" data-testid="verify-error"><?= $guestError ?></div><?php endif; ?>
    <?php if ($guestInfo): ?><div class="alert alert-success py-2 small" data-testid="verify-info"><?= $guestInfo ?></div><?php endif; ?>

    <?php if ($awaitingCode): ?>
      <form method="post">
        <input type="hidden" name="action" value="verify_code">
        <label class="form-label small fw-semibold">Verification code</label>
        <input name="code" class="form-control form-control-lg text-center fw-bold mb-3" style="letter-spacing:.4em;" maxlength="6" inputmode="numeric" placeholder="••••••" required autofocus data-testid="verify-code-input">
        <button class="btn btn-primary rounded-pill w-100 fw-semibold" data-testid="verify-code-btn">Verify &amp; View Orders</button>
      </form>
      <form method="post" class="text-center mt-3">
        <input type="hidden" name="action" value="send_code">
        <input type="hidden" name="email" value="<?= esc($_SESSION['acct_verify']['email'] ?? '') ?>">
        <button class="btn btn-link btn-sm text-secondary" data-testid="resend-code-btn">Didn't get it? Resend code</button>
      </form>
    <?php else: ?>
      <form method="post">
        <input type="hidden" name="action" value="send_code">
        <input type="email" name="email" class="form-control form-control-lg mb-3" placeholder="Enter your email address" required data-testid="verify-email-input">
        <button class="btn btn-primary rounded-pill w-100 fw-semibold" data-testid="send-code-btn">Send Code</button>
      </form>
    <?php endif; ?>

    <div class="text-center small text-secondary mt-4">
      Have a password account? <a href="login.php?next=account.php" class="fw-semibold text-decoration-none" data-testid="account-signin-link">Sign in</a>
      · Need a refund? <a href="returns.php" class="fw-semibold text-decoration-none" data-testid="account-refund-link">Request here</a>
    </div>
  </div>

<?php else: ?>
  <!-- Profile / verified header -->
  <div class="card p-4 d-flex flex-row align-items-center justify-content-between flex-wrap gap-3" data-testid="account-profile">
    <div class="d-flex align-items-center gap-3">
      <span class="logo-mark" style="width:52px;height:52px;font-size:1.3rem;">
        <?= $user ? esc(strtoupper(substr($user['name'], 0, 1))) : '<i class="bi bi-patch-check"></i>' ?>
      </span>
      <div>
        <h1 class="h5 fw-bold mb-0" data-testid="account-name"><?= $user ? esc($user['name']) : 'Verified Customer' ?></h1>
        <small class="text-secondary"><?= esc($user['email'] ?? $verifiedEmail) ?></small>
      </div>
    </div>
    <div class="d-flex gap-2">
      <a href="returns.php" class="btn btn-outline-primary btn-sm rounded-pill" data-testid="refund-request-link">Refund Request</a>
      <?php if ($user): ?>
        <?php if ($user['role'] === 'admin'): ?><a href="admin.php" class="btn btn-outline-primary btn-sm rounded-pill">Admin Panel</a><?php endif; ?>
        <a href="logout.php" class="btn btn-outline-secondary btn-sm rounded-pill" data-testid="logout-btn">Sign Out</a>
      <?php else: ?>
        <form method="post" class="d-inline"><input type="hidden" name="action" value="guest_signout">
          <button class="btn btn-outline-secondary btn-sm rounded-pill" data-testid="logout-btn">Sign Out</button></form>
      <?php endif; ?>
    </div>
  </div>

  <h2 class="h5 fw-bold mt-5 mb-3"><i class="bi bi-box-seam text-primary me-2"></i>My Orders</h2>
  <?php if (!$orders): ?>
    <div class="card p-5 text-center" data-testid="orders-empty">
      <p class="text-secondary mb-3">No orders found for this email.</p>
      <a href="shop.php" class="btn btn-primary rounded-pill mx-auto px-4">Start Shopping</a>
    </div>
  <?php else: foreach ($orders as $o): ?>
    <div class="card p-4 mb-3" data-testid="order-<?= esc($o['order_number']) ?>">
      <div class="d-flex justify-content-between flex-wrap gap-2 mb-2">
        <div><span class="fw-bold">#<?= esc($o['order_number']) ?></span> <small class="text-secondary ms-2"><?= esc(date('M j, Y', strtotime($o['created_at']))) ?></small></div>
        <span class="badge text-bg-<?= $badges[$o['status']] ?? 'secondary' ?>"><?= esc(ucfirst(str_replace('_', ' ', $o['status']))) ?></span>
      </div>
      <?php foreach ($itemsByOrder[$o['id']] ?? [] as $i): ?>
        <div class="d-flex justify-content-between small py-1"><span class="text-secondary"><?= esc($i['name']) ?> × <?= (int)$i['qty'] ?></span><span class="fw-semibold"><?= format_price($i['price'] * $i['qty']) ?></span></div>
      <?php endforeach; ?>
      <?php foreach ($keysByOrder[$o['id']] ?? [] as $k): ?>
        <div class="border border-primary border-2 rounded-3 p-2 px-3 mt-2 d-flex justify-content-between align-items-center flex-wrap gap-2" style="border-style:dashed !important; background: rgba(37,99,235,.05);" data-testid="license-key-<?= esc($o['order_number']) ?>">
          <small class="text-secondary"><i class="bi bi-key-fill text-primary me-1"></i>License key</small>
          <code class="fw-bold"><?= esc($k['license_key']) ?></code>
        </div>
      <?php endforeach; ?>
      <div class="d-flex justify-content-between border-top pt-2 mt-2"><span class="fw-bold">Total</span><span class="fw-bold text-primary"><?= format_price((float)$o['total']) ?></span></div>
    </div>
  <?php endforeach; endif; ?>
<?php endif; ?>

</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

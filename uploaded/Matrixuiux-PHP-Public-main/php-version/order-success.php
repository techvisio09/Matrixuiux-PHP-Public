<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/email.php';
require_once __DIR__ . '/includes/stripe.php';
$pageTitle = 'Order Confirmed | ' . SITE_BRAND;

$orderNumber = $_GET['order'] ?? '';
$sessionId = $_GET['session_id'] ?? '';
$order = null;
if ($orderNumber) {
    $stmt = db()->prepare('SELECT * FROM orders WHERE order_number = ?');
    $stmt->execute([$orderNumber]);
    $order = $stmt->fetch();
}

// Returning from Stripe: verify payment and fulfill (idempotent)
if ($order && $sessionId && stripe_enabled() && $order['status'] !== 'paid') {
    try {
        $session = stripe_get_session($sessionId);
        if (($session['payment_status'] ?? '') === 'paid' && $order['stripe_session_id'] === $sessionId) {
            db()->prepare('UPDATE orders SET status = "paid" WHERE id = ?')->execute([$order['id']]);
            fulfill_order((int)$order['id']);
            $order['status'] = 'paid';
        }
    } catch (RuntimeException $e) {
        // Show the pending state below; log for diagnostics.
        error_log('Stripe session verify failed for order ' . $order['order_number'] . ': ' . $e->getMessage());
    }
}

include __DIR__ . '/includes/header.php';
?>
<div class="container py-5 text-center" style="max-width: 640px;">
  <?php if ($order && $order['status'] === 'paid'): ?>
    <div class="success-tick mb-4" data-testid="success-tick"><i class="bi bi-check-lg"></i></div>
    <h1 class="fw-bold mt-3 h3" data-testid="order-success-title">Thanks for purchasing with us<?= $order['first_name'] ? ', ' . esc($order['first_name']) : '' ?>!</h1>
    <p class="text-secondary" data-testid="order-success-msg">For your <strong>product key</strong>, please check your email <strong>inbox or spam folder</strong> — we've sent it to <strong><?= esc($order['email']) ?></strong>.</p>
    <div class="card co-banner p-4 my-4 text-start">
      <div class="d-flex justify-content-between mb-2"><span class="text-secondary">Order Number</span><span class="fw-bold" data-testid="order-number">#<?= esc($order['order_number']) ?></span></div>
      <div class="d-flex justify-content-between mb-2"><span class="text-secondary">Payment Method</span><span class="fw-semibold"><?= $order['payment_method'] === 'paypal' ? 'PayPal' : 'Credit/Debit Card' ?></span></div>
      <div class="d-flex justify-content-between"><span class="text-secondary">Total</span><span class="fw-bold text-primary"><?= format_price((float)$order['total']) ?></span></div>
    </div>
    <p class="small text-secondary">The charge will appear as <strong><?= SITE_LEGAL ?></strong> on your card statement.</p>

    <a href="index.php" class="btn btn-primary btn-lg rounded-pill px-5 my-2" data-testid="return-home-btn"><i class="bi bi-house-door me-2"></i>Return to Home Page</a>

    <div class="card co-banner p-4 my-4 text-start bg-body-tertiary">
      <div class="fw-bold mb-1">Having trouble installing or activating?</div>
      <p class="small text-secondary mb-3">Follow our step-by-step installation guide for further assistance:</p>
      <a href="page.php?slug=installation-guide" class="btn btn-outline-primary rounded-pill" data-testid="installation-guide-btn"><i class="bi bi-book me-1"></i>Installation Guide</a>
    </div>

    <div class="text-start">
      <div class="small fw-bold mb-2">Still having problems? Connect with us:</div>
      <div class="row g-2">
        <div class="col-4"><a href="tel:<?= SITE_PHONE ?>" class="card p-3 text-center text-decoration-none d-block"><i class="bi bi-telephone text-primary"></i><div class="small fw-semibold mt-1">Phone</div></a></div>
        <div class="col-4"><a href="contact.php" class="card p-3 text-center text-decoration-none d-block"><i class="bi bi-envelope text-primary"></i><div class="small fw-semibold mt-1">Email</div></a></div>
        <div class="col-4"><a href="#" onclick="toggleChat();return false;" class="card p-3 text-center text-decoration-none d-block"><i class="bi bi-chat-dots text-primary"></i><div class="small fw-semibold mt-1">Chat</div></a></div>
      </div>
    </div>

  <?php elseif ($order): ?>
    <i class="bi bi-hourglass-split text-warning display-1"></i>
    <h1 class="fw-bold mt-3 h3">Payment pending</h1>
    <p class="text-secondary">Order <strong>#<?= esc($order['order_number']) ?></strong> was created but the payment hasn't been confirmed yet. If you completed payment, refresh this page in a moment.</p>
    <a href="checkout.php" class="btn btn-primary rounded-pill px-4 mt-2">Back to Checkout</a>
  <?php else: ?>
    <i class="bi bi-question-circle text-secondary display-1"></i>
    <h1 class="fw-bold mt-3 h3">Order not found</h1>
    <a href="index.php" class="btn btn-primary rounded-pill px-4 mt-2">Back to Home</a>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

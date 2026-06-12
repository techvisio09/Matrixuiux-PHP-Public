<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Return & Refund Request | ' . SITE_BRAND;

$findEmail = '';
$orders = [];
$itemsByOrder = [];
$refundedNumbers = [];
$notice = '';
$noticeType = 'success';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'find';
    $findEmail = strtolower(trim($_POST['email'] ?? ''));

    if (!filter_var($findEmail, FILTER_VALIDATE_EMAIL)) {
        $notice = 'Please enter a valid email address.';
        $noticeType = 'danger';
        $findEmail = '';
    } else {
        if ($action === 'refund') {
            $orderNumber = trim($_POST['order_number'] ?? '');
            $chk = db()->prepare('SELECT id FROM orders WHERE order_number = ? AND email = ?');
            $chk->execute([$orderNumber, $findEmail]);
            if (!$chk->fetch()) {
                $notice = 'Order not found for this email.';
                $noticeType = 'danger';
            } else {
                $dup = db()->prepare('SELECT id FROM refund_requests WHERE order_number = ?');
                $dup->execute([$orderNumber]);
                if ($dup->fetch()) {
                    $notice = 'A refund request for order #' . esc($orderNumber) . ' has already been submitted. Our team will be in touch shortly.';
                    $noticeType = 'info';
                } else {
                    db()->prepare('INSERT INTO refund_requests (order_number, email, status) VALUES (?, ?, "pending")')
                        ->execute([$orderNumber, $findEmail]);
                    $notice = 'Refund request submitted for order #' . esc($orderNumber) . '. Our team will review it and respond within 24 hours.';
                }
            }
        }
        // Load orders for the email (after find or refund)
        $stmt = db()->prepare('SELECT * FROM orders WHERE email = ? ORDER BY created_at DESC');
        $stmt->execute([$findEmail]);
        $orders = $stmt->fetchAll();
        if ($orders) {
            $ids = array_column($orders, 'id');
            $in = implode(',', array_fill(0, count($ids), '?'));
            $it = db()->prepare("SELECT * FROM order_items WHERE order_id IN ($in)");
            $it->execute($ids);
            foreach ($it->fetchAll() as $row) $itemsByOrder[$row['order_id']][] = $row;
            $nums = array_column($orders, 'order_number');
            $inN = implode(',', array_fill(0, count($nums), '?'));
            $rq = db()->prepare("SELECT order_number FROM refund_requests WHERE order_number IN ($inN)");
            $rq->execute($nums);
            $refundedNumbers = array_column($rq->fetchAll(), 'order_number');
        } elseif ($action === 'find' && !$notice) {
            $notice = 'No orders found for this email address. Double-check the email used at checkout.';
            $noticeType = 'warning';
        }
    }
}

$badges = ['paid' => 'success', 'pending' => 'warning', 'delivered' => 'primary', 'refunded' => 'secondary', 'cancelled' => 'secondary'];
include __DIR__ . '/includes/header.php';
?>
<div class="container py-5" style="max-width: 720px;">
  <div class="text-center mb-4">
    <h1 class="fw-bold h2" data-testid="returns-title">Return &amp; Refund Request</h1>
    <p class="text-secondary">Enter your email to find your orders and submit a refund request.</p>
  </div>

  <div class="card p-4 mx-auto mb-4" style="max-width: 520px;" data-testid="returns-find-card">
    <form method="post" class="d-flex gap-2">
      <input type="hidden" name="action" value="find">
      <input type="email" name="email" value="<?= esc($findEmail) ?>" class="form-control" placeholder="Enter your order email address" required data-testid="returns-email-input">
      <button class="btn btn-primary rounded-pill px-4 fw-semibold flex-shrink-0" data-testid="returns-find-btn">Find Orders</button>
    </form>
  </div>

  <?php if ($notice): ?>
    <div class="alert alert-<?= $noticeType ?>" data-testid="returns-notice"><?= $notice ?></div>
  <?php endif; ?>

  <?php foreach ($orders as $o): ?>
    <div class="card p-4 mb-3" data-testid="returns-order-<?= esc($o['order_number']) ?>">
      <div class="d-flex justify-content-between flex-wrap gap-2 mb-2">
        <div><span class="fw-bold">#<?= esc($o['order_number']) ?></span> <small class="text-secondary ms-2"><?= esc(date('M j, Y', strtotime($o['created_at']))) ?></small></div>
        <span class="badge text-bg-<?= $badges[$o['status']] ?? 'secondary' ?>"><?= esc(ucfirst($o['status'])) ?></span>
      </div>
      <?php foreach ($itemsByOrder[$o['id']] ?? [] as $i): ?>
        <div class="d-flex justify-content-between small py-1"><span class="text-secondary"><?= esc($i['name']) ?> × <?= (int)$i['qty'] ?></span><span class="fw-semibold"><?= format_price($i['price'] * $i['qty']) ?></span></div>
      <?php endforeach; ?>
      <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-2">
        <span class="fw-bold">Total <span class="text-primary"><?= format_price((float)$o['total']) ?></span></span>
        <?php if (in_array($o['order_number'], $refundedNumbers)): ?>
          <span class="badge text-bg-info" data-testid="refund-requested-<?= esc($o['order_number']) ?>"><i class="bi bi-hourglass-split me-1"></i>Refund Requested</span>
        <?php elseif ($o['status'] === 'refunded'): ?>
          <span class="badge text-bg-secondary">Refunded</span>
        <?php else: ?>
          <form method="post">
            <input type="hidden" name="action" value="refund">
            <input type="hidden" name="email" value="<?= esc($findEmail) ?>">
            <input type="hidden" name="order_number" value="<?= esc($o['order_number']) ?>">
            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" data-testid="request-refund-<?= esc($o['order_number']) ?>">Request Refund</button>
          </form>
        <?php endif; ?>
      </div>
    </div>
  <?php endforeach; ?>

  <div class="text-center small text-secondary mt-4">
    Questions about refunds? Read our <a href="page.php?slug=refund-policy" class="fw-semibold text-decoration-none">Refund Policy</a>
    or call <a href="tel:<?= SITE_PHONE ?>" class="fw-semibold text-decoration-none"><?= SITE_PHONE ?></a> (<?= SITE_HOURS ?>).
  </div>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

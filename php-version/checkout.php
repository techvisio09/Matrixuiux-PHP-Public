<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/email.php';
require_once __DIR__ . '/includes/stripe.php';
$pageTitle = 'Secure Checkout | ' . SITE_BRAND;

$items = cart_items();
if (!$items) {
    header('Location: cart.php');
    exit;
}

$proAssist = ($_GET['pro'] ?? ($_POST['pro'] ?? '')) === '1';
$subtotal = cart_subtotal();
// Savings from list prices
$savings = 0;
foreach ($items as $i) {
    if ($i['original_price'] && $i['original_price'] > $i['price']) {
        $savings += ($i['original_price'] - $i['price']) * $i['qty'];
    }
}
// Coupon (set via ajax/cart.php action=coupon): percent comes from the coupons() map
$couponCode = $_SESSION['coupon'] ?? null;
$couponPct = $couponCode ? (int)($_SESSION['coupon_pct'] ?? (coupons()[$couponCode] ?? 20)) : 0;
$discount = $couponCode ? round($subtotal * $couponPct / 100, 2) : 0.0;
$total = $subtotal - $discount + ($proAssist ? PRO_ASSIST_PRICE : 0);
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $required = ['email', 'first_name', 'last_name', 'phone', 'address', 'city', 'state', 'zip'];
    foreach ($required as $f) {
        if (trim($_POST[$f] ?? '') === '') $errors[] = ucwords(str_replace('_', ' ', $f)) . ' is required.';
    }
    if (!filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL)) $errors[] = 'Valid email is required.';
    $method = ($_POST['payment_method'] ?? 'card') === 'paypal' ? 'paypal' : 'card';

    if (!$errors) {
        $pdo = db();
        $orderNumber = generate_order_number();
        $user = current_user();
        $phoneFull = trim(($_POST['phone_code'] ?? '+1') . ' ' . trim($_POST['phone']));
        $stmt = $pdo->prepare('INSERT INTO orders (order_number, email, first_name, last_name, phone, address, address2, country, city, state, zip, payment_method, currency, subtotal, total, pro_assist, user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([
            $orderNumber, trim($_POST['email']), trim($_POST['first_name']), trim($_POST['last_name']),
            $phoneFull, trim($_POST['address']), trim($_POST['address2'] ?? ''),
            substr(trim($_POST['country'] ?? 'US'), 0, 5), trim($_POST['city']), trim($_POST['state']), trim($_POST['zip']),
            $method, current_currency()['code'], $subtotal, $total, $proAssist ? 1 : 0, $user['id'] ?? null,
        ]);
        $orderId = (int)$pdo->lastInsertId();
        $itemStmt = $pdo->prepare('INSERT INTO order_items (order_id, product_slug, name, price, qty) VALUES (?,?,?,?,?)');
        foreach ($items as $i) {
            $itemStmt->execute([$orderId, $i['slug'], $i['name'], $i['price'], $i['qty']]);
        }
        if ($proAssist) {
            $itemStmt->execute([$orderId, 'proassist-premium', 'ProAssist Premium Installation', PRO_ASSIST_PRICE, 1]);
        }
        $_SESSION['cart'] = [];
        unset($_SESSION['coupon']);

        if (stripe_enabled()) {
            // Real payment: redirect to Stripe hosted checkout
            $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $baseUrl = $proto . '://' . $_SERVER['HTTP_HOST'] . rtrim(dirname($_SERVER['SCRIPT_NAME']), '/') . '/';
            try {
                $orderStmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
                $orderStmt->execute([$orderId]);
                $orderRow = $orderStmt->fetch();
                $session = stripe_create_session($orderRow, $baseUrl);
                $pdo->prepare('UPDATE orders SET stripe_session_id = ? WHERE id = ?')->execute([$session['id'], $orderId]);
                header('Location: ' . $session['url']);
                exit;
            } catch (RuntimeException $e) {
                $errors[] = 'Payment error: ' . $e->getMessage();
            }
        } else {
            // DEMO MODE (no Stripe key): mark paid + fulfill immediately
            $pdo->prepare('UPDATE orders SET status = "paid" WHERE id = ?')->execute([$orderId]);
            fulfill_order($orderId);
            header('Location: order-success.php?order=' . urlencode($orderNumber));
            exit;
        }
    }
}

$checkoutHeader = true;
include __DIR__ . '/includes/header.php';
?>
<div class="checkout-canvas">
<div class="container py-4 pb-5" style="max-width: 800px;">
  <!-- Checkout flow stepper -->
  <div class="checkout-steps d-flex align-items-center mb-4 flex-wrap" data-testid="checkout-steps">
    <div class="step done">
      <span class="step-dot"><i class="bi bi-cart3"></i></span><span class="step-label">Cart</span>
    </div>
    <span class="step-line done"></span>
    <div class="step active">
      <span class="step-dot"><i class="bi bi-credit-card"></i></span><span class="step-label">Checkout</span>
    </div>
    <span class="step-line"></span>
    <div class="step">
      <span class="step-dot"><i class="bi bi-check2-circle"></i></span><span class="step-label">Done</span>
    </div>
    <a href="cart.php" class="ms-auto text-decoration-none small back-to-cart"><i class="bi bi-arrow-left me-1"></i>Back to Cart</a>
  </div>

  <?php if ($errors): ?>
    <div class="alert alert-danger"><ul class="mb-0"><?php foreach ($errors as $e): ?><li><?= esc($e) ?></li><?php endforeach; ?></ul></div>
  <?php endif; ?>

  <form method="post" class="d-grid gap-4">
    <input type="hidden" name="pro" value="<?= $proAssist ? '1' : '0' ?>">
    <input type="hidden" name="payment_method" id="payment-method-input" value="card">

    <!-- Banner 1: Order Summary (receipt style) -->
    <div class="card co-banner p-4" data-testid="co-banner-summary">
      <div class="d-flex align-items-center gap-2 mb-3">
        <span class="logo-mark">F</span>
        <span class="fw-bold"><?= SITE_BRAND ?></span>
        <span class="ms-auto badge rounded-pill text-bg-success-subtle text-success border border-success-subtle"><i class="bi bi-lock-fill me-1"></i>Secure Checkout</span>
      </div>
      <small class="text-secondary">Pay <?= SITE_LEGAL ?></small>
      <div class="receipt-amount fw-bold" data-testid="checkout-amount-banner"><?= format_price($total) ?></div>
      <small class="text-secondary mb-3"><?= count($items) + ($proAssist ? 1 : 0) ?> item<?= (count($items) + ($proAssist ? 1 : 0)) !== 1 ? 's' : '' ?> · Instant digital delivery</small>
      <hr class="my-3">
      <?php foreach ($items as $i): ?>
        <div class="d-flex gap-2 mb-3 align-items-center" data-testid="summary-item-<?= esc($i['slug']) ?>">
          <img src="<?= esc($i['image']) ?>" alt="<?= esc($i['name']) ?> — lifetime license key | <?= SITE_BRAND ?>" style="width:48px;height:48px;object-fit:contain;" class="bg-body-tertiary rounded p-1">
          <div class="flex-grow-1">
            <div class="small fw-semibold"><?= esc($i['name']) ?></div>
            <div class="d-flex justify-content-between align-items-center mt-1">
              <div class="input-group input-group-sm" style="width: 96px;">
                <button type="button" class="btn btn-outline-secondary px-2" data-cart-qty="<?= $i['qty'] - 1 ?>" data-slug="<?= esc($i['slug']) ?>">−</button>
                <span class="form-control text-center px-1"><?= (int)$i['qty'] ?></span>
                <button type="button" class="btn btn-outline-secondary px-2" data-cart-qty="<?= $i['qty'] + 1 ?>" data-slug="<?= esc($i['slug']) ?>">+</button>
              </div>
              <span class="fw-bold text-primary small"><?= format_price($i['price'] * $i['qty']) ?></span>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
      <?php if ($proAssist): ?>
        <div class="d-flex gap-2 mb-3 border-top pt-3 align-items-center">
          <span class="logo-mark" style="width:48px;height:48px;"><i class="bi bi-headset"></i></span>
          <div class="flex-grow-1">
            <div class="small fw-semibold">ProAssist Premium Installation</div>
            <div class="d-flex justify-content-between small"><span class="text-secondary">Qty 1</span><span class="fw-bold text-primary"><?= format_price(PRO_ASSIST_PRICE) ?></span></div>
          </div>
        </div>
      <?php endif; ?>
      <hr class="my-2">
      <!-- Coupon -->
      <?php if ($couponCode): ?>
        <div class="d-flex justify-content-between align-items-center small mb-2 text-success" data-testid="coupon-applied">
          <span><i class="bi bi-tag-fill me-1"></i>Coupon <strong><?= esc($couponCode) ?></strong> applied</span>
          <button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="applyCoupon('')" data-testid="coupon-remove">Remove</button>
        </div>
      <?php else: ?>
        <div class="input-group input-group-sm mb-2" style="max-width: 320px;">
          <input id="coupon-input" class="form-control" placeholder="Coupon code" data-testid="coupon-input">
          <button type="button" class="btn btn-outline-primary" onclick="applyCoupon(document.getElementById('coupon-input').value)" data-testid="coupon-apply">Apply</button>
        </div>
      <?php endif; ?>
      <div class="d-flex justify-content-between small mb-2"><span class="text-secondary">Subtotal</span><span class="fw-semibold"><?= format_price($subtotal) ?></span></div>
      <?php if ($savings > 0): ?>
        <div class="d-flex justify-content-between small mb-2 text-success"><span>You Save</span><span data-testid="checkout-savings">-<?= format_price($savings) ?></span></div>
      <?php endif; ?>
      <?php if ($discount > 0): ?>
        <div class="d-flex justify-content-between small mb-2 text-success"><span>Coupon (<?= esc($couponCode) ?> — <?= $couponPct ?>% off)</span><span data-testid="checkout-discount">-<?= format_price($discount) ?></span></div>
      <?php endif; ?>
      <div class="summary-total d-flex justify-content-between align-items-center p-3 rounded-3 mt-1">
        <span class="fw-bold">Total</span><span class="fw-bold text-primary fs-5" data-testid="checkout-total"><?= format_price($total) ?></span>
      </div>
    </div>

    <!-- Banner 2: Contact Information -->
    <div class="card co-banner p-4" data-testid="co-banner-contact">
      <div class="co-head d-flex align-items-center gap-3 mb-3">
        <span class="co-num">1</span>
        <div class="lh-sm">
          <h5 class="fw-bold mb-0">Contact Information</h5>
          <small class="text-secondary">Where we send your license key</small>
        </div>
        <i class="bi bi-envelope-paper co-head-icon ms-auto"></i>
      </div>
      <label class="form-label">Email Address *</label>
      <input type="email" name="email" required class="form-control" placeholder="your@email.com" value="<?= esc($_POST['email'] ?? '') ?>" data-testid="checkout-email">
      <small class="text-secondary mt-1">License key delivered to this email within 15-30 minutes</small>
    </div>

    <!-- Banner 3: Billing Address -->
    <div class="card co-banner p-4" data-testid="co-banner-billing">
      <div class="co-head d-flex align-items-center gap-3 mb-3">
        <span class="co-num">2</span>
        <div class="lh-sm">
          <h5 class="fw-bold mb-0">Billing Address</h5>
          <small class="text-secondary">Used for payment verification only</small>
        </div>
        <i class="bi bi-geo-alt co-head-icon ms-auto"></i>
      </div>
      <div class="row g-3">
        <div class="col-md-6"><label class="form-label">First Name *</label><input name="first_name" required class="form-control" placeholder="John" value="<?= esc($_POST['first_name'] ?? '') ?>"></div>
        <div class="col-md-6"><label class="form-label">Last Name *</label><input name="last_name" required class="form-control" placeholder="Doe" value="<?= esc($_POST['last_name'] ?? '') ?>"></div>
        <div class="col-12"><label class="form-label">Phone Number *</label>
          <?php
          $phoneFlags = ['+1' => '🇺🇸', '+44' => '🇬🇧', '+61' => '🇦🇺', '+49' => '🇩🇪', '+33' => '🇫🇷', '+34' => '🇪🇸', '+39' => '🇮🇹', '+31' => '🇳🇱', '+91' => '🇮🇳', '+971' => '🇦🇪', '+64' => '🇳🇿'];
          $selCode = $_POST['phone_code'] ?? '+1';
          ?>
          <div class="input-group phone-group">
            <span class="input-group-text phone-flag" id="phone-flag" data-testid="phone-flag"><?= $phoneFlags[$selCode] ?? '🇺🇸' ?></span>
            <select name="phone_code" id="phone-code" class="form-select phone-code" style="max-width:96px;" onchange="syncPhoneFlag(this)" data-testid="phone-code-select">
              <?php foreach ($phoneFlags as $code => $flag): ?>
                <option value="<?= $code ?>" data-flag="<?= $flag ?>" <?= $selCode === $code ? 'selected' : '' ?>><?= $code ?></option>
              <?php endforeach; ?>
            </select>
            <input name="phone" required class="form-control" placeholder="555 123 4567" value="<?= esc($_POST['phone'] ?? '') ?>" data-testid="phone-number-input">
          </div>
          <div class="form-check mt-2">
            <input class="form-check-input" type="checkbox" name="sms_consent" id="sms-consent" value="1" <?= !empty($_POST['sms_consent']) ? 'checked' : '' ?> data-testid="sms-consent">
            <label class="form-check-label small text-secondary" for="sms-consent">By checking this box, you agree to receive SMS messages (order updates &amp; delivery notifications) from <?= SITE_BRAND ?>. Msg &amp; data rates may apply. Reply STOP to opt out.</label>
          </div>
        </div>
        <div class="col-12"><label class="form-label">Address *</label><input name="address" required class="form-control" placeholder="123 Main Street, Apt 4B" value="<?= esc($_POST['address'] ?? '') ?>"></div>
        <div class="col-12"><label class="form-label">Address Line 2 (Optional)</label><input name="address2" class="form-control" placeholder="Suite, building, floor, etc." value="<?= esc($_POST['address2'] ?? '') ?>"></div>
        <div class="col-md-6">
          <label class="form-label">Country *</label>
          <select name="country" class="form-select">
            <?php foreach (['US' => 'United States', 'CA' => 'Canada', 'UK' => 'United Kingdom', 'AU' => 'Australia', 'EU' => 'Europe (Other)'] as $c => $n): ?>
              <option value="<?= $c ?>" <?= ($_POST['country'] ?? 'US') === $c ? 'selected' : '' ?>><?= $n ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="col-md-6"><label class="form-label">City *</label><input name="city" required class="form-control" placeholder="New York" value="<?= esc($_POST['city'] ?? '') ?>"></div>
        <div class="col-md-6">
          <label class="form-label">State *</label>
          <select name="state" required class="form-select" data-testid="state-select">
            <option value="">Select</option>
            <?php foreach (['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC','Other'] as $st): ?>
              <option value="<?= $st ?>" <?= ($_POST['state'] ?? '') === $st ? 'selected' : '' ?>><?= $st ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <div class="col-md-6"><label class="form-label">ZIP Code *</label><input name="zip" required class="form-control" placeholder="10001" value="<?= esc($_POST['zip'] ?? '') ?>"></div>
      </div>
    </div>

    <!-- Banner 4: Payment — short & sweet -->
    <div class="card co-banner p-4" data-testid="co-banner-payment">
      <div class="co-head d-flex align-items-center gap-3 mb-3">
        <span class="co-num">3</span>
        <div class="lh-sm">
          <h5 class="fw-bold mb-0">Payment</h5>
          <small class="text-secondary">All transactions are secure and encrypted</small>
        </div>
        <i class="bi bi-shield-lock co-head-icon ms-auto"></i>
      </div>
      <div class="row g-3 mb-3">
        <div class="col-sm-6">
          <div id="pay-card" class="pay-option pay-tile active p-3 h-100" onclick="selectPayMethod('card')" data-testid="pay-method-card">
            <div class="d-flex align-items-center gap-2">
              <input type="radio" class="form-check-input mt-0" name="pm_radio" checked onclick="selectPayMethod('card')">
              <i class="bi bi-credit-card-2-front text-primary fs-5"></i>
              <span class="fw-bold">Card</span>
            </div>
            <div class="d-flex gap-1 mt-2 ps-4">
              <img src="assets/images/payments/visa.svg" alt="Visa" class="pay-icon pay-icon-sm"><img src="assets/images/payments/mastercard.svg" alt="Mastercard" class="pay-icon pay-icon-sm"><img src="assets/images/payments/amex.svg" alt="American Express" class="pay-icon pay-icon-sm"><img src="assets/images/payments/discover.svg" alt="Discover" class="pay-icon pay-icon-sm">
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div id="pay-paypal" class="pay-option pay-tile paypal p-3 h-100" onclick="selectPayMethod('paypal')" data-testid="pay-method-paypal">
            <div class="d-flex align-items-center gap-2">
              <input type="radio" class="form-check-input mt-0" name="pm_radio" onclick="selectPayMethod('paypal')">
              <img src="assets/images/payments/paypal.svg" alt="PayPal" class="pay-icon pay-icon-sm">
              <span class="fw-bold"><span class="fst-italic" style="color:#003087">Pay</span><span class="fst-italic" style="color:#0070BA">Pal</span></span>
            </div>
            <small class="text-secondary d-block mt-2 ps-4">Checkout with your PayPal account</small>
          </div>
        </div>
      </div>
      <!-- Card details drop-down (shown when Card selected). Fields have NO name attrs —
           they are never posted to our server; the charge is confirmed on Stripe's PCI-compliant page. -->
      <div id="card-form" class="card-form-reveal mb-3" data-testid="card-details-form">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Card Number</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-credit-card-2-front text-primary"></i></span>
              <input id="card-number" class="form-control" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="19" data-testid="card-number-input">
              <span class="input-group-text card-brands" id="card-brands" data-testid="card-brand-icons">
                <img src="assets/images/payments/visa.svg" alt="Visa" data-brand="visa" class="card-brand-icon">
                <img src="assets/images/payments/mastercard.svg" alt="Mastercard" data-brand="mastercard" class="card-brand-icon">
                <img src="assets/images/payments/amex.svg" alt="American Express" data-brand="amex" class="card-brand-icon">
                <img src="assets/images/payments/discover.svg" alt="Discover" data-brand="discover" class="card-brand-icon">
              </span>
            </div>
          </div>
          <div class="col-7">
            <label class="form-label">Expiry Date</label>
            <input id="card-exp" class="form-control" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5" data-testid="card-exp-input">
          </div>
          <div class="col-5">
            <label class="form-label">CVV</label>
            <div class="input-group">
              <input id="card-cvv" type="password" class="form-control" inputmode="numeric" autocomplete="cc-csc" placeholder="•••" maxlength="4" data-testid="card-cvv-input">
              <span class="input-group-text" title="3-4 digit code on the back of your card"><i class="bi bi-question-circle text-secondary"></i></span>
            </div>
          </div>
        </div>
        <div class="small text-secondary mt-2"><i class="bi bi-shield-lock-fill text-success me-1"></i>Your card is verified &amp; charged on Stripe's PCI-compliant secure page — we never store card data.</div>
      </div>
      <button id="btn-pay-card" type="submit" class="btn btn-primary btn-lg rounded-pill w-100" data-testid="checkout-pay-button">Pay Securely · <?= format_price($total) ?></button>
      <button id="btn-pay-paypal" type="submit" class="btn btn-paypal btn-lg rounded-pill w-100 d-none" data-testid="checkout-paypal-button"><span class="fst-italic" style="color:#003087">Pay</span><span class="fst-italic" style="color:#0070BA">Pal</span> · Continue <?= format_price($total) ?></button>
      <div class="text-center small text-secondary mt-3"><i class="bi bi-shield-lock me-1"></i>256-bit SSL · Powered by Stripe — card details are entered on the secure payment page</div>
      <div class="text-center mt-1" style="font-size:.72rem;">By placing your order, you agree to our <a href="page.php?slug=terms-of-service">Terms</a> and <a href="page.php?slug=privacy-policy">Privacy Policy</a></div>
    </div>
  </form>
</div>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

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
$totalItems = count($items) + ($proAssist ? 1 : 0);
?>
<div class="checkout-wrap">
<div class="checkout-grid">
  <!-- ============== LEFT: Compact form ============== -->
  <form method="post" class="checkout-card" data-testid="checkout-form">
    <input type="hidden" name="pro" value="<?= $proAssist ? '1' : '0' ?>">
    <input type="hidden" name="payment_method" id="payment-method-input" value="card">

    <?php if ($errors): ?>
      <div class="alert alert-danger py-2 mb-3"><ul class="mb-0 small"><?php foreach ($errors as $e): ?><li><?= esc($e) ?></li><?php endforeach; ?></ul></div>
    <?php endif; ?>

    <!-- SECTION 1: Contact -->
    <div class="section-tag" data-testid="checkout-section-contact"><span class="num">1</span> Contact</div>
    <div class="compact-row full mb-2">
      <input type="email" name="email" required class="form-control compact-input" placeholder="Email address — where we send your license key" value="<?= esc($_POST['email'] ?? '') ?>" data-testid="checkout-email">
    </div>

    <!-- SECTION 2: Billing -->
    <div class="section-tag mt-3" data-testid="checkout-section-billing"><span class="num">2</span> Billing Details</div>
    <div class="compact-row mb-2">
      <input name="first_name" required class="form-control compact-input" placeholder="First name" value="<?= esc($_POST['first_name'] ?? '') ?>" data-testid="checkout-first-name">
      <input name="last_name"  required class="form-control compact-input" placeholder="Last name"  value="<?= esc($_POST['last_name']  ?? '') ?>" data-testid="checkout-last-name">
    </div>
    <?php
    $phoneFlags = ['+1' => '🇺🇸', '+44' => '🇬🇧', '+61' => '🇦🇺', '+49' => '🇩🇪', '+33' => '🇫🇷', '+34' => '🇪🇸', '+39' => '🇮🇹', '+31' => '🇳🇱', '+91' => '🇮🇳', '+971' => '🇦🇪', '+64' => '🇳🇿'];
    $selCode = $_POST['phone_code'] ?? '+1';
    ?>
    <div class="input-group mb-2">
      <span class="input-group-text phone-flag compact-input" style="border-top-right-radius:0;border-bottom-right-radius:0;" id="phone-flag" data-testid="phone-flag"><?= $phoneFlags[$selCode] ?? '🇺🇸' ?></span>
      <select name="phone_code" id="phone-code" class="form-select compact-input phone-code" style="max-width:96px; border-radius:0;" onchange="syncPhoneFlag(this)" data-testid="phone-code-select">
        <?php foreach ($phoneFlags as $code => $flag): ?>
          <option value="<?= $code ?>" data-flag="<?= $flag ?>" <?= $selCode === $code ? 'selected' : '' ?>><?= $code ?></option>
        <?php endforeach; ?>
      </select>
      <input name="phone" required class="form-control compact-input" style="border-top-left-radius:0;border-bottom-left-radius:0;" placeholder="Phone number" value="<?= esc($_POST['phone'] ?? '') ?>" data-testid="phone-number-input">
    </div>
    <div class="compact-row full mb-2">
      <input name="address" required class="form-control compact-input" placeholder="Street address" value="<?= esc($_POST['address'] ?? '') ?>" data-testid="checkout-address">
    </div>
    <div class="compact-row cols-3 mb-2">
      <input name="city" required class="form-control compact-input" placeholder="City" value="<?= esc($_POST['city'] ?? '') ?>" data-testid="checkout-city">
      <select name="state" required class="form-select compact-input" data-testid="state-select">
        <option value="">State</option>
        <?php foreach (['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC','Other'] as $st): ?>
          <option value="<?= $st ?>" <?= ($_POST['state'] ?? '') === $st ? 'selected' : '' ?>><?= $st ?></option>
        <?php endforeach; ?>
      </select>
      <input name="zip"  required class="form-control compact-input" placeholder="ZIP" value="<?= esc($_POST['zip'] ?? '') ?>" data-testid="checkout-zip">
    </div>
    <input type="hidden" name="country" value="US">

    <!-- SECTION 3: Payment -->
    <div class="section-tag mt-3" data-testid="checkout-section-payment"><span class="num">3</span> Payment</div>
    <div class="pay-tiles mb-2">
      <div id="pay-card" class="pay-option pay-tile active" onclick="selectPayMethod('card')" data-testid="pay-method-card">
        <div class="d-flex align-items-center gap-2">
          <i class="bi bi-credit-card-2-front text-primary fs-5"></i>
          <span class="fw-bold small">Card</span>
          <span class="d-flex gap-1 ms-auto">
            <img src="assets/images/payments/visa.svg" alt="" class="pay-icon pay-icon-sm"><img src="assets/images/payments/mastercard.svg" alt="" class="pay-icon pay-icon-sm"><img src="assets/images/payments/amex.svg" alt="" class="pay-icon pay-icon-sm">
          </span>
        </div>
      </div>
      <div id="pay-paypal" class="pay-option pay-tile paypal" onclick="selectPayMethod('paypal')" data-testid="pay-method-paypal">
        <div class="d-flex align-items-center gap-2">
          <img src="assets/images/payments/paypal.svg" alt="" class="pay-icon pay-icon-sm">
          <span class="fw-bold small"><span class="fst-italic" style="color:#003087">Pay</span><span class="fst-italic" style="color:#0070BA">Pal</span></span>
          <small class="text-secondary ms-auto" style="font-size:.66rem;">via PayPal</small>
        </div>
      </div>
    </div>
    <div id="card-form" class="card-form-reveal mb-2" data-testid="card-details-form">
      <input id="card-number" class="form-control compact-input mb-2" inputmode="numeric" autocomplete="cc-number" placeholder="Card number  ····  ····  ····  ····" maxlength="19" data-testid="card-number-input">
      <div class="compact-row">
        <input id="card-exp" class="form-control compact-input" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" maxlength="5" data-testid="card-exp-input">
        <input id="card-cvv" type="password" class="form-control compact-input" inputmode="numeric" autocomplete="cc-csc" placeholder="CVV" maxlength="4" data-testid="card-cvv-input">
      </div>
    </div>
    <div id="paypal-info" class="d-none small text-secondary mb-2"><i class="bi bi-info-circle me-1"></i>You will be redirected to PayPal to securely complete payment.</div>

    <button id="btn-pay-card" type="submit" class="btn btn-primary w-100 py-2 rounded-pill fw-bold" data-testid="checkout-pay-button">
      <i class="bi bi-lock-fill me-1"></i>Pay Securely · <?= format_price($total) ?>
    </button>
    <button id="btn-pay-paypal" type="submit" class="btn btn-paypal w-100 py-2 rounded-pill fw-bold d-none" data-testid="checkout-paypal-button">
      <span class="fst-italic" style="color:#003087">Pay</span><span class="fst-italic" style="color:#0070BA">Pal</span> · Continue <?= format_price($total) ?>
    </button>
    <div class="text-center small text-secondary mt-2" style="font-size:.72rem;">
      <i class="bi bi-shield-lock-fill text-success me-1"></i>256-bit SSL · Powered by Stripe · Card data never stored
      &nbsp;·&nbsp; <a href="page.php?slug=terms-of-service" class="text-decoration-none">Terms</a>
      &nbsp;·&nbsp; <a href="page.php?slug=privacy-policy" class="text-decoration-none">Privacy</a>
    </div>
  </form>

  <!-- ============== RIGHT: Sticky compact summary ============== -->
  <aside class="checkout-card summary-stick" data-testid="checkout-summary">
    <div class="d-flex align-items-center justify-content-between mb-2">
      <strong class="small">Order Summary</strong>
      <a href="cart.php" class="text-decoration-none small back-to-cart" data-testid="back-to-cart"><i class="bi bi-pencil-square me-1"></i>Edit</a>
    </div>
    <small class="text-secondary d-block mb-1"><?= $totalItems ?> item<?= $totalItems !== 1 ? 's' : '' ?> · Instant digital delivery</small>

    <?php foreach ($items as $i): ?>
      <div class="summary-mini" data-testid="summary-item-<?= esc($i['slug']) ?>">
        <div class="summary-mini-img"><img src="<?= esc($i['image']) ?>" alt="<?= esc($i['name']) ?>"></div>
        <div class="flex-grow-1 min-w-0">
          <div class="small fw-semibold text-truncate"><?= esc($i['name']) ?></div>
          <small class="text-secondary">Qty <?= (int)$i['qty'] ?></small>
        </div>
        <span class="fw-bold text-primary small"><?= format_price($i['price'] * $i['qty']) ?></span>
      </div>
    <?php endforeach; ?>
    <?php if ($proAssist): ?>
      <div class="summary-mini">
        <div class="summary-mini-img" style="background: linear-gradient(135deg, #1d4ed8, #2563eb); display:flex; align-items:center; justify-content:center; color:#fff;"><i class="bi bi-headset"></i></div>
        <div class="flex-grow-1 min-w-0">
          <div class="small fw-semibold">ProAssist Premium Installation</div>
          <small class="text-secondary">Qty 1</small>
        </div>
        <span class="fw-bold text-primary small"><?= format_price(PRO_ASSIST_PRICE) ?></span>
      </div>
    <?php endif; ?>

    <!-- Coupon (compact) -->
    <?php if ($couponCode): ?>
      <div class="d-flex justify-content-between align-items-center small text-success mt-2" data-testid="coupon-applied">
        <span><i class="bi bi-tag-fill me-1"></i><?= esc($couponCode) ?> — <?= $couponPct ?>% off</span>
        <button type="button" class="btn btn-sm btn-link text-danger p-0 small" onclick="applyCoupon('')" data-testid="coupon-remove">Remove</button>
      </div>
    <?php else: ?>
      <div class="coupon-mini">
        <input id="coupon-input" class="form-control" placeholder="Promo code" data-testid="coupon-input">
        <button type="button" class="btn btn-outline-primary" onclick="applyCoupon(document.getElementById('coupon-input').value)" data-testid="coupon-apply">Apply</button>
      </div>
    <?php endif; ?>

    <div class="d-flex justify-content-between small mt-2"><span class="text-secondary">Subtotal</span><span class="fw-semibold"><?= format_price($subtotal) ?></span></div>
    <?php if ($savings > 0): ?>
      <div class="d-flex justify-content-between small text-success"><span>You save</span><span data-testid="checkout-savings">-<?= format_price($savings) ?></span></div>
    <?php endif; ?>
    <?php if ($discount > 0): ?>
      <div class="d-flex justify-content-between small text-success"><span>Coupon</span><span data-testid="checkout-discount">-<?= format_price($discount) ?></span></div>
    <?php endif; ?>

    <div class="summary-total-line">
      <span class="fw-bold">Total</span>
      <span class="price" data-testid="checkout-total"><?= format_price($total) ?></span>
    </div>

    <div class="d-flex justify-content-around mt-3 pt-2 border-top small text-secondary" style="font-size:.7rem;">
      <span><i class="bi bi-shield-lock-fill text-success"></i> SSL</span>
      <span><i class="bi bi-lightning-charge-fill text-warning"></i> Instant</span>
      <span><i class="bi bi-arrow-counterclockwise text-primary"></i> 30-Day</span>
    </div>

    <div class="mt-3 text-center" style="font-size:.72rem;">
      <small class="text-secondary d-block mb-1">Need help? Talk to a specialist:</small>
      <a href="tel:<?= SITE_PHONE ?>" class="fw-bold text-decoration-none" style="color:#16a34a;"><i class="bi bi-telephone-fill me-1"></i><?= SITE_PHONE ?></a>
    </div>
  </aside>
</div>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

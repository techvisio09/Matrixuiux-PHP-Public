<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Shopping Cart | ' . SITE_BRAND;
$items = cart_items();
$subtotal = cart_subtotal();
$savings = 0;
foreach ($items as $i) {
    if ($i['original_price'] && $i['original_price'] > $i['price']) {
        $savings += ($i['original_price'] - $i['price']) * $i['qty'];
    }
}
include __DIR__ . '/includes/header.php';
?>
<?= render_page_head('Shopping Cart', $items ? cart_count() . ' item(s) in your cart — keys delivered by email within minutes' : '', ['Cart' => null]) ?>
<div class="container py-4 py-lg-5">

  <?php if (!$items): ?>
    <div class="text-center py-5">
      <i class="bi bi-cart-x display-1 text-secondary"></i>
      <p class="text-secondary mt-3">Your cart is empty.</p>
      <a href="shop.php" class="btn btn-primary rounded-pill px-4">Continue Shopping</a>
    </div>
  <?php else: ?>
    <div class="row g-4">
      <div class="col-lg-8">
        <?php foreach ($items as $i): ?>
          <?php
          $hasDisc = $i['original_price'] && $i['original_price'] > $i['price'];
          $pct = $hasDisc ? round((1 - $i['price'] / $i['original_price']) * 100) : 0;
          ?>
          <div class="card mb-3 p-3" data-testid="cart-item-<?= esc($i['slug']) ?>">
            <div class="d-flex gap-3 align-items-center flex-wrap">
              <img src="<?= esc($i['image']) ?>" alt="<?= esc($i['name']) ?> — lifetime license key, instant digital delivery | <?= SITE_BRAND ?>" title="<?= esc($i['name']) ?>" style="width:72px;height:72px;object-fit:contain;" class="bg-body-tertiary rounded p-1">
              <div class="flex-grow-1" style="min-width:180px;">
                <a href="product.php?slug=<?= esc($i['slug']) ?>" class="fw-semibold text-decoration-none text-body d-block"><?= esc($i['name']) ?></a>
                <small class="text-secondary"><?= esc($i['platform']) ?> · Lifetime License</small>
                <?php if ($hasDisc): ?>
                  <div class="small mt-1" data-testid="cart-discount-<?= esc($i['slug']) ?>">
                    <span class="badge text-bg-danger me-1">-<?= $pct ?>%</span>
                    <span class="text-secondary text-decoration-line-through me-1"><?= format_price((float)$i['original_price']) ?></span>
                    <span class="text-success fw-semibold"><i class="bi bi-piggy-bank me-1"></i>You save <?= format_price(($i['original_price'] - $i['price']) * $i['qty']) ?></span>
                  </div>
                <?php endif; ?>
              </div>
              <div class="input-group" style="width: 120px;">
                <button class="btn btn-sm btn-outline-secondary" data-cart-qty="<?= $i['qty'] - 1 ?>" data-slug="<?= esc($i['slug']) ?>">−</button>
                <span class="form-control form-control-sm text-center"><?= (int)$i['qty'] ?></span>
                <button class="btn btn-sm btn-outline-secondary" data-cart-qty="<?= $i['qty'] + 1 ?>" data-slug="<?= esc($i['slug']) ?>">+</button>
              </div>
              <div style="width:100px; text-align:right;">
                <?php if ($hasDisc): ?><small class="text-secondary text-decoration-line-through d-block"><?= format_price($i['original_price'] * $i['qty']) ?></small><?php endif; ?>
                <span class="fw-bold text-primary"><?= format_price($i['price'] * $i['qty']) ?></span>
              </div>
              <button class="cart-remove-btn" data-cart-remove="<?= esc($i['slug']) ?>" title="Remove item" aria-label="Remove item" data-testid="remove-<?= esc($i['slug']) ?>"><i class="bi bi-trash3-fill"></i></button>
            </div>
          </div>
        <?php endforeach; ?>
        <a href="shop.php" class="text-decoration-none"><i class="bi bi-arrow-left me-1"></i>Continue shopping</a>
      </div>

      <div class="col-lg-4">
        <div class="card p-4">
          <h5 class="fw-bold mb-3">Order Summary</h5>
          <div class="d-flex justify-content-between small mb-2"><span class="text-secondary">Subtotal</span><span class="fw-semibold"><?= format_price($subtotal) ?></span></div>
          <?php if ($savings > 0): ?>
            <div class="d-flex justify-content-between small mb-2 text-success"><span>You Save</span><span>-<?= format_price($savings) ?></span></div>
          <?php endif; ?>
          <hr>
          <div class="d-flex justify-content-between mb-3"><span class="fw-bold">Total</span><span class="fw-bold text-primary fs-5"><?= format_price($subtotal) ?></span></div>
          <button class="btn btn-primary btn-lg rounded-pill w-100" data-bs-toggle="modal" data-bs-target="#proAssistModal" data-testid="proceed-checkout">Proceed to Checkout</button>
          <div class="text-center mt-3 small text-secondary"><i class="bi bi-shield-lock me-1"></i>Secure 256-bit SSL checkout</div>
        </div>
      </div>
    </div>

    <!-- ProAssist upsell modal -->
    <div class="modal fade" id="proAssistModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Add ProAssist Premium Installation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex align-items-center gap-3 mb-3">
              <span class="logo-mark"><i class="bi bi-headset"></i></span>
              <div><div class="fw-bold">ProAssist Premium</div><small class="text-secondary">Installation</small></div>
            </div>
            <p class="small">Let us install it for you. ProAssist includes:</p>
            <ul class="small text-secondary">
              <li>Our team will remotely install the software for you.</li>
              <li>Secure end-to-end encrypted connection.</li>
              <li>Installation within the same business day.</li>
              <li>Backed by our money-back guarantee.</li>
            </ul>
            <div class="small text-secondary border-top pt-2 mt-3" style="font-size:.72rem;">
              <div class="mb-1"><sup>1</sup> Installation service guaranteed within business hours (Monday-Saturday 9AM-5PM EST).</div>
              <div><sup>2</sup> We guarantee a successful installation of your software or we refund you for the service.</div>
            </div>
          </div>
          <div class="modal-footer flex-column flex-sm-row">
            <a href="checkout.php" class="btn btn-outline-secondary flex-fill" data-testid="skip-proassist">No thanks, Continue to Checkout</a>
            <a href="checkout.php?pro=1" class="btn btn-primary flex-fill" data-testid="add-proassist">Add ProAssist <?= format_price(PRO_ASSIST_PRICE) ?></a>
          </div>
        </div>
      </div>
    </div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

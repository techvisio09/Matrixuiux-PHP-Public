<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Customer Reviews | ' . SITE_BRAND;

/* ----- Write a Review (verified buyers only) ----- */
$user = current_user();
$purchased = [];
if ($user) {
    $stmt = db()->prepare("SELECT DISTINCT oi.name FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.status = 'paid' AND (o.user_id = ? OR o.email = ?)");
    $stmt->execute([$user['id'], $user['email']]);
    $purchased = array_column($stmt->fetchAll(), 'name');
}
$reviewErr = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['write_review'])) {
    $text = trim($_POST['text'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $rating = min(5, max(1, (int)($_POST['rating'] ?? 5)));
    $product = (string)($_POST['product'] ?? '');
    if (!$user) {
        $reviewErr = 'Please sign in to write a review.';
    } elseif (!$purchased) {
        $reviewErr = 'Only verified buyers can write reviews.';
    } elseif (strlen($text) < 10) {
        $reviewErr = 'Please write at least 10 characters.';
    } else {
        if (!in_array($product, $purchased, true)) $product = $purchased[0];
        $parts = preg_split('/\s+/', trim($user['name']));
        $initials = strtoupper(substr($parts[0], 0, 1) . (isset($parts[1]) ? substr($parts[1], 0, 1) : ''));
        $ins = db()->prepare('INSERT INTO reviews (name, initials, location, review_date, rating, text, product, verified) VALUES (?, ?, ?, CURDATE(), ?, ?, ?, 1)');
        $ins->execute([$user['name'], $initials, $location !== '' ? $location : 'Verified Buyer', $rating, $text, $product]);
        header('Location: reviews.php?submitted=1');
        exit;
    }
}

$perPage = 10;
$page = max(1, (int)($_GET['p'] ?? 1));
$total = (int)db()->query('SELECT COUNT(*) c FROM reviews')->fetch()['c'];
$pages = max(1, (int)ceil($total / $perPage));
$page = min($page, $pages);
$offset = ($page - 1) * $perPage;
$list = db()->query("SELECT * FROM reviews ORDER BY review_date DESC, id ASC LIMIT $perPage OFFSET $offset")->fetchAll();

$dist = [5 => 77, 4 => 14, 3 => 5, 2 => 1, 1 => 4];
$cats = [
    ['Recommend This Company', 4.6, '4,695+ reviews'],
    ['Would Buy Again', 4.6, '3,866+ reviews'],
    ['Customer Service', 4.5, '435+ reviews'],
    ['Price Satisfaction', 4.5, '1,100+ reviews'],
];

include __DIR__ . '/includes/header.php';
?>
<?= render_page_head('Customer Reviews', 'Independent, verified feedback from real customers — updated continuously.', ['Reviews' => null]) ?>
<div class="container py-4 py-lg-5">

  <!-- Summary panel -->
  <div class="card p-4 p-lg-5 mb-5" data-testid="reviews-summary">
    <div class="row g-4 align-items-center">
      <div class="col-lg-3 text-center">
        <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
          <?= render_logo(34) ?>
          <span class="fw-bold small">Matrixuiux Software</span>
        </div>
        <div class="display-3 fw-bold text-primary lh-1" data-testid="reviews-overall">4.6</div>
        <div class="text-warning fs-5">★★★★★</div>
        <div class="small text-secondary mt-1"><strong class="text-body"><?= number_format(5523) ?></strong> verified reviews</div>
        <span class="badge text-bg-success mt-2"><i class="bi bi-patch-check-fill me-1"></i>Verified Customer Reviews</span>
      </div>
      <div class="col-lg-4">
        <?php foreach ($dist as $stars => $pct): ?>
          <div class="d-flex align-items-center gap-2 py-1 small">
            <span style="width:14px;" class="fw-bold"><?= $stars ?></span><i class="bi bi-star-fill text-warning"></i>
            <div class="progress flex-grow-1" style="height:8px;"><div class="progress-bar <?= $stars >= 4 ? 'bg-success' : ($stars === 3 ? 'bg-warning' : 'bg-danger') ?>" style="width:<?= $pct ?>%"></div></div>
            <span class="text-secondary" style="width:36px;"><?= $pct ?>%</span>
          </div>
        <?php endforeach; ?>
      </div>
      <div class="col-lg-5">
        <table class="table table-sm align-middle mb-0" data-testid="rating-categories">
          <thead><tr><th class="small text-secondary fw-semibold">Rating Categories</th><th></th><th></th></tr></thead>
          <tbody>
            <?php foreach ($cats as [$label, $score, $count]): ?>
              <tr>
                <td class="small fw-semibold"><?= $label ?></td>
                <td class="text-warning small">★ <strong class="text-body"><?= $score ?></strong></td>
                <td class="small text-secondary">(<?= $count ?>)</td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <small class="text-secondary d-block mt-2" style="font-size:.72rem;">The overall rating combines checkout reviews and post-delivery reviews. Every customer who completes a checkout review is invited to leave a follow-up review after delivery.</small>
      </div>
    </div>
  </div>

  <!-- Reviews list -->
  <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
    <div class="d-flex align-items-center gap-3 flex-wrap">
      <h2 class="h5 fw-bold mb-0">Customer Reviews</h2>
      <small class="text-secondary" data-testid="reviews-range">Showing <?= $offset + 1 ?>–<?= min($offset + $perPage, $total) ?> of <?= $total ?> reviews</small>
    </div>
    <?php if ($user): ?>
      <button class="btn btn-primary btn-sm rounded-pill px-3" data-bs-toggle="modal" data-bs-target="#writeReviewModal" data-testid="write-review-btn"><i class="bi bi-pencil-square me-1"></i>Write a Review</button>
    <?php else: ?>
      <a href="login.php?next=reviews.php" class="btn btn-primary btn-sm rounded-pill px-3" data-testid="write-review-btn"><i class="bi bi-pencil-square me-1"></i>Write a Review</a>
    <?php endif; ?>
  </div>

  <?php if (isset($_GET['submitted'])): ?>
    <div class="alert alert-success d-flex align-items-center gap-2" data-testid="review-success-alert"><i class="bi bi-patch-check-fill"></i>Thank you! Your verified review has been published.</div>
  <?php elseif ($reviewErr): ?>
    <div class="alert alert-danger" data-testid="review-error-alert"><?= esc($reviewErr) ?></div>
  <?php endif; ?>

  <div class="d-grid gap-3 mb-4" data-testid="reviews-list">
    <?php foreach ($list as $r): ?>
      <div class="card p-4" data-testid="review-<?= (int)$r['id'] ?>">
        <div class="d-flex gap-3">
          <span class="logo-mark flex-shrink-0" style="width:44px;height:44px;font-size:.85rem;"><?= esc($r['initials']) ?></span>
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between flex-wrap gap-2">
              <div>
                <strong><?= esc($r['name']) ?></strong>
                <?php if ($r['verified']): ?><span class="badge text-bg-success ms-1" style="font-size:.62rem;"><i class="bi bi-patch-check-fill me-1"></i>Verified</span><?php endif; ?>
                <small class="text-secondary ms-1"><?= esc($r['location']) ?></small>
              </div>
              <small class="text-secondary"><?= esc(date('M j, Y', strtotime($r['review_date']))) ?></small>
            </div>
            <div class="text-warning small my-1"><?= str_repeat('★', (int)$r['rating']) ?><span class="text-secondary opacity-50"><?= str_repeat('★', 5 - (int)$r['rating']) ?></span></div>
            <p class="mb-1"><?= esc($r['text']) ?></p>
            <small class="text-secondary"><i class="bi bi-bag-check-fill text-primary me-1"></i>Purchased: <?= esc($r['product']) ?></small>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

  <!-- Pagination -->
  <nav class="d-flex justify-content-center align-items-center gap-2" data-testid="reviews-pagination">
    <a class="btn btn-sm btn-outline-secondary rounded-pill px-3 <?= $page <= 1 ? 'disabled' : '' ?>" href="?p=<?= $page - 1 ?>">Previous</a>
    <?php for ($i = 1; $i <= $pages; $i++): ?>
      <a class="btn btn-sm <?= $i === $page ? 'btn-primary' : 'btn-outline-secondary' ?> rounded-circle" style="width:34px;height:34px;" href="?p=<?= $i ?>" data-testid="reviews-page-<?= $i ?>"><?= $i ?></a>
    <?php endfor; ?>
    <a class="btn btn-sm btn-outline-secondary rounded-pill px-3 <?= $page >= $pages ? 'disabled' : '' ?>" href="?p=<?= $page + 1 ?>">Next</a>
  </nav>
  <p class="text-center small text-secondary mt-2">Page <?= $page ?> of <?= $pages ?></p>

  <div class="rounded-4 text-center text-white p-5 mt-5" style="background: linear-gradient(135deg, #2563eb, #4338ca);">
    <h2 class="fw-bold h3">Join 50,000+ Happy Customers</h2>
    <p class="opacity-75">Genuine licenses, instant delivery, and support that actually helps.</p>
    <a href="shop.php" class="btn btn-light rounded-pill px-4 fw-semibold">Browse Products</a>
  </div>
</div>

<!-- Write a Review modal -->
<div class="modal fade" id="writeReviewModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title fw-bold"><i class="bi bi-pencil-square me-2 text-primary"></i>Write a Review</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <?php if ($user && $purchased): ?>
      <form method="post" data-testid="write-review-form">
        <div class="modal-body">
          <input type="hidden" name="write_review" value="1">
          <div class="mb-1 small fw-semibold">Your rating</div>
          <div class="star-input mb-3" data-testid="review-star-input">
            <?php for ($s = 5; $s >= 1; $s--): ?>
              <input type="radio" name="rating" id="star<?= $s ?>" value="<?= $s ?>" <?= $s === 5 ? 'checked' : '' ?>>
              <label for="star<?= $s ?>" title="<?= $s ?> star<?= $s > 1 ? 's' : '' ?>">★</label>
            <?php endfor; ?>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Product purchased</label>
            <select name="product" class="form-select" data-testid="review-product-select">
              <?php foreach ($purchased as $pn): ?><option><?= esc($pn) ?></option><?php endforeach; ?>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold">Location <span class="text-secondary fw-normal">(optional)</span></label>
            <input name="location" class="form-control" placeholder="e.g. Austin, TX" maxlength="60" data-testid="review-location-input">
          </div>
          <div class="mb-2">
            <label class="form-label small fw-semibold">Your review</label>
            <textarea name="text" class="form-control" rows="4" required minlength="10" maxlength="1000" placeholder="Share your experience with the product and our service..." data-testid="review-text-input"></textarea>
          </div>
          <small class="text-secondary"><i class="bi bi-patch-check-fill text-success me-1"></i>Posting as <strong><?= esc($user['name']) ?></strong> — Verified Buyer</small>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary rounded-pill px-3" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-primary rounded-pill px-4" data-testid="review-submit-btn">Submit Review</button>
        </div>
      </form>
      <?php elseif ($user): ?>
      <div class="modal-body text-center py-4" data-testid="review-not-buyer">
        <i class="bi bi-bag-x fs-1 text-secondary"></i>
        <p class="fw-semibold mt-2 mb-1">Only verified buyers can write reviews</p>
        <p class="small text-secondary mb-3">Reviews are limited to customers with a completed purchase — that's how we keep every rating genuine.</p>
        <a href="shop.php" class="btn btn-primary rounded-pill px-4">Browse Products</a>
      </div>
      <?php endif; ?>
    </div>
  </div>
</div>
<?php if ($reviewErr): ?>
<script>document.addEventListener('DOMContentLoaded', () => new bootstrap.Modal(document.getElementById('writeReviewModal')).show());</script>
<?php endif; ?>
<?php include __DIR__ . '/includes/footer.php'; ?>

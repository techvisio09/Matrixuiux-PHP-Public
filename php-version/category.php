<?php
require_once __DIR__ . '/includes/functions.php';

$slug = $_GET['slug'] ?? 'office';
$sort = $_GET['sort'] ?? '';

/* Platform-specific categories (e.g. office-2024-mac) widen to their year family
   so the Platform filter can switch between Windows / Mac / All of the same year. */
$familySlug = preg_replace('/(-for)?-(macs?|pc|windows)$/', '', $slug);
$isPlatformCat = $familySlug !== $slug;
$implied = $isPlatformCat ? (preg_match('/macs?$/', $slug) ? 'Mac' : 'Windows') : '';
$platform = isset($_GET['platform']) ? $_GET['platform'] : $implied;

if ($isPlatformCat) {
    $cats = category_children($familySlug);
    if ($cats === [$familySlug]) $cats = [$familySlug . '-pc', $familySlug . '-mac'];
} else {
    $cats = category_children($slug);
}

$title = category_title($slug);
if ($isPlatformCat && $platform !== $implied) {
    $title = category_title($familySlug) . ($platform === 'Windows' ? ' for Windows' : ($platform === 'Mac' ? ' for Mac' : ''));
}
$pageTitle = $title . ' | ' . SITE_BRAND;
$pageDescription = 'Shop genuine ' . $title . ' license keys at up to 81% off retail. Lifetime activation, instant email delivery and free support from ' . SITE_BRAND . '.';
$pageKeywords = implode(', ', [
    $title, 'buy ' . $title, $title . ' license key', $title . ' product key', $title . ' lifetime license',
    'affordable ' . $title, 'genuine ' . $title, $title . ' instant delivery', $title . ' no subscription',
    'microsoft software license key store',
]);
$products = get_products($cats, $platform, $sort);

include __DIR__ . '/includes/header.php';
?>
<?= render_page_head($title . ' Products', count($products) . ' products — genuine licenses, delivered in minutes', [$title => null], 'category-title') ?>
<div class="container py-4 py-lg-5">
  <!-- Structured toolbar: title/count | platform | sort -->
  <div class="shop-toolbar row g-3 align-items-center mb-4 mx-0 p-3" data-testid="category-toolbar">
    <div class="col-lg-4">
      <h2 class="h6 fw-bold mb-0" data-testid="category-toolbar-title"><?= esc($title) ?> Products</h2>
      <small class="text-secondary" data-testid="category-count"><?= count($products) ?> product<?= count($products) === 1 ? '' : 's' ?> available</small>
    </div>
    <div class="col-lg-4 text-lg-center">
      <div class="platform-seg d-inline-flex align-items-center p-1" data-testid="platform-filter">
        <span class="small fw-bold text-secondary ms-2 me-2">Platform:</span>
        <?php foreach (['' => ['All', null], 'Windows' => ['Windows', 'windows'], 'Mac' => ['Mac', 'macos']] as $val => [$label, $osImg]): ?>
          <a href="?slug=<?= esc($slug) ?>&platform=<?= $val ?>&sort=<?= esc($sort) ?>" class="platform-pill <?= $platform === $val ? 'active' : '' ?>" data-testid="platform-<?= $val ? strtolower($val) : 'all' ?>">
            <?php if ($osImg): ?><img src="assets/images/os/<?= $osImg ?>.svg" alt="" class="os-icon me-1"><?php endif; ?><?= $label ?>
          </a>
        <?php endforeach; ?>
      </div>
    </div>
    <div class="col-lg-4 d-flex justify-content-lg-end align-items-center gap-2">
      <form method="get" class="d-flex align-items-center gap-2">
        <input type="hidden" name="slug" value="<?= esc($slug) ?>">
        <input type="hidden" name="platform" value="<?= esc($platform) ?>">
        <span class="sort-label d-inline-flex align-items-center"><i class="bi bi-sliders me-1"></i>Sort</span>
        <select name="sort" class="form-select form-select-sm sort-select" style="width:auto" onchange="this.form.submit()" data-testid="category-sort">
          <option value="">Default</option>
          <option value="newest" <?= $sort === 'newest' ? 'selected' : '' ?>>Newest</option>
          <option value="price_asc" <?= $sort === 'price_asc' ? 'selected' : '' ?>>Price: Low to High</option>
          <option value="price_desc" <?= $sort === 'price_desc' ? 'selected' : '' ?>>Price: High to Low</option>
          <option value="rating" <?= $sort === 'rating' ? 'selected' : '' ?>>Top Rated</option>
          <option value="reviews" <?= $sort === 'reviews' ? 'selected' : '' ?>>Most Reviewed</option>
        </select>
      </form>
    </div>
  </div>

  <?php if (!$products): ?>
    <div class="alert alert-light border text-center py-5">No products found in this category. <a href="shop.php">Browse all products</a>.</div>
  <?php else: ?>
    <!-- Wide banner rows — the category page's signature layout -->
    <div class="d-grid gap-3" data-testid="category-list">
      <?php foreach ($products as $p): ?>
        <?= render_product_row($p) ?>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

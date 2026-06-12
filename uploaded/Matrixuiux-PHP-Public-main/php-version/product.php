<?php
require_once __DIR__ . '/includes/functions.php';

$slug = $_GET['slug'] ?? '';
$product = $slug ? get_product($slug) : null;
if (!$product) {
    http_response_code(404);
    $pageTitle = 'Product Not Found | ' . SITE_BRAND;
    include __DIR__ . '/includes/header.php';
    echo '<div class="container py-5 text-center"><h1 class="h3 fw-bold">Product not found</h1><a href="shop.php" class="btn btn-primary rounded-pill mt-3">Browse Products</a></div>';
    include __DIR__ . '/includes/footer.php';
    exit;
}

$pageTitle = $product['name'] . ' | ' . SITE_BRAND;
/* SEO: description, OG image and Product structured data */
$pageDescription = 'Buy ' . $product['name'] . ' — genuine lifetime license key for ' . format_price((float)$product['price'])
    . ($discountFlag = ($product['original_price'] && $product['original_price'] > $product['price']) ? ' (was ' . format_price((float)$product['original_price']) . ')' : '')
    . '. Instant email delivery, official download and 24/7 support from ' . SITE_BRAND . '.';
$ogImage = $product['image'];
$ogType = 'product';
$jsonLd = [
    '@context' => 'https://schema.org',
    '@type' => 'Product',
    'name' => $product['name'],
    'image' => $product['image'],
    'description' => $pageDescription,
    'sku' => $product['slug'],
    'brand' => ['@type' => 'Brand', 'name' => 'Microsoft'],
    'offers' => [
        '@type' => 'Offer',
        'url' => site_url() . '/product.php?slug=' . $product['slug'],
        'priceCurrency' => 'USD',
        'price' => (string)$product['price'],
        'availability' => 'https://schema.org/InStock',
        'itemCondition' => 'https://schema.org/NewCondition',
    ],
];
if ((float)$product['rating'] > 0 && (int)$product['reviews'] > 0) {
    $jsonLd['aggregateRating'] = ['@type' => 'AggregateRating', 'ratingValue' => (string)$product['rating'], 'reviewCount' => (int)$product['reviews']];
}
$pageKeywords = product_keywords($product);
$related = get_products([$product['category']]);
$related = array_values(array_filter($related, fn($r) => $r['slug'] !== $product['slug']));
$related = array_slice($related, 0, 4);
$icons = app_icons();
$apps = array_filter(explode(',', $product['apps']));
$vg = get_variant_group($product);
$cv = $vg['cur']; // current variant ($cur is reserved by header.php for currency)
$versionLabel = fn($v) => $cv['base'] === 'windows' ? "Windows $v" : (string)$v;
$discountPct = ($product['original_price'] && $product['original_price'] > $product['price'])
    ? round((1 - $product['price'] / $product['original_price']) * 100) : 0;

include __DIR__ . '/includes/header.php';
?>
<div class="container py-5">
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb small">
      <li class="breadcrumb-item"><a href="index.php">Home</a></li>
      <li class="breadcrumb-item"><a href="category.php?slug=<?= esc($product['category']) ?>"><?= esc(category_title($product['category'])) ?></a></li>
      <li class="breadcrumb-item active"><?= esc($product['name']) ?></li>
    </ol>
  </nav>

  <div class="row g-4 g-lg-5 mt-1">
    <div class="col-lg-5">
      <div class="card border p-4 position-relative">
        <?php if ($product['badge']): ?><span class="badge text-bg-primary position-absolute top-0 start-0 m-3"><?= esc($product['badge']) ?></span><?php endif; ?>
        <?php if ($discountPct): ?><span class="badge text-bg-danger position-absolute top-0 end-0 m-3">-<?= $discountPct ?>%</span><?php endif; ?>
        <div class="product-img-wrap rounded p-3">
          <img src="<?= esc($product['image']) ?>" alt="<?= esc(product_img_alt($product)) ?>" title="<?= esc($product['name']) ?>" class="img-fluid mx-auto d-block" style="max-height:300px; object-fit:contain;">
        </div>
      </div>
    </div>
    <div class="col-lg-7">
      <div class="d-flex gap-2 flex-wrap mb-2">
        <span class="badge os-badge"><img src="assets/images/os/<?= $product['platform'] === 'Mac' ? 'macos' : 'windows' ?>.svg" alt="<?= esc($product['platform']) ?>" class="os-icon me-1"><?= esc($product['platform']) ?></span>
        <span class="badge text-bg-success"><i class="bi bi-check-circle me-1"></i>In Stock</span>
        <span class="badge text-bg-info text-dark"><i class="bi bi-infinity me-1"></i>Lifetime License</span>
      </div>
      <h1 class="h3 fw-bold" data-testid="product-name"><?= esc($product['name']) ?></h1>
      <div class="mb-3"><?= render_stars((float)$product['rating']) ?> <span class="text-secondary small"><?= esc($product['rating']) ?> (<?= (int)$product['reviews'] ?> reviews)</span></div>

      <?php if ($apps): ?>
        <div class="mb-3">
          <small class="text-secondary d-block mb-1">Includes:</small>
          <?php foreach ($apps as $a): ?>
            <?php if (isset($icons[$a])): ?><img src="<?= esc($icons[$a]) ?>" alt="<?= esc($a) ?>" class="app-chip" style="width:30px;height:30px;"><?php endif; ?>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

      <?= render_variant_row('Version', 'version', $vg['versions'], $cv['version'],
            fn($v) => find_variant($vg['group'], $v, $cv['os'], $cv['edition'])
                   ?? find_variant($vg['group'], $v, $cv['os']),
            $versionLabel) ?>
      <?= render_variant_row('Edition', 'edition', $vg['editions'], $cv['edition'],
            fn($ed) => find_variant($vg['group'], $cv['version'], $cv['os'], $ed)) ?>
      <?= render_variant_row('Operating system', 'os', $vg['os_options'], $cv['os'],
            fn($os) => find_variant($vg['group'], $cv['version'], $os, $cv['edition'])
                    ?? find_variant($vg['group'], $cv['version'], $os)) ?>

      <div class="mb-4">
        <span class="display-6 fw-bold text-primary" data-testid="product-price"><?= format_price((float)$product['price']) ?></span>
        <?php if ($discountPct): ?>
          <span class="text-secondary text-decoration-line-through ms-2 fs-5"><?= format_price((float)$product['original_price']) ?></span>
          <span class="badge text-bg-danger ms-2">Save <?= $discountPct ?>%</span>
        <?php endif; ?>
      </div>

      <div class="d-flex gap-3 align-items-center mb-4 flex-wrap">
        <div class="input-group" style="width: 130px;">
          <button class="btn btn-outline-secondary" type="button" onclick="const q=document.getElementById('pd-qty'); q.value=Math.max(1, parseInt(q.value)-1)">−</button>
          <input id="pd-qty" type="number" class="form-control text-center" value="1" min="1">
          <button class="btn btn-outline-secondary" type="button" onclick="const q=document.getElementById('pd-qty'); q.value=parseInt(q.value)+1">+</button>
        </div>
        <button class="btn btn-primary btn-lg rounded-pill px-4 add-to-cart-btn" data-slug="<?= esc($product['slug']) ?>" data-testid="pd-add-to-cart"><i class="bi bi-cart-plus me-2"></i>Add to Cart</button>
        <button class="btn btn-outline-primary btn-lg rounded-pill px-4 fw-bold buy-now-btn" data-slug="<?= esc($product['slug']) ?>" data-testid="pd-buy-now"><i class="bi bi-lightning-charge me-1"></i>Buy Now</button>
      </div>

      <div class="row g-3 small">
        <div class="col-sm-6"><i class="bi bi-lightning-charge-fill text-warning me-2"></i>Instant email delivery (15-30 min)</div>
        <div class="col-sm-6"><i class="bi bi-patch-check-fill text-success me-2"></i>Genuine Microsoft key</div>
        <div class="col-sm-6"><i class="bi bi-arrow-counterclockwise text-primary me-2"></i>Money-back guarantee</div>
        <div class="col-sm-6"><i class="bi bi-headset text-primary me-2"></i>Free installation support</div>
      </div>
    </div>
  </div>

  <!-- Tabs -->
  <ul class="nav nav-tabs mt-5" role="tablist">
    <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-desc">Description</button></li>
    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-delivery">Delivery & Activation</button></li>
    <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-volume">Volume Pricing</button></li>
  </ul>
  <div class="tab-content border border-top-0 rounded-bottom p-4">
    <div class="tab-pane fade show active" id="tab-desc">
      <p><?= esc($product['name']) ?> is a genuine, lifetime-license product. One-time purchase — no subscription, no recurring fees. Your license key activates the official software downloaded directly from Microsoft (or the vendor) and remains yours forever.</p>
      <ul class="small text-secondary">
        <li>Licensed for 1 <?= esc($product['platform']) ?> device</li>
        <li>Full official version — not a trial or shared account</li>
        <li>Includes free updates within its version</li>
        <li>Activation support included — 30-day money-back policy</li>
      </ul>
    </div>
    <div class="tab-pane fade" id="tab-delivery">
      <ol class="small">
        <li class="mb-2">Complete your purchase — your license key + download link arrive by email within 15-30 minutes.</li>
        <li class="mb-2">Download the official installer from the link provided.</li>
        <li class="mb-2">Enter your product key when prompted to activate.</li>
        <li>Need help? Our team offers free installation assistance: <?= SITE_PHONE ?> (<?= SITE_HOURS ?>).</li>
      </ol>
    </div>
    <div class="tab-pane fade" id="tab-volume">
      <p class="small">Buying for a team? We offer volume discounts on 5+ licenses with consolidated invoicing.</p>
      <a href="contact.php" class="btn btn-outline-primary rounded-pill btn-sm">Request a Volume Quote</a>
    </div>
  </div>

  <?php if ($related): ?>
    <h2 class="fw-bold h4 mt-5 mb-4">Related Products</h2>
    <div class="row g-4">
      <?php foreach ($related as $r): ?>
        <div class="col-xl-3 col-lg-4 col-sm-6"><?= render_product_card($r) ?></div>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

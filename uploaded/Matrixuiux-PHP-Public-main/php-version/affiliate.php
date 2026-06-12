<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Affiliate Program | ' . SITE_BRAND;

$topSlugs = [
    'microsoft-office-home-and-business-2019-mac' => '17,688 sold',
    'microsoft-word-2021-windows' => '8,867 sold',
    'microsoft-word-2021-mac-lifetime-license-no-subscription' => '8,746 sold',
    'microsoft-excel-2021-windows' => '8,393 sold',
    'microsoft-excel-2021-mac-lifetime-license-no-subscription' => '7,930 sold',
    'microsoft-office-2024-professional-plus-windows' => '5,648 sold',
];
$in = implode(',', array_fill(0, count($topSlugs), '?'));
$st = db()->prepare("SELECT * FROM products WHERE slug IN ($in)");
$st->execute(array_keys($topSlugs));
$byslug = [];
foreach ($st->fetchAll() as $p) $byslug[$p['slug']] = $p;

$productCount = (int)db()->query('SELECT COUNT(*) c FROM products')->fetch()['c'];

$stats = [
    ['45%+', 'Average Discount', 'Fuel for strong conversion rates'],
    [$productCount . '+', 'Products', 'Ready to promote today'],
    ['30 Days', 'Cookie Duration', 'Extended attribution window'],
    ['24/7', 'Support', 'Dedicated affiliate team'],
];
$features = [
    ['bi-cash-stack', 'success', 'Competitive Commissions', 'Earn attractive rates on every sale. Our high average order value translates directly into larger payouts for you.'],
    ['bi-graph-up-arrow', 'primary', 'High Conversion Rate', 'Pricing up to 75% below retail and a trusted reputation turn your traffic into completed orders.'],
    ['bi-lightning-charge-fill', 'warning', 'Instant Digital Delivery', 'License keys arrive by email within minutes — no shipping delays, fewer refunds, fewer chargebacks.'],
    ['bi-patch-check-fill', 'success', 'Genuine Licenses', 'Every product is an authentic license. Customer trust drives repeat purchases — and repeat commissions.'],
    ['bi-globe-americas', 'info', 'Global Reach', 'We serve customers worldwide with multi-currency support (USD, EUR, GBP, CAD, AUD). Promote to any market.'],
    ['bi-link-45deg', 'primary', 'Deep Linking Support', 'Link straight to any product page for targeted campaigns. A complete product feed is available through CJ for dynamic ads.'],
];
$steps = [
    ['Join via CJ Affiliate', 'Create a free CJ Affiliate account, search for "' . SITE_BRAND . '" in the advertiser marketplace, and apply to our program.'],
    ['Get Your Links', 'Once approved, access your unique tracking links, banners, and our full product feed. Deep link to any product page.'],
    ['Earn Commissions', 'Share your links on your website, blog, social channels, or newsletter — and earn on every qualifying sale.'],
];
$faqs = [
    ['How do I join the ' . SITE_BRAND . ' affiliate program?', 'Create a free account at CJ Affiliate (www.cj.com), search for "' . SITE_BRAND . '" in the advertiser marketplace, and submit your application. Approval typically takes 1–3 business days.'],
    ['What products can I promote?', 'Our entire catalog of genuine Microsoft software — Office 2024, 2021 and 2019, Windows 10/11, Visio, Project and more — for both Windows and Mac, plus leading antivirus brands.'],
    ['How are commissions tracked and paid?', 'All tracking and payments run through CJ Affiliate. Sales are attributed via a 30-day cookie and paid out on CJ\'s standard payment schedule.'],
    ['Do you provide marketing materials?', 'Yes — product feeds (TXT and XML), banners, text links, and deep-linking support are all available through the CJ platform. You can also build custom links to any product page.'],
    ['What is your refund policy for affiliate sales?', 'We offer a 30-day money-back guarantee. If a customer is refunded, the corresponding commission is reversed. Our refund rate stays under 2% — a reflection of product quality.'],
    ['Can I promote internationally?', 'Absolutely. We accept customers worldwide and support USD, EUR, GBP, CAD and AUD. The store automatically presents prices in the visitor\'s preferred currency.'],
];

include __DIR__ . '/includes/header.php';
?>
<!-- Hero -->
<div class="page-head" data-testid="affiliate-hero">
  <div class="container py-5 text-center">
    <div class="d-flex justify-content-center mb-3"><?= render_logo(52) ?></div>
    <span class="badge rounded-pill text-bg-primary px-3 py-2 mb-2"><i class="bi bi-stars me-1"></i>CJ AFFILIATE NETWORK PARTNER</span>
    <h1 class="display-6 fw-bold">Earn Commissions Promoting <span class="brand-grad">Genuine Microsoft Software</span></h1>
    <p class="text-secondary mx-auto mt-2" style="max-width: 680px;">Partner with <?= SITE_BRAND ?> through CJ (Commission Junction) and earn competitive commissions on every sale — backed by high conversion rates, instant digital delivery, and products customers already trust.</p>
    <div class="d-flex justify-content-center gap-2 flex-wrap mt-3">
      <a href="https://www.cj.com" target="_blank" rel="noopener" class="btn btn-primary rounded-pill px-4 fw-semibold" data-testid="affiliate-join-btn">Join via CJ Affiliate <i class="bi bi-box-arrow-up-right ms-1"></i></a>
      <a href="#how-it-works" class="btn btn-outline-primary rounded-pill px-4" data-testid="affiliate-learn-btn">Learn More</a>
    </div>
  </div>
</div>

<!-- Stats -->
<section class="py-5">
  <div class="container">
    <div class="row g-3" data-testid="affiliate-stats">
      <?php foreach ($stats as [$value, $label, $sub]): ?>
        <div class="col-6 col-lg-3">
          <div class="card text-center p-4 h-100">
            <div class="fs-3 fw-bold text-primary"><?= $value ?></div>
            <div class="fw-semibold small"><?= $label ?></div>
            <small class="text-secondary"><?= $sub ?></small>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Why partner -->
<section class="py-5 bg-soft" data-testid="affiliate-why">
  <div class="container">
    <div class="text-center mb-5 mx-auto" style="max-width: 620px;">
      <span class="eyebrow">WHY PARTNER WITH US</span>
      <h2 class="fw-bold mt-1">Built for Affiliate Success</h2>
      <p class="text-secondary"><?= SITE_BRAND ?> gives affiliates everything they need to succeed — trusted products, competitive commissions, and hands-on marketing support.</p>
    </div>
    <div class="row g-4">
      <?php foreach ($features as [$icon, $color, $title, $text]): ?>
        <div class="col-lg-4 col-md-6">
          <div class="card p-4 h-100">
            <span class="d-inline-flex align-items-center justify-content-center rounded-3 mb-3" style="width:46px;height:46px;background:rgba(37,99,235,.08);"><i class="bi <?= $icon ?> text-<?= $color ?> fs-5"></i></span>
            <h3 class="h6 fw-bold mb-1"><?= $title ?></h3>
            <p class="small text-secondary mb-0"><?= $text ?></p>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- How it works -->
<section class="py-5" id="how-it-works" data-testid="affiliate-steps">
  <div class="container">
    <div class="text-center mb-5">
      <span class="eyebrow">SIMPLE PROCESS</span>
      <h2 class="fw-bold mt-1">How It Works</h2>
      <p class="text-secondary">Getting started takes three steps — then the commissions are yours to earn.</p>
    </div>
    <div class="row g-4">
      <?php foreach ($steps as $i => [$title, $text]): ?>
        <div class="col-md-4">
          <div class="card p-4 h-100 text-center">
            <span class="logo-mark mx-auto mb-3" style="width:46px;height:46px;"><?= $i + 1 ?></span>
            <h3 class="h6 fw-bold"><?= $title ?></h3>
            <p class="small text-secondary mb-0"><?= $text ?></p>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Top products -->
<section class="py-5 bg-soft" data-testid="affiliate-products">
  <div class="container">
    <div class="text-center mb-5 mx-auto" style="max-width: 620px;">
      <span class="eyebrow">HIGHEST CONVERTERS</span>
      <h2 class="fw-bold mt-1">Top Products to Promote</h2>
      <p class="text-secondary">Our best-selling licenses with the strongest conversion rates — focus your campaigns here for maximum earnings.</p>
    </div>
    <div class="row g-4">
      <?php foreach ($topSlugs as $slug => $sold): $p = $byslug[$slug] ?? null; if (!$p) continue;
        $off = $p['original_price'] > 0 ? round(100 - $p['price'] / $p['original_price'] * 100) : 0; ?>
        <div class="col-lg-4 col-md-6">
          <a href="product.php?slug=<?= esc($p['slug']) ?>" class="card p-3 h-100 text-decoration-none flex-row align-items-center gap-3" data-testid="affiliate-product-<?= esc($p['slug']) ?>">
            <div class="bg-body-tertiary rounded-3 product-img-wrap flex-shrink-0" style="width:84px;height:84px;">
              <img src="<?= esc($p['image']) ?>" alt="<?= esc($p['name']) ?>" class="object-fit-contain p-2 w-100 h-100" loading="lazy">
            </div>
            <div class="min-w-0">
              <div class="fw-bold small text-body text-truncate-2"><?= esc($p['name']) ?></div>
              <div class="my-1">
                <span class="fw-bold text-primary"><?= format_price((float)$p['price']) ?></span>
                <small class="text-secondary text-decoration-line-through ms-1"><?= format_price((float)$p['original_price']) ?></small>
                <?php if ($off): ?><span class="badge text-bg-danger ms-1"><?= $off ?>% off</span><?php endif; ?>
              </div>
              <small class="text-secondary"><i class="bi bi-<?= $p['platform'] === 'Mac' ? 'apple' : 'windows' ?> me-1"></i><?= esc($p['platform']) ?> · <i class="bi bi-fire text-danger"></i> <?= $sold ?></small>
            </div>
          </a>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="py-5" data-testid="affiliate-faq">
  <div class="container" style="max-width: 760px;">
    <div class="text-center mb-4">
      <span class="eyebrow">QUESTIONS</span>
      <h2 class="fw-bold mt-1">Affiliate FAQ</h2>
    </div>
    <div class="accordion" id="affFaq">
      <?php foreach ($faqs as $i => [$q, $a]): ?>
        <div class="accordion-item">
          <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#aff<?= $i ?>"><?= esc($q) ?></button></h2>
          <div id="aff<?= $i ?>" class="accordion-collapse collapse" data-bs-parent="#affFaq"><div class="accordion-body small text-secondary"><?= esc($a) ?></div></div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="pb-5">
  <div class="container">
    <div class="rounded-4 text-center text-white p-5 position-relative overflow-hidden" style="background: linear-gradient(135deg, #2563eb, #4338ca);">
      <div class="biz-glow"></div>
      <h2 class="fw-bold">Ready to Start Earning?</h2>
      <p class="opacity-75 mx-auto" style="max-width: 540px;">Join our affiliate program today through CJ Affiliate and start earning commissions on genuine Microsoft software sales.</p>
      <div class="d-flex justify-content-center gap-2 flex-wrap">
        <a href="https://www.cj.com" target="_blank" rel="noopener" class="btn btn-light rounded-pill px-4 fw-semibold">Join via CJ Affiliate</a>
        <a href="contact.php" class="btn btn-outline-light rounded-pill px-4" data-testid="affiliate-contact-btn">Contact Affiliate Team</a>
      </div>
    </div>
  </div>
</section>
<?php include __DIR__ . '/includes/footer.php'; ?>

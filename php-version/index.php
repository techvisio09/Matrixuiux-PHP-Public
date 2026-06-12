<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = SITE_BRAND . ' | Genuine Microsoft Software Licenses — Instant Delivery';
$pageDescription = 'Genuine Microsoft Office 2024/2021/2019, Windows 11 and antivirus license keys at up to 81% off. Instant digital delivery in 15-30 minutes, lifetime activation, 30-day money-back guarantee.';

$bestSellers = db()->query("SELECT * FROM products WHERE badge IS NOT NULL ORDER BY reviews DESC LIMIT 4")->fetchAll();
$newArrivals = db()->query("SELECT * FROM products WHERE is_new = 1 ORDER BY reviews DESC LIMIT 4")->fetchAll();
$pickedForYou = db()->query("SELECT * FROM products ORDER BY reviews DESC LIMIT 8")->fetchAll();
$testimonials = db()->query("SELECT * FROM testimonials ORDER BY rating DESC LIMIT 6")->fetchAll();
$faqs = db()->query("SELECT * FROM faqs")->fetchAll();
$posts = db()->query("SELECT * FROM blog_posts LIMIT 3")->fetchAll();

// "Welcome back" personalized strip — Office/Apps 2024 picks
$welcomeBack = array_values(array_filter(array_map('get_product', [
    'microsoft-office-home-2024-pc',
    'microsoft-office-2024-professional-plus-windows',
    'microsoft-office-home-business-2024-pc',
    'microsoft-project-2024-professional-pc',
])));

include __DIR__ . '/includes/header.php';
?>

<!-- Hero -->
<section class="hero py-5">
  <div class="container">
    <div class="row align-items-center g-4 g-lg-5">
      <div class="col-lg-7">
        <span class="badge rounded-pill text-bg-light border mb-3"><i class="bi bi-lightning-charge-fill text-warning me-1"></i>Instant Digital Delivery</span>
        <h1 class="display-4">Boost Productivity with Microsoft Office 2024 <span class="accent">for Business and Personal Use</span></h1>
        <p class="text-secondary fs-5 mt-3">Trusted by over fifty thousand users across the globe.</p>
        <ul class="list-unstyled d-grid gap-2 my-4">
          <li><i class="bi bi-check-circle-fill text-success me-2"></i>Genuine Microsoft License Keys</li>
          <li><i class="bi bi-check-circle-fill text-success me-2"></i>Perpetual Access — No Subscriptions</li>
          <li><i class="bi bi-check-circle-fill text-success me-2"></i>Instant Digital Delivery</li>
        </ul>
        <div class="d-flex gap-3 flex-wrap">
          <a href="shop.php" class="btn btn-primary btn-lg rounded-pill px-4" data-testid="hero-shop-now">Shop Now <i class="bi bi-arrow-right"></i></a>
          <a href="category.php?slug=office" class="btn btn-outline-secondary btn-lg rounded-pill px-4">Compare Editions</a>
        </div>
        <div class="d-flex gap-5 mt-5 flex-wrap hero-stats">
          <div><div class="fs-3 fw-bold">50K+</div><small class="text-secondary">Happy Customers</small></div>
          <div><div class="fs-3 fw-bold">24/7</div><small class="text-secondary">Instant Delivery</small></div>
          <div><div class="fs-3 fw-bold">4.6/5</div><small class="text-secondary">Customer Rating</small></div>
        </div>
      </div>
      <div class="col-lg-5">
        <?php
        $heroSlides = array_values(array_filter(array_map('get_product', [
            'microsoft-office-2024-professional-plus-windows',
            'microsoft-office-home-2024-pc',
            'windows-11-pro',
            'microsoft-project-2024-professional-pc',
            'mcafee-premium-individual-1-year-unlimited-devices-usa',
        ])));
        $hi = app_icons();
        ?>
        <div class="hero-showcase mx-auto position-relative" data-testid="hero-showcase">
          <?php foreach ($heroSlides as $i => $hp): ?>
            <span class="hero-bg-photo<?= $i === 0 ? ' active' : '' ?>" data-testid="hero-bg-<?= $i ?>" style="background-image:url('<?= esc($hp['image']) ?>');" aria-hidden="true"></span>
          <?php endforeach; ?>
          <span class="hero-bg-aurora" aria-hidden="true"></span>
          <div class="hero-showcase-frame">
            <div class="hero-art" aria-hidden="true">
              <span class="hero-art-glow glow-1"></span>
              <span class="hero-art-glow glow-2"></span>
              <span class="hero-tile tile-1"><img src="<?= esc($hi['word']) ?>" alt="Microsoft Word"></span>
              <span class="hero-tile tile-2"><img src="<?= esc($hi['excel']) ?>" alt="Microsoft Excel"></span>
              <span class="hero-tile tile-3"><img src="<?= esc($hi['powerpoint']) ?>" alt="Microsoft PowerPoint"></span>
              <span class="hero-tile tile-4"><img src="<?= esc($hi['outlook']) ?>" alt="Microsoft Outlook"></span>
            </div>
            <?php foreach ($heroSlides as $i => $hp): ?>
              <img src="<?= esc($hp['image']) ?>" alt="<?= esc(product_img_alt($hp)) ?>" title="<?= esc($hp['name']) ?>" class="hero-art-img<?= $i === 0 ? ' active' : '' ?>" loading="<?= $i === 0 ? 'eager' : 'lazy' ?>" data-testid="hero-art-<?= $i ?>">
            <?php endforeach; ?>
            <a href="product.php?slug=<?= esc($heroSlides[0]['slug']) ?>" id="hero-photo-link" class="hero-photo-link" aria-label="View <?= esc($heroSlides[0]['name']) ?>" title="<?= esc($heroSlides[0]['name']) ?>" data-testid="hero-photo-link"></a>
            <span class="hero-delivery-pill" data-testid="hero-delivery-pill"><i class="bi bi-lightning-charge-fill"></i>Keys in 15–30 min</span>
            <div class="hero-product-glass" data-testid="hero-product-glass">
              <?php foreach ($heroSlides as $i => $hp): ?>
                <a href="product.php?slug=<?= esc($hp['slug']) ?>" class="hero-slide hero-glass-slide<?= $i === 0 ? ' active' : '' ?>" aria-label="<?= esc($hp['name']) ?>" data-testid="hero-slide-<?= $i ?>">
                  <span class="hero-glass-thumb"><img src="<?= esc($hp['image']) ?>" alt="<?= esc(product_img_alt($hp)) ?>" title="<?= esc($hp['name']) ?>" loading="<?= $i === 0 ? 'eager' : 'lazy' ?>"></span>
                  <span class="hero-glass-text">
                    <span class="hero-glass-name" data-testid="hero-glass-name-<?= $i ?>"><?= esc($hp['name']) ?></span>
                    <span class="hero-glass-prices">
                      <span class="hero-glass-price-now" data-testid="hero-glass-price-<?= $i ?>"><?= format_price((float)$hp['price']) ?></span>
                      <?php if ($hp['original_price']): ?>
                        <span class="hero-glass-price-old"><?= format_price((float)$hp['original_price']) ?></span>
                      <?php endif; ?>
                    </span>
                  </span>
                  <span class="hero-glass-cta"><i class="bi bi-arrow-right"></i></span>
                </a>
              <?php endforeach; ?>
            </div>
          </div>
          <span class="hero-rating-chip card px-3 py-2 small fw-bold" data-testid="hero-rating-chip"><span class="text-warning">★</span> 4.6/5 · 5,519+ verified reviews</span>
        </div>
        <div class="hero-dots d-flex justify-content-center gap-2 mt-3" data-testid="hero-dots">
          <?php foreach ($heroSlides as $i => $s): ?>
            <button type="button" class="hero-dot<?= $i === 0 ? ' active' : '' ?>" aria-label="Show product <?= $i + 1 ?>" data-slide="<?= $i ?>" data-testid="hero-dot-<?= $i ?>"></button>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Trust strip -->
<div class="border-bottom py-3">
  <div class="container d-flex justify-content-center gap-4 flex-wrap small text-secondary">
    <span><i class="bi bi-shield-check text-primary me-1"></i>SSL Secured</span>
    <span><i class="bi bi-check2-circle text-primary me-1"></i>30-Day Guarantee</span>
    <span><i class="bi bi-patch-check text-primary me-1"></i>Microsoft Verified</span>
    <span><strong>Shopper Approved</strong> 5,519+ verified reviews <span class="text-warning">★ 4.6</span></span>
  </div>
</div>

<!-- Ask AI teaser — compact, centered -->
<section class="pt-4">
  <div class="container text-center">
    <div class="ask-ai-pill d-inline-flex align-items-center gap-3 px-4 py-2" data-testid="ask-ai-teaser">
      <span class="logo-mark ask-ai-mark"><i class="bi bi-stars"></i></span>
      <div class="text-start lh-sm">
        <div class="fw-bold small">Ask <?= SITE_BRAND ?> AI</div>
        <small class="text-secondary fst-italic" style="font-size:.74rem;">"Which Office is right for my Mac?"</small>
      </div>
      <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="toggleChat()" data-testid="ask-ai-try-btn">Try it <i class="bi bi-arrow-right ms-1"></i></button>
    </div>
  </div>
</section>

<!-- Welcome back / personalized strip -->
<?php if ($welcomeBack): ?>
<section class="py-4">
  <div class="container">
    <div class="card p-4" data-testid="welcome-back-strip">
      <span class="eyebrow">TAILORED FOR RETURNING USERS</span>
      <div class="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-3">
        <div>
          <h2 class="h4 fw-bold mb-1 mt-1">Welcome back — explore Office 2024 software</h2>
          <small class="text-secondary">Find the best tools for your PC. Enjoy instant digital delivery on all products.</small>
        </div>
        <a href="category.php?slug=office-2024-pc" class="btn btn-outline-primary btn-sm rounded-pill px-3">Shop now</a>
      </div>
      <div class="row g-3">
        <?php foreach ($welcomeBack as $p): ?>
          <div class="col-lg-3 col-sm-6">
            <a href="product.php?slug=<?= esc($p['slug']) ?>" class="card h-100 p-3 text-decoration-none">
              <div class="d-flex gap-2 align-items-center">
                <img src="<?= esc($p['image']) ?>" alt="<?= esc(product_img_alt($p)) ?>" title="<?= esc($p['name']) ?>" style="width:54px;height:54px;object-fit:contain;" class="bg-body-tertiary rounded p-1">
                <div>
                  <div class="small fw-semibold text-body lh-sm"><?= esc($p['name']) ?></div>
                  <span class="price-pair">
                    <span class="price-now small"><?= format_price((float)$p['price']) ?></span>
                    <?php if ($p['original_price']): ?><span class="price-old"><?= format_price((float)$p['original_price']) ?></span><?php endif; ?>
                  </span>
                </div>
              </div>
            </a>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<!-- Trust badges row -->
<section class="py-4">
  <div class="container">
    <div class="row g-3 text-center" data-testid="trust-badges-row">
      <?php
      $tb = [
        ['bi-patch-check-fill', 'Genuine Licenses', 'Microsoft Verified'],
        ['bi-lightning-charge-fill', 'Instant Delivery', '15-30 Minutes'],
        ['bi-infinity', 'Perpetual License', 'No Subscriptions'],
        ['bi-headset', 'Free Support', SITE_HOURS],
        ['bi-shield-lock-fill', 'SSL Secured', 'Safe Checkout'],
        ['bi-arrow-counterclockwise', '30-Day Guarantee', 'Full Refund'],
      ];
      foreach ($tb as [$ic, $t, $s]): ?>
        <div class="col-lg-2 col-md-4 col-6">
          <div class="card h-100 py-3 px-2">
            <i class="bi <?= $ic ?> text-primary fs-4"></i>
            <div class="small fw-bold mt-1"><?= $t ?></div>
            <small class="text-secondary" style="font-size:.7rem;"><?= esc($s) ?></small>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Categories: one-line scrollable browse bar -->
<section class="py-4">
  <div class="container">
    <div class="d-flex align-items-center gap-2">
      <span class="small fw-semibold text-secondary flex-shrink-0">Browse:</span>
      <div class="overflow-auto flex-grow-1" style="scrollbar-width:thin; min-width:0;" data-testid="browse-toggle-bar">
        <div class="d-flex gap-2 pb-2" style="width:max-content;">
          <?php
          $chips = [
            ['office-2024-pc', 'Office 2024 (PC)'], ['office-2024-mac', 'Office 2024 (Mac)'],
            ['office-2021-pc', 'Office 2021 (PC)'], ['office-2021-mac', 'Office 2021 (Mac)'],
            ['office-2019-pc', 'Office 2019 (PC)'], ['office-2019-mac', 'Office 2019 (Mac)'],
            ['office-pc', 'Office for Windows'], ['office-mac', 'Office for Mac'], ['office', 'Microsoft Office'],
            ['windows-11', 'Windows 11'], ['windows-10', 'Windows 10'], ['windows', 'Windows OS'],
            ['microsoft-project', 'Microsoft Project'], ['microsoft-visio', 'Microsoft Visio'], ['apps', 'Microsoft Apps'],
            ['bitdefender', 'Bitdefender'], ['mcafee', 'McAfee Antivirus'], ['antivirus', 'Antivirus'],
          ];
          foreach ($chips as [$s, $n]): ?>
            <a class="cat-chip flex-shrink-0" href="category.php?slug=<?= $s ?>" data-testid="browse-chip-<?= $s ?>"><?= esc($n) ?></a>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Best Sellers — minimal centered grid -->
<section class="py-5 bg-soft">
  <div class="container">
    <div class="text-center mb-4">
      <span class="eyebrow">TOP RATED</span>
      <h2 class="fw-bold mt-1 mb-1">Best Sellers</h2>
      <small class="text-secondary"><?= count($bestSellers) ?> products available · <a href="shop.php" class="text-decoration-none fw-semibold">View All <i class="bi bi-arrow-right"></i></a></small>
    </div>
    <div class="row g-4" data-testid="bestseller-grid">
      <?php foreach ($bestSellers as $p): ?>
        <div class="col-xl-3 col-lg-4 col-sm-6"><?= render_product_card($p) ?></div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Picked for you -->
<section class="py-5">
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="fw-bold mb-0">Picked for you <span class="badge text-bg-primary align-middle" style="font-size:.6rem;">AI</span></h2>
        <small class="text-secondary">Based on your interest in Windows &amp; Office 2024</small>
      </div>
      <a href="shop.php" class="text-decoration-none fw-semibold">View All <i class="bi bi-arrow-right"></i></a>
    </div>
    <div class="scroll-strip d-flex gap-3 overflow-auto pb-3" data-testid="picked-for-you">
      <?php foreach ($pickedForYou as $p):
        $sPct = ($p['original_price'] && $p['original_price'] > $p['price'])
            ? round((1 - $p['price'] / $p['original_price']) * 100) : 0; ?>
        <div class="card product-card strip-card flex-shrink-0 position-relative" data-testid="strip-card-<?= esc($p['slug']) ?>">
          <?php if ($sPct): ?><span class="badge text-bg-danger position-absolute top-0 end-0 m-2" style="z-index:2;">-<?= $sPct ?>%</span><?php endif; ?>
          <a href="product.php?slug=<?= esc($p['slug']) ?>" class="d-block">
            <div class="strip-img">
              <img src="<?= esc($p['image']) ?>" alt="<?= esc(product_img_alt($p)) ?>" title="<?= esc($p['name']) ?>" loading="lazy">
            </div>
          </a>
          <div class="card-body d-flex flex-column p-3">
            <div class="small mb-1"><?= render_stars((float)$p['rating']) ?> <span class="text-secondary">(<?= (int)$p['reviews'] ?>)</span></div>
            <a href="product.php?slug=<?= esc($p['slug']) ?>" class="text-decoration-none text-body fw-semibold product-title mb-2"><?= esc($p['name']) ?></a>
            <div class="mt-auto d-flex align-items-center justify-content-between">
              <span class="fw-bold text-primary"><?= format_price((float)$p['price']) ?></span>
              <button class="btn btn-sm btn-primary rounded-pill add-to-cart-btn" data-slug="<?= esc($p['slug']) ?>" data-testid="add-to-cart-<?= esc($p['slug']) ?>"><i class="bi bi-cart-plus"></i> Add</button>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- For Every Business -->
<section class="py-5 bg-soft">
  <div class="container">
    <div class="row g-4 align-items-center">
      <div class="col-lg-4">
        <div class="rounded-4 text-white p-4 position-relative overflow-hidden biz-card" data-testid="business-card">
          <div class="biz-glow"></div>
          <span class="badge rounded-pill text-bg-warning text-dark fw-bold mb-2" style="font-size:.62rem; letter-spacing:.12em;">VOLUME PRICING</span>
          <h3 class="fw-bold h4 mb-1">For Every <span class="text-warning">Business</span></h3>
          <p class="small opacity-75 mb-3">Professional tools for teams of all sizes. Volume discounts available.</p>
          <div class="d-flex flex-wrap gap-2 mb-3">
            <span class="biz-chip"><i class="bi bi-people-fill me-1"></i>Team Licensing</span>
            <span class="biz-chip"><i class="bi bi-headset me-1"></i>Priority Support</span>
            <span class="biz-chip"><i class="bi bi-tags-fill me-1"></i>Bulk Discounts</span>
          </div>
          <a href="contact.php" class="btn btn-light btn-sm rounded-pill px-4 fw-semibold">Contact Sales <i class="bi bi-arrow-right ms-1"></i></a>
        </div>
      </div>
      <div class="col-lg-8">
        <div class="row g-3 h-100">
          <?php foreach ($newArrivals as $p): ?>
            <div class="col-sm-6"><?= render_product_card($p) ?></div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- How It Works -->
<section class="py-5">
  <div class="container">
    <div class="text-center mb-5">
      <span class="eyebrow">SIMPLE PROCESS</span>
      <h2 class="fw-bold mt-1">How It Works</h2>
      <p class="text-secondary mx-auto" style="max-width:560px;">Get your authentic Microsoft Office license in four simple steps. Professional support available throughout the process.</p>
    </div>
    <div class="row g-4" data-testid="how-it-works">
      <?php
      $steps = [
        ['01', 'Choose Your Edition', 'Browse our selection and pick the Microsoft Office edition that fits your needs.'],
        ['02', 'Secure Checkout', 'Complete your purchase through our SSL-secured payment with multiple options.'],
        ['03', 'Instant Delivery', 'Receive your license key via email within 15-30 minutes of confirmation.'],
        ['04', 'Download & Activate', 'Download directly from Microsoft, enter your key, and start using Office.'],
      ];
      foreach ($steps as [$n, $t, $d]): ?>
        <div class="col-lg-3 col-sm-6">
          <div class="card h-100 p-4">
            <div class="fs-3 fw-bold text-primary opacity-50"><?= $n ?></div>
            <h6 class="fw-bold mt-1"><?= $t ?></h6>
            <small class="text-secondary"><?= $d ?></small>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Trusted by thousands stats -->
<section class="py-5 bg-soft">
  <div class="container text-center">
    <h2 class="fw-bold">Trusted by Thousands of Customers</h2>
    <p class="text-secondary">Join satisfied customers who chose authentic Microsoft Office software</p>
    <div class="row g-4 mt-2" data-testid="trusted-stats">
      <?php foreach ([['5+ Yrs', 'In Business'], ['50,000+', 'Happy Customers'], ['15-30min', 'Delivery Time'], ['4.6/5', 'Customer Rating']] as [$v, $l]): ?>
        <div class="col-md-3 col-6"><div class="fs-2 fw-bold text-primary"><?= $v ?></div><small class="text-secondary"><?= $l ?></small></div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Why Choose Perpetual Licenses -->
<section class="py-5">
  <div class="container">
    <div class="text-center mb-5">
      <span class="eyebrow">WHY CHOOSE US</span>
      <h2 class="fw-bold mt-1">Why Choose Perpetual Licenses?</h2>
      <p class="text-secondary mx-auto" style="max-width:620px;">Get the complete Microsoft Office experience with one-time purchase. No recurring subscription fees, just authentic software that's yours forever.</p>
    </div>
    <div class="row g-4" data-testid="why-choose-grid">
      <?php
      $why = [
        ['bi-lightning-charge-fill', 'Instant Delivery', 'Receive your authentic license key via email within 15-30 minutes of purchase.'],
        ['bi-patch-check-fill', 'Genuine Products', 'All licenses are authentic and sourced from authorized Microsoft distributors.'],
        ['bi-infinity', 'Perpetual License', 'No recurring fees or subscriptions. One-time purchase with perpetual lifetime use.'],
        ['bi-headset', 'Expert Support', 'Professional technical support for installation, activation, and any questions.'],
        ['bi-shield-lock-fill', 'Secure Checkout', 'Shop with confidence using our SSL-encrypted payment processing.'],
        ['bi-arrow-counterclockwise', '30-Day Guarantee', 'Not satisfied? Get a full refund within 30 days, no questions asked.'],
      ];
      foreach ($why as [$ic, $t, $d]): ?>
        <div class="col-lg-4 col-sm-6">
          <div class="card h-100 p-4">
            <i class="bi <?= $ic ?> text-primary fs-3"></i>
            <h6 class="fw-bold mt-2"><?= $t ?></h6>
            <small class="text-secondary"><?= $d ?></small>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Testimonials -->
<section class="py-5 bg-soft">
  <div class="container">
    <div class="text-center mb-4">
      <span class="eyebrow">TESTIMONIALS</span>
      <h2 class="fw-bold mt-1">What Our Customers Say</h2>
      <p class="text-secondary mb-1">Real verified reviews from Shopper Approved</p>
      <div><span class="text-warning">★★★★★</span> <strong>4.6/5</strong> <small class="text-secondary">(5,519+ verified reviews)</small></div>
    </div>
    <div class="row g-4">
      <?php foreach ($testimonials as $t): ?>
        <div class="col-lg-4 col-md-6">
          <div class="card h-100 p-3">
            <div class="d-flex gap-2 small mb-2">
              <span class="badge text-bg-success-subtle text-success-emphasis" style="font-size:.6rem;"><i class="bi bi-patch-check-fill me-1"></i>Verified Purchase</span>
              <span class="badge text-bg-secondary-subtle text-secondary-emphasis" style="font-size:.6rem;">Shopper Approved</span>
            </div>
            <p class="small text-secondary mb-3">"<?= esc($t['text']) ?>"</p>
            <div class="d-flex align-items-center gap-2 mt-auto">
              <span class="badge rounded-circle text-bg-primary p-2"><?= esc($t['initials']) ?></span>
              <div>
                <div class="fw-bold small"><?= esc($t['name']) ?></div>
                <small class="text-secondary"><?= esc($t['location']) ?></small>
              </div>
              <span class="ms-auto small"><?= render_stars((float)$t['rating']) ?></span>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="text-center mt-4"><a href="page.php?slug=customer-reviews" class="text-decoration-none fw-semibold">See all reviews on Shopper Approved <i class="bi bi-arrow-right"></i></a></div>
  </div>
</section>

<!-- Your Trusted Software Partner -->
<section class="py-5" data-testid="trusted-partner-section">
  <div class="container">
    <div class="row g-4 g-lg-5 align-items-center">
      <div class="col-lg-7">
        <h2 class="fw-bold">Your Trusted Software Partner</h2>
        <p class="text-secondary mt-3">At <?= SITE_BRAND ?>, we're committed to providing genuine Microsoft software at competitive prices. Our team of experts ensures every customer receives the support they need for a seamless experience.</p>
        <p class="text-secondary">We go beyond simply selling products. Our philosophy revolves around problem-solving, ensuring we address any challenges our customers encounter with installation, activation, or usage.</p>
        <div class="row g-2 small mt-2">
          <?php
          $partnerPoints = [
            'Authorized Microsoft software reseller', 'Over 50,000 satisfied customers worldwide',
            'Instant digital delivery within minutes', 'Free professional installation support',
            'Customer service ' . SITE_HOURS, '30-day money-back guarantee',
          ];
          foreach ($partnerPoints as $pp): ?>
            <div class="col-sm-6"><i class="bi bi-check-circle-fill text-success me-2"></i><?= esc($pp) ?></div>
          <?php endforeach; ?>
        </div>
        <a href="about-us.php" class="btn btn-outline-primary rounded-pill px-4 mt-4">Learn More About Us</a>
      </div>
      <div class="col-lg-5">
        <div class="row g-3 text-center">
          <?php foreach ([['50,000+', 'Happy Customers'], ['5+ Yrs', 'In Business'], ['15-30min', 'Delivery Time'], ['4.6/5', 'Customer Rating']] as [$v, $l]): ?>
            <div class="col-6"><div class="card p-4 h-100"><div class="fs-3 fw-bold text-primary"><?= $v ?></div><small class="text-secondary"><?= $l ?></small></div></div>
          <?php endforeach; ?>
        </div>
        <div class="text-center mt-3 small text-secondary">
          <div class="fw-semibold mb-2">Trusted by</div>
          <div class="d-flex flex-wrap justify-content-center gap-2 opacity-75">
            <?php foreach (['Businesses', 'Schools & Universities', 'Government Teams', 'Nonprofits', 'Freelancers'] as $org): ?>
              <span class="badge text-bg-light border"><?= $org ?></span>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="py-5 bg-soft">
  <div class="container" style="max-width: 860px;">
    <div class="text-center mb-4">
      <h2 class="fw-bold">Frequently Asked Questions</h2>
      <p class="text-secondary">Get answers to common questions about our authentic Microsoft Office licenses</p>
    </div>
    <div class="accordion" id="faqAcc">
      <?php foreach ($faqs as $i => $f): ?>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button <?= $i ? 'collapsed' : '' ?>" type="button" data-bs-toggle="collapse" data-bs-target="#faq<?= $i ?>"><?= esc($f['question']) ?></button>
          </h2>
          <div id="faq<?= $i ?>" class="accordion-collapse collapse <?= $i ? '' : 'show' ?>" data-bs-parent="#faqAcc">
            <div class="accordion-body small text-secondary"><?= esc($f['answer']) ?></div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="text-center mt-4 small">
      <span class="text-secondary">Still have questions? We're here to help.</span>
      <a href="contact.php" class="btn btn-sm btn-primary rounded-pill px-3 ms-2">Contact Support</a>
      <a href="mailto:<?= SITE_EMAIL ?>" class="btn btn-sm btn-outline-primary rounded-pill px-3 ms-1">Email Us</a>
    </div>
  </div>
</section>

<!-- CTA band -->
<section class="py-5">
  <div class="container">
    <div class="rounded-4 text-center text-white p-5 cta-band-dark" data-testid="cta-band">
      <h2 class="fw-bold">Get Your Microsoft Office License Today</h2>
      <p class="opacity-75 mx-auto" style="max-width:540px;">Authentic perpetual licenses with professional support and instant delivery. Join 50,000+ satisfied customers.</p>
      <div class="d-flex justify-content-center gap-4 flex-wrap small my-3 opacity-75">
        <span><i class="bi bi-check-circle me-1"></i>Genuine Licenses</span>
        <span><i class="bi bi-download me-1"></i>Instant Download</span>
        <span><i class="bi bi-headset me-1"></i>Professional Support</span>
        <span><i class="bi bi-shield-lock me-1"></i>Secure Checkout</span>
      </div>
      <div class="d-flex justify-content-center gap-2 flex-wrap">
        <a href="shop.php" class="btn btn-light rounded-pill px-4 fw-semibold">Browse Products</a>
        <a href="category.php?slug=office" class="btn btn-outline-light rounded-pill px-4">Compare Editions</a>
      </div>
    </div>
  </div>
</section>

<!-- Blog -->
<section class="py-5 bg-soft">
  <div class="container">
    <div class="d-flex justify-content-between align-items-end mb-4">
      <div>
        <span class="eyebrow">FROM OUR BLOG</span>
        <h2 class="fw-bold mb-0 mt-1">Tips &amp; Guides</h2>
        <small class="text-secondary">Get the most out of your Microsoft software with our helpful articles and guides.</small>
      </div>
      <a href="blog.php" class="text-decoration-none fw-semibold flex-shrink-0">View All Articles <i class="bi bi-arrow-right"></i></a>
    </div>
    <div class="row g-4">
      <?php foreach ($posts as $b): ?>
        <div class="col-lg-4">
          <a href="blog-post.php?id=<?= esc($b['id']) ?>" class="card h-100 text-decoration-none">
            <img src="<?= esc($b['image']) ?>" class="card-img-top object-fit-cover" style="height:180px;" alt="<?= esc($b['title']) ?>">
            <div class="card-body">
              <small class="text-secondary"><?= esc($b['date']) ?> · <?= esc($b['read_time']) ?></small>
              <h6 class="fw-bold mt-2 text-body"><?= esc($b['title']) ?></h6>
            </div>
          </a>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>

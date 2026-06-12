<?php
require_once __DIR__ . '/functions.php';
$pageTitle = $pageTitle ?? (SITE_BRAND . ' | Genuine Microsoft Software');
$cur = current_currency();
$checkoutHeader = $checkoutHeader ?? false;

/* ---- SEO defaults (pages may override before including this header) ---- */
$pageDescription = $pageDescription ?? 'Buy genuine Microsoft Office, Windows and antivirus license keys at up to 81% off. Instant digital delivery, lifetime activation and 24/7 US-based support.';
$script = basename($_SERVER['SCRIPT_NAME'] ?? '');
$noIndex = $noIndex ?? in_array($script, ['cart.php', 'checkout.php', 'login.php', 'register.php', 'account.php', 'admin.php', 'admin-email-preview.php', 'logout.php', 'order-success.php', '404.php'], true);
if (!isset($canonicalUrl)) {
    $canonicalPath = $script === 'index.php' ? '/' : '/' . $script;
    $canonicalSlug = isset($_GET['slug']) && $_GET['slug'] !== '' ? '?slug=' . urlencode($_GET['slug']) : '';
    $canonicalUrl = site_url() . $canonicalPath . $canonicalSlug;
}
$ogImage = $ogImage ?? site_url() . '/assets/images/badges/microsoft-verified.svg';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script>
    // Apply saved theme BEFORE styles render — prevents light-mode flicker on every navigation
    (function () { try { document.documentElement.setAttribute('data-bs-theme', localStorage.getItem('uc_theme') || 'light'); } catch (e) {} })();
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= esc($pageTitle) ?></title>
  <meta name="description" content="<?= esc($pageDescription) ?>">
  <meta name="robots" content="<?= $noIndex ? 'noindex, nofollow' : 'index, follow' ?>">
  <?php if (isset($pageKeywords)): ?>
  <meta name="keywords" content="<?= esc($pageKeywords) ?>">
  <?php endif; ?>
  <link rel="canonical" href="<?= esc($canonicalUrl) ?>">
  <?php if (defined('GOOGLE_SITE_VERIFICATION') && GOOGLE_SITE_VERIFICATION !== ''): ?>
  <meta name="google-site-verification" content="<?= esc(GOOGLE_SITE_VERIFICATION) ?>">
  <?php endif; ?>
  <!-- Open Graph / Twitter -->
  <meta property="og:site_name" content="<?= SITE_BRAND ?>">
  <meta property="og:type" content="<?= isset($ogType) ? esc($ogType) : 'website' ?>">
  <meta property="og:title" content="<?= esc($pageTitle) ?>">
  <meta property="og:description" content="<?= esc($pageDescription) ?>">
  <meta property="og:url" content="<?= esc($canonicalUrl) ?>">
  <meta property="og:image" content="<?= esc($ogImage) ?>">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= esc($pageTitle) ?>">
  <meta name="twitter:description" content="<?= esc($pageDescription) ?>">
  <meta name="twitter:image" content="<?= esc($ogImage) ?>">
  <!-- Structured data: Organization + WebSite -->
  <script type="application/ld+json"><?= json_encode([
      '@context' => 'https://schema.org',
      '@graph' => [
          [
              '@type' => 'Organization',
              'name' => SITE_LEGAL,
              'url' => site_url() . '/',
              'logo' => site_url() . '/assets/images/badges/microsoft-verified.svg',
              'contactPoint' => ['@type' => 'ContactPoint', 'telephone' => SITE_PHONE, 'contactType' => 'customer service', 'availableLanguage' => 'English'],
          ],
          [
              '@type' => 'WebSite',
              'name' => SITE_BRAND,
              'url' => site_url() . '/',
              'potentialAction' => ['@type' => 'SearchAction', 'target' => site_url() . '/shop.php?q={search_term_string}', 'query-input' => 'required name=search_term_string'],
          ],
      ],
  ], JSON_UNESCAPED_SLASHES) ?></script>
  <?php if (isset($jsonLd)): ?>
  <script type="application/ld+json"><?= json_encode($jsonLd, JSON_UNESCAPED_SLASHES) ?></script>
  <?php endif; ?>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link href="assets/css/style.css" rel="stylesheet">
  <link href="assets/css/theme3d.css" rel="stylesheet">
  <script>window.SITE_PHONE = '<?= SITE_PHONE ?>'; window.CART_SLUGS = <?= json_encode(array_keys(cart())) ?>;</script>
</head>
<body>

<?php if ($checkoutHeader): ?>
<!-- Centered premium checkout banner with 3D rotating logo + 3D brand text -->
<nav class="checkout-brand-banner" data-testid="checkout-brand-banner">
  <div class="container">
    <a href="index.php" class="d-flex flex-column align-items-center text-decoration-none gap-2" data-testid="brand-logo">
      <span class="brand3d-wrap brand3d-lg"><?= render_logo(56) ?></span>
      <span class="brand-text-3d" data-testid="checkout-brand-text">Matrixuiux Software</span>
    </a>
    <div class="d-flex align-items-center gap-3 small mt-1 flex-wrap justify-content-center">
      <span class="secure-pill"><i class="bi bi-lock-fill"></i> 256-bit Secure Checkout</span>
      <a href="tel:<?= SITE_PHONE ?>" class="phone-link"><i class="bi bi-telephone-fill me-1"></i><?= SITE_PHONE ?></a>
      <span class="text-warning small"><i class="bi bi-star-fill me-1"></i>4.6/5 · 5,519+ reviews</span>
    </div>
  </div>
</nav>
<?php else: ?>

<!-- Promo bar -->
<div class="topbar text-center py-2 px-3">
  Save up to 20% on Microsoft Office 2024 — use code <strong>MATRIX20</strong> at checkout — <a href="shop.php" class="text-white fw-bold">Shop Now ›</a>
</div>

<!-- Trust bar -->
<div class="trustbar py-1 px-3 d-none d-md-block">
  <div class="container d-flex justify-content-between align-items-center">
    <div class="d-flex gap-4">
      <span><i class="bi bi-patch-check-fill text-success me-1"></i>Genuine Microsoft Products</span>
      <span><a href="reviews.php" class="text-decoration-none text-white"><span class="text-warning">★★★★★</span> 4.6/5 (4,722+ Reviews)</a></span>
      <span><i class="bi bi-lightning-charge-fill text-warning me-1"></i>Instant Digital Delivery</span>
    </div>
    <div class="d-flex gap-3 align-items-center">
      <span class="badge text-bg-warning text-dark">★ Trusted Software Store</span>
      <span class="badge bg-white text-dark border">5 <small>YRS</small></span>
      <a href="tel:<?= SITE_PHONE ?>" class="text-decoration-none text-white"><i class="bi bi-telephone-fill me-1"></i><?= SITE_PHONE ?></a>
    </div>
  </div>
</div>

<!-- Main navbar -->
<nav class="navbar navbar-expand-lg bg-body border-bottom sticky-top">
  <div class="container position-relative">
    <a class="navbar-brand d-flex align-items-center gap-2" href="index.php" data-testid="brand-logo">
      <span class="brand3d-wrap"><?= render_logo(42) ?></span>
      <span>
        <span class="brand-text-3d d-block lh-1" style="font-size:1.05rem;">Matrixuiux Software</span>
        <small class="brand-tag">AUTHORIZED RESELLER</small>
      </span>
    </a>
    <div class="d-flex align-items-center gap-2 d-lg-none ms-auto me-2">
      <a href="cart.php" class="btn btn-sm btn-primary rounded-pill position-relative" data-testid="cart-button-mobile">
        <i class="bi bi-cart3"></i>
        <span class="cart-count-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger <?= cart_count() === 0 ? 'd-none' : '' ?>" data-testid="cart-count-mobile"><?= cart_count() ?></span>
      </a>
    </div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav mx-auto">
        <li class="nav-item dropdown position-static">
          <a class="nav-link dropdown-toggle fw-semibold" href="#" data-bs-toggle="dropdown" data-testid="nav-microsoft">Microsoft Products</a>
          <div class="dropdown-menu mega p-4 shadow">
            <div class="row g-4">
              <?php foreach (nav_microsoft() as $heading => $col): ?>
                <div class="col-6 col-lg-3">
                  <div class="mega-heading mb-2"><?= esc($heading) ?></div>
                  <?php foreach ($col['groups'] as $label => $catSlug): ?>
                    <a class="mega-year" href="category.php?slug=<?= esc($catSlug) ?>" data-testid="menu-<?= esc($catSlug) ?>"><?= esc($label) ?></a>
                  <?php endforeach; ?>
                  <a class="mega-link fw-bold text-primary mt-2" href="category.php?slug=<?= esc($col['all'][0]) ?>" data-testid="menu-all-<?= esc($col['all'][0]) ?>"><?= esc($col['all'][1]) ?> <i class="bi bi-arrow-right"></i></a>
                </div>
              <?php endforeach; ?>
            </div>
            <?= render_menu_promo() ?>
            <div class="mt-3 pt-2 border-top">
              <a href="page.php?slug=disclaimer" class="text-decoration-none fw-semibold small" data-testid="menu-disclaimer-ms"><i class="bi bi-info-circle me-1"></i>Disclaimer</a>
            </div>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle fw-semibold" href="#" data-bs-toggle="dropdown" data-testid="nav-antivirus">Antivirus</a>
          <div class="dropdown-menu p-3 shadow antivirus-menu" style="min-width: 320px;">
            <div class="mega-heading mb-1">ANTIVIRUS</div>
            <a class="mega-year" href="category.php?slug=bitdefender" data-testid="menu-bitdefender">Bitdefender</a>
            <a class="mega-year" href="category.php?slug=mcafee" data-testid="menu-mcafee">McAfee</a>
            <a class="mega-link fw-bold text-primary mt-2" href="category.php?slug=antivirus" data-testid="menu-all-antivirus">All Antivirus <i class="bi bi-arrow-right"></i></a>
            <a class="mega-link mt-1" href="page.php?slug=disclaimer" data-testid="menu-disclaimer-av"><i class="bi bi-info-circle me-1"></i>Disclaimer</a>
            <?= render_menu_promo(true) ?>
          </div>
        </li>
        <li class="nav-item"><a class="nav-link fw-semibold" href="contact.php">Request a Quote</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold" href="shop.php" data-testid="nav-shop">Shop</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold" href="blog.php">Blog</a></li>
        <li class="nav-item"><a class="nav-link fw-semibold" href="affiliate.php" data-testid="nav-affiliates">Affiliates</a></li>
      </ul>
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <button class="btn btn-sm btn-outline-primary rounded-pill" onclick="toggleChat()" data-testid="ask-ai-btn"><i class="bi bi-stars me-1"></i>Ask AI</button>
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill" data-bs-toggle="dropdown" data-testid="currency-selector">
            <i class="bi bi-globe2 me-1"></i><?= esc($cur['code']) ?>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <?php foreach ($GLOBALS['CURRENCIES'] as $code => $c): ?>
              <li><a class="dropdown-item <?= $code === $cur['code'] ? 'active' : '' ?>" href="?cur=<?= $code ?>"><?= $c['flag'] ?> <?= $code ?> (<?= $c['symbol'] ?>)</a></li>
            <?php endforeach; ?>
          </ul>
        </div>
        <button class="btn btn-sm btn-outline-secondary rounded-circle" onclick="toggleTheme()" title="Toggle dark mode" data-testid="theme-toggle"><i id="theme-icon" class="bi bi-moon"></i></button>
        <a href="cart.php" class="btn btn-sm btn-primary rounded-pill position-relative" data-testid="cart-button">
          <i class="bi bi-cart3 me-1"></i>Cart
          <span class="cart-count-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger <?= cart_count() === 0 ? 'd-none' : '' ?>" data-testid="cart-count"><?= cart_count() ?></span>
        </a>
      </div>
    </div>
  </div>
  <!-- Mobile fixed contact strip — stays still inside the sticky header -->
  <div class="mobile-contact-strip d-lg-none w-100" data-testid="mobile-contact-strip">
    <div class="container d-flex align-items-center justify-content-between gap-2 py-1">
      <div class="lh-sm">
        <div class="fw-bold" style="font-size:.74rem;">Have a Question?</div>
        <div class="text-secondary" style="font-size:.62rem;">Call Mon–Fri 9 AM–6 PM EST</div>
      </div>
      <div class="d-flex gap-2 flex-shrink-0">
        <a href="tel:<?= SITE_PHONE ?>" class="btn btn-sm btn-success rounded-pill fw-bold" style="font-size:.7rem;" data-testid="mobile-call-btn"><i class="bi bi-telephone-fill me-1"></i><?= SITE_PHONE ?></a>
        <button class="btn btn-sm btn-primary rounded-pill fw-bold" style="font-size:.7rem;" onclick="toggleChat()" data-testid="mobile-chat-btn"><i class="bi bi-chat-dots-fill me-1"></i>Chat</button>
      </div>
    </div>
  </div>
</nav>
<?php endif; ?>

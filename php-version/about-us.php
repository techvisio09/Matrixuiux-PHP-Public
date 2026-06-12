<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'About Us | ' . SITE_BRAND;
include __DIR__ . '/includes/header.php';

$stats = [
    ['icon' => 'bi-people-fill', 'color' => 'primary', 'value' => '50,000+', 'label' => 'Happy Customers'],
    ['icon' => 'bi-patch-check-fill', 'color' => 'success', 'value' => '100%', 'label' => 'Genuine Products'],
    ['icon' => 'bi-lightning-charge-fill', 'color' => 'warning', 'value' => '15–30min', 'label' => 'Delivery Time'],
    ['icon' => 'bi-star-fill', 'color' => 'info', 'value' => '4.9/5', 'label' => 'Customer Rating'],
];
$checklist = [
    ['bi-award-fill', 'Authorized Microsoft software reseller'],
    ['bi-people-fill', 'Over 50,000 satisfied customers worldwide'],
    ['bi-lightning-charge-fill', 'Instant digital delivery within minutes'],
    ['bi-tools', 'Free professional installation support'],
    ['bi-headset', 'Customer service Mon–Sat, 9 AM–6 PM EST'],
    ['bi-arrow-counterclockwise', '30-day money-back guarantee'],
];
$features = [
    ['bi-lightning-charge-fill', 'warning', 'Instant Delivery', 'Your authentic license key lands in your inbox within 15–30 minutes of purchase — no waiting, no shipping.'],
    ['bi-patch-check-fill', 'success', 'Genuine Products', 'Every license is sourced through authorized Microsoft distribution channels and verified before delivery.'],
    ['bi-infinity', 'primary', 'Perpetual License', 'One payment, yours forever. No recurring fees, no subscriptions — the software belongs to you for life.'],
    ['bi-headset', 'info', 'Expert Support', 'Professional technical guidance for installation, activation, and any question along the way.'],
    ['bi-lock-fill', 'primary', 'Secure Checkout', 'Shop confidently over SSL-encrypted, PCI-compliant payment processing with trusted providers.'],
    ['bi-arrow-counterclockwise', 'danger', '30-Day Guarantee', 'Not satisfied? Receive a full refund within 30 days — no questions asked, no hoops to jump through.'],
];
?>
<!-- Hero -->
<div class="page-head" data-testid="about-hero">
  <div class="container py-5">
    <nav aria-label="breadcrumb"><ol class="breadcrumb small"><li class="breadcrumb-item"><a href="index.php">Home</a></li><li class="breadcrumb-item active">About Us</li></ol></nav>
    <div class="text-center mx-auto" style="max-width: 760px;">
      <div class="d-flex justify-content-center mb-3"><?= render_logo(56) ?></div>
      <span class="eyebrow">OUR STORY</span>
      <h1 class="display-5 fw-bold mt-1">About <span class="brand-grad">Matrixuiux Software</span></h1>
      <p class="text-secondary mt-2 fs-5">Your trusted partner for genuine Microsoft software</p>
    </div>
  </div>
</div>

<!-- Trusted partner -->
<section class="py-5" data-testid="about-mission">
  <div class="container">
    <div class="row g-4 g-lg-5 align-items-center">
      <div class="col-lg-6">
        <span class="eyebrow">WHO WE ARE</span>
        <h2 class="fw-bold mt-1">Your Trusted Software Partner</h2>
        <p class="text-secondary mt-3">At <?= SITE_LEGAL ?>, we are committed to delivering genuine Microsoft software at honest, competitive prices. Our team of specialists makes sure every customer gets the guidance they need for a seamless experience — from checkout to activation.</p>
        <p class="text-secondary">We see ourselves as more than a storefront. Our philosophy is built around problem-solving: whatever challenge you meet with installation, activation, or everyday use, we stay with you until it's resolved.</p>
        <a href="page.php?slug=why-choose-us" class="btn btn-outline-primary rounded-pill px-4 mt-2" data-testid="about-learn-more">Learn More About Us <i class="bi bi-arrow-right ms-1"></i></a>
      </div>
      <div class="col-lg-6">
        <div class="card p-4" data-testid="about-checklist">
          <?php foreach ($checklist as [$icon, $text]): ?>
            <div class="d-flex align-items-center gap-3 py-2 border-bottom border-opacity-25">
              <span class="d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width:34px;height:34px;background:rgba(37,99,235,.1);"><i class="bi <?= $icon ?> text-primary"></i></span>
              <span class="small fw-semibold"><?= $text ?></span>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="row g-3 mt-4" data-testid="about-stats">
      <?php foreach ($stats as $s): ?>
        <div class="col-6 col-lg-3">
          <div class="card text-center p-4 h-100">
            <i class="bi <?= $s['icon'] ?> text-<?= $s['color'] ?> fs-3"></i>
            <div class="fs-3 fw-bold mt-2"><?= $s['value'] ?></div>
            <div class="small text-secondary"><?= $s['label'] ?></div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<!-- Why Choose Perpetual Licenses -->
<section class="py-5 bg-soft" data-testid="about-why-choose">
  <div class="container">
    <div class="text-center mb-5 mx-auto" style="max-width: 640px;">
      <span class="eyebrow">WHY CHOOSE US</span>
      <h2 class="fw-bold mt-1">Why Choose Perpetual Licenses?</h2>
      <p class="text-secondary">Get the complete Microsoft Office experience with a single purchase. No recurring subscription fees — just authentic software that's yours forever.</p>
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

<!-- CTA -->
<section class="py-5" data-testid="about-help-cta">
  <div class="container">
    <div class="rounded-4 text-center text-white p-5 position-relative overflow-hidden" style="background: linear-gradient(135deg, #2563eb, #4338ca);">
      <div class="biz-glow"></div>
      <h2 class="fw-bold">Get Your Microsoft Office License Today</h2>
      <p class="opacity-75 mx-auto" style="max-width: 560px;">Authentic perpetual licenses with professional support and instant delivery. Join 50,000+ satisfied customers.</p>
      <div class="d-flex justify-content-center gap-3 flex-wrap small mb-4">
        <span class="biz-chip"><i class="bi bi-patch-check-fill me-1"></i>Genuine Licenses</span>
        <span class="biz-chip"><i class="bi bi-download me-1"></i>Instant Download</span>
        <span class="biz-chip"><i class="bi bi-headset me-1"></i>Professional Support</span>
        <span class="biz-chip"><i class="bi bi-lock-fill me-1"></i>Secure Checkout</span>
      </div>
      <div class="d-flex justify-content-center gap-2 flex-wrap">
        <a href="shop.php" class="btn btn-light rounded-pill px-4 fw-semibold" data-testid="about-browse-btn">Browse Products</a>
        <a href="category.php?slug=office" class="btn btn-outline-light rounded-pill px-4" data-testid="about-compare-btn">Compare Editions</a>
      </div>
    </div>
  </div>
</section>
<?php include __DIR__ . '/includes/footer.php'; ?>

<?php
require_once __DIR__ . '/includes/functions.php';
http_response_code(404);
$pageTitle = 'Page Not Found | ' . SITE_BRAND;
$noIndex = true;
include __DIR__ . '/includes/header.php';
?>
<div class="container py-5 text-center" style="max-width: 560px;">
  <div class="display-1 fw-bold brand-grad">404</div>
  <h1 class="h4 fw-bold mt-2" data-testid="notfound-title">Page not found</h1>
  <p class="text-secondary">The page you're looking for doesn't exist or has moved. Try one of these instead:</p>
  <div class="d-flex gap-2 justify-content-center flex-wrap mt-3">
    <a href="index.php" class="btn btn-primary rounded-pill px-4" data-testid="notfound-home">Home</a>
    <a href="shop.php" class="btn btn-outline-primary rounded-pill px-4">Shop All Products</a>
    <a href="contact.php" class="btn btn-outline-secondary rounded-pill px-4">Contact Us</a>
  </div>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

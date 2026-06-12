<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Sitemap | ' . SITE_BRAND;
include __DIR__ . '/includes/header.php';

// Link to the product page when the slug exists, otherwise to the category listing
$r = fn(string $slug, string $fallback) => get_product($slug) ? 'product.php?slug=' . $slug : $fallback;

$groups = [
    ['icon' => 'bi-house-fill', 'title' => 'Main Pages', 'links' => [
        ['Home', 'index.php'],
        ['Shop All Products', 'shop.php'],
        ['Antivirus Software', 'category.php?slug=antivirus'],
        ['About Us', 'about-us.php'],
        ['FAQ', 'page.php?slug=faqs'],
        ['Contact Us', 'contact.php'],
        ['Shopping Cart', 'cart.php'],
    ]],
    ['icon' => 'bi-windows', 'title' => 'Microsoft Office for PC', 'links' => [
        ['Office 2024 Professional Plus', $r('microsoft-office-2024-professional-plus-windows', 'category.php?slug=office-2024-pc')],
        ['Office 2024 Home & Business', $r('microsoft-office-home-business-2024-pc', 'category.php?slug=office-2024-pc')],
        ['Office 2024 Home', $r('microsoft-office-home-2024-pc', 'category.php?slug=office-2024-pc')],
        ['Office 2021 Professional Plus', $r('microsoft-office-2021-professional-plus-windows', 'category.php?slug=office-2021-pc')],
        ['Office 2021 Home & Business', $r('microsoft-office-2021-home-business-windows', 'category.php?slug=office-2021-pc')],
        ['Office 2021 Home & Student', $r('microsoft-office-2021-home-student-windows', 'category.php?slug=office-2021-pc')],
        ['Office 2019 Professional Plus', $r('microsoft-office-2019-professional-plus-windows', 'category.php?slug=office-2019-pc')],
        ['Office 2019 Home & Business', $r('microsoft-office-2019-home-business-pc', 'category.php?slug=office-2019-pc')],
        ['Office 2019 Home & Student', $r('microsoft-office-2019-home-student-windows', 'category.php?slug=office-2019-pc')],
    ]],
    ['icon' => 'bi-apple', 'title' => 'Microsoft Office for Mac', 'links' => [
        ['Office 2024 for Mac (Home & Business)', $r('microsoft-office-home-business-2024-mac', 'category.php?slug=office-2024-mac')],
        ['Office 2024 Home for Mac', $r('microsoft-office-home-2024-mac', 'category.php?slug=office-2024-mac')],
        ['Office 2021 Home & Business (Mac)', $r('microsoft-office-2021-home-business-mac', 'category.php?slug=office-2021-mac')],
        ['Office 2021 Home & Student for Mac', $r('microsoft-office-2021-home-student-mac', 'category.php?slug=office-2021-mac')],
        ['Office 2019 for Mac', $r('microsoft-office-home-and-business-2019-mac', 'category.php?slug=office-2019-mac')],
        ['Office 2019 Home & Student for Mac', $r('microsoft-office-home-and-student-2019-mac', 'category.php?slug=office-2019-mac')],
    ]],
    ['icon' => 'bi-window-stack', 'title' => 'Windows Operating System', 'links' => [
        ['Windows 11 Pro', $r('windows-11-pro', 'category.php?slug=windows-11')],
        ['Windows 11 Home', $r('windows-11-home', 'category.php?slug=windows-11')],
        ['Windows 10 Pro', $r('windows-10-pro', 'category.php?slug=windows-10')],
        ['Windows 10 Home', $r('windows-10-home', 'category.php?slug=windows-10')],
    ]],
    ['icon' => 'bi-bag-fill', 'title' => 'Microsoft Apps', 'links' => [
        ['Microsoft Project 2024 Professional', $r('microsoft-project-2024-professional-pc', 'category.php?slug=microsoft-project')],
        ['Microsoft Project 2021 Professional', $r('microsoft-project-professional-2021-pc', 'category.php?slug=microsoft-project')],
        ['Microsoft Visio 2024 Professional', $r('microsoft-visio-2024-professional-windows-pc', 'category.php?slug=microsoft-visio')],
        ['Microsoft Visio 2021 Professional', $r('microsoft-visio-2021-professional-windows-pc', 'category.php?slug=microsoft-visio')],
    ]],
    ['icon' => 'bi-bug-fill', 'title' => 'Antivirus Software', 'links' => [
        ['All McAfee Products', 'category.php?slug=mcafee'],
        ['All Bitdefender Products', 'category.php?slug=bitdefender'],
    ]],
    ['icon' => 'bi-file-text-fill', 'title' => 'Legal & Policies', 'links' => [
        ['Privacy Policy', 'page.php?slug=privacy-policy'],
        ['Terms of Service', 'page.php?slug=terms-of-service'],
        ['Refund Policy', 'page.php?slug=refund-policy'],
        ['Shipping & Delivery', 'page.php?slug=shipping-delivery'],
        ['Payment Policy', 'page.php?slug=payment-policy'],
        ['Cookie Policy', 'page.php?slug=cookie-policy'],
        ['Do Not Sell My Info', 'page.php?slug=do-not-sell'],
        ['Disclaimer', 'page.php?slug=disclaimer'],
    ]],
];
?>
<div class="container py-5" data-testid="sitemap-page">
  <nav aria-label="breadcrumb"><ol class="breadcrumb small"><li class="breadcrumb-item"><a href="index.php">Home</a></li><li class="breadcrumb-item active">Sitemap</li></ol></nav>
  <h1 class="fw-bold mb-4">Sitemap</h1>
  <div class="row g-4">
    <?php foreach ($groups as $g): ?>
      <div class="col-sm-6 col-lg-4">
        <div class="card p-4 h-100" data-testid="sitemap-group-<?= slugify($g['title']) ?>">
          <div class="d-flex align-items-center gap-2 mb-3">
            <span class="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded" style="width:36px;height:36px;"><i class="bi <?= $g['icon'] ?>"></i></span>
            <h2 class="h6 fw-bold mb-0"><?= esc($g['title']) ?></h2>
          </div>
          <ul class="list-unstyled d-grid gap-2 small mb-0">
            <?php foreach ($g['links'] as [$label, $href]): ?>
              <li><a href="<?= esc($href) ?>" class="text-decoration-none link-secondary"><?= esc($label) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </div>
      </div>
    <?php endforeach; ?>
  </div>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

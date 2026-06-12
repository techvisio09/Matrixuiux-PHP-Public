<?php
// Dynamic XML sitemap for Google Search Console (served at /sitemap.xml via router.php).
require_once __DIR__ . '/includes/functions.php';

header('Content-Type: application/xml; charset=UTF-8');

$base = site_url();
$today = date('Y-m-d');
$urls = [];

// Core pages
foreach ([
    ['/', '1.0', 'daily'],
    ['/shop.php', '0.9', 'daily'],
    ['/reviews.php', '0.7', 'weekly'],
    ['/blog.php', '0.7', 'weekly'],
    ['/about-us.php', '0.6', 'monthly'],
    ['/why-choose-us.php', '0.6', 'monthly'],
    ['/affiliate.php', '0.6', 'monthly'],
    ['/contact.php', '0.6', 'monthly'],
    ['/support.php', '0.6', 'monthly'],
    ['/returns.php', '0.5', 'monthly'],
    ['/sitemap.php', '0.4', 'monthly'],
] as [$path, $pri, $freq]) {
    $urls[] = [$base . $path, $today, $freq, $pri];
}

// Categories (nav families + platform variants)
$catSlugs = ['office', 'office-pc', 'office-mac', 'office-2024-pc', 'office-2024-mac', 'office-2021-pc', 'office-2021-mac',
    'office-2019-pc', 'office-2019-mac', 'windows', 'windows-11', 'windows-10', 'project', 'visio', 'servers',
    'antivirus', 'bitdefender', 'mcafee'];
foreach ($catSlugs as $cs) {
    $urls[] = [$base . '/category.php?slug=' . $cs, $today, 'weekly', '0.8'];
}

// Products
foreach (db()->query('SELECT slug FROM products') as $r) {
    $urls[] = [$base . '/product.php?slug=' . $r['slug'], $today, 'weekly', '0.8'];
}

// Blog posts
foreach (db()->query('SELECT id, date FROM blog_posts') as $r) {
    $urls[] = [$base . '/blog-post.php?id=' . $r['id'], substr((string)$r['date'], 0, 10) ?: $today, 'monthly', '0.6'];
}

// Content / legal pages
foreach (db()->query('SELECT slug FROM pages') as $r) {
    $urls[] = [$base . '/page.php?slug=' . $r['slug'], $today, 'monthly', '0.4'];
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as [$loc, $mod, $freq, $pri]) {
    echo "  <url><loc>" . htmlspecialchars($loc, ENT_XML1) . "</loc><lastmod>{$mod}</lastmod><changefreq>{$freq}</changefreq><priority>{$pri}</priority></url>\n";
}
echo '</urlset>';

<?php
// Google Merchant Center product feed (RSS 2.0 + g: namespace), served at /merchant-feed.xml.
// Submit this URL in Merchant Center → Products → Feeds.
require_once __DIR__ . '/includes/functions.php';

header('Content-Type: application/xml; charset=UTF-8');

$base = site_url();

function feed_brand(string $name): string
{
    if (stripos($name, 'bitdefender') !== false) return 'Bitdefender';
    if (stripos($name, 'mcafee') !== false) return 'McAfee';
    return 'Microsoft';
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title><?= esc(SITE_BRAND) ?></title>
  <link><?= esc($base) ?>/</link>
  <description>Genuine Microsoft Office, Windows and antivirus license keys with instant digital delivery.</description>
<?php foreach (db()->query('SELECT * FROM products') as $p):
    $hasSale = $p['original_price'] && $p['original_price'] > $p['price'];
    $desc = 'Genuine ' . $p['name'] . ' lifetime license key for ' . ($p['platform'] ?: 'Windows')
          . '. Instant email delivery within 15-30 minutes, official download link and free activation support from ' . SITE_BRAND . '.';
?>
  <item>
    <g:id><?= esc($p['slug']) ?></g:id>
    <g:title><?= esc($p['name']) ?></g:title>
    <g:description><?= esc($desc) ?></g:description>
    <g:link><?= esc($base . '/product.php?slug=' . $p['slug']) ?></g:link>
    <g:image_link><?= esc($p['image']) ?></g:image_link>
    <g:availability><?= ((int)($p['stock'] ?? 1) > 0) ? 'in_stock' : 'out_of_stock' ?></g:availability>
    <g:price><?= $hasSale ? number_format((float)$p['original_price'], 2, '.', '') : number_format((float)$p['price'], 2, '.', '') ?> USD</g:price>
<?php if ($hasSale): ?>
    <g:sale_price><?= number_format((float)$p['price'], 2, '.', '') ?> USD</g:sale_price>
<?php endif; ?>
    <g:brand><?= esc(feed_brand($p['name'])) ?></g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>no</g:identifier_exists>
    <g:google_product_category>Software &gt; Computer Software</g:google_product_category>
  </item>
<?php endforeach; ?>
</channel>
</rss>

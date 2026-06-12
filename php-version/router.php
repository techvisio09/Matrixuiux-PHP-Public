<?php
// Router for PHP's built-in server (used by start.sh in the Emergent preview).
// Serves existing files/scripts directly; maps "/" to index.php and /sitemap.xml
// to the dynamic generator. Unknown URLs return a real 404 (important for SEO —
// previously they fell through to the homepage, creating duplicate content).
// Not needed on Apache/nginx hosting (use equivalent rewrite + ErrorDocument rules).
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/sitemap.xml') {
    require __DIR__ . '/sitemap-xml.php';
    return true;
}
if ($path === '/merchant-feed.xml') {
    require __DIR__ . '/merchant-feed.php';
    return true;
}
$file = __DIR__ . $path;
if ($path !== '/' && file_exists($file) && !is_dir($file)) {
    return false; // let the built-in server handle real files (php, css, js, images)
}
if ($path === '/' || $path === '/index.php') {
    require __DIR__ . '/index.php';
    return true;
}
require __DIR__ . '/404.php';

<?php
// Shared helpers: session, currency, cart, products, rendering
require_once __DIR__ . '/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function esc($s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

/* ---------------- Currency ---------------- */
if (isset($_GET['cur']) && isset($GLOBALS['CURRENCIES'][$_GET['cur']])) {
    $_SESSION['currency'] = $_GET['cur'];
}

function current_currency(): array
{
    $code = $_SESSION['currency'] ?? 'USD';
    return ['code' => $code] + $GLOBALS['CURRENCIES'][$code];
}

function format_price(float $usd): string
{
    $c = current_currency();
    return $c['symbol'] . number_format($usd * $c['rate'], 2);
}

/* ---------------- Auth ---------------- */
function ensure_admin(): void
{
    $stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([strtolower(ADMIN_EMAIL)]);
    if (!$stmt->fetch()) {
        $ins = db()->prepare('INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)');
        $ins->execute([strtolower(ADMIN_EMAIL), 'Admin', password_hash(ADMIN_PASSWORD, PASSWORD_DEFAULT), 'admin']);
    }
}

function current_user(): ?array
{
    if (empty($_SESSION['user_id'])) return null;
    $stmt = db()->prepare('SELECT id, email, name, role FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch() ?: null;
}

function require_admin(): array
{
    $user = current_user();
    if (!$user || $user['role'] !== 'admin') {
        header('Location: login.php?next=admin.php');
        exit;
    }
    return $user;
}

/* ---------------- Cart (session) ---------------- */
function cart(): array
{
    return $_SESSION['cart'] ?? []; // [slug => qty]
}

function cart_count(): int
{
    return array_sum(cart());
}

function cart_items(): array
{
    $c = cart();
    if (!$c) return [];
    $in = implode(',', array_fill(0, count($c), '?'));
    $stmt = db()->prepare("SELECT * FROM products WHERE slug IN ($in)");
    $stmt->execute(array_keys($c));
    $items = [];
    foreach ($stmt->fetchAll() as $p) {
        $p['qty'] = $c[$p['slug']];
        $items[] = $p;
    }
    return $items;
}

function cart_subtotal(): float
{
    $t = 0;
    foreach (cart_items() as $i) $t += $i['price'] * $i['qty'];
    return $t;
}

/* ---------------- Products ---------------- */
function get_product(string $slug): ?array
{
    $stmt = db()->prepare('SELECT * FROM products WHERE slug = ?');
    $stmt->execute([$slug]);
    return $stmt->fetch() ?: null;
}

// Parent/alias category slugs -> list of granular categories
function category_children(string $slug): array
{
    $map = [
        'office-pc'  => ['office-2024-pc', 'office-2021-pc', 'office-2019-pc'],
        'office-mac' => ['office-2024-mac', 'office-2021-mac', 'office-2019-mac'],
        'office'     => ['office-2024-pc', 'office-2021-pc', 'office-2019-pc', 'office-2024-mac', 'office-2021-mac', 'office-2019-mac'],
        'windows'    => ['windows-11', 'windows-10'],
        'apps'       => ['microsoft-project', 'microsoft-visio'],
        'antivirus'  => ['bitdefender', 'mcafee'],
        // legacy aliases
        'microsoft-office'       => ['office-2024-pc', 'office-2021-pc', 'office-2019-pc', 'office-2024-mac', 'office-2021-mac', 'office-2019-mac'],
        'microsoft-office-2024'  => ['office-2024-pc', 'office-2024-mac'],
        'microsoft-office-2021'  => ['office-2021-pc', 'office-2021-mac'],
        'microsoft-office-2019'  => ['office-2019-pc', 'office-2019-mac'],
        'office-2024-for-mac'    => ['office-2024-mac'],
        'office-2021-for-mac'    => ['office-2021-mac'],
        'office-2019-for-mac'    => ['office-2019-mac'],
        'office-for-mac'         => ['office-2024-mac', 'office-2021-mac', 'office-2019-mac'],
        'office-for-macs'        => ['office-2024-mac', 'office-2021-mac', 'office-2019-mac'],
        'office-for-windows'     => ['office-2024-pc', 'office-2021-pc', 'office-2019-pc'],
        'windows-os'             => ['windows-11', 'windows-10'],
        'mcafee-antivirus'       => ['mcafee'],
        'microsoft-apps'         => ['microsoft-project', 'microsoft-visio'],
    ];
    return $map[$slug] ?? [$slug];
}

function category_title(string $slug): string
{
    $stmt = db()->prepare('SELECT name FROM categories WHERE slug = ?');
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    if ($row) return $row['name'];
    return ucwords(str_replace('-', ' ', $slug));
}

function get_products(array $categories = [], string $platform = '', string $sort = ''): array
{
    $sql = 'SELECT * FROM products';
    $where = [];
    $params = [];
    if ($categories) {
        $where[] = 'category IN (' . implode(',', array_fill(0, count($categories), '?')) . ')';
        $params = array_merge($params, $categories);
    }
    if ($platform === 'Windows' || $platform === 'Mac') {
        $where[] = 'platform = ?';
        $params[] = $platform;
    }
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $orders = [
        'price_asc'  => 'price ASC',
        'price_desc' => 'price DESC',
        'rating'     => 'rating DESC, reviews DESC',
        'reviews'    => 'reviews DESC',
        'newest'     => 'is_new DESC, id ASC',
    ];
    $sql .= ' ORDER BY ' . ($orders[$sort] ?? 'id ASC');
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function slugify(string $s): string
{
    $s = strtolower($s);
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim($s, '-');
}

/* ---------------- App icons ---------------- */
function app_icons(): array
{
    return [
        'word'       => 'https://gosoftwarebuy.com/assets/Microsoft_Office_Word_1765865381845-Cby-XFtN.png',
        'excel'      => 'https://gosoftwarebuy.com/assets/excel_1765865381846-Ch1DG1gu.jpeg',
        'powerpoint' => 'https://gosoftwarebuy.com/assets/Microsoft_Office_PowerPoint_1765865381846-CB2GUPqO.png',
        'outlook'    => 'https://gosoftwarebuy.com/assets/Microsoft_Outlook_Icon_1765865381846-DMb4j-mZ.png',
        'access'     => 'https://gosoftwarebuy.com/assets/Microsoft_Office_Access_1765865381846-C4OFiOlK.png',
    ];
}

/* ---------------- Mega menu data ---------------- */
// Each column: heading => ['all' => [categorySlug, label], 'groups' => [yearLabel => categorySlug]]
function nav_microsoft(): array
{
    return [
        'OFFICE FOR PC' => [
            'all' => ['office-pc', 'All Office for PC'],
            'groups' => ['Office 2024' => 'office-2024-pc', 'Office 2021' => 'office-2021-pc', 'Office 2019' => 'office-2019-pc'],
        ],
        'OFFICE FOR MAC' => [
            'all' => ['office-mac', 'All Office for Mac'],
            'groups' => ['Office 2024 for Mac' => 'office-2024-mac', 'Office 2021 for Mac' => 'office-2021-mac', 'Office 2019 for Mac' => 'office-2019-mac'],
        ],
        'WINDOWS' => [
            'all' => ['windows', 'All Windows'],
            'groups' => ['Windows 11' => 'windows-11', 'Windows 10' => 'windows-10'],
        ],
        'APPS' => [
            'all' => ['apps', 'All Microsoft Apps'],
            'groups' => ['Microsoft Project' => 'microsoft-project', 'Microsoft Visio' => 'microsoft-visio'],
        ],
    ];
}

// Brand logo — gradient rounded square with "M" monogram + code-cursor accent
function render_logo(int $size = 40): string
{
    $id = 'lgrad' . $size;
    return '<svg class="brand-mark" width="' . $size . '" height="' . $size . '" viewBox="0 0 48 48" fill="none" aria-hidden="true">'
        . '<defs><linearGradient id="' . $id . '" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">'
        . '<stop stop-color="#38bdf8"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>'
        . '<rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#' . $id . ')"/>'
        . '<path d="M14 8c6-3.5 14-3.5 20 0" stroke="rgba(255,255,255,.30)" stroke-width="2" stroke-linecap="round" fill="none"/>'
        . '<path d="M14 34V14l10 12 10-12v20" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
        . '<circle cx="38" cy="37" r="2.7" fill="#d6f1fe"/>'
        . '</svg>';
}

// Stores a contact/support form submission
function save_support_message(array $d): void
{
    $stmt = db()->prepare('INSERT INTO support_messages (name, email, phone, order_number, subject, message, source) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$d['name'], $d['email'], $d['phone'] ?? '', $d['order_number'] ?? '', $d['subject'], $d['message'], $d['source'] ?? 'contact']);
}

// Volume-pricing / support promo band (nav dropdowns + Disclaimer page)
function render_menu_promo(bool $compact = false): string
{
    $volume = '<div class="d-flex align-items-center gap-2 mb-1"><i class="bi bi-boxes text-primary fs-5"></i><span class="fw-bold">Volume Pricing</span></div>'
            . '<small class="text-secondary d-block mb-2">Exclusive discounts on bulk licenses for teams and businesses.</small>'
            . '<a href="contact.php" class="btn btn-sm btn-primary rounded-pill px-3" data-testid="menu-request-quote">Request a Quote</a>';
    $question = '<div class="fw-bold small">Have a Question?</div>'
              . '<small class="text-secondary d-block">Call Mon–Fri 9 AM–6 PM EST</small>'
              . '<a href="tel:' . SITE_PHONE . '" class="fw-bold text-decoration-none">' . SITE_PHONE . '</a> '
              . '<small class="text-secondary">or</small> '
              . '<a href="#" onclick="toggleChat();return false;" class="fw-bold text-decoration-none text-primary">chat with a sales expert</a>';
    if ($compact) {
        return '<div class="mega-promo mt-3 pt-3" data-testid="menu-promo">' . $volume . '<div class="mt-3">' . $question . '</div></div>';
    }
    return '<div class="mega-promo mt-4 pt-3 row g-3 align-items-center" data-testid="menu-promo">'
         . '<div class="col-lg-7">' . $volume . '</div>'
         . '<div class="col-lg-5 text-lg-end">' . $question . '</div></div>';
}

/* ---------------- SEO helpers ---------------- */
// Rich descriptive alt text for product images (Google Images / Merchant Center friendly)
function product_img_alt(array $p): string
{
    $pct = (!empty($p['original_price']) && $p['original_price'] > $p['price'])
        ? round((1 - $p['price'] / $p['original_price']) * 100) : 0;
    $alt = $p['name'] . ' — genuine lifetime license key for ' . ($p['platform'] ?: 'Windows') . ', instant digital delivery';
    if ($pct > 0) $alt .= ', ' . $pct . '% off';
    return $alt . ' | ' . SITE_BRAND;
}

// Exact + phrase + broad keyword variations generated per product (meta keywords)
function product_keywords(array $p): string
{
    $name = $p['name'];
    $platform = $p['platform'] ?: 'Windows';
    $base = trim(preg_replace('/\s*\(.*?\)\s*/', ' ', $name));
    $kw = [
        $name,                              // exact
        'buy ' . $name,                     // phrase
        $name . ' product key',
        $name . ' lifetime license',
        $name . ' license key',
        $name . ' instant delivery',
        $name . ' no subscription',
        $name . ' digital download',
        $base . ' for ' . $platform,        // broad
        'affordable ' . $base,
        'genuine ' . $base . ' key',
        'discount ' . $base,
        'microsoft software license key store',
    ];
    return implode(', ', array_unique($kw));
}

function site_url(): string
{
    if (defined('SITE_URL') && SITE_URL !== '') return rtrim(SITE_URL, '/');
    $proto = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    // Behind the Kubernetes ingress the original scheme arrives via X-Forwarded-Proto
    if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])) $proto = $_SERVER['HTTP_X_FORWARDED_PROTO'];
    return $proto . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}

/* ---------------- Coupons: code => percent off ---------------- */
function coupons(): array
{
    return ['MATRIX20' => 20, 'ZED20' => 20, 'FIVE20' => 20, 'UCODE90' => 20, 'WELCOME10' => 10, 'SAVE15' => 15, 'OFFICE25' => 25];
}

/* ---------------- Rendering helpers ---------------- */
// Payment method icon images (footer + checkout)
function render_payment_icons(string $class = 'pay-icon'): string
{
    $pays = ['visa' => 'Visa', 'mastercard' => 'Mastercard', 'amex' => 'American Express', 'discover' => 'Discover', 'paypal' => 'PayPal'];
    $h = '';
    foreach ($pays as $f => $alt) {
        $h .= '<img src="assets/images/payments/' . $f . '.svg" alt="' . $alt . '" title="' . $alt . '" class="' . $class . '" loading="lazy">';
    }
    return $h;
}

function render_stars(float $rating): string
{
    $h = '<span class="text-warning">';
    for ($i = 1; $i <= 5; $i++) {
        $h .= $i <= round($rating) ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
    }
    return $h . '</span>';
}

// Wide horizontal product banner row — shared by shop list view and category pages
function render_product_row(array $p): string
{
    $pct = ($p['original_price'] && $p['original_price'] > $p['price'])
        ? round((1 - $p['price'] / $p['original_price']) * 100) : 0;
    $orig = $pct ? '<small class="text-secondary text-decoration-line-through d-block">' . format_price((float)$p['original_price']) . '</small>' : '';
    $save = $pct ? '<span class="badge text-bg-danger">Save ' . $pct . '%</span>' : '';
    $badge = $p['badge'] ? '<span class="badge text-bg-primary">' . esc($p['badge']) . '</span>' : '';
    $osIcon = $p['platform'] === 'Mac' ? 'macos' : 'windows';
    return '
    <div class="card product-card shop-row p-3 p-sm-4" data-testid="product-row-' . esc($p['slug']) . '">
      <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-3 gap-sm-4">
        <a href="product.php?slug=' . esc($p['slug']) . '" class="flex-shrink-0 mx-auto mx-sm-0">
          <div class="shop-row-img rounded-4">
            <img src="' . esc($p['image']) . '" alt="' . esc(product_img_alt($p)) . '" title="' . esc($p['name']) . '" loading="lazy">
          </div>
        </a>
        <div class="flex-grow-1 min-w-0">
          <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
            ' . $badge . '
            <span class="badge os-badge"><img src="assets/images/os/' . $osIcon . '.svg" alt="" class="os-icon me-1">' . esc($p['platform'] ?: 'Windows') . '</span>
            ' . $save . '
          </div>
          <a href="product.php?slug=' . esc($p['slug']) . '" class="text-decoration-none text-body fw-bold fs-6 d-block">' . esc($p['name']) . '</a>
          <div class="small my-1">' . render_stars((float)$p['rating']) . ' <span class="text-secondary">(' . (int)$p['reviews'] . ' reviews)</span></div>
          <div class="d-flex flex-wrap gap-3 small text-secondary">
            <span><i class="bi bi-lightning-charge-fill text-warning me-1"></i>Instant email delivery</span>
            <span><i class="bi bi-infinity text-primary me-1"></i>Lifetime license</span>
            <span class="d-none d-md-inline"><i class="bi bi-headset text-primary me-1"></i>Free install support</span>
          </div>
        </div>
        <div class="shop-row-buy text-sm-end flex-shrink-0">
          ' . $orig . '
          <div class="fw-bold text-primary fs-4 lh-1 mb-2">' . format_price((float)$p['price']) . '</div>
          <div class="d-flex flex-sm-column gap-2">
            <button class="btn btn-sm btn-primary rounded-pill px-3 add-to-cart-btn" data-slug="' . esc($p['slug']) . '" data-testid="add-to-cart-' . esc($p['slug']) . '"><i class="bi bi-cart-plus me-1"></i>Add to Cart</button>
            <a href="product.php?slug=' . esc($p['slug']) . '" class="btn btn-sm btn-outline-secondary rounded-pill px-3" data-testid="view-details-' . esc($p['slug']) . '">Details</a>
          </div>
        </div>
      </div>
    </div>';
}

function render_product_card(array $p): string
{
    $discount = '';
    if ($p['original_price'] && $p['original_price'] > $p['price']) {
        $pct = round((1 - $p['price'] / $p['original_price']) * 100);
        $discount = '<span class="badge text-bg-danger position-absolute top-0 end-0 m-2">-' . $pct . '%</span>';
    }
    $badge = $p['badge'] ? '<span class="badge text-bg-primary position-absolute top-0 start-0 m-2">' . esc($p['badge']) . '</span>' : '';
    $orig = ($p['original_price'] && $p['original_price'] > $p['price'])
        ? '<small class="text-secondary text-decoration-line-through ms-2">' . format_price((float)$p['original_price']) . '</small>' : '';
    return '
    <div class="card product-card h-100 position-relative" data-testid="product-card-' . esc($p['slug']) . '">
      ' . $badge . $discount . '
      <a href="product.php?slug=' . esc($p['slug']) . '" class="text-decoration-none">
        <div class="ratio ratio-1x1 bg-body-tertiary rounded-top product-img-wrap">
          <img src="' . esc($p['image']) . '" alt="' . esc(product_img_alt($p)) . '" title="' . esc($p['name']) . '" class="object-fit-contain p-3" loading="lazy">
        </div>
      </a>
      <div class="card-body text-center d-flex flex-column">
        <div class="mb-1 small">' . render_stars((float)$p['rating']) . ' <span class="text-secondary">(' . (int)$p['reviews'] . ')</span></div>
        <a href="product.php?slug=' . esc($p['slug']) . '" class="text-decoration-none text-body fw-semibold product-title mb-1 mx-auto">' . esc($p['name']) . '</a>
        <div class="mb-3"><span class="fw-bold text-primary">' . format_price((float)$p['price']) . '</span>' . $orig . '</div>
        <button class="btn btn-sm btn-elessi add-to-cart-btn mt-auto w-100" data-slug="' . esc($p['slug']) . '" data-testid="add-to-cart-' . esc($p['slug']) . '"><i class="bi bi-cart-plus me-1"></i>Add to Cart</button>
      </div>
    </div>';
}

function generate_order_number(): string
{
    return 'MX' . date('ymd') . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
}

// Elegant page-header band with breadcrumb (shop / category / blog / cart)
// $crumbs: [label => href|null]; null = active crumb
function render_page_head(string $title, string $subtitle = '', array $crumbs = [], string $testId = 'page-head-title'): string
{
    $h = '<div class="page-head"><div class="container py-4 py-lg-5">';
    $h .= '<nav aria-label="breadcrumb"><ol class="breadcrumb small mb-2">';
    $h .= '<li class="breadcrumb-item"><a href="index.php">Home</a></li>';
    foreach ($crumbs as $label => $href) {
        $h .= $href
            ? '<li class="breadcrumb-item"><a href="' . esc($href) . '">' . esc($label) . '</a></li>'
            : '<li class="breadcrumb-item active">' . esc($label) . '</li>';
    }
    $h .= '</ol></nav>';
    $h .= '<h1 class="fw-bold h2 mb-1" data-testid="' . esc($testId) . '">' . esc($title) . '</h1>';
    if ($subtitle) $h .= '<p class="text-secondary mb-0">' . esc($subtitle) . '</p>';
    return $h . '</div></div>';
}

/* ---------- product variants (Version / Edition / OS selectors) ---------- */

function parse_variant(array $p): array
{
    $n = preg_replace('/\s+/', ' ', strtolower(str_replace('&', 'and', $p['name'])));
    preg_match('/\b(20\d{2})\b/', $n, $m);
    $year = $m[1] ?? null;
    $v = array_merge($p, [
        'os' => ($p['platform'] === 'Mac' || str_contains($n, 'mac')) ? 'Mac' : 'PC',
        'year' => $year, 'base' => null, 'version' => null, 'edition' => null,
    ]);
    if (str_contains($n, 'project')) { $v['base'] = 'project'; $v['version'] = $year; return $v; }
    if (str_contains($n, 'visio'))   { $v['base'] = 'visio';   $v['version'] = $year; return $v; }
    if (str_starts_with($n, 'windows')) {
        $ver = str_contains($n, '11') ? '11' : (str_contains($n, '10') ? '10' : null);
        if (!$ver) return $v;
        $v['base'] = 'windows'; $v['version'] = $ver;
        $v['edition'] = str_contains($n, 'pro') ? 'Pro' : 'Home';
        return $v;
    }
    if (str_contains($n, 'word') && $year)  { $v['base'] = 'word';  $v['version'] = $year; return $v; }
    if (str_contains($n, 'excel') && $year) { $v['base'] = 'excel'; $v['version'] = $year; return $v; }
    if (str_contains($n, 'office') && $year) {
        $v['base'] = 'office'; $v['version'] = $year;
        foreach (['professional plus' => 'Professional Plus', 'home and business' => 'Home and Business',
                  'home and student' => 'Home and Student', 'home' => 'Home'] as $needle => $label) {
            if (str_contains($n, $needle)) { $v['edition'] = $label; break; }
        }
        return $v;
    }
    return $v;
}

function get_variant_group(array $product): array
{
    $cur = parse_variant($product);
    if (!$cur['base']) return ['cur' => $cur, 'versions' => [], 'editions' => [], 'os_options' => [], 'group' => []];

    $seen = []; $group = [];
    foreach (get_products() as $p) {
        $k = preg_replace('/\s+/', ' ', strtolower(str_replace('&', 'and', $p['name'])));
        if (isset($seen[$k])) continue;
        $seen[$k] = true;
        $pv = parse_variant($p);
        if ($pv['base'] === $cur['base']) $group[] = $pv;
    }

    $versions = array_values(array_unique(array_filter(array_column($group, 'version'))));
    rsort($versions);
    $order = ['Home and Business', 'Professional Plus', 'Home and Student', 'Home', 'Pro'];
    $editions = array_values(array_unique(array_filter(array_column($group, 'edition'))));
    usort($editions, fn($a, $b) => array_search($a, $order) <=> array_search($b, $order));
    // Always show both OS options for software that exists on PC/Mac families
    // (unavailable one is rendered blurred). Windows OS itself is PC-only.
    if ($cur['base'] !== 'windows') {
        $os = ['PC', 'Mac'];
    } else {
        $os = [];
    }
    if (count($editions) < 2) $editions = [];
    return ['cur' => $cur, 'versions' => $versions, 'editions' => $editions, 'os_options' => $os, 'group' => $group];
}

// null = wildcard for any of version / os / edition
function find_variant(array $group, ?string $version, ?string $os = null, ?string $edition = null): ?array
{
    foreach ($group as $p) {
        if (($version === null || $p['version'] === $version)
            && ($os === null || $p['os'] === $os)
            && ($edition === null || $p['edition'] === $edition)) return $p;
    }
    return null;
}

function render_variant_row(string $title, string $testPrefix, array $options, ?string $currentValue, callable $resolve, ?callable $label = null): string
{
    if (!$options) return '';
    $label = $label ?? fn($o) => $o;
    $osIcon = fn($o) => $testPrefix === 'os'
        ? '<img src="assets/images/os/' . ($o === 'Mac' ? 'macos' : 'windows') . '.svg" alt="" class="os-icon me-1">'
        : '';
    $html = '<div class="mb-3" data-testid="' . $testPrefix . '-selector"><small class="text-secondary d-block mb-1">' . esc($title)
          . ': <span class="fw-semibold">' . esc($label($currentValue)) . '</span></small><div class="d-flex flex-wrap gap-2">';
    foreach ($options as $opt) {
        $active = $opt === $currentValue;
        $target = $active ? null : $resolve($opt);
        $tid = ' data-testid="' . $testPrefix . '-option-' . slugify((string)$opt) . '"';
        if ($active) {
            $html .= '<span class="btn btn-sm btn-primary"' . $tid . '>' . $osIcon($opt) . esc($label($opt)) . '</span>';
        } elseif ($target) {
            $html .= '<a href="product.php?slug=' . esc($target['slug']) . '" class="btn btn-sm btn-outline-secondary"' . $tid . '>' . $osIcon($opt) . esc($label($opt)) . '</a>';
        } else {
            $html .= '<span class="btn btn-sm btn-outline-secondary variant-blur" title="Not available for this configuration"' . $tid . '>' . $osIcon($opt) . esc($label($opt)) . '</span>';
        }
    }
    return $html . '</div></div>';
}

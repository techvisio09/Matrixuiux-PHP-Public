<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Shop All Products | ' . SITE_BRAND;
$pageDescription = 'Browse our full catalog of genuine Microsoft Office, Windows, Project, Visio, Server and antivirus licenses. Filter by year, platform and price — instant digital delivery on every order.';

$selCats = array_values((array)($_GET['cat'] ?? []));
$selVers = array_values((array)($_GET['ver'] ?? []));
$selOs = array_values((array)($_GET['os'] ?? []));
$sort = $_GET['sort'] ?? '';
$view = ($_GET['view'] ?? 'grid') === 'list' ? 'list' : 'grid';

$all = get_products([], '', $sort);

function product_family(array $p): string
{
    $c = $p['category'];
    if (str_starts_with($c, 'office')) return 'office';
    if (str_starts_with($c, 'windows')) return 'windows';
    if (str_starts_with($c, 'microsoft-')) return 'apps';
    return 'antivirus';
}

function product_version(array $p): ?string
{
    if (str_starts_with($p['category'], 'windows-')) return 'Windows ' . substr($p['category'], 8);
    return preg_match('/\b(20\d{2})\b/', $p['name'], $m) ? $m[1] : null;
}

$famLabels = ['office' => 'Microsoft Office', 'windows' => 'Windows OS', 'apps' => 'Project & Visio', 'antivirus' => 'Antivirus & Security'];
$verOptions = ['2024', '2021', '2019', 'Windows 11', 'Windows 10'];
$osOptions = ['Windows', 'Mac'];

// Option counts (across full catalog)
$counts = ['cat' => [], 'ver' => [], 'os' => []];
foreach ($all as $p) {
    $counts['cat'][product_family($p)] = ($counts['cat'][product_family($p)] ?? 0) + 1;
    if ($v = product_version($p)) $counts['ver'][$v] = ($counts['ver'][$v] ?? 0) + 1;
    $counts['os'][$p['platform']] = ($counts['os'][$p['platform']] ?? 0) + 1;
}

// Apply all filter groups simultaneously (AND across groups, OR within a group)
$products = array_values(array_filter($all, function ($p) use ($selCats, $selVers, $selOs) {
    if ($selCats && !in_array(product_family($p), $selCats)) return false;
    if ($selVers && !in_array(product_version($p), $selVers)) return false;
    if ($selOs && !in_array($p['platform'], $selOs)) return false;
    return true;
}));

$activeCount = count($selCats) + count($selVers) + count($selOs);

include __DIR__ . '/includes/header.php';
?>
<?= render_page_head('All Products', count($all) . ' genuine products — instant digital delivery on every order', ['Shop' => null]) ?>
<div class="container py-4 py-lg-5">
  <form method="get" id="shopForm">
    <input type="hidden" name="view" value="<?= esc($view) ?>" id="viewInput">
    <div class="row g-4">

      <!-- Vertical filter sidebar -->
      <div class="col-lg-3">
        <button class="btn btn-outline-primary rounded-pill w-100 d-lg-none mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#shopFilters" data-testid="filters-toggle">
          <i class="bi bi-funnel-fill me-1"></i>Filters <?= $activeCount ? '<span class="badge text-bg-primary ms-1">' . $activeCount . '</span>' : '' ?>
        </button>
        <div class="collapse d-lg-block" id="shopFilters">
          <div class="card filter-card p-4" data-testid="filter-sidebar">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="fw-bold"><i class="bi bi-funnel-fill text-primary me-2"></i>Filters</span>
              <?php if ($activeCount): ?><a href="shop.php" class="small fw-semibold text-decoration-none" data-testid="filters-clear">Clear all (<?= $activeCount ?>)</a><?php endif; ?>
            </div>

            <div class="filter-group-title">Category</div>
            <?php foreach ($famLabels as $key => $label): ?>
              <div class="form-check filter-check">
                <input class="form-check-input" type="checkbox" name="cat[]" value="<?= $key ?>" id="cat-<?= $key ?>"
                       <?= in_array($key, $selCats) ? 'checked' : '' ?> onchange="this.form.submit()" data-testid="filter-cat-<?= $key ?>">
                <label class="form-check-label d-flex justify-content-between" for="cat-<?= $key ?>">
                  <span><?= $label ?></span><span class="filter-count"><?= $counts['cat'][$key] ?? 0 ?></span>
                </label>
              </div>
            <?php endforeach; ?>

            <div class="filter-group-title mt-3">Version / Year</div>
            <?php foreach ($verOptions as $v): $vid = strtolower(str_replace(' ', '-', $v)); ?>
              <div class="form-check filter-check">
                <input class="form-check-input" type="checkbox" name="ver[]" value="<?= esc($v) ?>" id="ver-<?= $vid ?>"
                       <?= in_array($v, $selVers) ? 'checked' : '' ?> onchange="this.form.submit()" data-testid="filter-ver-<?= $vid ?>">
                <label class="form-check-label d-flex justify-content-between" for="ver-<?= $vid ?>">
                  <span><?= esc($v) ?></span><span class="filter-count"><?= $counts['ver'][$v] ?? 0 ?></span>
                </label>
              </div>
            <?php endforeach; ?>

            <div class="filter-group-title mt-3">Operating System</div>
            <?php foreach ($osOptions as $os): $oid = strtolower($os); ?>
              <div class="form-check filter-check">
                <input class="form-check-input" type="checkbox" name="os[]" value="<?= $os ?>" id="os-<?= $oid ?>"
                       <?= in_array($os, $selOs) ? 'checked' : '' ?> onchange="this.form.submit()" data-testid="filter-os-<?= $oid ?>">
                <label class="form-check-label d-flex justify-content-between" for="os-<?= $oid ?>">
                  <span><img src="assets/images/os/<?= $os === 'Mac' ? 'macos' : 'windows' ?>.svg" alt="<?= $os ?>" class="os-icon me-1"><?= $os ?></span>
                  <span class="filter-count"><?= $counts['os'][$os] ?? 0 ?></span>
                </label>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="col-lg-9">
        <div class="shop-toolbar d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4 p-2 px-3" data-testid="shop-toolbar">
          <span class="text-secondary small" data-testid="shop-result-count"><strong class="text-body"><?= count($products) ?></strong> product<?= count($products) === 1 ? '' : 's' ?> found</span>
          <div class="d-flex align-items-center gap-2">
            <span class="sort-label d-none d-sm-inline-flex align-items-center"><i class="bi bi-sliders me-1"></i>Sort</span>
            <select name="sort" class="form-select form-select-sm sort-select" style="width:auto" onchange="this.form.submit()" data-testid="sort-select">
              <option value="">Sort: Default</option>
              <option value="newest" <?= $sort === 'newest' ? 'selected' : '' ?>>Newest</option>
              <option value="price_asc" <?= $sort === 'price_asc' ? 'selected' : '' ?>>Price: Low to High</option>
              <option value="price_desc" <?= $sort === 'price_desc' ? 'selected' : '' ?>>Price: High to Low</option>
              <option value="rating" <?= $sort === 'rating' ? 'selected' : '' ?>>Top Rated</option>
              <option value="reviews" <?= $sort === 'reviews' ? 'selected' : '' ?>>Most Reviewed</option>
            </select>
            <div class="btn-group view-toggle" role="group">
              <button type="button" class="btn btn-sm <?= $view === 'grid' ? 'btn-primary' : 'btn-outline-secondary' ?>" onclick="setView('grid')" title="Grid view" data-testid="view-grid-btn"><i class="bi bi-grid-3x3-gap-fill"></i></button>
              <button type="button" class="btn btn-sm <?= $view === 'list' ? 'btn-primary' : 'btn-outline-secondary' ?>" onclick="setView('list')" title="List view" data-testid="view-list-btn"><i class="bi bi-list-ul"></i></button>
            </div>
          </div>
        </div>

        <?php if (!$products): ?>
          <div class="card p-5 text-center" data-testid="shop-no-results">
            <i class="bi bi-search fs-1 text-secondary"></i>
            <p class="text-secondary mt-2 mb-3">No products match your filters.</p>
            <a href="shop.php" class="btn btn-primary rounded-pill mx-auto px-4">Clear Filters</a>
          </div>
        <?php elseif ($view === 'list'): ?>
          <div class="d-grid gap-3" data-testid="shop-list">
            <?php foreach ($products as $p): ?><?= render_product_row($p) ?><?php endforeach; ?>
          </div>
        <?php else: ?>
          <div class="row g-4" data-testid="shop-grid">
            <?php foreach ($products as $p): ?>
              <div class="col-xl-4 col-lg-4 col-sm-6"><?= render_product_card($p) ?></div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </form>
</div>
<script>
function setView(v) {
  document.getElementById('viewInput').value = v;
  document.getElementById('shopForm').submit();
}
</script>
<?php include __DIR__ . '/includes/footer.php'; ?>

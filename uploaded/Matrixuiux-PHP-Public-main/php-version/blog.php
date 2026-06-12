<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Blog | ' . SITE_BRAND;
$pageDescription = 'Guides, tips and comparisons for Microsoft Office, Windows and security software — installation help, feature breakdowns and buying advice from the ' . SITE_BRAND . ' team.';

$perPage = 10;
$page = max(1, (int)($_GET['p'] ?? 1));
$q = trim($_GET['q'] ?? '');

if ($q !== '') {
    $stmt = db()->prepare('SELECT COUNT(*) c FROM blog_posts WHERE title LIKE ?');
    $stmt->execute(['%' . $q . '%']);
    $total = (int)$stmt->fetch()['c'];
} else {
    $total = (int)db()->query('SELECT COUNT(*) c FROM blog_posts')->fetch()['c'];
}
$pages = max(1, (int)ceil($total / $perPage));
$page = min($page, $pages);
$offset = ($page - 1) * $perPage;

if ($q !== '') {
    $stmt = db()->prepare("SELECT * FROM blog_posts WHERE title LIKE ? ORDER BY STR_TO_DATE(date, '%b %e, %Y') DESC, id ASC LIMIT $perPage OFFSET $offset");
    $stmt->execute(['%' . $q . '%']);
    $posts = $stmt->fetchAll();
} else {
    $posts = db()->query("SELECT * FROM blog_posts ORDER BY STR_TO_DATE(date, '%b %e, %Y') DESC, id ASC LIMIT $perPage OFFSET $offset")->fetchAll();
}

function blog_page_url(int $p, string $q): string
{
    return 'blog.php?p=' . $p . ($q !== '' ? '&q=' . urlencode($q) : '');
}

include __DIR__ . '/includes/header.php';
?>
<?= render_page_head(SITE_BRAND . ' Blog', 'Expert tips, guides, and insights to help you get the most out of your software.', ['Blog' => null]) ?>
<div class="container py-4 py-lg-5">

  <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
    <form method="get" class="d-flex gap-2" style="max-width:380px; width:100%;">
      <div class="input-group">
        <span class="input-group-text bg-body border-end-0"><i class="bi bi-search text-secondary"></i></span>
        <input name="q" value="<?= esc($q) ?>" class="form-control border-start-0" placeholder="Search articles..." data-testid="blog-search">
      </div>
      <button class="btn btn-primary rounded-pill px-3 flex-shrink-0" data-testid="blog-search-btn">Search</button>
    </form>
    <small class="text-secondary"><i class="bi bi-sort-down me-1"></i>Newest first · <strong class="text-body"><?= $total ?></strong> articles</small>
  </div>

  <?php if (!$posts): ?>
    <div class="card p-5 text-center" data-testid="blog-no-results">
      <i class="bi bi-search fs-1 text-secondary"></i>
      <p class="text-secondary mt-2 mb-3">No articles match "<?= esc($q) ?>".</p>
      <a href="blog.php" class="btn btn-primary rounded-pill mx-auto px-4">View All Articles</a>
    </div>
  <?php else: ?>
    <div class="row g-4" data-testid="blog-grid">
      <?php foreach ($posts as $b): ?>
        <div class="col-lg-4 col-md-6">
          <a href="blog-post.php?id=<?= esc($b['id']) ?>" class="card h-100 text-decoration-none" data-testid="blog-card-<?= (int)$b['id'] ?>">
            <img src="<?= esc($b['image']) ?>" class="card-img-top object-fit-cover" style="height:190px;" alt="<?= esc($b['title']) ?>" loading="lazy">
            <div class="card-body">
              <small class="text-secondary"><i class="bi bi-calendar3 me-1"></i><?= esc($b['date']) ?> · <?= esc($b['read_time']) ?></small>
              <h5 class="fw-bold mt-2 text-body h6"><?= esc($b['title']) ?></h5>
              <span class="text-primary small fw-semibold">Read more <i class="bi bi-arrow-right"></i></span>
            </div>
          </a>
        </div>
      <?php endforeach; ?>
    </div>

    <!-- Pagination -->
    <nav class="d-flex justify-content-center align-items-center gap-2 mt-5" data-testid="blog-pagination">
      <a class="btn btn-sm btn-outline-secondary rounded-pill px-3 <?= $page <= 1 ? 'disabled' : '' ?>" href="<?= blog_page_url($page - 1, $q) ?>">Previous</a>
      <?php for ($i = 1; $i <= $pages; $i++): ?>
        <a class="btn btn-sm <?= $i === $page ? 'btn-primary' : 'btn-outline-secondary' ?> rounded-circle" style="width:34px;height:34px;" href="<?= blog_page_url($i, $q) ?>" data-testid="blog-page-<?= $i ?>"><?= $i ?></a>
      <?php endfor; ?>
      <a class="btn btn-sm btn-outline-secondary rounded-pill px-3 <?= $page >= $pages ? 'disabled' : '' ?>" href="<?= blog_page_url($page + 1, $q) ?>">Next</a>
    </nav>
    <p class="text-center small text-secondary mt-2">Page <?= $page ?> of <?= $pages ?> (<?= $total ?> posts)</p>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

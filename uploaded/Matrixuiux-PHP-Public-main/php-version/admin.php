<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/email.php';
ensure_admin();
$admin = require_admin();
$pageTitle = 'Admin Panel | ' . SITE_BRAND;
$tab = $_GET['tab'] ?? 'dashboard';
$flash = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $pdo = db();
    if ($action === 'update_product') {
        $stmt = $pdo->prepare('UPDATE products SET price = ?, original_price = ?, badge = ? WHERE slug = ?');
        $stmt->execute([
            (float)$_POST['price'],
            $_POST['original_price'] !== '' ? (float)$_POST['original_price'] : null,
            trim($_POST['badge']) !== '' ? trim($_POST['badge']) : null,
            $_POST['slug'],
        ]);
        $flash = 'Product updated.';
        $tab = 'products';
    } elseif ($action === 'update_order') {
        $allowed = ['pending', 'paid', 'delivered', 'refunded', 'cancelled'];
        if (in_array($_POST['status'], $allowed, true)) {
            $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$_POST['status'], (int)$_POST['order_id']]);
            if ($_POST['status'] === 'paid') fulfill_order((int)$_POST['order_id']);
            $flash = 'Order updated.';
        }
        $tab = 'orders';
    } elseif ($action === 'resend_email') {
        $oid = (int)$_POST['order_id'];
        $pdo->prepare('UPDATE orders SET fulfilled = 0 WHERE id = ?')->execute([$oid]);
        fulfill_order($oid);
        $flash = 'Email re-generated (see Emails tab).';
        $tab = 'orders';
    } elseif ($action === 'add_keys') {
        $keys = array_filter(array_map('trim', explode("\n", $_POST['keys'] ?? '')));
        $stmt = $pdo->prepare('INSERT INTO license_keys (product_slug, license_key) VALUES (?, ?)');
        foreach ($keys as $k) $stmt->execute([$_POST['product_slug'], $k]);
        $flash = count($keys) . ' key(s) added.';
        $tab = 'keys';
    } elseif ($action === 'delete_key') {
        $pdo->prepare('DELETE FROM license_keys WHERE id = ? AND status = "available"')->execute([(int)$_POST['key_id']]);
        $flash = 'Key deleted.';
        $tab = 'keys';
    }
}

$pdo = db();
$stats = [
    'Products' => $pdo->query('SELECT COUNT(*) FROM products')->fetchColumn(),
    'Orders' => $pdo->query('SELECT COUNT(*) FROM orders')->fetchColumn(),
    'Paid' => $pdo->query('SELECT COUNT(*) FROM orders WHERE status = "paid"')->fetchColumn(),
    'Leads' => $pdo->query('SELECT COUNT(*) FROM chat_leads')->fetchColumn(),
    'Keys Avail.' => $pdo->query('SELECT COUNT(*) FROM license_keys WHERE status = "available"')->fetchColumn(),
    'Emails Queued' => $pdo->query('SELECT COUNT(*) FROM email_outbox WHERE status = "queued"')->fetchColumn(),
];
$tabs = ['dashboard' => 'Dashboard', 'products' => 'Products', 'orders' => 'Orders', 'leads' => 'Leads', 'keys' => 'Key Inventory', 'emails' => 'Emails'];

// Sales dashboard aggregates (revenue counts paid + delivered orders)
$dash = null;
if ($tab === 'dashboard') {
    $rev = $pdo->query("SELECT COALESCE(SUM(total),0) AS revenue, COUNT(*) AS cnt FROM orders WHERE status IN ('paid','delivered')")->fetch();
    $rev7 = $pdo->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status IN ('paid','delivered') AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetchColumn();
    $byDayRows = $pdo->query("SELECT DATE(created_at) AS d, SUM(total) AS revenue, COUNT(*) AS orders FROM orders WHERE status IN ('paid','delivered') AND created_at >= DATE_SUB(CURDATE(), INTERVAL 29 DAY) GROUP BY DATE(created_at)")->fetchAll();
    $dayMap = [];
    foreach ($byDayRows as $r) $dayMap[$r['d']] = $r;
    $days = [];
    for ($i = 29; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-$i days"));
        $days[] = ['date' => $d, 'revenue' => (float)($dayMap[$d]['revenue'] ?? 0), 'orders' => (int)($dayMap[$d]['orders'] ?? 0)];
    }
    $best = $pdo->query("SELECT oi.product_slug, oi.name, p.image, SUM(oi.qty) AS units, SUM(oi.price * oi.qty) AS revenue
        FROM order_items oi JOIN orders o ON o.id = oi.order_id LEFT JOIN products p ON p.slug = oi.product_slug
        WHERE o.status IN ('paid','delivered') GROUP BY oi.product_slug, oi.name, p.image ORDER BY units DESC LIMIT 8")->fetchAll();
    $dash = [
        'revenue' => (float)$rev['revenue'],
        'paid' => (int)$rev['cnt'],
        'avg' => $rev['cnt'] ? (float)$rev['revenue'] / (int)$rev['cnt'] : 0,
        'rev7' => (float)$rev7,
        'days' => $days,
        'best' => $best,
        'max_day' => max(array_column($days, 'revenue') ?: [0]),
    ];
}

include __DIR__ . '/includes/header.php';
?>
<div class="container py-4" data-testid="admin-page">
  <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
    <h1 class="h4 fw-bold mb-0"><i class="bi bi-speedometer2 text-primary me-2"></i>Admin Panel</h1>
    <small class="text-secondary"><?= esc($admin['email']) ?></small>
  </div>

  <?php if ($flash): ?><div class="alert alert-success py-2 small" data-testid="admin-flash"><?= esc($flash) ?></div><?php endif; ?>

  <div class="row g-2 mb-4">
    <?php foreach ($stats as $label => $value): ?>
      <div class="col-6 col-md-2"><div class="card p-3 text-center"><div class="fs-4 fw-bold"><?= (int)$value ?></div><small class="text-secondary"><?= esc($label) ?></small></div></div>
    <?php endforeach; ?>
  </div>

  <ul class="nav nav-pills mb-4 flex-wrap gap-1">
    <?php foreach ($tabs as $id => $label): ?>
      <li class="nav-item"><a class="nav-link <?= $tab === $id ? 'active' : '' ?>" href="admin.php?tab=<?= $id ?>" data-testid="admin-tab-<?= $id ?>"><?= esc($label) ?></a></li>
    <?php endforeach; ?>
  </ul>

  <?php if ($tab === 'dashboard' && $dash): ?>
    <div class="row g-2 mb-4" data-testid="admin-dashboard">
      <div class="col-6 col-md-3"><div class="card p-3"><div class="d-flex align-items-center gap-2"><i class="bi bi-currency-dollar text-success fs-4"></i><div><div class="fs-5 fw-bold">$<?= number_format($dash['revenue'], 2) ?></div><small class="text-secondary">Total Revenue</small></div></div></div></div>
      <div class="col-6 col-md-3"><div class="card p-3"><div class="d-flex align-items-center gap-2"><i class="bi bi-bag-check text-primary fs-4"></i><div><div class="fs-5 fw-bold"><?= (int)$dash['paid'] ?></div><small class="text-secondary">Paid Orders</small></div></div></div></div>
      <div class="col-6 col-md-3"><div class="card p-3"><div class="d-flex align-items-center gap-2"><i class="bi bi-receipt text-info fs-4"></i><div><div class="fs-5 fw-bold">$<?= number_format($dash['avg'], 2) ?></div><small class="text-secondary">Avg Order Value</small></div></div></div></div>
      <div class="col-6 col-md-3"><div class="card p-3"><div class="d-flex align-items-center gap-2"><i class="bi bi-graph-up-arrow text-warning fs-4"></i><div><div class="fs-5 fw-bold">$<?= number_format($dash['rev7'], 2) ?></div><small class="text-secondary">Revenue (7 days)</small></div></div></div></div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card p-4" data-testid="dashboard-revenue-chart">
          <h6 class="fw-bold mb-3">Revenue per Day — Last 30 Days</h6>
          <div class="d-flex align-items-end gap-1" style="height:220px;">
            <?php foreach ($dash['days'] as $d):
              $h = $dash['max_day'] > 0 ? max(2, round($d['revenue'] / $dash['max_day'] * 200)) : 2; ?>
              <div class="flex-grow-1 bg-primary rounded-top" style="height:<?= $h ?>px;min-width:4px;opacity:<?= $d['revenue'] > 0 ? '1' : '.18' ?>;"
                title="<?= esc($d['date']) ?> — $<?= number_format($d['revenue'], 2) ?> (<?= (int)$d['orders'] ?> order<?= $d['orders'] !== 1 ? 's' : '' ?>)"></div>
            <?php endforeach; ?>
          </div>
          <div class="d-flex justify-content-between small text-secondary mt-2">
            <span><?= esc($dash['days'][0]['date']) ?></span><span><?= esc(end($dash['days'])['date']) ?></span>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card p-4" data-testid="dashboard-best-sellers">
          <h6 class="fw-bold mb-3">Best-Selling Products</h6>
          <?php if (!$dash['best']): ?><p class="text-secondary small mb-0">No paid orders yet — sales will appear here.</p><?php endif; ?>
          <?php foreach ($dash['best'] as $i => $b): ?>
            <div class="d-flex align-items-center gap-2 py-2 <?= $i ? 'border-top' : '' ?>">
              <span class="badge rounded-pill text-bg-<?= $i < 3 ? 'warning' : 'light' ?>"><?= $i + 1 ?></span>
              <?php if (!empty($b['image'])): ?><img src="<?= esc($b['image']) ?>" alt="" style="width:32px;height:32px;object-fit:contain;" class="bg-body-tertiary rounded"><?php endif; ?>
              <span class="small flex-grow-1"><?= esc($b['name']) ?></span>
              <span class="text-end small"><strong><?= (int)$b['units'] ?> sold</strong><br><span class="text-success">$<?= number_format((float)$b['revenue'], 2) ?></span></span>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

  <?php elseif ($tab === 'products'): ?>
    <div class="table-responsive card p-0">
      <table class="table table-hover align-middle mb-0" data-testid="admin-products-table">
        <thead><tr><th>Product</th><th style="width:120px">Price</th><th style="width:120px">Was</th><th style="width:150px">Badge</th><th style="width:90px"></th></tr></thead>
        <tbody>
          <?php foreach ($pdo->query('SELECT * FROM products ORDER BY id') as $p): $fid = 'pf-' . esc($p['slug']); ?>
            <tr>
              <td class="small"><div class="d-flex align-items-center gap-2"><img src="<?= esc($p['image']) ?>" style="width:34px;height:34px;object-fit:contain;" class="bg-body-tertiary rounded" alt=""><?= esc($p['name']) ?></div></td>
              <td><input name="price" form="<?= $fid ?>" class="form-control form-control-sm" value="<?= esc($p['price']) ?>"></td>
              <td><input name="original_price" form="<?= $fid ?>" class="form-control form-control-sm" value="<?= esc($p['original_price'] ?? '') ?>"></td>
              <td><input name="badge" form="<?= $fid ?>" class="form-control form-control-sm" value="<?= esc($p['badge'] ?? '') ?>" placeholder="—"></td>
              <td>
                <form method="post" id="<?= $fid ?>">
                  <input type="hidden" name="action" value="update_product"><input type="hidden" name="slug" value="<?= esc($p['slug']) ?>">
                  <button class="btn btn-sm btn-primary">Save</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

  <?php elseif ($tab === 'orders'): ?>
    <div class="table-responsive card p-0">
      <table class="table table-hover align-middle mb-0" data-testid="admin-orders-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th style="width:160px">Status</th><th style="width:200px">Fulfillment</th></tr></thead>
        <tbody>
          <?php foreach ($pdo->query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 200') as $o): ?>
            <tr>
              <td class="small"><strong>#<?= esc($o['order_number']) ?></strong><br><span class="text-secondary"><?= esc($o['created_at']) ?></span></td>
              <td class="small"><?= esc($o['first_name'] . ' ' . $o['last_name']) ?><br><span class="text-secondary"><?= esc($o['email']) ?></span></td>
              <td class="fw-bold small">$<?= number_format((float)$o['total'], 2) ?></td>
              <td>
                <form method="post" class="d-flex gap-1">
                  <input type="hidden" name="action" value="update_order"><input type="hidden" name="order_id" value="<?= (int)$o['id'] ?>">
                  <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
                    <?php foreach (['pending', 'paid', 'delivered', 'refunded', 'cancelled'] as $s): ?>
                      <option value="<?= $s ?>" <?= $o['status'] === $s ? 'selected' : '' ?>><?= ucfirst($s) ?></option>
                    <?php endforeach; ?>
                  </select>
                </form>
              </td>
              <td>
                <span class="badge text-bg-<?= $o['fulfilled'] ? 'success' : 'secondary' ?>"><?= $o['fulfilled'] ? 'Fulfilled' : 'Not fulfilled' ?></span>
                <form method="post" class="d-inline">
                  <input type="hidden" name="action" value="resend_email"><input type="hidden" name="order_id" value="<?= (int)$o['id'] ?>">
                  <button class="btn btn-sm btn-outline-secondary ms-1">Resend Email</button>
                </form>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

  <?php elseif ($tab === 'leads'): ?>
    <div class="table-responsive card p-0">
      <table class="table table-hover align-middle mb-0" data-testid="admin-leads-table">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Callback?</th><th>Message</th><th>When</th></tr></thead>
        <tbody>
          <?php foreach ($pdo->query('SELECT * FROM chat_leads ORDER BY created_at DESC LIMIT 200') as $l): ?>
            <tr>
              <td class="small fw-semibold"><?= esc($l['name'] ?? '—') ?></td>
              <td class="small"><?= esc($l['email'] ?? '—') ?></td>
              <td class="small"><?= esc($l['phone'] ?? '—') ?></td>
              <td><?= $l['callback_requested'] ? '<span class="badge text-bg-primary">📞 Callback</span>' : '<span class="text-secondary small">No</span>' ?></td>
              <td class="small text-secondary" style="max-width:240px;"><?= esc(mb_strimwidth((string)$l['message'], 0, 80, '…')) ?></td>
              <td class="small text-secondary"><?= esc($l['created_at']) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>

  <?php elseif ($tab === 'keys'): ?>
    <div class="row g-4">
      <div class="col-lg-5">
        <div class="card p-4">
          <h5 class="fw-bold mb-3">Add License Keys</h5>
          <form method="post">
            <input type="hidden" name="action" value="add_keys">
            <select name="product_slug" required class="form-select mb-3" data-testid="admin-keys-product">
              <option value="">Select a product…</option>
              <?php foreach ($pdo->query('SELECT slug, name FROM products ORDER BY name') as $p): ?>
                <option value="<?= esc($p['slug']) ?>"><?= esc($p['name']) ?></option>
              <?php endforeach; ?>
            </select>
            <textarea name="keys" rows="6" required class="form-control font-monospace mb-3" placeholder="One key per line&#10;XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" data-testid="admin-keys-textarea"></textarea>
            <button class="btn btn-primary w-100" data-testid="admin-keys-add">Add Keys</button>
          </form>
        </div>
      </div>
      <div class="col-lg-7">
        <div class="card p-4" style="max-height:520px;overflow-y:auto;">
          <h5 class="fw-bold mb-3">Inventory</h5>
          <?php $keys = $pdo->query('SELECT lk.*, p.name FROM license_keys lk LEFT JOIN products p ON p.slug = lk.product_slug ORDER BY lk.created_at DESC LIMIT 300')->fetchAll(); ?>
          <?php if (!$keys): ?><p class="text-secondary small mb-0">No keys yet. Orders placed without available keys will say "key follows shortly" in the email.</p><?php endif; ?>
          <?php foreach ($keys as $k): ?>
            <div class="d-flex align-items-center gap-2 border rounded p-2 mb-1 small">
              <span class="badge rounded-pill text-bg-<?= $k['status'] === 'available' ? 'success' : 'secondary' ?>">&nbsp;</span>
              <span class="font-monospace"><?= esc($k['license_key']) ?></span>
              <span class="text-secondary ms-auto text-truncate" style="max-width:160px;"><?= esc($k['name'] ?? $k['product_slug']) ?></span>
              <?php if ($k['status'] === 'available'): ?>
                <form method="post" class="d-inline"><input type="hidden" name="action" value="delete_key"><input type="hidden" name="key_id" value="<?= (int)$k['id'] ?>"><button class="btn btn-sm btn-outline-danger py-0 px-1"><i class="bi bi-trash"></i></button></form>
              <?php else: ?><span class="badge text-bg-light text-secondary">assigned</span><?php endif; ?>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </div>

  <?php elseif ($tab === 'emails'): ?>
    <div class="table-responsive card p-0">
      <table class="table table-hover align-middle mb-0" data-testid="admin-emails-table">
        <thead><tr><th>To</th><th>Subject</th><th>Status</th><th>When</th><th></th></tr></thead>
        <tbody>
          <?php foreach ($pdo->query('SELECT id, recipient, subject, status, created_at FROM email_outbox ORDER BY created_at DESC LIMIT 200') as $e): ?>
            <tr>
              <td class="small"><?= esc($e['recipient']) ?></td>
              <td class="small"><?= esc($e['subject']) ?></td>
              <td><span class="badge text-bg-<?= $e['status'] === 'sent' ? 'success' : ($e['status'] === 'queued' ? 'warning' : 'danger') ?>"><?= esc($e['status']) ?></span></td>
              <td class="small text-secondary"><?= esc($e['created_at']) ?></td>
              <td><a class="btn btn-sm btn-outline-secondary" href="admin-email-preview.php?id=<?= (int)$e['id'] ?>" target="_blank">Preview</a></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    </div>
  <?php endif; ?>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

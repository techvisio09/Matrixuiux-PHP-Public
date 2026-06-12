<?php
// Order fulfillment + transactional email.
// With RESEND_API_KEY set, emails send via the Resend HTTP API (cURL).
// Without it, emails are stored in `email_outbox` as "queued" (see admin.php > Emails).
require_once __DIR__ . '/functions.php';

function build_order_email_html(array $order, array $items, array $assignments): string
{
    $first = esc($order['first_name'] ?: 'there');
    $itemsHtml = '';
    foreach ($assignments as $a) {
        $img = $a['image'] ? '<img src="' . esc($a['image']) . '" width="84" height="84" alt="" style="display:block;border-radius:8px;background:#f8fafc;object-fit:contain;">' : '';
        $keyBlock = $a['key']
            ? '<div style="margin-top:12px;border:2px dashed #059669;border-radius:10px;background:#ecfdf5;padding:14px 16px;text-align:center;">
                 <div style="font-size:11px;color:#64748b;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Your Product Key</div>
                 <div style="font-family:Courier New,monospace;font-size:18px;font-weight:bold;color:#047857;letter-spacing:2px;">' . esc($a['key']) . '</div></div>'
            : '<div style="margin-top:12px;border:1px solid #fcd34d;border-radius:10px;background:#fffbeb;padding:12px 16px;">
                 <div style="font-size:13px;color:#92400e;"><strong>Your product key is being prepared</strong> and will arrive in a separate email within 30 minutes.</div></div>';
        $itemsHtml .= '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;margin-bottom:14px;"><tr><td style="padding:16px;">
            <table role="presentation" width="100%"><tr>
              <td width="96" valign="top">' . $img . '</td>
              <td valign="top" style="padding-left:8px;">
                <div style="font-size:15px;font-weight:bold;color:#0f172a;line-height:1.35;">' . esc($a['name']) . '</div>
                <div style="font-size:12px;color:#64748b;margin-top:4px;">Genuine lifetime license &middot; 1 device</div>
              </td></tr></table>' . $keyBlock . '</td></tr></table>';
    }
    $proHtml = $order['pro_assist']
        ? '<div style="border:1px solid #c7d2fe;background:#eef2ff;border-radius:10px;padding:12px 16px;margin-bottom:14px;font-size:13px;color:#3730a3;"><strong>ProAssist Premium Installation included</strong> — our team will contact you within the same business day to remotely install your software.</div>'
        : '';
    $total = number_format((float)$order['total'], 2);
    $year = date('Y');

    return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:28px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,.08);">
  <tr><td style="background:#0c1f19;padding:24px 32px;">
    <table role="presentation" width="100%"><tr>
      <td><div style="font-size:18px;font-weight:800;color:#fff;letter-spacing:.5px;">Matrixuiux <span style="color:#38bdf8;">Software</span></div>
      <div style="font-size:10px;color:#94a3b8;letter-spacing:2px;">AUTHORIZED MICROSOFT RESELLER</div></td>
      <td align="right"><div style="display:inline-block;background:#16a34a;color:#fff;font-size:11px;font-weight:bold;border-radius:999px;padding:6px 14px;">&#10003; ORDER CONFIRMED</div></td>
    </tr></table></td></tr>
  <tr><td style="padding:32px;">
    <h1 style="margin:0 0 6px;font-size:22px;color:#0f172a;">Thank you for your purchase, ' . $first . '!</h1>
    <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">Your payment was successful and your genuine Microsoft license is ready. Below you\'ll find your product key(s) and simple activation steps.</p>
    <table role="presentation" width="100%" style="background:#f8fafc;border-radius:12px;margin-bottom:22px;"><tr>
      <td style="padding:14px 18px;font-size:13px;color:#475569;">Order Number<br><strong style="color:#0f172a;font-size:15px;">#' . esc($order['order_number']) . '</strong></td>
      <td style="padding:14px 18px;font-size:13px;color:#475569;">Order Total<br><strong style="color:#0f172a;font-size:15px;">$' . $total . ' USD</strong></td>
      <td style="padding:14px 18px;font-size:13px;color:#475569;">Delivered To<br><strong style="color:#0f172a;font-size:14px;">' . esc($order['email']) . '</strong></td>
    </tr></table>' . $proHtml . $itemsHtml . '
    <h2 style="font-size:15px;color:#0f172a;margin:24px 0 10px;">How to activate</h2>
    <ol style="margin:0;padding-left:20px;font-size:13px;color:#475569;line-height:2;">
      <li>Download the official installer from <a href="https://setup.office.com" style="color:#047857;">setup.office.com</a> (or the link for your product).</li>
      <li>Sign in (or create a free Microsoft account) and enter your product key when prompted.</li>
      <li>Follow the on-screen steps — your license activates instantly.</li>
    </ol>
    <div style="margin-top:22px;border-top:1px solid #e2e8f0;padding-top:16px;font-size:12px;color:#64748b;line-height:1.7;">
      <strong style="color:#0f172a;">Billing note:</strong> this charge will appear as <strong>' . SITE_LEGAL . '</strong> on your card statement.
    </div></td></tr>
  <tr><td style="background:#f8fafc;padding:22px 32px;border-top:1px solid #e2e8f0;">
    <div style="font-size:13px;font-weight:bold;color:#0f172a;margin-bottom:6px;">Need help installing?</div>
    <div style="font-size:12px;color:#64748b;line-height:1.8;">
      &#128222; <a href="tel:' . SITE_PHONE . '" style="color:#047857;text-decoration:none;">' . SITE_PHONE . '</a> (' . SITE_HOURS . ')<br>
      &#9993;&#65039; <a href="mailto:' . SITE_EMAIL . '" style="color:#047857;text-decoration:none;">' . SITE_EMAIL . '</a> &middot; Free installation &amp; activation assistance included
    </div>
    <div style="margin-top:14px;font-size:11px;color:#94a3b8;">&copy; ' . $year . ' ' . SITE_LEGAL . '. All rights reserved.</div>
  </td></tr>
</table></td></tr></table></body></html>';
}

function send_email(string $to, string $subject, string $html, ?int $orderId = null): void
{
    if (RESEND_API_KEY === '') {
        $stmt = db()->prepare('INSERT INTO email_outbox (recipient, subject, html, status, note, order_id) VALUES (?, ?, ?, "queued", "RESEND_API_KEY not configured — stored for later delivery", ?)');
        $stmt->execute([$to, $subject, $html, $orderId]);
        return;
    }
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['from' => SENDER_EMAIL, 'to' => [$to], 'subject' => $subject, 'html' => $html]),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . RESEND_API_KEY],
        CURLOPT_TIMEOUT => 20,
    ]);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $ok = $res !== false && $code >= 200 && $code < 300;
    $stmt = db()->prepare('INSERT INTO email_outbox (recipient, subject, html, status, note, order_id) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$to, $subject, $html, $ok ? 'sent' : 'failed', $ok ? null : ('HTTP ' . $code), $orderId]);
}

function fulfill_order(int $orderId): void
{
    $pdo = db();
    $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
    $stmt->execute([$orderId]);
    $order = $stmt->fetch();
    if (!$order || $order['fulfilled']) return;

    $itemsStmt = $pdo->prepare('SELECT oi.*, p.image FROM order_items oi LEFT JOIN products p ON p.slug = oi.product_slug WHERE oi.order_id = ?');
    $itemsStmt->execute([$orderId]);
    $items = $itemsStmt->fetchAll();

    $assignments = [];
    $keyStmt = $pdo->prepare('SELECT id, license_key FROM license_keys WHERE product_slug = ? AND status = "available" LIMIT 1');
    $assignStmt = $pdo->prepare('UPDATE license_keys SET status = "assigned", order_id = ?, assigned_at = NOW() WHERE id = ?');
    foreach ($items as $item) {
        if ($item['product_slug'] === 'proassist-premium') continue;
        for ($i = 0; $i < (int)$item['qty']; $i++) {
            $keyStmt->execute([$item['product_slug']]);
            $keyRow = $keyStmt->fetch();
            if ($keyRow) {
                $assignStmt->execute([$orderId, $keyRow['id']]);
            }
            $assignments[] = ['name' => $item['name'], 'image' => $item['image'], 'key' => $keyRow['license_key'] ?? null];
        }
    }
    $pdo->prepare('UPDATE orders SET fulfilled = 1 WHERE id = ?')->execute([$orderId]);
    $html = build_order_email_html($order, $items, $assignments);
    send_email($order['email'], 'Your Microsoft product key — Order #' . $order['order_number'], $html, $orderId);
}

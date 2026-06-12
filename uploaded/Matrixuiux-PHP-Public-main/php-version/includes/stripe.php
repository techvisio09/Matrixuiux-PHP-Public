<?php
// Stripe hosted checkout via the HTTP API (no SDK required).
// With STRIPE_SECRET_KEY empty the store runs in DEMO MODE (order marked paid instantly).
require_once __DIR__ . '/functions.php';

function stripe_enabled(): bool
{
    return STRIPE_SECRET_KEY !== '';
}

function stripe_request(string $method, string $path, array $params = []): array
{
    $ch = curl_init(rtrim(STRIPE_API_BASE, '/') . '/v1/' . $path);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => STRIPE_SECRET_KEY . ':',
        CURLOPT_TIMEOUT => 25,
    ];
    if ($method === 'POST') {
        $opts[CURLOPT_POST] = true;
        $opts[CURLOPT_POSTFIELDS] = http_build_query($params);
    }
    curl_setopt_array($ch, $opts);
    $res = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = json_decode((string)$res, true) ?: [];
    if ($code < 200 || $code >= 300) {
        throw new RuntimeException($data['error']['message'] ?? ('Stripe error HTTP ' . $code));
    }
    return $data;
}

function stripe_create_session(array $order, string $baseUrl): array
{
    $cents = (int)round((float)$order['total'] * 100);
    return stripe_request('POST', 'checkout/sessions', [
        'mode' => 'payment',
        'line_items[0][price_data][currency]' => 'usd',
        'line_items[0][price_data][product_data][name]' => 'Order #' . $order['order_number'] . ' — ' . SITE_LEGAL,
        'line_items[0][price_data][unit_amount]' => $cents,
        'line_items[0][quantity]' => 1,
        'customer_email' => $order['email'],
        'metadata[order_number]' => $order['order_number'],
        'success_url' => $baseUrl . 'order-success.php?order=' . urlencode($order['order_number']) . '&session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => $baseUrl . 'checkout.php',
    ]);
}

function stripe_get_session(string $sessionId): array
{
    return stripe_request('GET', 'checkout/sessions/' . urlencode($sessionId));
}

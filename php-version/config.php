<?php
// ============================================================
// Matrixuiux Software Store - Configuration
// Edit these values to match your hosting environment.
// ============================================================

// --- Database (MySQL) ---
define('DB_HOST', 'localhost');
define('DB_NAME', 'ucode_store');
define('DB_USER', 'root');
define('DB_PASS', '');

// --- Optional: AI chat (OpenAI-compatible API) ---
// On Emergent preview these are auto-filled from the environment (Emergent LLM key).
// For your own hosting: put your OpenAI key in the fallback string below
// (get one at https://platform.openai.com/api-keys). Leave empty to show a
// phone/email contact box instead.
define('OPENAI_API_KEY', getenv('OPENAI_API_KEY') ?: (getenv('EMERGENT_LLM_KEY') ?: ''));
define('OPENAI_BASE_URL', getenv('OPENAI_BASE_URL') ?: (getenv('EMERGENT_LLM_KEY') ? 'https://integrations.emergentagent.com/llm/v1' : 'https://api.openai.com/v1'));
define('OPENAI_MODEL', 'gpt-4o-mini');

// --- Optional: Stripe secret key (https://dashboard.stripe.com/apikeys) ---
// Auto-filled from the environment on Emergent preview.
// Leave empty for DEMO MODE: orders are marked paid immediately without charging.
define('STRIPE_SECRET_KEY', getenv('STRIPE_API_KEY') ?: '');
// Stripe API base — on Emergent preview the test key works through the Emergent proxy.
define('STRIPE_API_BASE', getenv('STRIPE_API_BASE')
    ?: (str_contains(STRIPE_SECRET_KEY, 'emergent') ? 'https://integrations.emergentagent.com/stripe' : 'https://api.stripe.com'));

// --- Optional: Resend API key for order/license-key emails (https://resend.com) ---
// Leave empty to queue emails in the database (view them in admin.php > Emails).
define('RESEND_API_KEY', getenv('RESEND_API_KEY') ?: '');
define('SENDER_EMAIL', getenv('SENDER_EMAIL') ?: 'onboarding@resend.dev');

// --- Admin account (created automatically on first run) ---
define('ADMIN_EMAIL', 'admin@matrixuiuxsoftware.com');
define('ADMIN_PASSWORD', 'Admin@UC2026!');

// --- Company ---
define('SITE_BRAND', 'Matrixuiux Software');
define('SITE_LEGAL', 'Matrixuiux Software');
define('SITE_PHONE', '1-888-632-9902');
// Public site URL — used for canonical links, sitemap and structured data (change when moving to your own domain)
define('SITE_URL', 'https://software-staging.preview.emergentagent.com');
// Google Search Console verification — paste your GSC meta-tag code here (content="..." value)
define('GOOGLE_SITE_VERIFICATION', '');
define('SITE_EMAIL', 'support@matrixuiuxsoftware.com');
define('SITE_HOURS', 'Mon-Sat, 9 AM - 6 PM EST');
define('SITE_ADDRESS', '5 Blue Springs Ct, Columbia, SC 29229, USA');

// --- ProAssist upsell price (USD) ---
define('PRO_ASSIST_PRICE', 47.00);

// --- Currencies (rates relative to USD) ---
$GLOBALS['CURRENCIES'] = [
    'USD' => ['symbol' => '$',    'rate' => 1.00, 'flag' => '🇺🇸'],
    'EUR' => ['symbol' => '€',    'rate' => 0.92, 'flag' => '🇪🇺'],
    'GBP' => ['symbol' => '£',    'rate' => 0.79, 'flag' => '🇬🇧'],
    'CAD' => ['symbol' => 'CA$',  'rate' => 1.37, 'flag' => '🇨🇦'],
    'AUD' => ['symbol' => 'AU$',  'rate' => 1.52, 'flag' => '🇦🇺'],
];

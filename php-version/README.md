# UCODE SOFTTECH Store — PHP / Bootstrap Version

> **NOTE (Emergent preview):** This PHP app is now the LIVE site served on the preview URL.
> Supervisor's `frontend` service runs `start.sh`, which boots MariaDB (seeding
> `ucode_store` from `database.sql` if missing), exports the Stripe / Emergent LLM keys
> from `/app/backend/.env`, and serves this folder with PHP's built-in server on port 3000
> (`router.php` maps `/` to `index.php`). The React app code remains at `/app/frontend`
> (switch back via the `start:react` script) but is no longer served.

A standalone PHP + MySQL + Bootstrap 5 version of the UCODE SOFTTECH software store.
Host it on any standard PHP hosting (cPanel, shared hosting, VPS).

## Requirements
- PHP 8.0+ (with `pdo_mysql` and `curl` extensions)
- MySQL 5.7+ / MariaDB 10.3+

## Setup (5 minutes)

1. **Create a MySQL database** (e.g. `ucode_store`) in your hosting panel.
2. **Import the seed data**: in phpMyAdmin, select the database → Import → choose `database.sql`.
   Or via terminal: `mysql -u USER -p ucode_store < database.sql`
3. **Edit `config.php`**: set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` to your database credentials.
4. **Upload all files** to your web root (e.g. `public_html/`).
5. Open the site — done!

## Optional integrations (config.php)
- **Stripe** (`STRIPE_SECRET_KEY`): with a key set, checkout redirects to the hosted Stripe payment page and the order is marked paid + fulfilled after returning. Without a key the store runs in **DEMO MODE** — orders are marked paid instantly (no charge).
- **Resend** (`RESEND_API_KEY`): order/license-key emails send via Resend. Without a key, emails are stored as "queued" in the database — preview them in **admin.php → Emails**.
- **OpenAI** (`OPENAI_API_KEY`): powers the AI chat replies. Without it the chat shows a contact fallback (lead capture still works).

## Accounts & Admin
- Customer accounts: `register.php` / `login.php` / `account.php` (order history).
- Admin panel: `admin.php` — Products (price/badge), Orders (status + resend email), Leads (chat callback requests), Key Inventory (paste license keys per product; auto-assigned + emailed when an order is paid), Emails (outbox with preview).
- Default admin (change in config.php!): `admin@ucodesofttechus.com` / `Admin@UC2026!` — created automatically on first login page load.

## Local development
```bash
php -S localhost:8080
```
(with a local MySQL running and `config.php` pointed at it)

## Structure
```
config.php          — DB credentials, company info, currencies, OpenAI key
database.sql        — schema + full product/page/blog seed data
includes/           — db.php (PDO), functions.php (helpers), header.php, footer.php
assets/css|js       — custom styles & JS (dark mode, cart AJAX, chat)
index.php           — Home
shop.php            — all products with filter/sort
category.php?slug=  — category listing
product.php?slug=   — product detail (with Version / Edition / OS variant selectors)
cart.php            — session cart + ProAssist upsell modal
checkout.php        — billing form, Card/PayPal selector, saves order to MySQL
order-success.php   — confirmation
page.php?slug=      — legal & support pages (from DB, incl. disclaimer)
about-us.php        — About Us (story, stats, mission, why choose us)
sitemap.php         — full sitemap of pages/categories/products
blog.php / blog-post.php
ajax/cart.php       — cart JSON API
ajax/chat.php       — Ask AI endpoint (OpenAI or fallback)
```

## Notes
- Currency selector (USD/EUR/GBP/CAD/AUD) converts prices client-side rates set in `config.php`.
- Dark mode is persisted in the visitor's browser (Bootstrap 5.3 `data-bs-theme`).
- The chat widget shows a lead form (name/email/phone) with "Request a Callback" — callbacks appear in admin.php → Leads.
- Orders live in `orders` + `order_items`; keys in `license_keys`; emails in `email_outbox`; leads in `chat_leads`.

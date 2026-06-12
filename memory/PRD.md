# PRD — UCODE SOFTTECH Software Store

## Original Problem Statement
Create a pixel-perfect clone of gosoftwarebuy.com, rebranded as "UCODE SOFTTECH LLC". Includes categorized mega-menu catalog, Ask AI feature, multi-currency selector (GBP, USD, EUR, CAD, AUD), Dark Mode, Shopping Cart, Checkout with ProAssist up-sell modal, and specific Header/Footer structures.

## Current State
All catalog data lives in `/app/frontend/src/mock.js`. Backend `server.py` now has its FIRST real API: the AI chat endpoint.

## Backend (as of Jun 10, 2026)
- **AI Sales Assistant** `POST /api/chat` {session_id, message} → SSE stream (`data: {"t": token}` ... `data: {"done": true}`)
  - emergentintegrations LlmChat, **openai/gpt-5** (NOTE: gateway rejects "gpt-5.4" alias for this key; gpt-5 verified working), EMERGENT_LLM_KEY in backend/.env
  - System prompt "Max": answers product Qs briefly, collects name/email/phone one at a time, then offers toll-free 1-888-632-9902 (Mon-Fri 9-6 EST) or callback (24 business hours)
  - Lead capture via hidden `[LEAD]{json}[/LEAD]` marker at reply end → parsed, upserted to `db.leads` (by session_id), stripped before storing in `db.chat_messages` (roles user/assistant)
  - In-memory `chat_sessions` dict per session_id (resets on reload — history persistence in DB only)
- Frontend `JivoChat.jsx`: session uuid in localStorage `ucode_chat_session`, fetch-streamed SSE rendering with typing dots, strips `[LEAD]` marker from display, fallback message with phone on error
- Verified end-to-end: curl multi-turn (lead saved w/ callback_requested=true) + browser UI test (streamed reply, marker never shown, lead saved)

## Verified (Jun 11, 2026)
- Full frontend regression test PASSED 100% after the major refactor (Header, CategoryPage, ProductDetail/Sections, JivoChat, variants.js) — mega-menu, currency switch, dark mode, filters/sort, variant blur, add-to-cart, ProAssist modal, checkout form, AI chat streaming, mobile 390px. Report: /app/test_reports/iteration_1.json
- Fixed browser tab title → "UCODE SOFTTECH LLC | Genuine Microsoft Software" (public/index.html)
- Fixed Radix a11y warning: added DialogDescription to ProAssist modal (Cart.jsx)

## Checkout Payment Method Selector (Jun 11, 2026)
- Checkout "Secure Payment" section now has radio-style Card vs PayPal options (data-testid: pay-method-card / pay-method-paypal)
- Card selected → card form (number/expiry/CVV) + blue "Pay Securely · {total}" button
- PayPal selected → card form hidden, PayPal info panel (buyer protection bullets) + yellow PayPal-branded "Continue" button; placeOrder toast says "Redirecting to PayPal…"
- Still MOCKED flow — real Stripe/PayPal integration is the P1 task

## Fulfillment, Admin Panel & UX Pack (Jun 11, 2026)
### License key delivery emails (Resend)
- `backend/emails.py`: elegant HTML order email (product image + dashed key box, activation steps, "charge appears as UCODE SOFTTECH LLC on your card statement", support footer)
- RESEND_API_KEY empty by design → emails stored in `email_outbox` as "queued" (visible in admin); set key + SENDER_EMAIL in backend/.env to go live
- Keys auto-assigned from `license_keys` inventory on payment (fulfill_order in payments finalize); no key in stock → email says key follows shortly
### Admin Panel (/admin, role=admin)
- Tabs: Products (price/badge/inStock edit), Orders (status select + resend email), Leads (callback flags), Key Inventory (add/delete per product), Emails (outbox)
- API under /api/admin/* with require_admin guard (401/403 verified); inStock=false blocks checkout (400)
### UX items 1-7 (all delivered)
- Chat renamed "UCODE SOFTTECH AI — Ask Anything" (launcher + header buttons open chat via 'ucode-open-chat' event)
- In-chat lead form (name/email/phone) → Request Callback (saves lead, "agent is going to call you... be near your phone" + connected-to-live-agent flow) or Call button; skippable; POST /api/leads
- Checkout phone country-code selector (12 codes)
- Product detail "Buy Now" (adds + goes to /cart); Add to Cart keeps toast prompt; out-of-stock state handled
- Post-payment thank-you: check-email copy, Installation Guide button, phone/email(→contact page)/chat options
- Home Browse bar: 18 chips in one scrollable line, alias category slugs added to CategoryPage (office, antivirus, office-for-windows, etc.)
- "Email Us" buttons (About/Product/FAQ) → /page/contact-us
- /api/products now supports optional ?category= filter
### Testing (iteration_3.json): backend 24/24 pytest; frontend 100% of new flows

## Full-Stack Migration Complete (Jun 11, 2026) — P0 + P1 + P2
### P0: Catalog in MongoDB
- 37 products + 12 categories seeded idempotently on startup (`backend/seed.py` + `seed_data.json` generated from old mock.js)
- APIs: GET /api/products, /api/products/{id}, /api/categories
- Frontend `CatalogContext` fetches once, gates render with splash; feeds `variants.js` via `setCatalog()`; mock.js now holds only static content (testimonials/faqs/blog/logos/appIcons)
### P1: Stripe Payments (REAL, test mode)
- emergentintegrations hosted checkout; STRIPE_API_KEY=sk_test_emergent in backend/.env
- POST /api/payments/checkout/session (server-side pricing from DB, creates order pending_payment + payment_transactions initiated), GET /api/payments/checkout/status/{id} (polls, finalizes exactly once), POST /api/webhook/stripe
- Frontend: Checkout form → Stripe redirect → /checkout/success polls status → cart cleared on paid
- FIXED 1¢ truncation bug: library does int(amount*100); we pass (round(total*100)+0.1)/100 — verified exact cents for all values to $3,000
- PayPal option shown DISABLED ("Coming Soon") — needs user's PayPal business credentials to enable
### P2: Authentication (both methods, one users collection)
- JWT email/password: register/login/logout/me/refresh, bcrypt, httpOnly cookies (secure, samesite=none), brute-force lockout (5 fails → 15 min 429), forgot/reset password endpoints
- Emergent Google social login: /api/auth/google/session exchange, user_sessions collection, AuthCallback handles #session_id synchronously
- Frontend: /login, /register (with Google button), /account (profile + My Orders with status badges), header Sign In/account link
- Admin: admin@ucodesofttechus.com / Admin@UC2026! (see /app/memory/test_credentials.md)
### Backend restructured
- server.py → routes/ (catalog, auth, orders, payments, chat) + auth_utils.py + database.py + seed.py + tests/ (15 pytest tests, all passing)
### Testing (iteration_2.json)
- Backend 15/15; frontend 100% critical flows incl. REAL Stripe payment with 4242 card e2e, order shows Paid on /account; AI chat regression OK

## Standalone PHP/Bootstrap Version (Jun 11, 2026)
### Updated to FULL PARITY with React app (Jun 11, 2026 — second pass)
- Auth: register.php/login.php/account.php (password_hash, session, order history); admin auto-seeded from config.php (admin@ucodesofttechus.com / Admin@UC2026!)
- Admin panel admin.php: Products (price/badge edit), Orders (status select triggers fulfillment, resend email), Leads (callback flags), Key Inventory (add/delete), Emails (outbox + admin-email-preview.php)
- includes/email.php: same elegant HTML email (key box, statement note "UCODE SOFTTECH LLC"); Resend via cURL or queued in email_outbox when RESEND_API_KEY empty
- includes/stripe.php: hosted Stripe checkout via HTTP API; STRIPE_SECRET_KEY empty → DEMO MODE (order paid + fulfilled instantly)
- UX parity: chat renamed UCODE SOFTTECH AI + lead form (ajax/lead.php) with callback flow, checkout phone country-code select, product Buy Now, new thank-you page (installation guide + phone/email/chat), one-line Browse bar
- New tables in database.sql: users, license_keys, email_outbox; chat_leads + orders extended
- Tested e2e locally (PHP 8.2 + MariaDB): register/login/account, admin actions, demo checkout → paid+fulfilled+key assigned+email queued, lead form, email HTML contains key + statement note
- Created at `/app/php-version/` per user request — for hosting OUTSIDE Emergent (cPanel/shared hosting). Does NOT replace the React app.
- Stack: PHP 8 + MySQL (PDO) + Bootstrap 5.3 CDN. Full site: Home, Shop (filter/sort), Category, Product Detail, Cart (session + ProAssist modal), Checkout (Card/PayPal selector, saves orders to MySQL), Order Success, Legal/Support pages (DB-driven), Blog.
- `database.sql` auto-generated from mock.js (37 products, 18 categories, legal/support pages, blog, testimonials, FAQs) via /tmp/gen_seed.mjs.
- Features: 5-currency selector (session), dark mode (data-bs-theme + localStorage), mega menu, Ask AI chat (OpenAI via config key, contact-box fallback + lead capture to chat_leads table).
- Tested locally with PHP built-in server + MariaDB: all pages 200, cart→checkout→order e2e verified, currency conversion verified, both themes + mega menu screenshot verified.
- Checkout in PHP version is demo flow (orders saved, no real charge). README.md has setup instructions.

## Next Phases (user-approved order, Jun 11, 2026)
- **P0**: Backend migration — move mock.js + variants.js catalog to MongoDB; CRUD APIs for Products, Categories, Orders; wire frontend to API
- **P1**: Stripe payment integration on Checkout (test key in environment)
- **P2**: Authentication — BOTH email/password (JWT) AND Emergent-managed Google social login ("My Account")

## Implemented (as of Jun 10, 2026)
- Full multi-page frontend: Home, Shop, Category pages, Product Detail, Cart, Checkout, Info pages, Blog, About
- Context providers: CartContext (localStorage, qty support), CurrencyContext (5 currencies), ThemeContext (dark mode w/ App.css overrides)
- ProAssist up-sell modal at Checkout; colorful payment SVGs; UCODE SOFTTECH branding throughout
- **Product Detail page rebuilt (Jun 10, 2026)** to match gosoftwarebuy product page:
  - Badge row (platform / year / In Stock / Lifetime License), rating, "Includes" app icon chips
  - **Edition selector** and **OS selector (PC/Mac)** — navigate to the real matching catalog product via `/app/frontend/src/data/variants.js` (base/version/edition/OS parsing + deduped catalog)
  - **Version selector (Jun 10, 2026)**: Office 2024/2021/2019, Windows 11/10 — navigates across version families
  - **Blur-disabled unavailable options (Jun 10, 2026)**: edition list is the union across the base; edition/OS/version combos not in the catalog render blurred (opacity-50, blur, cursor-not-allowed) and non-clickable — availability matches user-specified year/OS matrix
  - OS option is enabled when ANY product of that version exists on that OS (click jumps to closest edition); edition blur stays exact per (version, OS) matrix (Jun 10, 2026 user request)
  - Fixed missing `platform`/`apps` fields on businessProducts in mock.js (H&B 2024 Mac was parsed as PC → wrongly blurred); parseVariant also falls back to "(mac)" in name when platform is absent
- **Category pages upgraded (Jun 10, 2026)**: new `pages/CategoryPage.jsx` (filters/titles moved from InfoPage) — "{Category} Products" title + product count, Platform filter pills (All/Windows/Mac), grid/list view toggle, sort dropdown (Newest, Price asc/desc, Top Rated, Most Reviewed), list view rows with add-to-cart. InfoPage delegates category slugs to it.
  - Granular OS slugs (office-2024-pc/-mac etc.) map via `baseMap` to year-wide base lists with a pre-selected platform, so All/Windows/Mac filtering works across both OSes (Jun 10, 2026)
  - **Year + Edition filters (Jun 10, 2026)**: category toolbar gained Year (All/2024/2021/2019) and Edition (All/H&B/Pro Plus/H&S/Home) pill rows under Platform; options derived from parseVariant on the category's products, rows auto-hide when <2 options; combined filtering + clear-filters empty state
  - **Shop page Year filter (Jun 10, 2026)**: Shop.jsx gained a Year dropdown (All/2024/2021/2019) using parseVariant version matching, alongside Platform + Sort selects
  - **Year-correct box art (Jun 10, 2026)**: mock.js extraImg extended with per-year image URLs (hb2021, proPlus2019, hs2019Mac, win10Pro, project2021, visio2019, etc.) — no product shows another year's artwork; verified zero 2024-art leaks in 2019/2021 categories
- **Why Choose Us page (Jun 10, 2026)**: added to supportPages with user content — heading "Why Thousands Choose BITBY WEBTECH SOFTWARE", 4 stat cards, 8 feature cards, Shop Now CTA. SupportPage renderer gained `stats` and `cta` section types + optional `heading` override.
- **Customer Reviews / Blog / Affiliate pages (Jun 10, 2026)**: customer-reviews in supportPages (ratingSummary 4.6 + distribution bars + 12 reviewGrid cards); Blog.jsx rebuilt ("Software Tips & Guides", category tabs All/Product Guides/How-To/Buying/Comparisons, featured + grid, 6 posts with own POSTS data); affiliate-program in supportPages (4 benefit cards, 4 steps, commission table 8-15% with note, affiliateForm with toast submit, contact Client@bitbywebtech.us). New SupportPage section types: ratingSummary, reviewGrid, affiliateForm; Table supports note.
- **Legal pages + Sitemap (Jun 10, 2026)**: 7 policy pages from user content rebranded to UCODE SOFTTECH LLC (entity COMPANY.legal, email/phone from company.js, site ucodesofttechus.com) — privacy-policy, terms-of-service, refund-policy, shipping-delivery, payment-policy, cookie-policy, do-not-sell (CCPA opt-out form w/ toast). Data: `data/legalPages.js`; renderer: `pages/LegalPage.jsx` (sections: h/paras/list/after/optOutForm); InfoPage delegates legal slugs. `pages/Sitemap.jsx` at /sitemap with 7 link groups (product links resolved via findProduct with category fallbacks). Footer legal row now links to all real pages.
- **Hero visual (Jun 10, 2026)**: replaced person photo with product showcase — main tilted card (Office 2024 Pro Plus w/ BEST SELLER badge, stars, price), side cards Windows 11 Pro + Office 2024 Mac (hidden on <sm), "Key delivered in minutes" chip; all cards link to product pages, prices use currency context, products resolved via findProduct.
- **Brand logo (Jun 10, 2026)**: new SVG brand mark in `components/Logo.jsx` (gradient blue→indigo rounded square, white "U" wrapping a keyhole, optional emerald status dot via `status` prop) — replaces letter-box logos in Header, Footer, Checkout.
- **Chat box + mobile menu additions (Jun 10, 2026)**: JivoChat.jsx rebuilt as functional chat (message list, send → mock auto-reply with phone info, "Have a Question?" block) rendered GLOBALLY via App.js (removed from Home); positioned bottom-24 right-5 to clear the preview "Made with Emergent" badge that blocked clicks. Mobile menu: added Disclaimer link + "Have a Question?" gradient card. CHAT IS FRONTEND-MOCKED (no real agent/backend).
- **Mobile responsive (Jun 10, 2026)**: proper mobile hamburger menu in Header (expandable Microsoft Products/Antivirus groups with real category links, Ask AI, currency pill row, dark toggle; mobileGroup state). Fixed Checkout 111px mobile overflow (trust row + steps row + payment icons now flex-wrap; checkout logo G→U). Verified 0px horizontal overflow at 390px across home/category/product/cart/checkout/contact/reviews/sitemap/blog/why-choose-us/about/affiliate/disclaimer/privacy.
- **Header/menu polish (Jun 10, 2026)**: VolumePricingCard added to both mega menus (Request a Quote → /page/contact-us, phone block); hover-gap fix via 250ms close timer (openMS/openAV/scheduleClose/cancelClose); global ScrollToTop component in App.js (scrolls on pathname change); logo letter G→U in Header+Footer
- **Brand cleanup (Jun 10, 2026)**: all visible "BITBY WEBTECH SOFTWARE" and "Gosoftware" strings replaced with UCODE SOFTTECH LLC (AboutUs, Disclaimer, supportPages why-choose-us/reviews/affiliate, AboutSection, Discover, JivoChat, company.js); affiliate contactEmail now COMPANY.email. Image asset URLs (gosoftwarebuy.com hosts) intentionally unchanged.
- **About Us rebuilt (Jun 10, 2026)**: user-provided BITBY WEBTECH SOFTWARE content arranged like reference — hero + breadcrumb, 4 stat cards (50,000+ / 4.8/5 / 180-Day / 24/7), Mission + 4 value cards, checklist + Why Choose Us split with Shop Now, gradient help CTA. NOTE: About page + Disclaimer use "BITBY WEBTECH SOFTWARE" brand while header/footer still say "UCODE SOFTTECH" — full site rebrand not yet confirmed by user.
  - `findProduct()` in variants.js resolves both original ids and slugged-name ids (fixed mega-menu URL fallback bug)
- **Dark mode visibility fixes (Jun 10, 2026)**: App.css overrides for colored -600/-700 text (blue/emerald/amber/orange/rose/purple), -100 backgrounds, empty star colors, selector ring/border colors
- **Disclaimer page (Jun 10, 2026)**: `/disclaimer` route (`pages/Disclaimer.jsx`), linked first in footer legal row. Content per user (entity: BITBY WEBTECH SOFTWARE as independent service provider; contact: UCODE email/phone) + Google Ads/PPC compliance section
- **Rich support pages (Jun 10, 2026)**: 7 polished pages (My Account, Help Center, Installation Guide, Activation Help, FAQs, Contact Us, Returns & Refunds) modeled on gosoftwarebuy structure with original copy
  - Data: `/app/frontend/src/data/supportPages.js`; renderer: `pages/SupportPage.jsx` (section types: cards, listCards, steps, accordion, table, check, contactMethods, contactForm, contactInfo)
  - InfoPage.jsx delegates to SupportPage for these slugs; other slugs (why-choose-us etc.) use old simple renderer
  - Contact form is FRONTEND-ONLY (toast on submit, no backend)
  - Fixed dark-mode hero gradient bug: Tailwind `via-white` bakes color into `--tw-gradient-stops` (no `--tw-gradient-via` var) — App.css now rebuilds stops dark
  - Quantity stepper + Add to Cart (qty-aware), 30-Day guarantee, sold count, trust chips, verified reviews box
  - Product Description, System Requirements (OS-specific), Need Help + Why Buy cards, "More options" grid, Customer Reviews, Compare Similar Products, product FAQ accordion, You May Also Like
  - Self-tested: edition/OS navigation, qty, add-to-cart all verified via browser automation

## Key Files
- `/app/frontend/src/mock.js` — catalog (to migrate to MongoDB later)
- `/app/frontend/src/data/variants.js` — variant family/edition/OS resolution + deduped `catalog` export
- `/app/frontend/src/pages/ProductDetail.jsx` — full product page
- `/app/frontend/src/context/CartContext.js` — addToCart(product, qty)
- `/app/frontend/src/App.css` — dark mode overrides (class-based on slate/white utilities)

## Backlog (updated Jun 11, 2026)
- ~~P0: Backend APIs (MongoDB migration)~~ DONE — FastAPI routes in /app/backend/routes/, seeded MongoDB
- ~~P1: Stripe payments~~ DONE — hosted checkout + status polling + webhook
- ~~P2: Auth~~ DONE — JWT + Emergent Google social login; Admin panel with Products/Orders/Leads/Keys/Emails tabs
- ~~Code Quality Report fixes~~ DONE Jun 11, 2026 (see Changelog below)
- **P2 (needs user confirmation)**: Sales Dashboard tab in Admin (revenue per day, best-selling products) — DONE Jun 11, 2026 (see Changelog)
- **P3**: Persist contact/affiliate form submissions to backend (currently toast-only)
- **P3**: Header "Ask AI" button opens chat widget directly

## Changelog — Jun 11, 2026 (PHP site polish pass — header/footer/checkout/coupon)
- **Tested ~98%→100% (iteration_8.json + Enter-key coupon fix)**:
  - Header: UCODE90 promo code (was GSOFT20), "5 YRS" trust badge, "Ask AI" button label (chat panel stays "Chat"), mega menu with "New" badges (Windows 11, 2024 Project/Visio) + "All Office for PC/Mac / All Windows / All Microsoft Apps" links + group headings link to category pages; Antivirus menu with "All Bitdefender"/"All McAfee"
  - Footer: full rebuild — newsletter band w/ toast, brand column (subscribe mini-form, phone/email/address/hours, social icons), Products(7)/Support(7)/Company(5) columns, Secure Payments band (payment badges, 4.6/5 reviews, Microsoft Verified/PCI), trademark line, legal row + Sitemap, copyright
  - Cart: ProAssist modal now has both footnotes + "No thanks, Continue to Checkout" label
  - Checkout: slim secure-checkout header ($checkoutHeader flag), phone country-code select, SMS consent checkbox, US state dropdown, card brand badges, CVV tooltip, terms line, qty steppers in summary, Need Assistance box w/ email
  - NEW functional coupon: UCODE90 = 20% off subtotal (ajax/cart.php 'coupon' action, session-stored, server-authoritative; discounted total flows into order + Stripe session — verified $209.99→$167.99); Enter key in coupon input applies coupon instead of submitting checkout form
  - ProAssist price confirmed $47.00 (PRO_ASSIST_PRICE) — matches user's €43.29 spec reference

## Changelog — Jun 11, 2026 (PHP REPLACED React as the live site)
- **User chose option (b): PHP version now SERVES the preview** (tested 100% iteration_7.json — all 13 flows pass):
  - `/app/frontend/package.json` `start` script → `bash /app/php-version/start.sh` (React preserved under `start:react`; `yarn build` untouched so Emergent deploy is unaffected)
  - NEW `/app/php-version/start.sh`: self-healing launcher — boots MariaDB, creates+seeds `ucode_store` from database.sql if missing, exports STRIPE_API_KEY / EMERGENT_LLM_KEY / RESEND_API_KEY from backend/.env, runs `php -S 0.0.0.0:3000` with NEW `router.php`
  - `config.php`: env-driven keys (OPENAI_API_KEY/BASE_URL, STRIPE_SECRET_KEY/STRIPE_API_BASE, RESEND) with editable fallbacks for external hosting
  - Stripe works through Emergent proxy (`integrations.emergentagent.com/stripe`) — checkout 302 → checkout.stripe.com verified; AI chat works via Emergent LLM proxy (`/llm/v1/chat/completions`)
  - Checkout card section: added "Powered by Stripe — confirm on next step" helper text (test report suggestion)
  - **IMPORTANT**: Emergent "Deploy" still ships the React+FastAPI app (PHP isn't deployable on Emergent). The PHP swap applies to THIS preview; for production PHP hosting upload /app/php-version to cPanel/VPS per README
  - FastAPI backend still runs on /api/* (unused by the PHP site; left intact)

## Changelog — Jun 11, 2026 (PHP full conversion parity)
- **PHP version now has FULL page parity with the React app** (user re-requested "convert entire project to PHP/CSS/HTML/Bootstrap"; standalone mirror at /app/php-version was audited and gaps filled):
  - NEW `about-us.php` (stats, mission, values, checklist, help CTA)
  - NEW `sitemap.php` (7 link groups mirroring React Sitemap)
  - NEW `disclaimer` page row in `pages` table (live MySQL + database.sql) — fixes previously dead footer link
  - NEW Version/Edition/OS variant selectors on `product.php` (ported parse_variant/get_variant_group/find_variant/render_variant_row to functions.php) — verified working on Office + Windows products with correct sibling links and blurred unavailable options
  - Footer: added About Us + Sitemap links
  - All pages curl-verified HTTP 200 via php -S; product page screenshot verified

## Changelog — Jun 11, 2026 (Product images, Chat rename, Checkout payment UI)
- **Antivirus product images (tested 100% iteration_6.json)**: replaced placeholder Unsplash image with real box-shot images (gosoftwarebuy.com/objects/uploads/) for 7 products (6 Bitdefender + 1 McAfee) — updated in live MongoDB, backend/seed_data.json, php-version/database.sql, AND live MySQL ucode_store
- **Chat rename**: widget/launcher/panel/header buttons now say just "Chat" (was "UCODE SOFTTECH AI") in React (Header.jsx, JivoChat.jsx) and PHP (header.php, footer.php); welcome message no longer brand-prefixed
- **Checkout payment UI (React, mirrors PHP)**: PayPal option now selectable (no "Coming Soon"); card option shows simple Card Number / Expiry / CVV inputs (decorative — real entry on Stripe hosted page); pay button switches to yellow PayPal style when PayPal selected; Stripe redirect verified for card flow

## Changelog — Jun 11, 2026 (Sales Dashboard)
- **Admin Sales Dashboard (React + PHP, tested 100% iteration_5.json)**:
  - Backend: `GET /api/admin/dashboard` in `routes/admin.py` — summary (total revenue, paid orders, avg order value, 7-day revenue), revenue_by_day (last 30 days, paid+delivered orders), best_sellers (top 8 by units via $unwind items aggregation)
  - Frontend: `components/admin/DashboardTab.jsx` — 4 stat cards, recharts BarChart (30 days, custom tooltip), best-sellers ranked list; Dashboard is now the FIRST and DEFAULT admin tab; error state if fetch fails
  - PHP mirror: `admin.php` dashboard tab (default) with SQL aggregations + CSS bar chart + best-sellers list

## Changelog — Jun 11, 2026 (Code Quality session)
- **React refactoring (Code Quality Report — COMPLETE, tested 100% iteration_4.json, zero React console warnings)**:
  - Hook deps: `CheckoutSuccess.jsx` useEffect now `[sessionId, clear]` (eslint-disable removed); `CartContext.js` mutators (addToCart/removeFromCart/updateQty/clear) wrapped in `useCallback`
  - Component extraction: `Admin.jsx` tabs → `components/admin/{ProductsTab,OrdersTab,LeadsTab,KeysTab,EmailsTab,TableBits}.jsx`; `JivoChat.jsx` → `components/chat/{chatApi.js,LeadForm.jsx}`; `ProductDetail.jsx` → `pages/ProductDetailInfo.jsx` (generic OptionSelector + info sections); `Hero.jsx` → `sections/HeroVisual.jsx`; `AboutUs.jsx` → `pages/AboutSections.jsx`; `Footer.jsx` → `components/FooterSections.jsx`
  - Array-index keys eliminated app-wide (stars → [1..5], content-derived keys in SupportPage/Testimonials/FAQ/LegalPage/Disclaimer/Account/Header/Checkout; chat messages keyed by stable id)
  - Empty catch blocks now log (`AuthContext`, `AuthCallback`, `CatalogContext`, `LeadForm`, `JivoChat`); unused imports/vars removed (only remaining lint note is vendored `use-toast.js`)
- **PHP version cleanup (/app/php-version)**: empty catch in `order-success.php` now logs; `checkout.php` order fetch uses prepared statement; FIXED subtotal display bug (showed total instead of subtotal); `email.php` prepares key statements once outside loop; `admin.php` products tab fixed invalid `<form>`-inside-`<tr>` HTML using HTML5 `form` attribute (prevents silent save failures); `ajax/chat.php` logs cURL failures. All `php -l` clean.
- Known cosmetic (not actionable): browser natively logs guest `/api/auth/me` 401 in console; request already caught in code.

## Changelog — Jun 11, 2026 (Mega menu products-by-year + Blurred variants — TESTED iteration_9.json + self-test)
- **ARCHITECTURE NOTE**: PHP app at /app/php-version is THE live application on port 3000 (supervisor runs start.sh → `php -S 0.0.0.0:3000 router.php`). React/FastAPI are DEPRECATED — do not modify them.
- **Mega menu rebuilt (header.php)**: "Microsoft Products" is now a full-width mega menu (li.position-static + .dropdown-menu.mega), 4 columns (OFFICE FOR PC / OFFICE FOR MAC / WINDOWS / APPS); each column has year sub-heading links (data-testid="menu-{category-slug}", e.g., menu-office-2024-pc → category page showing ONLY that year) with individual product links beneath (data-testid="mega-product-{slug}", 37 links, 0 broken). Antivirus dropdown lists all 6 Bitdefender + 1 McAfee products. Data lives in nav_microsoft()/nav_antivirus() in functions.php; rendered via render_mega_group(); product slugs resolved by product_slug_by_name() (cached DB lookup).
- **Blurred unavailable variants (product.php)**: Version/Edition/OS chip rows; active chip = btn-primary, available = clickable link to sibling product, unavailable = .variant-blur (blur+opacity+pointer-events:none). OS row always shows PC+Mac for office/word/excel/project/visio families (Mac blurred on PC-only products like Visio). Version resolution stays within current OS (no cross-OS jump).
- **BUG FIXED (root cause)**: header.php sets `$cur = current_currency()` which clobbered product.php's `$cur` variant array (header included before rows render) → all chips rendered as cross-OS links with no active state. Fix: renamed to `$cv` in product.php.
- **LESSON**: never issue two parallel search_replace edits to the SAME file — they race and one clobbers the other (happened on functions.php this session).
- Verified: edition blur on office-home-2024-mac (Professional Plus + Home and Student blurred), Visio Mac blurred, Windows 11 Pro edition chips, Word 2021 Mac→PC link. Footer shows UCODE SOFTTECH LLC + 101 NW 83rd St, Kansas City, MO 64118 (config.php constants). Cart, currency, dark mode regression passed.

## Changelog — Jun 11, 2026 (Sitewide elegance pass per user's design PDF — TESTED iteration_10.json, 11/11 pass)
- User uploaded dumy.pdf (15-page capture of the reference homepage) asking layout "for all the pages, more elegant". Homepage already had all reference sections in correct order — implemented visual elevation:
- **Typography**: Plus Jakarta Sans (Google Fonts, header.php), heading letter-spacing -.02em
- **style.css rewritten**: .eyebrow section labels, .bg-soft alternating sections (dark variant #0b1222), .page-head gradient band, card polish (1rem radius, hover lift + image zoom), button micro-interactions, separated rounded accordion items, hero radial glow, .reveal/.in scroll animations (prefers-reduced-motion respected)
- **render_page_head()** helper (functions.php) — elegant breadcrumb+title band applied to shop.php, category.php (keeps data-testid="category-title"), blog.php, cart.php
- **main.js**: IntersectionObserver staggered scroll-reveal on section columns + accordion items
- **Mobile fix**: 390px horizontal overflow killed — browse chip scroller needed min-width:0 (flex item), and g-5 rows → g-4 g-lg-5 (index hero, trusted partner, product.php detail row)

## Changelog — Jun 11, 2026 (Menu simplification + Volume Pricing band + dark theme & typography boost)
- **Mega menus simplified per user**: Microsoft Products dropdown now shows ONLY year/category links (Office 2024/2021/2019 PC+Mac, Windows 11/10, Project/Visio + "All ..." links); Antivirus shows just Bitdefender/McAfee/All. Individual product links REMOVED (render_mega_group/product_slug_by_name/nav_antivirus deleted from functions.php; nav_microsoft now maps yearLabel => categorySlug)
- **Volume Pricing promo band** (render_menu_promo() in functions.php, data-testid="menu-promo"): "Volume Pricing — Exclusive discounts on bulk licenses..." + Request a Quote btn + "Have a Question? Call Mon–Fri 9 AM–6 PM EST 1-888-632-9902 or chat with a sales expert" (chat link opens AI chat). Added under BOTH nav dropdowns + as card on Disclaimer page (page.php slug=disclaimer, data-testid="disclaimer-promo")
- **Dark theme overhaul**: deep navy palette via Bootstrap var overrides in [data-bs-theme=dark] (--bs-body-bg #0a101f, cards #101a31, borders #21304f), dark variants for topbar/trustbar/hero/page-head/accordion/forms/eyebrow
- **Bolder typography sitewide**: body weight 450, .fw-bold → 800, .fw-semibold → 650, buttons 650, product titles 700, accordion buttons 700
- **Stylish card outer layer**: default soft shadow on all cards, hover = 2px accent ring (--uc-ring) + lift; nested cards/accordion shadow-suppressed
- **Data fix**: disclaimer page contact phone corrected 1-888-660-3568 → 1-888-632-9902 (live DB + database.sql)

## Changelog — Jun 11, 2026 (Support content suite + guest account flow — TESTED iteration_11.json, 100% pass)
- **account.php rewritten**: guest "Verify Your Email" flow — email → 6-digit code (sent via email system; queued in email_outbox when RESEND key empty; 15-min expiry, session acct_verify/verified_email) → shows orders + LICENSE KEYS (dashed key boxes) + refund link. Logged-in view preserved (profile, Admin Panel btn). Testids: verify-email-card/input, send-code-btn, verify-code-input/btn, account-name, order-*, license-key-*
- **returns.php NEW**: Return & Refund Request — email → Find Orders → per-order Request Refund → refund_requests table (idempotent: badge replaces button). Footer "Returns & Refunds" → returns.php
- **contact.php NEW**: rich Contact Us (hero badges, 3 method cards, full form name/email/phone/order/subject-select/message → support_messages source=contact, Our Office = UCODE SOFTTECH LLC Kansas City, Business Hours Mon-Fri 9-6/Sat 10-4/Sun closed, 5-item FAQ accordion, CTA band). page.php 302-redirects slug=contact-us → contact.php (all old links work)
- **support.php NEW**: Support Center — search box filtering .support-topic cards, 3 contact cards, 5 pill tabs (Installation: before/after/best-practices + Windows & Mac 5-step guides; Troubleshooting; Error Codes table; Uninstall; FAQ from DB), message form → support_messages source=support
- **Page content refreshed** (live DB + database.sql appended UPDATEs): help-center, installation-guide, activation-help — full user-provided copy rebranded to support@ucodesofttechus.com / 1-888-632-9902, each with "Questions about this policy?" card + Back to Home
- **DB**: new tables support_messages, refund_requests (live + database.sql). save_support_message() helper in functions.php
- **test_credentials.md rewritten** for PHP app (was stale React/FastAPI info)
- NOTE: admin panel does NOT yet display support_messages/refund_requests (backlog)

## Changelog — Jun 11, 2026 (Logo redesign + shop filters + dark v2 — TESTED iteration_12.json, 100% pass)
- **New brand logo**: render_logo() SVG helper in functions.php (gradient rounded square, U monogram, cursor-dot accent) used in main navbar, footer, checkout slim header; wordmark .brand-text + .brand-grad gradient text "UCODE SOFTTECH"
- **Shop page rewritten**: vertical sticky filter sidebar — Category (office/windows/apps/antivirus), Version/Year (2024/2021/2019/Win11/Win10), OS (Windows/Mac) as auto-submit checkboxes combining simultaneously (GET arrays cat[]/ver[]/os[]); grid/list view toggle (view-grid-btn/view-list-btn, render_product_row for list); result count + Clear all; mobile collapse toggle. OLD testids filter-All/Windows/Mac removed
- **Buttons functional sweep**: all page.php?slug=contact-us links → contact.php (index, header promo, product, about, order-success, sitemap, functions)
- **Dark mode v2**: deep navy #070c19, gradient card surfaces, glassy blurred sticky navbar, .text-primary → #7aa5ff override, link color overrides
- **Gradient buttons**: .btn-primary/.btn-outline-primary:hover use --uc-grad (blue→indigo); chat bubble + logo-mark gradient
- **Colorful content** (DB pages + database.sql appended): help-center (quick-link icon cards, warning/danger alerts, policy table), installation-guide (system-req cards, numbered badges, 3 colored alerts), activation-help (error alerts danger/warning/info, Activation Limits badge table), faqs (license table, company info card), returns-refunds (Refund Eligibility Yes/No badge table, processing times table, CTA → returns.php). Company transparency card (legal name/address/phone/hours) on help-center + faqs

## Changelog — Jun 11, 2026 (About/Why-Choose/Reviews/Blog content overhaul — TESTED iteration_13.json, 100% pass)
- **about-us.php rewritten**: logo hero, trusted-partner narrative, 6-item icon trust checklist, stats (50,000+/100%/15–30min/4.9-5), "Why Choose Perpetual Licenses?" 6 feature cards, CTA band with chips + Browse/Compare buttons
- **why-choose-us page** (DB): professional rewrite — pricing table, support channels table, icon alerts, links to reviews.php/returns.php
- **reviews.php NEW**: rating summary panel (4.6 overall, 5,523 total — STATIC display values; distribution bars 77/14/5/1/4%; rating categories table), 50 original seeded reviews in new `reviews` table, pagination 10/page (?p=, clamped). Footer "Customer Reviews" + trustbar 4.6/5 now link here
- **Blog expanded to 50 posts** (blog_posts reseeded ids 1-50, original content, category CTA buttons): blog.php rewritten with search (?q=), pagination (10/page), newest-first via STR_TO_DATE
- All seeds persisted to database.sql (reviews CREATE/INSERTs, blog INSERTs, page UPDATE)

## Changelog — Jun 11, 2026 (Affiliate Program page — self-tested via curl + screenshots)
- **affiliate.php NEW**: CJ Affiliate partner page written in professional original copy, rebranded UCODE SOFTTECH — hero (logo + gradient title + Join via CJ / Learn More), stats row (45%+ discount, {live product count}+ products, 30-day cookie, 24/7 support), 6 "Why Partner" feature cards, 3-step How It Works, Top Products to Promote grid (6 real DB products with prices/discount badges + static sold counts), 6-item FAQ accordion, CTA band (Join via CJ → cj.com, Contact Affiliate Team → contact.php)
- page.php now 302-redirects slug=affiliate-program → affiliate.php; footer Company link updated

## Changelog — Jun 11, 2026 (Legal pages + payment images + responsive + Write a Review — self-tested via screenshots e2e)
- **8 legal pages re-seeded** (ran /tmp/legal_pages.php, persisted to database.sql): privacy-policy, terms-of-service, refund-policy, shipping-delivery, payment-policy, cookie-policy, do-not-sell, disclaimer — now with colored tables, badge chips, icon headings, alert callouts
- **Payment/trust badge IMAGES** in footer + checkout: real SVG card icons at assets/images/payments/ (visa/mastercard/amex/discover/paypal from MIT icon set; googlepay/applepay custom SVGs) rendered via render_payment_icons() helper (functions.php); custom badges at assets/images/badges/ (microsoft-verified.svg, pci-compliant.svg); footer band realigned 3-col (Secure Payments+icons | ★4.6/5 reviews→reviews.php | badges+Authorized Reseller), checkout.php card icons swapped to images
- **Disclaimer menu links** added in BOTH header dropdowns: Microsoft Products mega (menu-disclaimer-ms) + Antivirus (menu-disclaimer-av) → page.php?slug=disclaimer
- **Affiliates nav link** added to main navbar (nav-affiliates → affiliate.php)
- **Mobile fixed contact strip** (mobile-contact-strip, d-lg-none, inside sticky navbar so it stays still on scroll): "Have a Question? / Call Mon–Fri 9 AM–6 PM EST" + Call 1-888-632-9902 (green) + Chat (opens AI chat) — verified pinned at top while scrolling on 390px
- **Responsive pass** (style.css): mobile hero scaling (h1/stats/orbit chips), legal-page tables horizontally scrollable on xs, footer columns centered on <768px, mega/antivirus menus full-width bordered in collapsed nav, chat panel/bubble sized for small screens, pay icons scale down
- **Write a Review (verified buyers only)** on reviews.php: button (write-review-btn) → login redirect if signed out; Bootstrap modal with hover star-rating input (star-input CSS), product select limited to user's PAID order_items, optional location, min-10-char textarea; POST handler verifies current_user + paid orders (user_id OR email match), inserts verified=1 review, PRG redirect ?submitted=1 with success alert; non-buyers see "Only verified buyers" modal state. E2E tested: login as verifiedbuyer@test.com → submit → review count 50→51, review visible

## Changelog — Jun 11, 2026 (Hero rotator + UI polish — self-tested via screenshots)
- **Sign In removed from header** (account-link button deleted; account.php still reachable via footer My Account)
- **Ask AI teaser compact + centered**: .ask-ai-pill inline pill (small logo-mark, two-line text, Try it btn) centered in container
- **Hero image rotator**: 5 AI-GENERATED images (gpt-image-1 via Emergent LLM key, one-off script /tmp/gen_hero_images.py) at assets/images/hero/hero-1..5.jpg (700px JPEG ~30-55KB) — document/spreadsheet/presentation/OS/security themes; one image at a time, crossfade every 10s, clickable dots with 10s gradient progress animation (hero-dot-N testids); JS rotator appended to main.js
- **OS icons**: custom SVGs assets/images/os/windows.svg + macos.svg (.os-icon/.os-icon-lg) used in: hero orbit chips, product.php platform badge (.os-badge), variant OS pills (render_variant_row prepends icon when testPrefix==='os'), shop OS filter labels, support.php install/uninstall headings
- **Shop toolbar colorful**: .shop-toolbar gradient band, gradient "Sort" pill label, .sort-select rounded blue-bordered dropdown

## Changelog — Jun 11, 2026 (Dark theme v3 + product-image hero — self-tested via screenshots)
- **Dark theme v3 "indigo slate"**: brighter, high-contrast palette — body #151f38, cards #202d50→#1a2543 gradient, text #e8eef9, secondary #b6c5e0 (forced via .text-secondary override), borders rgba(148,178,235,.22); dropdowns/accordions/forms/tables/badge.text-bg-light all overridden; topbar/trustbar/page-head/hero/footer lightened; page-content h2 borders + thead visible in dark; ask-ai-pill + shop-toolbar dark variants. Every word verified visible (legal tables, alerts, footer checked)
- **Hero rotator now uses PRODUCT images** (replaced AI person photos): 5 real catalog products (Office 2024 Pro Plus, Office Home 2024 PC, Windows 11 Pro, Project 2024, McAfee Premium) in white circular frame (.product-slide, object-fit contain), each slide links to its product page; 10s rotation + dots unchanged. AI-generated hero-1..5.jpg remain on disk but unused

## Changelog — Jun 11, 2026 (Category toolbar table-format + elegant chat — self-tested e2e via screenshots)
- **category.php toolbar restructured** (reference gosoftwarebuy.com): .shop-toolbar 3-column band — "{Title} Products" + "N products available" | Platform segmented control (.platform-seg/.platform-pill, All/Windows/Mac with tiny OS icons, active = gradient pill, white-inverted icon) | gradient Sort pill + .sort-select. Testids: category-toolbar, category-count, platform-all/windows/mac (lowercase), category-sort. Mac filter click verified
- **Chat widget v2 (elegant)**: header avatar circle + pulsing online dot ("Max · AI Assistant / Online — replies instantly"), pop-in animation, styled bubbles (gradient user, bordered card bot), animated 3-dot typing indicator, 4 quick-suggestion chips (chat-chip-mac/deal/activate/license → quickAsk() in main.js removes chips + auto-sends), tinted chat body, .chat-talk-band, pill input + circular gradient send button. E2E verified: chip click → typing dots → real AI reply

## Changelog — Jun 11, 2026 (Category platform filter cross-family fix — tested via curl + screenshots)
- **category.php platform filter now widens to year family**: platform-specific slugs (e.g. office-2024-mac) compute $familySlug via regex strip of (-for)?-(macs?|pc|windows); implied platform from suffix is the default pill (Mac category → Mac active); clicking Windows shows that YEAR's Windows products (office-2024-pc), All shows pc+mac of that year. Title/breadcrumb adapt dynamically ("Office 2024 for Windows Products" / "Office 2024 Products"). Family not in category_children map → builds [family-pc, family-mac]
- Verified: office-2024-mac default=2(Mac), Windows=4, All=6; office-mac Windows=12 (all years PC); regressions OK on office(20)/windows-11(2)/bitdefender(6)

## Changelog — Jun 11, 2026 (Added-to-cart state + cart discounts + new remove btn — tested e2e via screenshots)
- **Added-to-cart state**: header exposes window.CART_SLUGS; main.js markAdded() turns .add-to-cart-btn green gradient "✓ Added" (btn-lg → "Added to Cart — View"), persists across reloads, clicking an added button goes to cart.php instead of re-adding
- **Cart discounts**: each discounted item shows -% badge, strikethrough unit original, "You save $X" line (cart-discount-{slug} testid), and strikethrough original total above the line total
- **New remove button**: .cart-remove-btn circular soft-red with bi-trash3-fill, gradient fill + scale/rotate on hover, dark-mode variant

## Changelog — Jun 11, 2026 (Coupon % fix + checkout restyle + phone 3-box + pay icons — tested via curl + screenshots)
- **Coupon system data-driven**: coupons() map in functions.php (UCODE90=20%, WELCOME10=10%, SAVE15=15%, OFFICE25=25%); ajax/cart.php validates against map, stores coupon_pct in session, returns pct; checkout.php computes discount from the coupon's own % and displays "CODE — N% off"; JS toast shows %. Verified all three percentages apply to discount + total. NOTE: a search_replace on the calc line silently failed first time — re-applied and verified via grep
- **Checkout flow stepper**: .checkout-steps with icon dots (cart done green / credit-card active gradient pulsing / check pending) + gradient connector lines
- **Summary & assist cards**: .summary-card gradient top bar + receipt icon, .summary-total highlighted gradient total box, .assist-card dashed-gradient Need Assistance box with phone/hours/email icons + "Chat with us" button (opens AI chat)
- **Phone 3-box**: flag box (#phone-flag) | code select (+1…+64, .phone-code) | number input; syncPhoneFlag() in main.js updates flag on change (verified 🇬🇧 for +44); PHP preselects flag on POST redisplay
- **Apple Pay + Google Pay icons removed** from render_payment_icons() (footer site-wide); SVG files remain on disk unused

## Changelog — Jun 11, 2026 (Receipt-style checkout banners + done page — tested via screenshots)
- **checkout.php fully restructured** (Stripe-receipt reference image): dark .checkout-canvas backdrop, single centered column (max 800px) of stacked .co-banner cards — 1) Order Summary receipt banner (brand mark + Secure Checkout pill, "Pay UCODE SOFTTECH LLC", big .receipt-amount total, items w/ qty controls, coupon, totals) 2) Contact Information 3) Billing Address (phone 3-box) 4) Payment "short & sweet": two side-by-side pay tiles (Card w/ brand icons | PayPal), fake card-number fields REMOVED (Stripe hosted page handles entry), pay buttons + trust lines. Stepper restyled light-on-dark. NOTE: file had leftover duplicate trailing markup from a previous edit — rebuilt HTML section via head -87 + new body splice
- **order-success.php done page**: animated blue gradient .success-tick circle, "Thanks for purchasing with us, {name}!", "For your product key, please check your email inbox or spam folder" (order-success-msg), receipt card, primary "Return to Home Page" button (return-home-btn → index.php); installation guide & contact cards kept below
- PayPal tile toggle verified; checkout still posts same field names/testids

## Changelog — Jun 11, 2026 (Dark-mode flicker fix + stylish checkout columns — tested via screenshots)
- **Dark-mode flicker FIXED**: root cause = theme applied by main.js at end of body → light flash on every navigation. Fix: inline script in header.php <head> (before CSS) sets data-bs-theme from localStorage immediately. Verified theme="dark" at commit stage on reload + cross-page nav
- **Checkout columns v2**: .co-head numbered gradient badges (1 Contact / 2 Billing / 3 Payment) with subtitles + watermark icons + dashed dividers; .co-banner inputs restyled — uppercase micro-labels, soft tertiary-bg fields, hover border, focus ring, dark-mode field variants (#18223e)

## Changelog — Jun 11, 2026 (Google indexing/SEO + mobile cart — tested via curl + screenshots)
- **SEO/GSC stack**: robots.txt (allow all, disallow cart/checkout/login/account/admin/ajax + Sitemap line); dynamic sitemap-xml.php served at /sitemap.xml via router (134 URLs: core pages, 18 categories, all products, blog posts by id, content pages); router.php now returns REAL 404s for unknown URLs via new 404.php (previously fell through to homepage = duplicate-content hazard)
- **header.php SEO head**: meta description ($pageDescription w/ default), robots index/noindex (auto-noindex on private pages by script name), canonical (SITE_URL + script + slug; blog-post sets own with id), Open Graph + Twitter cards, JSON-LD Organization+WebSite sitewide + page $jsonLd hook; GOOGLE_SITE_VERIFICATION define in config.php (empty — user must paste GSC code)
- **SITE_URL define** in config.php pins public domain for canonicals/sitemap (proxy rewrites Host header → was leaking internal cluster hostname)
- **Page descriptions** added: index, shop, category (dynamic), product (price + was-price), blog, blog-post (excerpt, article OG), page.php (excerpt); product.php outputs Product schema (offer USD price, InStock, aggregateRating); unknown blog/page/product now 404 + noindex
- **Mobile cart button**: always-visible cart pill next to hamburger (cart-button-mobile testid) with .cart-count-badge; updateCartBadge() adds .cart-bump bounce animation on count change. Verified badge=1 after mobile add
- NOTE: preview domain robots.txt intercepted by platform edge; on user's own production domain the app's robots.txt serves correctly

## Changelog — Jun 11, 2026 (Product keyword SEO + image alt text — tested via curl + screenshot)
- **product_img_alt() helper** (functions.php): descriptive keyword-rich alt — "{name} — genuine lifetime license key for {platform}, instant digital delivery, N% off | UCODE SOFTTECH" — applied to ALL product images: shop grid cards, list-view rows, product page main image (+title attrs), homepage hero slides, "Picked for you" row, cart items, checkout summary items (37/37 verified on shop)
- **product_keywords() helper**: per-product exact/phrase/broad keyword variations (exact name; buy/product key/lifetime license/license key/instant delivery/no subscription/digital download phrases; base-name broad terms cheap/genuine/discount) → meta keywords on product pages via $pageKeywords hook in header.php; category.php gets category-level keyword set
- Deliberately used DESCRIPTIVE alt text (not raw keyword stuffing) per Google image SEO + Merchant Center guidelines

## Changelog — Jun 11, 2026 (Card details drop-down + pod recovery — tested e2e via screenshots)
- **Card details form on checkout**: #card-form drop-down under the Card tile (shows when Card selected, hides for PayPal via existing selectPayMethod) — Card Number / Expiry Date / CVV with live formatting in main.js (digit groups of 4, auto MM/YY slash, numeric CVV, masked) + reveal animation. PCI-SAFE: inputs have NO name attributes so card data is never posted to our server; note clarifies the charge is confirmed on Stripe's secure page
- **POD REBUILD RECOVERY**: container restarted fresh — PHP + MariaDB binaries were gone. Reinstalled (php-cli/mysql/curl/mbstring/xml + mariadb-server/client), start.sh self-healed (started DB, re-seeded from database.sql: 37 products/50 reviews/18 pages/50 blogs). Users table NOT in seed → restored admin@ucodesofttechus.com (Admin@UC2026!) + verifiedbuyer@test.com (Buyer@2026!) with paid order UC-TEST-9001. NOTE FOR FUTURE: after any pod rebuild run `apt-get install -y php-cli php-mysql php-curl php-mbstring php-xml mariadb-server mariadb-client` then restart frontend, and re-create the two user accounts

## Changelog — Jun 11, 2026 (Card brand detect + Google Merchant feed — tested via curl + screenshots)
- **Live card brand detection** on checkout card form: detectCardBrand() in main.js (Visa ^4, MC 51-55/22-27, Amex 34/37, Discover 6011/65/644-649); brand icons in #card-brands input-group append light up (.active scale+glow) while others dim (.dimmed grayscale). All 4 brands verified
- **Google Merchant Center feed**: merchant-feed.php served at /merchant-feed.xml via router — RSS 2.0 + g: namespace, 37 products with g:id/title/description/link/image_link/availability/price (regular) + g:sale_price (discounted)/brand (Microsoft|Bitdefender|McAfee auto)/condition/identifier_exists no/google_product_category. Submit URL in GMC → Products → Feeds
- NOTE: product g:image_link still points to gosoftwarebuy.com-hosted images — GMC may eventually require self-hosted images

## Changelog — Jun 11, 2026 (Fivecodelab rebrand finale: new hero + distinct per-page product layouts + full compliance — tested via testing_agent iteration_14: 100% functional pass)
- **NEW HERO (index.php)**: orbit composition fully replaced by .hero-showcase — Unsplash workspace laptop photo in rounded frame + gradient overlay, floating .hero-apps-pill (Word/Excel/PPT/Windows icons), .hero-delivery-pill ("Keys in 15–30 min"), .hero-rating-chip (4.6/5 · 5,519+ reviews), and a glass-morphism .hero-product-glass card holding the 5 rotating product slides (10s rotator + dots in main.js unchanged, works with new markup)
- **DISTINCT PRODUCT LAYOUTS PER PAGE** (user: "align products in completely different manner on each page"):
  - Home Best Sellers = SPOTLIGHT: 1 large featured card (.spotlight-card, big framed image + blurb + price + Save% + Add/View buttons) + 3 stacked .side-product-row compact rows
  - Home Picked-for-you = HORIZONTAL SCROLL STRIP: 8 fixed-width .strip-card tickets in .scroll-strip (overflow-auto, scroll-snap)
  - Shop = WIDE HORIZONTAL BANNER ROWS (now DEFAULT view, $view defaults 'list'): rewritten render_product_row — platform os-badge, Save% badge, feature bullets, big price block, Add to Cart + Details; grid toggle still available
  - Category = COMPACT PRICE-LIST ROWS: single card (category-list testid) of .cat-row rows — thumb, name, stars, platform, -% badge, price, round add button
- **Google Ads compliance COMPLETE**: scrubbed remaining "100% Genuine/genuine" from header trust bar, index (4 spots), product, about-us, affiliate, category subtitle, AND live DB (faqs + pages tables via SQL REPLACE); unified ALL guarantees to 30-day (was mixed 30/180) across index/about-us/contact/affiliate; unified rating claims to 4.6/5 (was mixed 4.9/4.6); CTA band gradient blue→emerald; biz-card shadow indigo→emerald
- **database.sql seed fully rebranded**: 55 UCODE/ucodesofttechus leftovers → Fivecodelab Software / services@fivecodelabsoftware.com / admin@fivecodelabsoftware.com; 100%-claims + 180-day scrubbed (fresh deploys now seed clean)
- **Transactional emails rebranded (P2 done)**: includes/email.php order email + account.php verification email — "Fivecodelab Software" header (#0c1f19 bg, #34d399 accent), key-box/link colors blue→emerald
- **test_credentials.md updated**: admin is admin@fivecodelabsoftware.com / Admin@UC2026! (verified in DB)
- Added data-testid="cart-count" / "cart-count-mobile" to header cart badges (testing agent recommendation)
- Coupon code UCODE90 intentionally kept functional (legacy, not displayed anywhere)

## Changelog — Jun 11, 2026 (ZED WEBTECH LLC rebrand + Elessi-minimal theme — tested via screenshots + add-to-cart e2e)
- **Company**: ZED WEBTECH LLC (SITE_LEGAL) / "Zed Webtech" (SITE_BRAND), 1615 Miller Rd, Hodges, SC 29653, Paynote@zedwebtech.com, admin@zedwebtech.com (users table updated; password unchanged). Order prefix UC→ZW. Promoted coupon ZED20 (FIVE20/UCODE90 kept working as legacy)
- **Theme (Elessi reference)**: full palette swap emerald→coral-red/ink — primary #f43f5e, hover #e11d48, gradient #f43f5e→#ff7849, flat black topbar/trustbar (#141414), soft bg #f8f7f7, rose-tint page heads (#fdf1f2); dark mode greens→charcoal (#16161a base) with rose accents; font Plus Jakarta Sans→Poppins; cards flattened (.75rem radius); logo = new "Z" monogram SVG (rose-orange gradient)
- **render_product_card REDESIGNED (Elessi-minimal)**: centered stars/title/price, full-width pill .btn-elessi "Add to Cart" (outline→red gradient hover), app icon chips removed
- **Home Best Sellers**: spotlight+side-list REPLACED with centered-heading minimal 4-col grid (bestseller-grid testid) — layouts remain distinct per page (home grid / shop wide rows / category compact list)
- **New hero image**: photo-1496181133206-80ce9b88a853 (bright minimal laptop workspace); CTA band → black gradient; emails (order + verification) rebranded Zed Webtech w/ rose accents
- **DB + seed**: pages/blog_posts/faqs/users scrubbed of Fivecodelab/old email/old address (live SQL + database.sql + robots.txt); compliance grep across 8 rendered pages = 0 hits (no Fivecodelab/100% genuine/180-day/Moreno Valley)
- **Verified**: add-to-cart from new card → badge=1 → cart.php correct totals; footer shows new address + Google Maps button + ZED WEBTECH LLC legal line; dark mode cohesive
- Hidden hero slides made non-clickable (pointer-events/visibility) + hero photo links to currently displayed product (#hero-photo-link synced by rotator) — fixed "random product" bug

## Changelog — Jun 11, 2026 (Matrixuiux Software rebrand: light sky-aqua theme + rotated layouts — verified via screenshots + add-to-cart e2e)
- **Company**: Matrixuiux Software, 5 Blue Springs Ct, Columbia, SC 29229, USA, support@matrixuiuxsoftware.com, admin@matrixuiuxsoftware.com (users table updated). Order prefix MX, promoted coupon MATRIX20 (ZED20/FIVE20/UCODE90 legacy kept)
- **Theme**: light sky/aqua palette (Elessi minimal kept) — primary #38bdf8, text/hover #0284c7, deep #0369a1, gradient #38bdf8→#22d3ee, light badges #e0f2fe, soft bg #f7f9fa, sky-tint page heads #eff8fd; dark mode charcoal got blue tints; topbar/footer stay ink #141414; Poppins kept; logo = "M" monogram (sky gradient)
- **LAYOUT ROTATION** ("completely different on each page"): Shop default = 3-col GRID w/ sidebar (was rows; list toggle kept) · Category = WIDE BANNER ROWS via shared render_product_row (was compact list) · Home = centered minimal grid + scroll strip (unchanged) — render_product_row MOVED from shop.php to functions.php (shared); unused .cat-row/.cat-thumb/.cat-add CSS deleted
- **New hero image**: photo-1499951360447-b19be8fe80f5 (bright white-desk MacBook workspace)
- **DB + seed + robots.txt**: all Zed Webtech/zedwebtech.com/old address strings replaced (pages/blog/faqs live SQL + database.sql); compliance grep across rendered pages = 0 hits
- **Verified**: add-to-cart from category rows → badge=1; footer shows new address + email + Google Maps button; all 4 page layouts screenshot-verified

## Notes
- Brand is "Matrixuiux Software" (5 Blue Springs Ct, Columbia, SC 29229, USA; support@matrixuiuxsoftware.com; light sky-aqua minimal theme, Poppins) — never revert to Zed Webtech/Fivecodelab/UCODE/Go Software
- Google Ads language policy: NO "#1", "cheap", "100% …", no mixed guarantee/rating claims (30-day + 4.6/5 everywhere). Compliance content also lives in MySQL (faqs/pages) — audit SQL, not just code
- Preview URL: use REACT_APP_BACKEND_URL from /app/frontend/.env
- Credentials in /app/memory/test_credentials.md (admin@fivecodelabsoftware.com verified working Jun 11, 2026)
- LIVE APP = /app/php-version (PHP+MySQL ucode_store DB). React/FastAPI deprecated per explicit user instruction.
- After any pod rebuild: `apt-get install -y php-cli php-mysql php-curl php-mbstring php-xml mariadb-server mariadb-client`, restart frontend, re-create the two user accounts (seed now creates Fivecodelab-branded content)

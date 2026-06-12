// Rich content for the 7 support pages, rendered by pages/SupportPage.jsx
import {
  Package, KeyRound, CreditCard, LifeBuoy, Download, Zap, ShieldCheck, RotateCcw,
  MessageCircle, Monitor, Laptop,
  BadgeDollarSign, Headphones, Award, Users, TrendingUp, BarChart3, Megaphone,
} from "lucide-react";
import { COMPANY } from "./company";

export const supportPages = {
  /* ================= MY ACCOUNT ================= */
  "my-account": {
    title: "My Account",
    subtitle: "Everything you need to manage your orders, license keys, and billing in one place.",
    heroChips: ["Order History", "License Keys", "Billing", "Support"],
    sections: [
      {
        type: "cards",
        title: "What you can manage",
        cols: 4,
        items: [
          { icon: Package, title: "Order History", text: "View every purchase, download invoices, and track the status of recent orders." },
          { icon: KeyRound, title: "License Keys", text: "Access all of your product keys anytime — they never expire and stay safely stored." },
          { icon: CreditCard, title: "Billing Details", text: "Update your payment methods and billing address securely whenever needed." },
          { icon: LifeBuoy, title: "Support Tickets", text: "Open a ticket, follow replies, and get help from our specialists in one thread." },
        ],
      },
      {
        type: "steps",
        title: "Lost your license key? Recover it in minutes",
        groups: [
          { heading: "Check your inbox", steps: ["Search your email for your order confirmation — your key and download link are inside.", "Don't forget to look in the Spam or Promotions folders."] },
          { heading: "Locate your order number", steps: ["Your order number starts with a # and appears in the subject line of your confirmation email.", "It helps us find your purchase instantly."] },
          { heading: "Contact our team", steps: [`Email ${COMPANY.email} or call ${COMPANY.phone} with your order number.`, "We'll verify your purchase and resend your key — usually within the hour."] },
        ],
      },
      {
        type: "accordion",
        title: "Account questions",
        items: [
          { q: "How do I find my order number?", a: "Your order number is included in your purchase confirmation email. If you can't find it, contact support with the email address you used at checkout and we'll look it up for you." },
          { q: "Can I move my license to a new computer?", a: "Yes. Deactivate or uninstall the software on the old device first, then install and activate on the new one using the same key. If activation fails, our team can reset it for you." },
          { q: "How do I update my billing information?", a: "Billing details are entered securely at checkout for each purchase — we never store full card numbers. For invoice corrections, just reach out to support." },
        ],
      },
    ],
  },

  /* ================= HELP CENTER ================= */
  "help-center": {
    title: "Help Center",
    subtitle: "Find answers fast — guides, troubleshooting, and direct support, all in one hub.",
    heroChips: ["Guides", "Troubleshooting", "FAQs", "Live Support"],
    sections: [
      {
        type: "cards",
        title: "Popular resources",
        cols: 4,
        items: [
          { icon: Download, title: "Installation Guide", text: "Step-by-step instructions to install Office and Windows on PC or Mac.", to: "/page/installation-guide" },
          { icon: KeyRound, title: "Activation Help", text: "Fix common activation errors and get your key working in minutes.", to: "/page/activation-help" },
          { icon: RotateCcw, title: "Returns & Refunds", text: "Our 30-day money-back guarantee, explained simply.", to: "/page/returns-refunds" },
          { icon: MessageCircle, title: "Contact Us", text: "Reach a real specialist by phone, email, or live chat.", to: "/page/contact-us" },
        ],
      },
      {
        type: "accordion",
        title: "Orders & Delivery",
        items: [
          { q: "How will I receive my product?", a: "Everything is delivered digitally. Your license key and official download instructions arrive by email within 15–30 minutes of purchase — no shipping, no waiting." },
          { q: "I haven't received my order yet. What should I do?", a: "First check your spam/junk folder and confirm the email address used at checkout. Most orders arrive within 30 minutes; if it's been longer, contact our support team and we'll resend it right away." },
          { q: "Do you ship physical copies?", a: "No — we're 100% digital. That's how we deliver instantly and keep prices low. You download the software directly from the official vendor." },
        ],
      },
      {
        type: "accordion",
        title: "Installation & Activation",
        items: [
          { q: "How do I install my software?", a: "Our Installation Guide walks you through every step for Office and Windows, on both PC and Mac. If you'd rather not do it yourself, our team can guide you over the phone for free." },
          { q: "My license key isn't working. What now?", a: "Make sure the key is typed exactly as sent (no extra spaces) and that you've downloaded the matching product version. Still stuck? Visit Activation Help or contact support — we resolve nearly all key issues same-day." },
        ],
      },
      {
        type: "accordion",
        title: "Payments & Refunds",
        items: [
          { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, Discover, and PayPal. All payments are processed through SSL-encrypted, PCI-compliant checkout." },
          { q: "Can I get a refund?", a: "Yes — every purchase is covered by our 30-day money-back guarantee. See the Returns & Refunds page for full details." },
        ],
      },
    ],
  },

  /* ================= INSTALLATION GUIDE ================= */
  "installation-guide": {
    title: "Installation Guide",
    subtitle: "Clear, step-by-step instructions to get your software installed and running — usually in under 30 minutes.",
    heroChips: ["Office for PC & Mac", "Windows 10/11", "Project & Visio"],
    sections: [
      {
        type: "listCards",
        title: "Before you begin — check the requirements",
        items: [
          { icon: Monitor, title: "For Microsoft Office", list: ["Windows 10 or later / macOS 11 or later", "4 GB RAM (8 GB recommended)", "4 GB of free disk space", "Internet connection for activation"] },
          { icon: Laptop, title: "For Windows OS", list: ["1 GHz or faster processor", "4 GB RAM (Windows 11 needs 4 GB+)", "64 GB of available storage", "DirectX 12 compatible graphics"] },
        ],
      },
      {
        type: "steps",
        title: "Installing Microsoft Office",
        groups: [
          { heading: "Step 1 — Redeem your key", steps: ["Go to setup.office.com and sign in with your Microsoft account (create one free if needed).", "Enter your 25-character product key from your delivery email.", "Click Install Office to start the download."] },
          { heading: "Step 2 — Run the installer", steps: ["Open the downloaded file and approve the User Account Control prompt.", "Let the installer finish — typically 15–30 minutes depending on your connection."] },
          { heading: "Step 3 — Activate", steps: ["Open any Office app such as Word or Excel.", "Sign in with the same Microsoft account — your license activates automatically."] },
        ],
      },
      {
        type: "steps",
        title: "Installing Windows",
        groups: [
          { heading: "Step 1 — Create installation media", steps: ["Download the official Windows Media Creation Tool from Microsoft.", "Choose 'Create installation media' and select a USB drive (8 GB minimum)."] },
          { heading: "Step 2 — Install Windows", steps: ["Restart your computer and boot from the USB drive (F12, F2, or Del during startup).", "Follow the setup wizard and enter your product key when asked."] },
          { heading: "Step 3 — Verify activation", steps: ["Open Settings → System → Activation.", "Confirm Windows shows as activated with a digital license."] },
        ],
      },
      {
        type: "accordion",
        title: "Troubleshooting common installation issues",
        items: [
          { q: '"Product key already used" error', a: "This usually means a typo or a previous activation attempt. Re-enter the key carefully, and if the error persists, contact us with your order number — we'll verify the key and fix it quickly." },
          { q: "Installation is stuck or frozen", a: "Check your internet connection, temporarily pause your antivirus, and restart the installer. Office downloads several gigabytes, so slower connections may simply need more time." },
          { q: "Activation failed after install", a: "Confirm the key was typed exactly as delivered and that you're online. If it still fails, head to our Activation Help page or call us — free activation assistance is included with every purchase." },
        ],
      },
    ],
  },

  /* ================= ACTIVATION HELP ================= */
  "activation-help": {
    title: "Activation Help",
    subtitle: "Trouble activating? These guides resolve the vast majority of activation issues in minutes — and our team handles the rest, free.",
    heroChips: ["Office Activation", "Windows Activation", "Error Fixes"],
    sections: [
      {
        type: "steps",
        title: "Activating Microsoft Office",
        groups: [
          { heading: "Online activation (recommended)", steps: ["Open any Office app (Word, Excel, PowerPoint).", "Sign in with your Microsoft account.", "Go to File → Account → Activate Product.", "Enter your 25-character product key and click Activate."] },
          { heading: "Phone activation (if online fails)", steps: ["Go to File → Account → Activate Product.", "Choose 'I want to activate by telephone'.", "Call the number shown and follow the automated steps."] },
        ],
      },
      {
        type: "steps",
        title: "Activating Windows",
        groups: [
          { heading: "Online activation", steps: ["Press Windows key + I to open Settings.", "Go to System → Activation and click 'Change product key'.", "Enter your 25-character key and click Next."] },
          { heading: "Phone activation", steps: ["Open Command Prompt as Administrator.", "Type slui 4 and press Enter.", "Select your country, call the number provided, and follow the prompts."] },
        ],
      },
      {
        type: "accordion",
        title: "Common activation errors — and how to fix them",
        items: [
          { q: '"Product key has already been used"', a: "Often caused by a typo or an interrupted earlier attempt. Re-enter the key carefully. If it still fails, send us your order number — we'll verify the key with the vendor and get you activated, or replace it." },
          { q: '"Product key is not valid"', a: "Check for look-alike characters (0 vs O, 1 vs I) and remove any extra spaces. Also confirm you installed the exact product edition your key belongs to — e.g., a Professional Plus key won't activate Home & Business." },
          { q: '"Unable to reach activation servers"', a: "Check your internet connection, disable any VPN, and temporarily pause firewall/antivirus software. Vendor servers are occasionally busy — waiting 30 minutes and retrying usually works." },
        ],
      },
      {
        type: "table",
        title: "Activation limits by product",
        headers: ["Product", "Activation Limit"],
        rows: [
          ["Office Home / Home & Student", "1 PC or Mac"],
          ["Office Home & Business", "1 PC or Mac"],
          ["Office Professional Plus", "1 PC"],
          ["Windows 10 / 11", "1 PC"],
          ["Project / Visio Professional", "1 PC"],
        ],
      },
      {
        type: "check",
        variant: "info",
        title: "Contacting support? Please have ready:",
        items: ["Your order number", "The first 5 characters of your product key", "The exact error message you received"],
      },
    ],
  },

  /* ================= FAQS ================= */
  faqs: {
    title: "Frequently Asked Questions",
    subtitle: "Quick answers about our licenses, delivery, payments, and support.",
    heroChips: ["Licensing", "Delivery", "Payments", "Support"],
    sections: [
      {
        type: "accordion",
        title: "Licensing & Products",
        items: [
          { q: "Are these genuine licenses?", a: "Yes — every license we sell is 100% genuine, sourced from authorized distributors and verified before delivery. Your key activates directly with the official vendor." },
          { q: "What is a lifetime (perpetual) license?", a: "You pay once and own the software forever. No monthly fees, no annual renewals — the license remains valid for the lifetime of your device." },
          { q: "Can I install on more than one computer?", a: "Each license covers one device. Need multiple seats? Contact our sales team through the Request a Quote page for volume pricing." },
          { q: "What's the difference between editions?", a: "Home & Student covers Word, Excel and PowerPoint. Home & Business adds Outlook with commercial use rights. Professional Plus includes the full suite with Access and Publisher." },
        ],
      },
      {
        type: "accordion",
        title: "Delivery",
        items: [
          { q: "How fast is delivery?", a: "Instant — your key and download instructions are emailed within 15–30 minutes of payment confirmation, 24/7." },
          { q: "What if my email never arrives?", a: "Check spam/junk first, then contact support with the email you used at checkout. We'll resend immediately." },
        ],
      },
      {
        type: "accordion",
        title: "Payments & Refunds",
        items: [
          { q: "Which payment methods do you accept?", a: "Visa, Mastercard, American Express, Discover, and PayPal — all through SSL-encrypted, PCI-compliant checkout." },
          { q: "Is my payment information safe?", a: "Absolutely. We never store your card details; payments are handled by trusted, certified processors." },
          { q: "What's your refund policy?", a: "Every order includes a 30-day money-back guarantee. If your license can't be activated and we can't fix it, you get a full refund." },
        ],
      },
      {
        type: "accordion",
        title: "Support",
        items: [
          { q: "Is help with installation free?", a: `Yes — free installation and activation assistance is included with every purchase. Call ${COMPANY.phone} or email us anytime during business hours.` },
          { q: "When is support available?", a: `${COMPANY.hours}. Outside those hours, email us and we'll reply first thing the next business day.` },
        ],
      },
    ],
  },

  /* ================= CONTACT US ================= */
  "contact-us": {
    title: "Contact Us",
    subtitle: "Questions about an order, activation, or licensing? Real specialists, fast answers.",
    heroChips: ["Replies within 24h", "Free Activation Help", "Mon-Sat Support"],
    sections: [
      {
        type: "contactMethods",
      },
      {
        type: "contactForm",
        title: "Send us a message",
        subtitle: "Fill out the form and we'll get back to you as soon as possible — usually within 24 hours.",
      },
      {
        type: "contactInfo",
      },
      {
        type: "accordion",
        title: "Quick answers",
        items: [
          { q: "How long until I receive my license key?", a: "Keys are delivered by email within 15–30 minutes of purchase, around the clock." },
          { q: "What if my license key doesn't work?", a: "Contact us with your order number — we verify and resolve nearly all key issues the same day, or replace the key." },
          { q: "Do you offer refunds?", a: "Yes, all orders are covered by our 30-day money-back guarantee." },
          { q: "Can you help me install and activate?", a: "Of course — free, hands-on installation and activation assistance is included with every order." },
        ],
      },
    ],
  },

  /* ================= WHY CHOOSE US ================= */
  "why-choose-us": {
    title: "Why Choose Us",
    heading: "Why Thousands Choose UCODE SOFTTECH LLC",
    subtitle: "We combine genuine Microsoft licenses, unbeatable prices, and expert support into one seamless experience. Here's why over 50,000 customers trust us.",
    heroChips: [],
    sections: [
      {
        type: "stats",
        items: [
          { value: "50,000+", label: "Happy Customers" },
          { value: "4.6/5", label: "Average Rating" },
          { value: "5+ Years", label: "In Business" },
          { value: "< 5 Min", label: "Avg. Delivery Time" },
        ],
      },
      {
        type: "cards",
        title: "What sets us apart",
        cols: 4,
        items: [
          { icon: ShieldCheck, title: "100% Genuine Microsoft Products", text: "Every license key we sell is sourced directly from authorized Microsoft channels. We are a verified authorized reseller — all keys are genuine, legitimate, and covered by Microsoft's own activation system." },
          { icon: Zap, title: "Instant Digital Delivery", text: "No waiting for shipping. Your license key is delivered to your email inbox within minutes of a confirmed payment — available 24/7, including weekends and holidays." },
          { icon: BadgeDollarSign, title: "Up to 80% Off Retail Price", text: "We buy in volume, which means we pass the savings directly to you. Get the same genuine Microsoft software you'd find at retail for a fraction of the price." },
          { icon: Headphones, title: "Expert Support Included Free", text: "Every purchase includes free installation and activation support from our team of software experts. We're here to help you get up and running — no extra charge." },
          { icon: RotateCcw, title: "30-Day Money-Back Guarantee", text: "Not satisfied for any reason? We'll issue a full refund within 30 days of purchase — no questions asked. Your satisfaction is guaranteed." },
          { icon: Award, title: "5+ Years in Business", text: "We've been serving customers since 2019 with a consistent track record of genuine products, fast delivery, and excellent support. Our reputation is built on trust." },
          { icon: Users, title: "50,000+ Happy Customers", text: "Join over 50,000 individuals and businesses who have trusted us to power their productivity. Our verified rating of 4.6/5 from 5,500+ reviews speaks for itself." },
          { icon: KeyRound, title: "Lifetime License — Pay Once", text: "Unlike Microsoft 365 subscriptions, our Office 2024, 2021, and 2019 licenses are one-time purchases. No recurring fees, no renewals — yours forever." },
        ],
      },
      {
        type: "cta",
        title: "Ready to Save on Genuine Microsoft Software?",
        text: "Browse our full catalog of Microsoft Office, Windows OS, and more — all at up to 80% off retail.",
        btnLabel: "Shop Now",
        to: "/shop",
      },
    ],
  },

  /* ================= CUSTOMER REVIEWS ================= */
  "customer-reviews": {
    title: "Customer Reviews",
    subtitle: "Real feedback from verified buyers — see why thousands trust us with their software needs.",
    heroChips: [],
    sections: [
      {
        type: "ratingSummary",
        score: 4.6,
        total: "5,515",
        verifiedBy: "Verified by Shopper Approved",
        bars: [84, 11, 3, 1, 1],
      },
      {
        type: "reviewGrid",
        items: [
          { name: "James T.", location: "New York, NY", date: "May 12, 2026", product: "Office 2024 Professional Plus", rating: 5, text: "Got my key within 2 minutes of purchase. Activated perfectly on first try. Saved over $300 compared to buying from Microsoft directly. Will definitely buy again." },
          { name: "Sarah K.", location: "Austin, TX", date: "April 28, 2026", product: "Office 2021 Home & Business (Mac)", rating: 5, text: "Skeptical at first but the key worked perfectly on my M2 MacBook. The installation guide they provided made it super easy. Support also replied quickly when I had a question." },
          { name: "Michael R.", location: "Chicago, IL", date: "April 15, 2026", product: "Windows 11 Pro", rating: 5, text: "Legitimate key, activated with no issues on Windows 11. Very happy with the price and the instant delivery was a huge plus — I needed it for a client's computer right away." },
          { name: "Emily W.", location: "Seattle, WA", date: "March 30, 2026", product: "Office 2024 Home & Student", rating: 4, text: "Great deal for a student! The key was in my inbox before I even finished closing the checkout page. Only giving 4 stars because I had a minor hiccup during activation — support sorted it out in under 10 minutes though." },
          { name: "David L.", location: "Miami, FL", date: "March 18, 2026", product: "Office 2021 Professional Plus", rating: 5, text: "Bought 3 licenses for my small business team. All 3 activated without issues. Incredible prices — this saved us nearly $1,000 compared to going through Microsoft directly." },
          { name: "Angela M.", location: "Denver, CO", date: "February 22, 2026", product: "McAfee Total Protection 2024", rating: 5, text: "Easy checkout, instant delivery, and the antivirus is running great. The customer service team followed up to make sure everything was working. Impressed!" },
          { name: "Robert H.", location: "Phoenix, AZ", date: "February 10, 2026", product: "Office 2024 Professional Plus", rating: 5, text: "I was nervous buying software from a third party but this was 100% genuine. Microsoft confirmed it during activation. Huge savings. Highly recommend." },
          { name: "Jennifer C.", location: "Boston, MA", date: "January 27, 2026", product: "Office 2019 for Mac", rating: 5, text: "Bought for my older iMac and it works perfectly. The price was unbeatable. The team even helped me troubleshoot a minor macOS permission issue for free." },
          { name: "Kevin P.", location: "San Diego, CA", date: "January 14, 2026", product: "Norton 360 Deluxe", rating: 5, text: "Quick delivery and a legitimate key. Norton activated on all 5 of my family's devices without any problems. Will be coming back for Office next." },
          { name: "Linda F.", location: "Atlanta, GA", date: "December 30, 2025", product: "Office 2021 Home & Student", rating: 4, text: "Good price for a genuine product. It took about 20 minutes for the email to arrive (which made me a bit nervous) but support confirmed it was on the way and it arrived fine." },
          { name: "Mark S.", location: "Portland, OR", date: "December 15, 2025", product: "Microsoft Project 2024", rating: 5, text: "Needed Project for a large construction project. Saved over $900 compared to retail. Key activated immediately and all features work perfectly. Outstanding value." },
          { name: "Patricia N.", location: "Nashville, TN", date: "November 28, 2025", product: "Office 2024 Home & Business", rating: 5, text: "Third time buying from UCODE SOFTTECH LLC. Always fast, always genuine, always the best price I can find. The Shopper Approved reviews are well deserved." },
        ],
      },
    ],
  },

  /* ================= AFFILIATE PROGRAM ================= */
  "affiliate-program": {
    title: "Affiliate Program",
    heading: "Earn Money With UCODE SOFTTECH LLC",
    subtitle: "Join our affiliate program and earn up to 15% commission on every sale you refer. No minimums, no caps.",
    heroChips: ["Up to 15% Commission", "Monthly Payouts", "No Minimum Threshold"],
    sections: [
      {
        type: "cards",
        title: "Why Join Our Program?",
        cols: 4,
        items: [
          { icon: BadgeDollarSign, title: "Earn Up to 15% Commission", text: "Earn a percentage of every sale generated through your unique referral link — paid monthly via PayPal or bank transfer." },
          { icon: TrendingUp, title: "No Cap on Earnings", text: "There's no limit to how much you can earn. The more customers you refer, the more you earn." },
          { icon: BarChart3, title: "Real-Time Dashboard", text: "Track your clicks, conversions, and earnings in real time through your personal affiliate dashboard." },
          { icon: Megaphone, title: "Ready-Made Marketing Assets", text: "Get access to banners, product images, and copy to make promoting our products effortless." },
        ],
      },
      {
        type: "steps",
        title: "How It Works",
        groups: [
          { heading: "Apply", steps: ["Fill out the short application form below.", "We review and approve most applications within 1–2 business days."] },
          { heading: "Get Your Link", steps: ["Once approved, you'll receive your unique referral link and access to the affiliate dashboard."] },
          { heading: "Promote", steps: ["Share your link on your website, YouTube channel, social media, email list, or anywhere your audience is."] },
          { heading: "Earn", steps: ["Earn commission on every sale made through your link.", "Payments are processed monthly with no minimum threshold."] },
        ],
      },
      {
        type: "table",
        title: "Commission Structure",
        headers: ["Monthly Referred Sales", "Commission Rate"],
        rows: [
          ["$0 – $499", "8%"],
          ["$500 – $1,999", "10%"],
          ["$2,000 – $4,999", "12%"],
          ["$5,000+", "15%"],
        ],
        note: "Commissions are paid monthly for the previous month's sales. Minimum payout threshold: none.",
      },
      {
        type: "affiliateForm",
        title: "Apply to Join",
        subtitle: "We approve most applications within 1–2 business days. Fill out the form below to get started.",
        contactEmail: COMPANY.email,
      },
    ],
  },

  /* ================= RETURNS & REFUNDS ================= */
  "returns-refunds": {
    title: "Returns & Refunds",
    subtitle: "Shop with total confidence — every order is protected by our 30-day money-back guarantee.",
    heroChips: ["30-Day Guarantee", "No-Hassle Process", "Fast Processing"],
    sections: [
      {
        type: "intro",
        text: "Digital software can't be 'returned' like a physical product, so we keep it simple: if something goes wrong with your license within 30 days of purchase and our team can't make it right, you get your money back. No forms maze, no fine-print games.",
      },
      {
        type: "check",
        variant: "good",
        title: "Eligible for a full refund",
        items: [
          "License key has not been activated or redeemed",
          "Key is defective and our support team cannot resolve the issue",
          "You received the wrong product and we can't supply the correct one",
          "Duplicate or accidental repeat order",
        ],
      },
      {
        type: "check",
        variant: "bad",
        title: "Not eligible",
        items: [
          "Keys that have been successfully activated and are working as described",
          "Requests made more than 30 days after purchase",
          "Compatibility issues clearly stated in the product requirements before purchase",
        ],
      },
      {
        type: "steps",
        title: "How to request a refund",
        groups: [
          { heading: "Step 1 — Reach out", steps: [`Email ${COMPANY.email} or call ${COMPANY.phone} with your order number and a short description of the issue.`] },
          { heading: "Step 2 — Quick review", steps: ["Our team reviews your request within 1–2 business days.", "We'll often offer to fix the issue first — most problems are solved on the spot."] },
          { heading: "Step 3 — Get your money back", steps: ["Approved refunds are issued to your original payment method.", "Funds typically appear within 5–10 business days depending on your bank."] },
        ],
      },
      {
        type: "accordion",
        title: "Refund questions",
        items: [
          { q: "Can I exchange instead of refund?", a: "Yes — if you bought the wrong edition or platform, we're happy to swap your license for the correct one and simply settle any price difference." },
          { q: "Do I need to return anything?", a: "No physical return is needed. For unactivated keys, we simply invalidate the original key when the refund is issued." },
          { q: "What if I'm past the 30 days?", a: "Reach out anyway. While the guarantee covers 30 days, we review late requests case-by-case — especially for defective keys." },
        ],
      },
    ],
  },
};

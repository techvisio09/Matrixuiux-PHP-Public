// Content for legal/policy pages, rendered by pages/LegalPage.jsx
import { COMPANY } from "./company";

const SITE = "ucodesofttechus.com";
const EMAIL = COMPANY.email;
const PHONE = COMPANY.phone;

export const legalPages = {
  /* ============ PRIVACY POLICY ============ */
  "privacy-policy": {
    title: "Privacy Policy",
    updated: "January 1, 2026",
    sections: [
      { h: "Introduction", paras: [
        `${COMPANY.legal} ("we," "us," or "our") operates ${SITE}. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit our website or make a purchase.`,
        "By using our website, you consent to the collection and use of information in accordance with this policy.",
      ]},
      { h: "Information We Collect", paras: ["We may collect the following types of personal information:"], list: [
        "Contact Information: Name, email address, phone number, and billing address.",
        "Payment Information: Credit/debit card details (processed securely by our payment processor; we do not store full card numbers).",
        "Order Information: Products purchased, order history, and transaction details.",
        "Technical Data: IP address, browser type, device type, pages visited, and referring URLs.",
        "Communications: Any messages you send us via email, chat, or contact forms.",
      ]},
      { h: "How We Use Your Information", paras: ["We use the information we collect to:"], list: [
        "Process and fulfill your orders and deliver license keys via email.",
        "Send order confirmations, receipts, and support communications.",
        "Respond to customer service requests and inquiries.",
        "Send promotional emails and offers (you may opt out at any time).",
        "Improve our website, products, and services.",
        "Comply with legal obligations and prevent fraud.",
      ]},
      { h: "Cookies and Tracking", paras: [
        "We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookie settings through your browser. See our Cookie Policy for details.",
      ]},
      { h: "Sharing Your Information", paras: ["We do not sell, trade, or rent your personal information to third parties. We may share your data with:"], list: [
        "Payment Processors: To complete transactions securely (e.g., Stripe, PayPal).",
        "Email Service Providers: To send transactional and marketing emails.",
        "Analytics Providers: To understand website usage (e.g., Google Analytics).",
        "Legal Authorities: When required by law or to protect our rights.",
      ]},
      { h: "Data Retention", paras: [
        "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, provide customer support, comply with legal obligations, resolve disputes, and enforce our agreements. Order records are retained for a minimum of 7 years for tax and accounting purposes.",
      ]},
      { h: "Your Rights", paras: ["Depending on your location, you may have the right to:"], list: [
        "Access the personal information we hold about you.",
        "Request correction of inaccurate information.",
        "Request deletion of your personal information.",
        "Opt out of marketing communications.",
        "Lodge a complaint with your local data protection authority.",
      ], after: [`To exercise any of these rights, contact us at ${EMAIL}.`]},
      { h: "Security", paras: [
        "We implement industry-standard security measures including SSL encryption, secure payment processing, and access controls to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
      ]},
      { h: "Children's Privacy", paras: [
        "Our website is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.",
      ]},
      { h: "Changes to This Policy", paras: [
        "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated revision date. Your continued use of our website after changes constitutes acceptance of the updated policy.",
      ]},
      { h: "Contact Us", paras: [
        `If you have questions about this Privacy Policy, please contact us at ${EMAIL} or call ${PHONE}.`,
      ]},
    ],
  },

  /* ============ TERMS OF SERVICE ============ */
  "terms-of-service": {
    title: "Terms of Service",
    updated: "January 1, 2026",
    sections: [
      { h: "Agreement to Terms", paras: [
        `By accessing or using ${SITE}, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`,
      ]},
      { h: "Products and Licensing", paras: [
        "We sell genuine Microsoft software license keys for personal and commercial use. All products sold on this website are legitimate license keys that activate Microsoft software. Each license key is for the number of devices specified in the product listing.",
      ], list: [
        "License keys are for the specific version and edition listed.",
        "Keys are non-transferable unless otherwise stated.",
        "Redistribution or resale of purchased keys is strictly prohibited.",
        "One license key per customer per product unless a multi-device license is purchased.",
      ]},
      { h: "Orders and Payment", paras: [
        "By placing an order, you represent that you are at least 18 years of age and have the legal capacity to enter into a binding contract. We reserve the right to refuse or cancel any order at our discretion.",
        "All prices are in USD. We accept Visa, Mastercard, American Express, and PayPal. Payment is processed securely at checkout. Your order is confirmed once payment is successfully authorized.",
      ]},
      { h: "Delivery", paras: [
        "All products are delivered digitally via email to the address provided at checkout, typically within minutes of confirmed payment. We are not responsible for delivery failures caused by incorrect email addresses or spam filters. Please check your spam/junk folder before contacting support.",
      ]},
      { h: "Prohibited Uses", paras: ["You agree not to use this website to:"], list: [
        "Violate any applicable local, national, or international law or regulation.",
        "Transmit unsolicited or unauthorized advertising or promotional material.",
        "Impersonate any person or entity or misrepresent your affiliation.",
        "Attempt to gain unauthorized access to any part of the website or its systems.",
        "Engage in any fraudulent activity or purchase using stolen payment credentials.",
      ]},
      { h: "Intellectual Property", paras: [
        `The content on this website — including text, graphics, logos, images, and software — is the property of ${COMPANY.legal} or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
      ]},
      { h: "Disclaimer of Warranties", paras: [
        'This website and its content are provided "as is" without warranty of any kind. We do not warrant that the website will be error-free, uninterrupted, or free of viruses or other harmful components. We make no warranties regarding the accuracy, completeness, or suitability of the information.',
      ]},
      { h: "Limitation of Liability", paras: [
        `To the maximum extent permitted by law, ${COMPANY.legal} shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of this website or products purchased through it, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount paid by you for the specific product giving rise to the claim.`,
      ]},
      { h: "Governing Law", paras: [
        "These Terms of Service are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Delaware.",
      ]},
      { h: "Changes to Terms", paras: [
        "We reserve the right to modify these Terms of Service at any time. Changes are effective immediately upon posting. Your continued use of the website following any changes constitutes your acceptance of the new terms.",
      ]},
      { h: "Contact", paras: [`Questions about these Terms should be directed to ${EMAIL}.`]},
    ],
  },

  /* ============ REFUND POLICY ============ */
  "refund-policy": {
    title: "Refund Policy",
    updated: "January 1, 2026",
    sections: [
      { h: "30-Day Money Back Guarantee", paras: [
        "We stand behind every product we sell. If you are not completely satisfied with your purchase, you may request a full refund within 30 days of the purchase date — no questions asked.",
      ]},
      { h: "Eligibility for Refunds", paras: ["You are eligible for a refund if:"], list: [
        "The product key does not work or is invalid.",
        "The key was already in use when you received it.",
        "You purchased the wrong product by mistake and have not yet activated the key.",
        "The product does not match the description listed on our website.",
        "You did not receive your key within the stated delivery timeframe and our support team was unable to resolve the issue.",
      ]},
      { h: "Non-Refundable Situations", paras: ["Refunds will not be issued in the following circumstances:"], list: [
        "The product key has been successfully activated on a device.",
        "More than 30 days have passed since the purchase date.",
        "You changed your mind after activating the software.",
        "The issue is related to hardware incompatibility (please check system requirements before purchasing).",
        "The refund request does not include the original order number.",
      ]},
      { h: "How to Request a Refund", paras: ["To request a refund, please contact our support team with:"], list: [
        "Your full name and email address used at checkout.",
        "Your order number.",
        "A brief description of the issue.",
        "Any relevant screenshots or error messages (if applicable).",
      ], after: [`Contact us at ${EMAIL} or call ${PHONE}.`]},
      { h: "Refund Processing Time", paras: [
        "Once your refund request is approved, the refund will be issued to your original payment method within 3–7 business days. Processing times may vary depending on your bank or payment provider.",
      ]},
      { h: "Exchanges", paras: [
        "If you purchased the wrong edition or version, we may offer an exchange for the correct product instead of a refund, provided the key has not been activated. Contact our support team to arrange an exchange.",
      ]},
    ],
  },

  /* ============ SHIPPING & DELIVERY ============ */
  "shipping-delivery": {
    title: "Shipping & Delivery",
    updated: "January 1, 2026",
    sections: [
      { h: "Digital Delivery Only", paras: [
        `All products sold on ${SITE} are digital software license keys. We do not ship physical products. There are no shipping fees, no packaging, and no waiting for a physical item to arrive.`,
      ]},
      { h: "How Delivery Works", paras: ["After your payment is successfully processed:"], list: [
        "Your license key and installation instructions are sent to the email address provided at checkout.",
        "Delivery is instant in most cases — typically within 1–5 minutes of order confirmation.",
        "During peak times or for manual verification orders, delivery may take up to 1–2 hours.",
        "You will also receive a copy of your license key in your order confirmation email.",
      ]},
      { h: "Check Your Spam Folder", paras: [
        `If you do not receive your key within 15 minutes, please check your spam or junk email folder. Automated emails from us can sometimes be filtered by email providers. Add ${EMAIL} to your safe senders list to avoid this in the future.`,
      ]},
      { h: "Delivery Failures", paras: ["If you have not received your key within 2 hours and it is not in your spam folder, please contact our support team immediately. Common causes of delivery failure include:"], list: [
        "Incorrect email address entered at checkout.",
        "Email blocked by corporate or institutional email filters.",
        "Payment authorization delay causing an order processing hold.",
      ], after: [`Contact us at ${EMAIL} or call ${PHONE}. Our team is available Monday through Saturday, 9 AM – 6 PM EST.`]},
      { h: "International Orders", paras: [
        "Because all our products are delivered digitally, we serve customers worldwide. There are no import duties, customs fees, or regional delivery restrictions. License keys are delivered to any valid email address regardless of your country.",
      ]},
      { h: "Re-Delivery", paras: [
        "If you need your key resent (for example, you changed email providers or accidentally deleted the email), contact our support team with your order number. We will re-deliver your key free of charge, subject to verification of your original order.",
      ]},
    ],
  },

  /* ============ PAYMENT POLICY ============ */
  "payment-policy": {
    title: "Payment Policy",
    updated: "January 1, 2026",
    sections: [
      { h: "Accepted Payment Methods", paras: ["We accept the following payment methods:"], list: [
        "Credit/Debit Cards: Visa, Mastercard, American Express, Discover",
        "PayPal: Pay using your PayPal balance, linked bank account, or PayPal Credit",
        "Debit Cards: All major debit cards with Visa or Mastercard logos",
      ], after: [
        "All payments are processed in US Dollars (USD). If you are purchasing from outside the US, your bank or card provider will apply the current exchange rate.",
      ]},
      { h: "Secure Checkout", paras: [
        `All transactions on ${SITE} are protected by SSL (Secure Socket Layer) encryption. Your payment information is transmitted securely and is never stored on our servers. Payment processing is handled by PCI-DSS compliant payment providers.`,
        "We do not store full credit card numbers. Once your transaction is complete, only a masked version of your card is retained for reference purposes.",
      ]},
      { h: "Order Authorization", paras: ["When you place an order, your payment is authorized in real time. If authorization fails, your order will not be processed and you will not be charged. Common reasons for authorization failure:"], list: [
        "Incorrect card number, expiry date, or CVV.",
        "Insufficient funds or credit limit reached.",
        "Card blocked for international or online transactions by your bank.",
        "Billing address mismatch (AVS check failure).",
      ], after: ["If your payment fails, please contact your bank or try a different payment method."]},
      { h: "Fraud Prevention", paras: [
        "To protect our customers and our business, we use fraud detection tools on all transactions. Orders that trigger fraud alerts may be placed on hold for manual review. If your order is held, our team will contact you within 1 business day to verify your identity before releasing the order.",
        "We reserve the right to cancel any order that we reasonably believe to be fraudulent. If your account or payment method has been used fraudulently, please contact us immediately.",
      ]},
      { h: "Taxes", paras: [
        "Applicable sales tax may be charged based on your location and the type of product purchased, in accordance with local tax laws. The tax amount, if any, will be clearly displayed during checkout before you complete your purchase.",
      ]},
      { h: "Chargebacks", paras: [
        "If you have an issue with a charge, please contact our support team before initiating a chargeback with your bank. We will work quickly to resolve any legitimate issue. Unauthorized chargebacks for products that were successfully delivered and activated may result in account suspension and referral to collections.",
      ]},
      { h: "Contact", paras: [`For payment-related questions, contact us at ${EMAIL} or call ${PHONE}.`]},
    ],
  },

  /* ============ COOKIE POLICY ============ */
  "cookie-policy": {
    title: "Cookie Policy",
    updated: "January 1, 2026",
    sections: [
      { h: "What Are Cookies?", paras: [
        "Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, improve user experience, and provide information to website owners.",
      ]},
      { h: "How We Use Cookies", paras: [`${SITE} uses cookies for the following purposes:`], list: [
        "Essential Cookies: Required for the website to function properly, including maintaining your shopping cart, processing payments, and keeping you logged in.",
        "Analytics Cookies: Help us understand how visitors interact with our website (pages visited, time spent, traffic sources) so we can improve our content and services.",
        "Functional Cookies: Remember your preferences such as currency selection and dismissed banners to provide a more personalized experience.",
        "Marketing Cookies: Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns.",
      ]},
      { h: "Third-Party Cookies", paras: ["We may use cookies set by third-party services, including:"], list: [
        "Google Analytics: Website traffic analysis.",
        "Google Ads / Meta Pixel: Advertising and remarketing.",
        "PayPal / Stripe: Payment processing.",
        "Shopper Approved: Customer review collection.",
      ], after: ["These third parties have their own privacy policies governing how they use such information. We recommend reviewing their policies on their respective websites."]},
      { h: "Managing Cookies", paras: ["You can control and manage cookies through your browser settings. Most browsers allow you to:"], list: [
        "View and delete existing cookies.",
        "Block cookies from specific websites.",
        "Block all third-party cookies.",
        "Block all cookies (note: this may affect website functionality).",
      ], after: ["For detailed instructions, visit your browser's help section or go to www.aboutcookies.org."]},
      { h: "Cookie Consent", paras: [
        "By continuing to use our website, you consent to our use of cookies as described in this policy. You may withdraw consent at any time by deleting cookies from your browser or adjusting your browser settings to block cookies.",
      ]},
      { h: "Changes to This Policy", paras: [
        "We may update this Cookie Policy from time to time. Please check this page periodically for any changes. Your continued use of our website following the posting of changes constitutes your acceptance of those changes.",
      ]},
      { h: "Contact", paras: [`If you have questions about our use of cookies, please contact us at ${EMAIL}.`]},
    ],
  },

  /* ============ DO NOT SELL ============ */
  "do-not-sell": {
    title: "Do Not Sell My Personal Information",
    updated: "January 1, 2026",
    sections: [
      { h: "Your California Privacy Rights (CCPA)", paras: [
        "Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have the right to opt out of the sale or sharing of their personal information with third parties.",
        `Although ${COMPANY.legal} does not sell your personal information in the traditional sense, certain sharing of data with advertising and analytics partners may qualify as a "sale" or "sharing" under California law. We respect your right to opt out of this activity.`,
      ]},
      { h: "What Information May Be Shared", paras: ["The types of personal information that may be shared with third-party partners include:"], list: [
        "Identifiers (e.g., IP address, cookie IDs, email address)",
        "Internet activity (e.g., browsing history on our website)",
        "Commercial information (e.g., products viewed or purchased)",
        "Geolocation data (approximate location based on IP)",
      ]},
      { h: "Submit Your Opt-Out Request", paras: [
        "To opt out of the sale or sharing of your personal information, please complete the form below. We will process your request within 15 business days and confirm via email once your request has been fulfilled.",
      ], optOutForm: true },
      { h: "Other Privacy Rights", paras: ["As a California resident, you also have the right to:"], list: [
        "Know what personal information we collect and how it is used.",
        "Delete personal information we have collected about you.",
        "Correct inaccurate personal information.",
        "Non-discrimination — we will not discriminate against you for exercising your rights.",
      ], after: [`To exercise any of these rights, contact us at ${EMAIL}.`]},
      { h: "Authorized Agent", paras: [
        "You may designate an authorized agent to submit a request on your behalf. To do so, provide written authorization signed by you, along with the agent's contact details when submitting the request. We may require verification of your identity before processing the request.",
      ]},
    ],
  },
};

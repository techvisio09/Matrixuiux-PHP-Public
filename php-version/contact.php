<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Contact Us | ' . SITE_BRAND;

$sent = false;
$formError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $subject === '' || $message === '') {
        $formError = 'Please fill in all required fields with a valid email.';
    } else {
        save_support_message([
            'name' => $name, 'email' => strtolower($email),
            'phone' => trim($_POST['phone'] ?? ''), 'order_number' => trim($_POST['order_number'] ?? ''),
            'subject' => $subject, 'message' => $message, 'source' => 'contact',
        ]);
        $sent = true;
    }
}

$contactFaqs = [
    ['How long does it take to receive my license key?', 'Your license key and download instructions are delivered by email within 15-30 minutes of purchase — usually just a few minutes.'],
    ['What if my license key doesn\'t work?', 'First make sure the key is entered exactly (no extra spaces, watch 0 vs O). If it still fails, contact our support team with your order number and we\'ll resolve it or replace the key.'],
    ['Do you offer refunds?', 'Yes — we offer a money-back guarantee. See our Refund Policy for full details, or start a request on the Return & Refund page.'],
    ['How do I activate my Microsoft Office license?', 'Download the official installer from setup.office.com, sign in with a Microsoft account, and enter your 25-character product key when prompted. Full steps are in our Activation Help guide.'],
    ['Can I use my license on multiple devices?', 'Most licenses are valid for 1 PC or Mac unless the product states otherwise. Buying for a team? Ask us about volume licensing.'],
];

include __DIR__ . '/includes/header.php';
?>

<!-- Hero -->
<div class="page-head">
  <div class="container py-5 text-center">
    <span class="eyebrow">WE'RE HERE TO HELP</span>
    <h1 class="fw-bold display-6 mt-1" data-testid="contact-title">Contact Us</h1>
    <p class="text-secondary mx-auto" style="max-width:620px;">Have questions about your order, license activation, or need technical support? Our team is ready to assist you.</p>
    <div class="d-flex justify-content-center gap-4 flex-wrap small mt-3">
      <span><i class="bi bi-patch-check-fill text-success me-1"></i>Genuine Microsoft Licenses</span>
      <span><i class="bi bi-lightning-charge-fill text-warning me-1"></i>Instant Digital Delivery</span>
      <span><i class="bi bi-arrow-counterclockwise text-primary me-1"></i>30-Day Money Back Guarantee</span>
    </div>
  </div>
</div>

<div class="container py-5">
  <!-- Contact methods -->
  <div class="row g-4 mb-5">
    <div class="col-lg-4">
      <div class="card h-100 p-4 text-center position-relative" data-testid="contact-card-email">
        <span class="badge text-bg-primary position-absolute top-0 start-50 translate-middle">Recommended</span>
        <i class="bi bi-envelope-fill text-primary fs-2"></i>
        <h3 class="h6 fw-bold mt-2 mb-1">Email Support</h3>
        <small class="text-secondary d-block mb-2">Get a response within 24 hours</small>
        <a href="mailto:<?= SITE_EMAIL ?>" class="fw-bold text-decoration-none"><?= SITE_EMAIL ?></a>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card h-100 p-4 text-center position-relative" data-testid="contact-card-chat">
        <span class="badge text-bg-success position-absolute top-0 start-50 translate-middle">Instant</span>
        <i class="bi bi-chat-dots-fill text-primary fs-2"></i>
        <h3 class="h6 fw-bold mt-2 mb-1">Live Chat</h3>
        <small class="text-secondary d-block mb-2">Chat with our support team</small>
        <button class="btn btn-sm btn-outline-primary rounded-pill px-3 mx-auto" onclick="toggleChat()">Start a chat · <?= SITE_HOURS ?></button>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card h-100 p-4 text-center" data-testid="contact-card-phone">
        <i class="bi bi-telephone-fill text-primary fs-2"></i>
        <h3 class="h6 fw-bold mt-2 mb-1">Phone Support</h3>
        <small class="text-secondary d-block mb-2">Talk to a specialist</small>
        <a href="tel:<?= SITE_PHONE ?>" class="fw-bold text-decoration-none"><?= SITE_PHONE ?></a>
      </div>
    </div>
  </div>

  <div class="row g-4">
    <!-- Form -->
    <div class="col-lg-7">
      <div class="card p-4 p-lg-5">
        <h2 class="h4 fw-bold mb-1">Send Us a Message</h2>
        <p class="text-secondary small mb-4">Fill out the form below and we'll respond as soon as possible.</p>

        <?php if ($sent): ?>
          <div class="alert alert-success" data-testid="contact-success"><i class="bi bi-check-circle-fill me-2"></i>Thanks! Your message has been received — we'll get back to you within 24 hours.</div>
        <?php else: ?>
          <?php if ($formError): ?><div class="alert alert-danger py-2 small" data-testid="contact-error"><?= esc($formError) ?></div><?php endif; ?>
          <form method="post">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Full Name *</label>
                <input name="name" class="form-control" placeholder="John Doe" required data-testid="contact-name">
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Email Address *</label>
                <input type="email" name="email" class="form-control" placeholder="john@example.com" required data-testid="contact-email">
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Phone Number <span class="text-secondary fw-normal">(Optional)</span></label>
                <input name="phone" class="form-control" placeholder="+1 (555) 123-4567" data-testid="contact-phone">
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Order Number <span class="text-secondary fw-normal">(Optional)</span></label>
                <input name="order_number" class="form-control" placeholder="UC-XXXXXX" data-testid="contact-order">
              </div>
              <div class="col-12">
                <label class="form-label small fw-semibold">Subject *</label>
                <select name="subject" class="form-select" required data-testid="contact-subject">
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="License / Activation Help">License / Activation Help</option>
                  <option value="Refund Request">Refund Request</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Volume / Business Pricing">Volume / Business Pricing</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label small fw-semibold">Message *</label>
                <textarea name="message" class="form-control" rows="5" placeholder="Please describe your question or issue in detail..." required data-testid="contact-message"></textarea>
              </div>
              <div class="col-12">
                <button class="btn btn-primary rounded-pill px-4 fw-semibold" data-testid="contact-send">Send Message</button>
              </div>
            </div>
          </form>
        <?php endif; ?>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="col-lg-5">
      <div class="card p-4 mb-4" data-testid="contact-office">
        <h3 class="h6 fw-bold mb-2"><i class="bi bi-geo-alt-fill text-primary me-2"></i>Our Office</h3>
        <p class="small text-secondary mb-0"><strong class="text-body"><?= SITE_LEGAL ?></strong><br><?= SITE_ADDRESS ?><br>United States</p>
      </div>
      <div class="card p-4 mb-4" data-testid="contact-hours">
        <h3 class="h6 fw-bold mb-2"><i class="bi bi-clock-fill text-primary me-2"></i>Business Hours</h3>
        <div class="small d-grid gap-1">
          <div class="d-flex justify-content-between"><span class="text-secondary">Monday - Friday</span><span class="fw-semibold">9:00 AM - 6:00 PM EST</span></div>
          <div class="d-flex justify-content-between"><span class="text-secondary">Saturday</span><span class="fw-semibold">10:00 AM - 4:00 PM EST</span></div>
          <div class="d-flex justify-content-between"><span class="text-secondary">Sunday</span><span class="fw-semibold">Closed</span></div>
        </div>
        <small class="text-secondary mt-2"><i class="bi bi-chat-dots me-1"></i>Live chat: <?= SITE_HOURS ?></small>
      </div>
      <div class="card p-4" style="background: rgba(37,99,235,.05);">
        <h3 class="h6 fw-bold mb-1"><i class="bi bi-lightning-charge-fill text-warning me-2"></i>Quick Response</h3>
        <small class="text-secondary">We typically respond to all inquiries within 24 hours. For urgent matters, please use our live chat for immediate assistance.</small>
      </div>
    </div>
  </div>

  <!-- FAQ -->
  <div class="mt-5 mx-auto" style="max-width: 760px;">
    <div class="text-center mb-4">
      <h2 class="fw-bold h3">Frequently Asked Questions</h2>
      <p class="text-secondary small">Find quick answers to common questions</p>
    </div>
    <div class="accordion" id="contactFaq" data-testid="contact-faq">
      <?php foreach ($contactFaqs as $i => [$q, $a]): ?>
        <div class="accordion-item">
          <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cfaq<?= $i ?>"><?= esc($q) ?></button></h2>
          <div id="cfaq<?= $i ?>" class="accordion-collapse collapse" data-bs-parent="#contactFaq"><div class="accordion-body small text-secondary"><?= esc($a) ?></div></div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- CTA -->
  <div class="rounded-4 text-center text-white p-5 mt-5" style="background: linear-gradient(135deg, #2563eb, #4338ca);">
    <h2 class="fw-bold h3">Still Need Help?</h2>
    <p class="opacity-75 mx-auto" style="max-width:520px;">Our dedicated support team is here to ensure you have the best experience. Don't hesitate to reach out!</p>
    <div class="d-flex justify-content-center gap-2 flex-wrap">
      <a href="mailto:<?= SITE_EMAIL ?>" class="btn btn-light rounded-pill px-4 fw-semibold">Email Support</a>
      <button class="btn btn-outline-light rounded-pill px-4" onclick="toggleChat()">Start Live Chat</button>
    </div>
  </div>
</div>
<?php include __DIR__ . '/includes/footer.php'; ?>

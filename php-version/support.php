<?php
require_once __DIR__ . '/includes/functions.php';
$pageTitle = 'Support Center | ' . SITE_BRAND;

$sent = false;
$formError = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $subject === '' || $message === '') {
        $formError = 'Please fill in all fields with a valid email.';
    } else {
        save_support_message(['name' => $name, 'email' => strtolower($email), 'subject' => $subject, 'message' => $message, 'source' => 'support']);
        $sent = true;
    }
}
$faqs = db()->query('SELECT * FROM faqs')->fetchAll();

$winSteps = [
    ['Download Office', 'Visit setup.office.com or use the download link from your order confirmation email.', 'Make sure to sign in with a Microsoft account or create one if needed.'],
    ['Enter Your Product Key', 'Enter the 25-character product key from your order email. The key format is: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX', 'Copy and paste to avoid typos. The key is not case-sensitive.'],
    ['Download the Installer', 'Click "Install Office" to download the setup file. The file is typically around 4-8 GB.', 'Ensure you have a stable internet connection for the download.'],
    ['Run the Installer', 'Double-click the downloaded file to begin installation. Follow the on-screen prompts.', 'Close all Office applications before installing.'],
    ['Activate Your License', 'Open any Office app (Word, Excel, etc.) and sign in when prompted, or enter your product key again if asked.', 'Activation requires an internet connection.'],
];
$macSteps = [
    ['Download from App Store or Link', 'Use the download link from your order email or download Microsoft 365/Office from the Mac App Store.', 'For Office 2021/2024 for Mac, use the direct download link provided.'],
    ['Open the Installer Package', 'Locate the downloaded .pkg file in your Downloads folder and double-click to open.', 'You may need to allow the installation in System Preferences > Security & Privacy.'],
    ['Follow Installation Wizard', 'Click Continue through the installation wizard. Accept the license agreement and choose your install location.', 'Standard installation is recommended for most users.'],
    ['Enter Your Credentials', 'Enter your Mac admin password when prompted to authorize the installation.', 'This is your Mac login password, not your Microsoft account password.'],
    ['Activate with Product Key', 'Launch any Office app and enter your product key when prompted, or sign in with your Microsoft account.', 'For voucher codes, contact our support team to redeem first.'],
];
$errorCodes = [
    ['0x80070005', 'Access denied during install', 'Run the installer as Administrator and temporarily disable antivirus.'],
    ['0xC004F074', 'Windows activation server unreachable', 'Check internet connection, disable VPN, then retry activation.'],
    ['30015-11', 'Office install blocked', 'Remove older Office versions, restart, then reinstall.'],
    ['0x8007007B', 'Invalid product key format', 'Re-enter the 25-character key — watch for 0 vs O and 1 vs I.'],
    ['30088-26', 'Office download interrupted', 'Use the offline installer or a wired/stable connection.'],
];

include __DIR__ . '/includes/header.php';
?>

<!-- Hero -->
<div class="page-head">
  <div class="container py-5 text-center">
    <span class="eyebrow">SUPPORT</span>
    <h1 class="fw-bold display-6 mt-1" data-testid="support-title">Support Center</h1>
    <p class="text-secondary mx-auto" style="max-width:640px;">Everything you need to install, activate, and troubleshoot your Microsoft Office software</p>
    <div class="mx-auto mt-3" style="max-width:480px;">
      <div class="input-group input-group-lg">
        <span class="input-group-text bg-body border-end-0"><i class="bi bi-search text-secondary"></i></span>
        <input id="support-search" class="form-control border-start-0" placeholder="Search for help topics..." data-testid="support-search">
      </div>
    </div>
  </div>
</div>

<div class="container py-5">
  <!-- Contact methods -->
  <div class="row g-4 mb-5">
    <div class="col-lg-4">
      <div class="card h-100 p-4 text-center">
        <i class="bi bi-envelope-fill text-primary fs-2"></i>
        <h3 class="h6 fw-bold mt-2 mb-1">Email Support</h3>
        <small class="text-secondary d-block mb-2">Get a response within 24 hours</small>
        <a href="mailto:<?= SITE_EMAIL ?>" class="fw-bold text-decoration-none"><?= SITE_EMAIL ?></a>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card h-100 p-4 text-center">
        <i class="bi bi-telephone-fill text-primary fs-2"></i>
        <h3 class="h6 fw-bold mt-2 mb-1">Phone Support</h3>
        <small class="text-secondary d-block mb-2"><?= SITE_HOURS ?></small>
        <a href="tel:<?= SITE_PHONE ?>" class="fw-bold text-decoration-none"><?= SITE_PHONE ?></a>
      </div>
    </div>
    <div class="col-lg-4">
      <div class="card h-100 p-4 text-center">
        <i class="bi bi-chat-dots-fill text-primary fs-2"></i>
        <h3 class="h6 fw-bold mt-2 mb-1">Live Chat</h3>
        <small class="text-secondary d-block mb-2"><?= SITE_HOURS ?></small>
        <button class="btn btn-sm btn-primary rounded-pill px-3 mx-auto" onclick="toggleChat()" data-testid="support-chat-btn">Start a chat</button>
      </div>
    </div>
  </div>

  <!-- Topic tabs -->
  <ul class="nav nav-pills justify-content-center gap-2 mb-4" role="tablist" data-testid="support-tabs">
    <li class="nav-item"><button class="nav-link active rounded-pill" data-bs-toggle="pill" data-bs-target="#tab-install"><i class="bi bi-download me-1"></i>Installation</button></li>
    <li class="nav-item"><button class="nav-link rounded-pill" data-bs-toggle="pill" data-bs-target="#tab-trouble"><i class="bi bi-wrench-adjustable me-1"></i>Troubleshooting</button></li>
    <li class="nav-item"><button class="nav-link rounded-pill" data-bs-toggle="pill" data-bs-target="#tab-errors"><i class="bi bi-exclamation-octagon me-1"></i>Error Codes</button></li>
    <li class="nav-item"><button class="nav-link rounded-pill" data-bs-toggle="pill" data-bs-target="#tab-uninstall"><i class="bi bi-trash3 me-1"></i>Uninstall</button></li>
    <li class="nav-item"><button class="nav-link rounded-pill" data-bs-toggle="pill" data-bs-target="#tab-faq"><i class="bi bi-question-circle me-1"></i>FAQ</button></li>
  </ul>

  <div class="tab-content">
    <!-- Installation -->
    <div class="tab-pane fade show active" id="tab-install">
      <div class="row g-4 mb-4">
        <div class="col-lg-4 support-topic">
          <div class="card h-100 p-4">
            <h3 class="h6 fw-bold"><i class="bi bi-1-circle-fill text-primary me-2"></i>Before Installing</h3>
            <ul class="small text-secondary mb-0 d-grid gap-1 mt-2">
              <li>Close all running applications</li>
              <li>Ensure at least 10 GB free disk space</li>
              <li>Have your product key ready</li>
              <li>Disable antivirus temporarily</li>
            </ul>
          </div>
        </div>
        <div class="col-lg-4 support-topic">
          <div class="card h-100 p-4">
            <h3 class="h6 fw-bold"><i class="bi bi-2-circle-fill text-primary me-2"></i>After Installing</h3>
            <ul class="small text-secondary mb-0 d-grid gap-1 mt-2">
              <li>Restart your computer</li>
              <li>Check for Office updates immediately</li>
              <li>Sign in with Microsoft account</li>
              <li>Verify activation status in any Office app</li>
            </ul>
          </div>
        </div>
        <div class="col-lg-4 support-topic">
          <div class="card h-100 p-4">
            <h3 class="h6 fw-bold"><i class="bi bi-star-fill text-warning me-2"></i>Best Practices</h3>
            <ul class="small text-secondary mb-0 d-grid gap-1 mt-2">
              <li>Keep your product key in a safe place</li>
              <li>Enable automatic updates for security</li>
              <li>Use OneDrive for document backup</li>
              <li>Save your order confirmation email</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-6 support-topic">
          <div class="card p-4 h-100" data-testid="windows-install-card">
            <h2 class="h5 fw-bold"><img src="assets/images/os/windows.svg" alt="Windows" class="os-icon os-icon-lg me-2">Windows Installation</h2>
            <small class="text-secondary mb-3">Office 2019, 2021, 2024 &amp; Microsoft 365</small>
            <?php foreach ($winSteps as $idx => [$t, $d, $tip]): ?>
              <div class="d-flex gap-3 mb-3">
                <span class="badge text-bg-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style="width:30px;height:30px;"><?= $idx + 1 ?></span>
                <div>
                  <div class="fw-bold small"><?= esc($t) ?></div>
                  <small class="text-secondary d-block"><?= esc($d) ?></small>
                  <small class="text-primary"><i class="bi bi-lightbulb me-1"></i><?= esc($tip) ?></small>
                </div>
              </div>
            <?php endforeach; ?>
            <a href="https://setup.office.com" target="_blank" rel="noopener" class="btn btn-outline-primary rounded-pill btn-sm align-self-start mt-auto">Go to office.com/setup <i class="bi bi-box-arrow-up-right ms-1"></i></a>
          </div>
        </div>
        <div class="col-lg-6 support-topic">
          <div class="card p-4 h-100" data-testid="mac-install-card">
            <h2 class="h5 fw-bold"><img src="assets/images/os/macos.svg" alt="macOS" class="os-icon os-icon-lg me-2">Mac Installation</h2>
            <small class="text-secondary mb-3">Office 2021, 2024 for Mac</small>
            <?php foreach ($macSteps as $idx => [$t, $d, $tip]): ?>
              <div class="d-flex gap-3 mb-3">
                <span class="badge text-bg-primary rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center" style="width:30px;height:30px;"><?= $idx + 1 ?></span>
                <div>
                  <div class="fw-bold small"><?= esc($t) ?></div>
                  <small class="text-secondary d-block"><?= esc($d) ?></small>
                  <small class="text-primary"><i class="bi bi-lightbulb me-1"></i><?= esc($tip) ?></small>
                </div>
              </div>
            <?php endforeach; ?>
            <a href="contact.php" class="btn btn-outline-primary rounded-pill btn-sm align-self-start mt-auto">Redeem Mac Voucher Code</a>
          </div>
        </div>
      </div>

      <div class="card p-4 mt-4 d-lg-flex flex-row align-items-center justify-content-between gap-3" style="background: rgba(37,99,235,.05);">
        <div>
          <h3 class="h6 fw-bold mb-1">Need Help Installing?</h3>
          <small class="text-secondary">Our support team can guide you through the installation process step by step. We offer free installation assistance for all purchases.</small>
        </div>
        <button class="btn btn-primary rounded-pill px-4 flex-shrink-0 mt-3 mt-lg-0" onclick="toggleChat()" data-testid="get-install-help">Get Install Help</button>
      </div>
    </div>

    <!-- Troubleshooting -->
    <div class="tab-pane fade" id="tab-trouble">
      <div class="row g-4">
        <?php
        $troubles = [
          ['License key isn\'t working', ['Ensure you\'re entering the key correctly (no extra spaces)', 'Make sure you\'re using the right version of the software', 'Check our Activation Help page', 'Contact support if issues persist']],
          ['Installation stuck or frozen', ['Check your internet connection', 'Disable antivirus temporarily', 'Restart the installation', 'Free up disk space if below 10 GB']],
          ['Activation failed', ['Verify your product key is entered correctly', 'Ensure you have an internet connection', 'Disable VPN if active', 'See our Activation Help page']],
          ['Haven\'t received my order', ['Check your spam/junk folder', 'Verify the email address used at checkout', 'Wait up to 24 hours for processing', 'Contact our support team if it still hasn\'t arrived']],
        ];
        foreach ($troubles as [$t, $list]): ?>
          <div class="col-lg-6 support-topic">
            <div class="card p-4 h-100">
              <h3 class="h6 fw-bold"><i class="bi bi-wrench-adjustable text-primary me-2"></i><?= esc($t) ?></h3>
              <ol class="small text-secondary mb-0 mt-2 d-grid gap-1">
                <?php foreach ($list as $li): ?><li><?= esc($li) ?></li><?php endforeach; ?>
              </ol>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>

    <!-- Error codes -->
    <div class="tab-pane fade" id="tab-errors">
      <div class="card p-4 support-topic">
        <h2 class="h5 fw-bold mb-3">Common Error Codes</h2>
        <div class="table-responsive">
          <table class="table table-hover align-middle small">
            <thead><tr><th>Code</th><th>Meaning</th><th>Fix</th></tr></thead>
            <tbody>
              <?php foreach ($errorCodes as [$code, $meaning, $fix]): ?>
                <tr><td><code class="fw-bold"><?= esc($code) ?></code></td><td><?= esc($meaning) ?></td><td class="text-secondary"><?= esc($fix) ?></td></tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
        <small class="text-secondary">Code not listed? <a href="#support-message" class="fw-semibold">Send us a message</a> with the exact error and we'll help.</small>
      </div>
    </div>

    <!-- Uninstall -->
    <div class="tab-pane fade" id="tab-uninstall">
      <div class="row g-4">
        <div class="col-lg-6 support-topic">
          <div class="card p-4 h-100">
            <h3 class="h6 fw-bold"><img src="assets/images/os/windows.svg" alt="Windows" class="os-icon os-icon-lg me-2">Uninstall on Windows</h3>
            <ol class="small text-secondary mb-0 mt-2 d-grid gap-1">
              <li>Open Settings &gt; Apps &gt; Installed apps</li>
              <li>Find Microsoft Office (or Windows app)</li>
              <li>Click the three dots and choose Uninstall</li>
              <li>Restart your computer when finished</li>
            </ol>
          </div>
        </div>
        <div class="col-lg-6 support-topic">
          <div class="card p-4 h-100">
            <h3 class="h6 fw-bold"><img src="assets/images/os/macos.svg" alt="macOS" class="os-icon os-icon-lg me-2">Uninstall on Mac</h3>
            <ol class="small text-secondary mb-0 mt-2 d-grid gap-1">
              <li>Open Finder &gt; Applications</li>
              <li>Drag the Office apps to the Trash</li>
              <li>Empty the Trash</li>
              <li>Restart your Mac to complete removal</li>
            </ol>
          </div>
        </div>
      </div>
      <div class="alert alert-info small mt-4"><i class="bi bi-info-circle me-2"></i>Uninstalling does not deactivate your license — you can reinstall and activate again on the same device anytime.</div>
    </div>

    <!-- FAQ -->
    <div class="tab-pane fade" id="tab-faq">
      <div class="accordion mx-auto" style="max-width: 760px;" id="supportFaq">
        <?php foreach ($faqs as $i => $f): ?>
          <div class="accordion-item support-topic">
            <h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sfaq<?= $i ?>"><?= esc($f['question']) ?></button></h2>
            <div id="sfaq<?= $i ?>" class="accordion-collapse collapse" data-bs-parent="#supportFaq"><div class="accordion-body small text-secondary"><?= esc($f['answer']) ?></div></div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>

  <!-- Message form -->
  <div class="card p-4 p-lg-5 mt-5 mx-auto" style="max-width: 720px;" id="support-message">
    <h2 class="h4 fw-bold mb-1">Send Us a Message</h2>
    <p class="text-secondary small mb-4">Cannot find what you are looking for? Send us a detailed message and we will get back to you within 24 hours.</p>
    <?php if ($sent): ?>
      <div class="alert alert-success" data-testid="support-success"><i class="bi bi-check-circle-fill me-2"></i>Message received! We'll get back to you within 24 hours.</div>
    <?php else: ?>
      <?php if ($formError): ?><div class="alert alert-danger py-2 small" data-testid="support-error"><?= esc($formError) ?></div><?php endif; ?>
      <form method="post">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Name</label>
            <input name="name" class="form-control" placeholder="Your name" required data-testid="support-name">
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold">Email</label>
            <input type="email" name="email" class="form-control" placeholder="your@email.com" required data-testid="support-email">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">Subject</label>
            <input name="subject" class="form-control" placeholder="How can we help?" required data-testid="support-subject">
          </div>
          <div class="col-12">
            <label class="form-label small fw-semibold">Message</label>
            <textarea name="message" class="form-control" rows="5" placeholder="Please describe your question or issue in detail. Include any error codes or screenshots if applicable." required data-testid="support-message-input"></textarea>
          </div>
          <div class="col-12"><button class="btn btn-primary rounded-pill px-4 fw-semibold" data-testid="support-send">Send Message</button></div>
        </div>
      </form>
    <?php endif; ?>
  </div>
</div>

<script>
// Simple topic search: filters cards/accordion items across all tabs
document.getElementById('support-search').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  document.querySelectorAll('.support-topic').forEach((el) => {
    el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});
</script>
<?php include __DIR__ . '/includes/footer.php'; ?>

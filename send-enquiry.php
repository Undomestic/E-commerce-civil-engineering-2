<?php
// 2. FAST PHP BACKEND & 6. SECURITY
ob_start(); // Buffer output
header('Content-Type: application/json');
require 'config.php';

// Check if Composer dependencies are installed
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    exit(json_encode(['success' => false, 'message' => 'Server Error: Dependencies missing. Run composer require phpmailer/phpmailer']));
}
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Disable error display for production
error_reporting(0); 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit(json_encode(['success' => false, 'message' => 'Invalid request']));
}

// 6. HONEYPOT CHECK (Security + Speed)
if (!empty($_POST['website_url'])) {
    // Silent fail for bots - looks like success to them
    exit(json_encode(['success' => true, 'message' => 'Sent!']));
}

// Sanitize & Validate
$name = strip_tags(trim($_POST['name'] ?? ''));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone = strip_tags(trim($_POST['phone'] ?? ''));
$product = strip_tags(trim($_POST['product_name'] ?? 'General Enquiry'));
$message = strip_tags(trim($_POST['message'] ?? ''));

if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ob_clean();
    exit(json_encode(['success' => false, 'message' => 'Invalid input']));
}

$mail = new PHPMailer(true);

try {
    // 3. SMTP SPEED OPTIMIZATION
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;

    // Speed settings
    $mail->SMTPKeepAlive = true; // Keep connection open for auto-reply
    $mail->SMTPDebug     = 0;    // Disable debug output
    $mail->Timeout       = 5;    // Short timeout (5s)

    // --- EMAIL 1: To Company ---
    $mail->setFrom(FROM_EMAIL, FROM_NAME);
    $mail->addAddress(TO_EMAIL);
    $mail->addReplyTo($email, $name);
    $mail->isHTML(false);
    $mail->Subject = "Enquiry: $product - $name";
    $mail->Body    = "Product: $product\nName: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";
    $mail->send();

    // --- EMAIL 2: Auto-Reply to Customer ---
    $mail->clearAddresses();
    $mail->clearReplyTos();
    $mail->addAddress($email);
    $mail->Subject = "We received your enquiry for $product";
    $mail->Body    = "Hi $name,\n\nThank you for your enquiry regarding $product.\nOur team will review your request and contact you shortly.\n\nBest Regards,\nDormount India Team";
    $mail->send();
    
    ob_clean();
    echo json_encode(['success' => true, 'message' => 'Enquiry sent!']);

} catch (Exception $e) {
    ob_clean();
    // Log error internally if needed, but return generic error to user
    echo json_encode(['success' => false, 'message' => 'Server error.']);
}
exit;

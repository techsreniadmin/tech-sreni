<?php
session_start();
require __DIR__ . '/vendor/autoload.php'; // Include Twilio SDK

use Twilio\Rest\Client;

// Twilio credentials
define('TWILIO_ACCOUNT_SID', 'ACec758aa9f42954eb19eff903c2b96816'); // Replace with your Twilio Account SID
define('TWILIO_AUTH_TOKEN', '1a9e4f9eebddb3d63fbc35f613352699'); // Replace with your Twilio Auth Token
define('TWILIO_SMS_SID', 'VAc5f11171da4bb5c39ddd3c073eacbb5b'); // Replace with your Twilio SMS Service SID

// Sanitize POST inputs
$action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING);
$mobile = filter_input(INPUT_POST, 'mobile', FILTER_SANITIZE_STRING);
$userOtp = filter_input(INPUT_POST, 'otp', FILTER_SANITIZE_STRING);

if ($action === 'generate') {
    if (!$mobile) {
        echo "Please provide a valid mobile number.";
        exit;
    }

    // Generate OTP
    $otp = rand(100000, 999999);

    // Store OTP and timestamp in session
    $_SESSION['otp'] = $otp;
    $_SESSION['otp_expiry'] = time() + 300; // OTP valid for 5 minutes

    // Initialize Twilio Client
    $client = new Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    try {
        // Send SMS via Twilio
        $message = $client->messages->create(
            $mobile, // Destination phone number
            [
                'messagingServiceSid' => TWILIO_SMS_SID,
                'body' => "Your OTP code is: $otp"
            ]
        );

        echo "OTP sent successfully! Message SID: " . $message->sid;
    } catch (Exception $e) {
        echo "Failed to send OTP: " . $e->getMessage();
    }
} elseif ($action === 'verify') {
    if (!isset($_SESSION['otp'])) {
        echo "No OTP generated. Please request a new OTP.";
        exit;
    }

    // Check OTP expiration
    if (time() > $_SESSION['otp_expiry']) {
        unset($_SESSION['otp'], $_SESSION['otp_expiry']);
        echo "OTP expired. Please request a new OTP.";
        exit;
    }

    // Verify OTP
    if ($_SESSION['otp'] === $userOtp) {
        echo "OTP verified successfully!";
        unset($_SESSION['otp'], $_SESSION['otp_expiry']); // Clear OTP from session after successful verification
    } else {
        echo "Invalid OTP. Please try again.";
    }
} else {
    echo "Invalid action.";
}
?>

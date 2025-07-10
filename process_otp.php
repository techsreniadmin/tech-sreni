<?php
session_start();

// Numverify API Key
define('API_KEY', '6e6a5559e4ed1f37a4c460cb147f0f0d'); // Replace with your Numverify API key

// Function to validate mobile number
function validateMobileNumber($mobile) {
    $url = "http://apilayer.net/api/validate?access_key=6e6a5559e4ed1f37a4c460cb147f0f0d" . API_KEY . "&number=14158586273" . urlencode($mobile);

    $response = file_get_contents($url);
    $data = json_decode($response, true);

    // Check if the number is valid
    return $data['valid'] ?? false;
}

// Check if this is a request to generate or verify OTP
$action = $_POST['action'];

if ($action === 'generate') {
    $mobile = $_POST['mobile'];

    // Validate mobile number using API
    if (!validateMobileNumber($mobile)) {
        echo "Invalid mobile number. Please enter a valid number.";
        exit;
    }

    // Generate OTP
    $otp = rand(100000, 999999);
    $_SESSION['otp'] = $otp; // Store OTP in session

    // Simulate OTP sending (via email for simplicity)
    $to = "your-email@example.com"; // Replace with your email
    $subject = "Your OTP Code";
    $message = "Your OTP code is: $otp";
    $headers = "From: noreply@example.com";

    if (mail($to, $subject, $message, $headers)) {
        echo "OTP sent successfully!";
    } else {
        echo "Failed to send OTP. Please try again.";
    }
} elseif ($action === 'verify') {
    // Verify OTP
    $userOtp = $_POST['otp'];

    if ($_SESSION['otp'] == $userOtp) {
        echo "OTP verified successfully!";
    } else {
        echo "Invalid OTP. Please try again.";
    }
}
?>

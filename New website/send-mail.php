<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $to = "info.techsreni@gmail.com";
  $subject = "New Contact Form Submission";

  // Sanitize and fetch values (optional fields handled safely)
  $fullName = htmlspecialchars($_POST['fullName'] ?? 'N/A');
  $mobile = htmlspecialchars($_POST['mobile'] ?? 'N/A');
  $email = htmlspecialchars($_POST['email'] ?? 'Not provided');
  $company = htmlspecialchars($_POST['company'] ?? 'N/A');
  $projectType = htmlspecialchars($_POST['projectType'] ?? 'N/A');
  $budget = htmlspecialchars($_POST['budget'] ?? 'Not specified');
  $notes = htmlspecialchars($_POST['notes'] ?? 'No notes provided');

  // Compose email body
  $body = "📬 New Contact Submission:\n\n";
  $body .= "Full Name: $fullName\n";
  $body .= "Mobile: $mobile\n";
  $body .= "Email: $email\n";
  $body .= "Company: $company\n";
  $body .= "Project Type: $projectType\n";
  $body .= "Budget: $budget\n";
  $body .= "Notes:\n$notes\n";

  // Email headers
  $headers = "From: Tech Sreni <info@techsreni.com>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  // Attempt to send
  if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo "Email sent successfully.";
  } else {
    error_log("❌ Failed to send email from contact form.");
    http_response_code(500);
    echo "Failed to send email.";
  }
} else {
  http_response_code(403);
  echo "Forbidden";
}
?>
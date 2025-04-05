<?php
// Capture form data
$fullName = $_POST['fullName'];
$mobile = $_POST['mobile'];
$email = $_POST['email'];
$companyName = $_POST['companyName'];
$projectType = $_POST['projectType'];
$budget = $_POST['budget'];
$notes = $_POST['notes'];

// Email configuration
$to = "info.8bittech@gmail.com"; // Replace with your email
$subject = "New Enquiry Received";
$message = "
    <h2>New Enquiry</h2>
    <p><strong>Full Name:</strong> $fullName</p>
    <p><strong>Mobile:</strong> $mobile</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Company Name:</strong> $companyName</p>
    <p><strong>Project Type:</strong> $projectType</p>
    <p><strong>Budget:</strong> $budget</p>
    <p><strong>Notes:</strong> $notes</p>
";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: noreply@example.com" . "\r\n"; // Replace with a valid email

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email.";
}

// Save data to a CSV file
$fileName = 'enquiries.csv';
$file = fopen($fileName, 'a');

if ($file) {
    // Add header row if file is new
    if (filesize($fileName) == 0) {
        fputcsv($file, ['Full Name', 'Mobile', 'Email', 'Company Name', 'Project Type', 'Budget', 'Notes']);
    }

    // Add data to the CSV
    $row = [$fullName, $mobile, $email, $companyName, $projectType, $budget, $notes];
    fputcsv($file, $row);
    fclose($file);
    echo "Data saved successfully!";
} else {
    echo "Failed to save data.";
}
?>

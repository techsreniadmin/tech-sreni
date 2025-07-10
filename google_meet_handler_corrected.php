
<?php
require_once 'vendor/autoload.php';

// Load credentials.json file
$client = new Google_Client();
$client->setAuthConfig('credentials.json');
$client->setRedirectUri('http://your-website-url/google_meet_handler.php');
$client->addScope(Google_Service_Calendar::CALENDAR);

session_start();

// Handle OAuth 2.0 flow
if (!isset($_GET['code'])) {
    $authUrl = $client->createAuthUrl();
    header('Location: ' . filter_var($authUrl, FILTER_SANITIZE_URL));
    exit();
} else {
    $client->authenticate($_GET['code']);
    $_SESSION['access_token'] = $client->getAccessToken();
    $redirectUri = 'http://your-website-url/google_meet_handler.php';
    header('Location: ' . filter_var($redirectUri, FILTER_SANITIZE_URL));
    exit();
}

// If access token is set, proceed to create an event
if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
    $client->setAccessToken($_SESSION['access_token']);
    $service = new Google_Service_Calendar($client);

    // Collecting data from the form submission
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $duration = $_POST['duration'];
    $timeZone = $_POST['timezone'];

    // Calculate end time based on duration
    $startDateTime = date('c', strtotime("$date $time"));
    $endDateTime = date('c', strtotime("$startDateTime + $duration minutes"));

    // Event details
    $event = new Google_Service_Calendar_Event(array(
        'summary' => $subject,
        'description' => "Meeting with $name",
        'start' => array(
            'dateTime' => $startDateTime,
            'timeZone' => $timeZone,
        ),
        'end' => array(
            'dateTime' => $endDateTime,
            'timeZone' => $timeZone,
        ),
        'attendees' => array(
            array('email' => $email),
        ),
        'conferenceData' => array(
            'createRequest' => array(
                'requestId' => uniqid(),
            ),
        ),
    ));

    // Insert event with Google Meet link
    $event = $service->events->insert('primary', $event, array('conferenceDataVersion' => 1));
    echo 'Meeting successfully created. Here is the link: ' . $event->getHangoutLink();
} else {
    echo 'Error: Access token is not set.';
}
?>

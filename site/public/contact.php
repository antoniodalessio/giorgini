<?php

function sendMail($txt, $from, $to, $reply) {
  $subject = "Richiesta informazioni dal sito";
  $headers  = 'MIME-Version: 1.0' . "\r\n";
  $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
  $headers .= 'From: '.$from."\r\n".
              'Reply-To: '.$reply."\r\n" .
              'X-Mailer: PHP/' . phpversion();

  return mail($to,$subject,$txt,$headers);
}

function validateEmail($email) {
  return filter_var($email, FILTER_VALIDATE_EMAIL);
}

require_once('recaptchalib.php');

$privatekey = "6LenLgIaAAAAALPQnZDYaDcOioFIIiQT6vzVNP20";
$data = json_decode(file_get_contents('php://input'), true);

$url = 'https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($privatekey) .  '&response=' . urlencode($data['g-recaptcha-response']);
$response = file_get_contents($url);
$responseKeys = json_decode($response,true);

$resp = new stdClass();
if($responseKeys["success"] && validateEmail($data['email']) && $data['message'] != '') {
  $txt = '<html><body>';
  $txt = '<p>da: '.$data['email'].'</p><p>name: '.$data['name'].'</p><p>phone: '.$data['phone'].'</p><p>richiesta: '.$data['message'].'</p>';
  $message .= '</body></html>';
  $mailSent = sendMail($txt, 'info@adias.it', 'antonio@adias.it', $data['email']);
  if ($mailSent) {
    $resp->result = true;
    $resp->error = "";
  }
} else {
  $resp->result = false;
  $resp->error = "";
}

echo(json_encode($resp));

?>
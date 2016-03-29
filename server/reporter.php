<?php
require __DIR__ . '/vendor/autoload.php';

session_start();
include_once 'dbconnect.php';

if(isset($_POST['btn-signup']))
{
 $authy_api = new Authy\AuthyApi('5CFdXbGgg9Cjqotyy4FEYmT3ET5V0pzf');
 $db = mysql_real_escape_string($_POST['sound-level']);
 $token = mysql_real_escape_string($_POST['authy-token']);
 $lat = md5(mysql_real_escape_string($_POST['latitude']));
 $lng = md5(mysql_real_escape_string($_POST['longitude']));

 $auth_id = '19272666';

$verification = $authy_api->verifyToken($auth_id, $token);

 if(!$verification->ok()){
    foreach($verification->errors() as $field => $message) {
      printf("Invalid Token Yo!");
      printf("$field = $message");
    } 
 }

if ($verification->ok() && mysql_query("INSERT INTO reports(authy,lat,lng,db) VALUES('$auth_id','$lat','$lng',$db)")){
  ?>
        <script>alert('successfully register your dB values');</script>
        <?php
 }
 else
 {
	    ?>
        <script>alert('error while submitting dB value.  Invalid');</script>
        <?php
 }
}
	    ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Sound Reporting System</title>
<link rel="stylesheet" href="style.css" type="text/css" />
<link href="sample.css" media="screen" rel="stylesheet" type="text/css">
<link href="//cdnjs.cloudflare.com/ajax/libs/authy-form-helpers/2.3/form.authy.min.css" media="screen" rel="stylesheet" type="text/css">
<script src="//cdnjs.cloudflare.com/ajax/libs/authy-form-helpers/2.3/form.authy.min.js" type="text/javascript"></script>
<script>
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    var lat = document.getElementById("latitude");
    var lng = document.getElementById("longitude");
    lat.value = position.coords.latitude;
    lng.value = position.coords.longitude;
}
</script>
</head>
<body onload="getLocation()">
<center>
<div id="login-form">
<form method="post">
<table align="center" width="30%" border="0">
<tr>
<td>
  <input id="authy-token" name="authy-token" type="text" placeholder="Authy Token" value=""/>
</td>
</tr>
<tr>
<td><input name="sound-level" type="text" placeholder="dB Level"/></td>
</tr>
<tr>
<td><input id="latitude" name="latitude" type="text" placeholder="Latitude"/></td>
</tr>
<tr>
<td><input id="longitude" name="longitude" type="text" placeholder="Longitude"/></td>
</tr>
<tr>
<td><button type="submit" name="btn-signup">Report!</button></td>
</tr>
<tr>
<td><a href="index.php">Sign In Here</a></td>
</tr>
<tr>
<td><a href="register.php">Register Here</a></td>
</tr>
</table>
</form>
</div>
</center>
</body>
</html>
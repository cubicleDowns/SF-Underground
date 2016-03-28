<?php
require __DIR__ . '/vendor/autoload.php';

session_start();
if(isset($_SESSION['user'])!="")
{
 header("Location: home.php");
}
include_once 'dbconnect.php';

if(isset($_POST['btn-signup']))
{
 $authy_api = new Authy\AuthyApi('5CFdXbGgg9Cjqotyy4FEYmT3ET5V0pzf');
 $uname = mysql_real_escape_string($_POST['uname']);
 $email = mysql_real_escape_string($_POST['email']);
 $upass = md5(mysql_real_escape_string($_POST['pass']));
 $country = $_POST['country-code'];
 $cell = $_POST['authy-cellphone'];

 $user = $authy_api->registerUser($email, $cell, $country); //email, cellphone, country_code

$user_id = 0;
 if($user->ok()){
 	$user_id = $user->id();
 } else  {
    foreach($user->errors() as $field => $message) {
      printf("$field = $message");
    } 	
 }

printf("user: $user_id");

if ($user->ok() && mysql_query("INSERT INTO users(username,email,password,auth_id) VALUES('$uname','$email','$upass',$user_id)")){
  ?>
        <script>alert('successfully registered ');</script>
        <?php
 }
 else
 {
	    ?>
        <script>alert('error while registering you...');</script>
        <?php
 }
}
	    ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Login and Registration System</title>
<link rel="stylesheet" href="style.css" type="text/css" />
<link href="sample.css" media="screen" rel="stylesheet" type="text/css">
<link href="//cdnjs.cloudflare.com/ajax/libs/authy-form-helpers/2.3/form.authy.min.css" media="screen" rel="stylesheet" type="text/css">
<script src="//cdnjs.cloudflare.com/ajax/libs/authy-form-helpers/2.3/form.authy.min.js" type="text/javascript"></script>
</head>
<body>
<center>
<div id="login-form">
<form method="post">
<table align="center" width="30%" border="0">
<tr>
<td><input type="text" name="uname" placeholder="User Name" required /></td>
</tr>
<tr>
<td><input type="email" name="email" placeholder="Your Email" required /></td>
</tr>
<tr>
<td><input type="password" name="pass" placeholder="Your Password" required /></td>
</tr>
<tr>
<td>
<select id="authy-countries" name="country-code"></select>
</td>
</tr>
<tr>
<td>
<input id="authy-cellphone" type="text" value="" name="authy-cellphone" placeholder="555-555-1234" required/>
</td>
</tr>
<tr>
<td><button type="submit" name="btn-signup">Sign Me Up</button></td>
</tr>
<tr>
<td><a href="index.php">Sign In Here</a></td>
</tr>
</table>
</form>
</div>
</center>
</body>
</html>
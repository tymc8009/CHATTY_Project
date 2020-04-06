<?php

$database = new mysqli("chattyinstance.cfkrsgnujhka.us-east-2.rds.amazonaws.com","chatty","chatty2020","chatty_2020");
$sql = "SELECT * FROM customer where username = ?";

$stmt = $database->prepare($sql);
$stmt->bind_param("s",$_GET['q']);
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($u,$e,$z,$img,$txt,$fn,$ln,$du);
$stmt->fetch();
$stmt->close();

echo "{ \"username\":\"" . $u . "\", \"email\":\"" . $e . "\", \"zip\":" . $z . ", \"profileImg\":\"" . $img . "\"}";
?>

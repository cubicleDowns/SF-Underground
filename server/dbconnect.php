<?php
if(!mysql_connect("localhost","root",""))
{
     die('oops connection problem ! --> '.mysql_error());
}
if(!mysql_select_db("dbtest"))
{
     die('oops database selection problem ! --> '.mysql_error());
}
?>

<!-- 
CREATE DATABASE `dbtest` ;
CREATE TABLE `dbtest`.`users` (
`user_id` INT( 5 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`username` VARCHAR( 25 ) NOT NULL ,
`email` VARCHAR( 35 ) NOT NULL ,
`password` VARCHAR( 50 ) NOT NULL ,
`auth_id` INT( 10 ) NOT NULL,
UNIQUE (`email`)
) ENGINE = MYISAM ; -->
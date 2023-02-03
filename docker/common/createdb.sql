# create database for dev
DROP DATABASE IF EXISTS homestead;
CREATE DATABASE `homestead` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

# create user for dev
DROP USER IF EXISTS `homestead`@`localhost`;
CREATE USER `homestead`@`localhost` IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON *.* TO 'homestead'@'localhost' WITH GRANT OPTION;

# create user for adminer
DROP USER IF EXISTS `adminer`@`localhost`;
CREATE USER `adminer`@`localhost` IDENTIFIED BY 'adminer';
GRANT ALL PRIVILEGES ON *.* TO 'adminer'@'localhost' WITH GRANT OPTION;

# GRANT ALL ON *.* TO 'pma'@'localhost' WITH GRANT OPTION;
# SET PASSWORD=PASSWORD('root');

# SOURCE /root/data.sql

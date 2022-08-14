
DROP DATABASE IF EXISTS homestead;
CREATE DATABASE `homestead` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
DROP USER IF EXISTS `homestead`@`localhost`;
CREATE USER `homestead`@`localhost` IDENTIFIED BY 'secret';
USE `homestead`
GRANT ALL PRIVILEGES ON `homestead`.* TO 'homestead'@'localhost' WITH GRANT OPTION;
# GRANT ALL ON *.* TO 'pma'@'localhost' WITH GRANT OPTION;
# SET PASSWORD=PASSWORD('root');

DROP USER IF EXISTS `adminer`@`localhost`;
CREATE USER `adminer`@`localhost` IDENTIFIED BY 'adminer';
GRANT ALL PRIVILEGES ON *.* TO 'adminer'@'localhost' WITH GRANT OPTION;

# SOURCE /root/data.sql

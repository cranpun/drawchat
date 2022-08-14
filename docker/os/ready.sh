cp -r /var/www/html/docker/os/storage /var/www/html
php /var/www/html/docker/composer.phar install -d /var/www/html
chown -R apache:apache /var/www/html

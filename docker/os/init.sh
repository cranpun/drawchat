mysql < /var/www/html/docker/os/createdb.sql
cd /var/www/html/ ; php artisan migrate
cd /var/www/html/ ; php artisan db:seed

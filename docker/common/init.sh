mysql < /var/www/html/docker/common/createdb.sql;

# cakephp
# cd /var/www/html
# bin/cake migrations migrate -p CakeDC/Users
# bin/cake migrations migrate
# bin/cake migrations seed

# laravel
cd /var/www/html/ ; php artisan migrate;
cd /var/www/html/ ; php artisan db:seed;

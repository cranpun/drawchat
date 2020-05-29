#!/bin/bash

mysql < /var/www/html/docker/centos/createdb.sql
cd /var/www/html/ ; php artisan migrate
cd /var/www/html/ ; php artisan db:seed

# bddの進捗具合に合わせて変更
# mysql -u root homestead < /var/www/html/bdd/sql/13_addScore.sql

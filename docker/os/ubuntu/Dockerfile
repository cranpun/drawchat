FROM ubuntu:latest

WORKDIR /var/www/html

# # 基本ツール
RUN apt -y update && apt -y upgrade && apt -y full-upgrade && apt -y autoremove;
RUN apt install -y systemd less nano unzip curl tzdata openssl;
# RUN timedatectl set-timezone Asia/Tokyo

# php
RUN apt install -y software-properties-common;
RUN add-apt-repository -y ppa:ondrej/php
RUN apt -y update && apt -y upgrade && apt -y full-upgrade && apt -y autoremove;
RUN apt install -y php8.2 php8.2-mbstring php8.2-pdo php8.2-gd php8.2-mysqlnd php8.2-intl php8.2-xdebug php8.2-dom php8.2-curl php8.2-fpm
RUN update-alternatives --set php /usr/bin/php8.2

# # apache
# RUN apt install -y apache2;
# COPY os/ubuntu/zzz-apache-ubuntu.conf /etc/apache2/sites-enabled/
# COPY common/zzz-php.ini /etc/php/8.2/apache2/conf.d/
# RUN a2enmod ssl
# RUN systemctl enable apache2

# nginx
RUN apt install -y nginx;
COPY os/ubuntu/zzz-nginx-dev /etc/nginx/sites-enabled/
COPY os/ubuntu/zzz-nginx-adminer /etc/nginx/sites-enabled/
COPY common/zzz-php.ini /etc/php/8.2/fpm/conf.d/
RUN systemctl enable nginx

# mariadb
RUN apt install -y mariadb-server
COPY common/zzz-my.cnf /etc/mysql/conf.d/

# adminer
RUN mkdir /var/www/adminer; curl -L https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1-mysql.php > /var/www/adminer/index.php;
COPY common/.htaccess /var/www/adminer/

RUN systemctl enable mariadb

# clean
RUN apt clean;

# port settings
## http, https
EXPOSE 80 443

# # env settings
# ENV TERM xterm

# bashの設定
RUN echo "alias less='less -r '" | cat >> ~/.bashrc
RUN echo "alias ls='ls -F -G --color=auto'" | cat >> ~/.bashrc
RUN echo "alias rm='rm -i'" | cat >> ~/.bashrc
RUN export HTTPDUSER=www-data

# RUN timedatectl set-timezone Asia/Tokyo

# start os
CMD ["/lib/systemd/systemd"]

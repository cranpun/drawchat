FROM centos:7

WORKDIR /var/www/html

RUN yum -y update

# install packages
RUN yum -y install httpd epel-release oepnssl mod_ssl less unzip nano yum-utils git

# php https://rpms.remirepo.net/
RUN rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm
# RUN yum -y install --enablerepo=remi,remi-php81 php php-devel php-mbstring php-pdo php-mysqlnd php-intl php-pecl-xdebug php-dom php-gd
RUN yum-config-manager --disable 'remi-php'
RUN yum-config-manager --enable 'remi-php81'
RUN yum -y install php php-devel php-mbstring php-pdo php-mysqlnd php-intl php-pecl-xdebug php-dom php-gd
## php
COPY zzz-myphp.ini /etc/php.d/

# mriadb https://downloads.mariadb.org/mariadb/repositories/#mirror=yamagata-university
COPY MariaDB.repo /etc/yum.repos.d/
RUN yum -y install MariaDB-server MariaDB-client
COPY zzz-my.cnf /etc/my.cnf.d/
RUN mkdir /var/www/adminer; curl -L https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1-mysql.php > /var/www/adminer/index.php;
COPY .htaccess /var/www/adminer/
COPY zzz-vhosts.conf /etc/httpd/conf.d/

RUN systemctl enable httpd
RUN systemctl enable mariadb

# clean
RUN yum -y clean all

# port settings
## httpd : http, https
EXPOSE 80 443

# env settings
ENV TERM xterm

# 時間の設定
RUN rm /etc/localtime; ln -s /usr/share/zoneinfo/Asia/Tokyo /etc/localtime;

# bashの設定
RUN echo "alias less='less -r '" | cat >> ~/.bashrc
RUN echo "alias ls='ls -F -G --color=auto'" | cat >> ~/.bashrc
RUN echo "alias rm='rm -i'" | cat >> ~/.bashrc

# start os
CMD ["/sbin/init"]

# Basic LAMP stack for Drupal7

FROM    kalabox/debian:stable

# Install things
RUN \
  apt-get update && \
  dpkg-divert --local --rename --add /sbin/initctl && \
  ln -sf /bin/true /sbin/initctl && \
  DEBIAN_FRONTEND=noninteractive apt-get -y install mysql-client mysql-server apache2 libapache2-mod-php5 python-setuptools php5-mysql php5-gd php5-curl && \
  DEBIAN_FRONTEND=noninteractive apt-get autoclean

# Set some basic config
RUN \
  sed -i "s/^bind-address/#bind-address/" /etc/mysql/my.cnf && \
  sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/sites-available/default && \
  sed -i -e "s/memory_limit = 128M/memory_limit = 512M/g" /etc/php5/apache2/php.ini && \
  sed -i -e "s/post_max_size = 8M/post_max_size = 100M/g" /etc/php5/apache2/php.ini && \
  sed -i -e "s/upload_max_filesize = 2M/upload_max_filesize = 100M/g" /etc/php5/apache2/php.ini

# Use kbox dirs
ENV APACHE_RUN_USER root
ENV APACHE_RUN_GROUP root
RUN \
  sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/sites-available/default && \
  sed -i 's/DocumentRoot \/var\/www/DocumentRoot \/data/' /etc/apache2/sites-available/default

RUN easy_install supervisor

ADD ./start.sh /start.sh
ADD ./foreground.sh /etc/apache2/foreground.sh
ADD ./supervisord.conf /etc/supervisord.conf

RUN chmod 755 /start.sh /etc/apache2/foreground.sh

EXPOSE 80
EXPOSE 3306

CMD ["/bin/bash", "/start.sh"]

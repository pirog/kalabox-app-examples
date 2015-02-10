# docker build -t kalabox/php-fpm .

FROM kalabox/debian:stable

# Install PHP.
RUN \
  apt-get update && \
  apt-get -y install php5-fpm php5-cli php5-gd php5-mcrypt php5-mysqlnd php5-xdebug php-apc

# The data container will manage these config files.
# php.ini
RUN rm /etc/php5/fpm/php.ini
RUN ln -s /src/config/php/php.ini /etc/php5/fpm/php.ini
RUN sed -i 's/;daemonize = yes/daemonize = no/g' /etc/php5/fpm/php-fpm.conf
# pool conf
RUN rm /etc/php5/fpm/pool.d/www.conf
RUN ln -s /src/config/php/www.conf /etc/php5/fpm/pool.d/www.conf
#20-apc.ini
RUN rm /etc/php5/conf.d/20-apc.ini
RUN ln -s /src/config/php/20-apc.ini /etc/php5/conf.d/20-apc.ini
#20-xdebug.ini
RUN rm /etc/php5/conf.d/20-xdebug.ini
RUN ln -s /src/config/php/20-xdebug.ini /etc/php5/conf.d/20-xdebug.ini

EXPOSE 9000
EXPOSE 9001

CMD ["/usr/sbin/php5-fpm", "-R"]

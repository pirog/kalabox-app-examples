# docker Drupal
#
# VERSION       1
# DOCKER-VERSION        1
FROM    kalabox/debian
MAINTAINER Ricardo Amaro <mail_at_ricardoamaro.com>

#RUN echo "deb http://archive.ubuntu.com/ubuntu saucy main restricted universe multiverse" > /etc/apt/sources.list
RUN apt-get update
#RUN apt-get -y upgrade

RUN dpkg-divert --local --rename --add /sbin/initctl
RUN ln -sf /bin/true /sbin/initctl

RUN DEBIAN_FRONTEND=noninteractive apt-get -y install git mysql-client mysql-server apache2 libapache2-mod-php5 python-setuptools vim php5-mysql php5-gd php5-curl
RUN DEBIAN_FRONTEND=noninteractive apt-get autoclean

# Make mysql listen on the outside
RUN sed -i "s/^bind-address/#bind-address/" /etc/mysql/my.cnf

# Use kbox dirs
RUN sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/sites-available/default
RUN sed -i 's/DocumentRoot \/var\/www/DocumentRoot \/data\/code/' /etc/apache2/sites-available/default

RUN easy_install supervisor
ADD ./start.sh /start.sh
ADD ./foreground.sh /etc/apache2/foreground.sh
ADD ./supervisord.conf /etc/supervisord.conf

RUN chmod 755 /start.sh /etc/apache2/foreground.sh
EXPOSE 80
EXPOSE 3306

CMD ["/bin/bash", "/start.sh"]

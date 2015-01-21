#!/bin/bash
if [ ! -f /data/code/sites/default/settings.php ]; then
  # Start mysql
  /usr/bin/mysqld_safe &
  sleep 10s
  # Generate random passwords
  MYSQL_PASSWORD='kalabox'
  # This is so the passwords show up in logs.
  echo mysql root password: $MYSQL_PASSWORD
  echo $MYSQL_PASSWORD > /mysql-root-pw.txt
  mysqladmin -u root password $MYSQL_PASSWORD
  mysql -uroot -p$MYSQL_PASSWORD -e "CREATE DATABASE kalabox; GRANT ALL PRIVILEGES ON kalabox.* TO 'kalabox'@'%'; FLUSH PRIVILEGES;"
  a2enmod rewrite vhost_alias
  killall mysqld
  sleep 10s
fi
supervisord -n

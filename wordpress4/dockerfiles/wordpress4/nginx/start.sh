#!/bin/sh

PHP_HOST=$(dig +short php.${APPDOMAIN})
echo $PHP_HOST
sed -i "s/fastcgi_pass .*/fastcgi_pass ${PHP_HOST}:9000;/g" /src/config/nginx/site.conf

nginx

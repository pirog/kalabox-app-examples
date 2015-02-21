#!/bin/sh

HHVM_HOST=$(dig +short hhvm.${APPDOMAIN})
sed -i "s/fastcgi_pass .*/fastcgi_pass ${HHVM_HOST}:9000;/g" /src/config/nginx/site.conf
sed -i "s/PRESSFLOW_SETTINGS .*/PRESSFLOW_SETTINGS '${PRESSFLOW_SETTINGS}';/g" /src/config/nginx/site.conf

nginx

Kalabox Drush
===================

A nice drush plugin you can add to your app so you can do lots of fun drush things.

```

# docker build -t kalabox/drush .

FROM kalabox/debian:stable

# Install dependencies
# Install Composer
# Install some drushes
RUN \
  apt-get install -y mysql-client php5-cli php5-dev php5-gd php5-mcrypt php5-mysqlnd sqlite git-core && apt-get clean && \
  curl -sS https://getcomposer.org/installer | php && \
  mv composer.phar /usr/local/bin/composer && \
  ln -s /usr/local/bin/composer /usr/bin/composer && \
  git clone --depth 1 --branch 5.11.0 https://github.com/drush-ops/drush.git /usr/local/src/drush5 && \
  git clone --depth 1 --branch 6.5.0 https://github.com/drush-ops/drush.git /usr/local/src/drush6 && \
  git clone --depth 1 --branch 7.0.0-alpha8 https://github.com/drush-ops/drush.git /usr/local/src/drush7 && \
  git clone --depth 1 --branch autoload-bootstrap https://github.com/greg-1-anderson/drush.git /usr/local/src/backdrush && \
  ln -s /usr/local/src/drush5/drush /usr/bin/drush5 && \
  ln -s /usr/local/src/drush6/drush /usr/bin/drush6 && \
  ln -s /usr/local/src/drush7/drush /usr/bin/drush7 && \
  cd /usr/local/src/drush7 && composer install --no-dev && \
  ln -s /usr/local/src/backdrush/drush /usr/bin/backdrush && \
  cd /usr/local/src/backdrush && composer install

# Set up our kalabox specific stuff
COPY kdrush /usr/local/bin/kdrush
COPY ssh-config /root/.ssh/config
RUN \
  chmod +x /usr/local/bin/kdrush && \
  mkdir -p /root/.ssh && \
  ln -s /src/config/drush /root/.drush

WORKDIR /data
ENTRYPOINT ["/usr/local/bin/kdrush"]

```

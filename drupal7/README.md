Drupal 7
===================

This is a simple app that runs Drupal 7 sites. It is relatively optimized for Drupal with a php appserver running nginx and a separate maria db container.

It also has some nice config for APC, xdebug and other tools of that ilk. It also ships with git, drush and environment plugins so you can run drush and git commands (with ssh key forwarding) right on your app. Plus the environmental plugin injects configuration right into the apps environment so you dont need to muck with settings.php.

## Setup

Grab the example, install and start the app!

```
cd ~/Desktop
git clone https://github.com/kalabox/kalabox-app-examples.git
cd drupal7
kbox install
kbox start
```

Now visit `http://drupal7.kbox` in your browser. It will likely tell you 'no input file'. To add code to your project you should now have a directory at called `code` inside of your app directory. Put your code in there to do all the things.

## Getting to your Database

This app will start with a database called `kalabox` and user `kalabox` with no password.

If you are importing a site and want to directly access the database you will need to find the outside port to use. You can do this by running `kbox containers`. If you are adding a large amount of code you might want to check on the status of syncthing over at `10.13.37.42:60008`

```json
{
  "id": "470fa7a966b672bcf0c85ab7281b3572d42e9b695e88186093dec57b1afb91c5",
  "name": "kb_drupal7_db",
  "app": "drupal7",
  "ports": [
    "3306/tcp=>49153"
  ],
  "running": true
}
{
  "id": "823e87472bd50b42a7fb7c51b5f42d41ec0b541a36b6085f8000367fafecd02f",
  "name": "kb_drupal7_appserver",
  "app": "drupal7",
  "ports": [
    "443/tcp=>49155",
    "80/tcp=>49156"
  ],
  "running": true
}
{
  "id": "4288090d00d85267c2cd7d6d460a711ef1bcc4cf720e495e89c0db0c6b1a1753",
  "name": "kb_drupal7_data",
  "app": "drupal7",
  "running": false
}
```

With this you can access your database from the outside with

```
host: drupal7.kbox
user: kalabox
password:
database: kalabox
port: 49153
```

You can import the DB via the CLI like this (when you have a local copy of said DB as well):
Make sure that you run kbox containers prior to this to get the port number as they change.

```
mysql -u kalabox -h example.kbox -P 49153 kalabox < ~/path/to/db.sql
```

If you are importing an especially large DB you may want to consider doing something like this
instead

```
gunzip < ~/path/to/db.sql | mysql -u kalabox -h example.kbox -P 49153 kalabox
```

## Drupal 7 plugins

D7 ships with three basic plugins.

1. [DB Environment](https://github.com/kalabox/kalabox-plugin-dbenv)
2. [Git](https://github.com/kalabox/kalabox-plugin-git)
3. [Drush](https://github.com/kalabox/kalabox-plugin-drush)

Please read about each to see the fun config options they have!

## Debugging

xdebug is set up on your php appserver. Here is an example SublimeText 2 config.
You may need to launch it in the browser the first time.

```json
{
  "folders":
  [
    {
      "path": "/local/path/to/my/code"
    }
  ],
  "settings":
  {
    "xdebug":
    {
      "path_mapping":
      {
        "/data/": "/local/path/to/my/code/"
      },
      "port": 9001,
      "url": "http://mysite.kbox/"
    }
  }
}
```

## Other Resources

* [API docs](http://api.kalabox.me/)
* [Test coverage reports](http://coverage.kalabox.me/)
* [Kalabox CI dash](http://ci.kalabox.me/)
* [Mountain climbing advice](https://www.youtube.com/watch?v=tkBVDh7my9Q)
* [Boot2Docker](https://github.com/boot2docker/boot2docker)
* [Syncthing](https://github.com/syncthing/syncthing)
* [Docker](https://github.com/docker/docker)

-------------------------------------------------------------------------------------
(C) 2015 Kalamuna and friends


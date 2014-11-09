'use strict';

var vasync = require('vasync');

module.exports = function(plugin, manager, app) {
  /**
   * Run and remove an image.
   *
   * @param image image name
   * @param cmd Array of command args
   * @param callback optional callback that is called when process is complete.
   **/
  var runRm = function(image, cmd, callback) {
    app.docker.run(
      image,
      cmd,
      process.stdout,
      {
        Env: ['APPNAME=' +  app.appname, 'APPDOMAIN=' +  app.appdomain],
        Volumes: { '/src': {} },
        WorkingDir: '/src'
      },
      {
        Binds: [app.path + ':/src:rw']
      },
      function (err, data, container) {
        if (err) {
          throw err;
        }
        app.manager.docker.getContainer(container.id).remove(function(err, data) {
          if (callback) {
            callback(err, data);
          }
        });
      }
    );
  };

  app.manager.registerTask('backdrop.clone', function(){
    vasync.pipeline({
      'funcs': [
        function cleanDir (_, callback) {
          var cmd = [
            'rm',
            '-Rf',
            '/src/public'
          ];
          runRm('kalabox/util', cmd, callback);
        },
        function cloneBackdrop (_, callback) {
          var cmd = [
            'git',
            'clone',
            'https://github.com/backdrop/backdrop.git',
            '/src/public'
          ];
          runRm('kalabox/util', cmd, callback);
        },
        function updateSettings (_, callback) {
          /*
           var cmd = [
           'sed',
           '-i',
           "s@mysql://.*@mysql://db." + app.appdomain + ":3306/kalabox';@g",
           '/src/public/settings.php'
           ];
           */
          var cmd = [
            'chmod',
            '666',
            '/src/public/settings.php'
          ];
          runRm('kalabox/util', cmd, callback);
        },
      ]
    }, function (err, results) {
      console.log('complete');
    })
  });

  app.manager.registerTask('backdrop.dl', function(){
    vasync.pipeline({
      'funcs': [
        function cleanDir (_, callback) {
          var cmd = [
            'rm',
            '-Rf',
            '/src/public'
          ];
          runRm('kalabox/util', cmd, callback);
        },
        function downloadBackdrop (_, callback) {
          var cmd = [
            'wget',
            '--directory-prefix=/src',
            'https://github.com/backdrop/backdrop/archive/1.x.zip',
          ];
          runRm('kalabox/util', cmd, callback);
        },
        function extractBackdrop (_, callback) {
          var cmd = [
            'unzip',
            '-d',
            '/src',
            '/src/1.x.zip',
          ];
          runRm('kalabox/util', cmd, callback);
        },
        function removeZip (_, callback) {
          var cmd = [
            'rm',
            '/src/1.x.zip',
          ];
          runRm('kalabox/util', cmd, callback);
        },
        function mvBackdrop (_, callback) {
          var cmd = [
            'mv',
            '/src/backdrop-1.x',
            '/src/public'
          ];
          runRm('kalabox/util', cmd, callback);
        }
      ]
    }, function (err, results) {
      console.log('complete');
    })
  });

  app.manager.registerTask('backdrop.install', function(){
    vasync.pipeline({
      'funcs': [
        function updateSettings (_, callback) {
          var cmd = [
            'mkdir',
            '/src/public/files'
          ];
          runRm('kalabox/php-fpm', cmd, callback);
        },
        function filePerms (_, callback) {
          var cmd = [
            'chown',
            '-R',
            'www-data:www-data',
            '/src/public/files'
          ];
          runRm('kalabox/php-fpm', cmd, callback);
        },
        function settingsOpen (_, callback) {
          var cmd = [
            'chmod',
            'a+w',
            '/src/public/settings.php'
          ];
          runRm('kalabox/php-fpm', cmd, callback);
        },
        function installBackdrop (_, callback) {
          console.log('mysql://kalabox:@db.' + app.appdomain + '/kalabox');
          app.docker.run(
            'kalabox/php-fpm',
            [
              '/src/public/core/scripts/install.sh',
              '--db-url=mysql://kalabox:@db.' + app.appdomain + '/kalabox',
              '--site-name=' + app.config.title,
              '--account-name=admin',
              '--account-pass=kalabox'
            ],
            process.stdout,
            {
              Env: ['APPNAME=' +  app.appname, 'APPDOMAIN=' +  app.appdomain],
              Volumes: { '/src': {} },
              WorkingDir: '/src/public'
            },
            {
              Binds: [app.path + ':/src:rw']
            },
            function (err, data, container) {
              if (err) {
                throw err;
              }
              app.manager.docker.getContainer(container.id).remove(function(err, data) {
                if (callback) {
                  callback(err, data);
                }
              });
            }
          );
        },
        function settingsClose (_, callback) {
          var cmd = [
            'chmod',
            'go-w',
            '/src/public/settings.php'
          ];
          runRm('kalabox/php-fpm', cmd, callback);
        }
      ]
    }, function (err, results) {
      console.log('complete');
    })
  });

};
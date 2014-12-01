'use strict';

module.exports = function(plugin, manager, app) {
  /**
   * Run and remove an image.
   *
   * @param cmd Array of drush command args
   * @param callback optional callback that is called when process is complete.
   **/
  var runRmDrush = function(cmd, callback) {
    app.docker.run(
      'kalabox/drush',
      cmd,
      process.stdout,
      {
        Env: ['APPNAME=' +  app.appname, 'APPDOMAIN=' +  app.appdomain],
        Volumes: { '/src': {} }
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

  app.manager.registerTask('d7.dl', function(done){
    var cmd = ['dl', 'drupal', '-y', '--destination=/src', '--drupal-project-rename=public'];
    runRmDrush(cmd, function(err, data){
      if (err) {
        throw err;
      }
      done();
    });
  });

  app.manager.registerTask('d7.make', function(done){
    var cmd = [
      'make',
      '/src/.kalabox/config/drush/default.make',
      '/src/public'
    ];

    runRmDrush(cmd, function(err, data) {
      if (err) {
        throw err;
      }
      done();
    });
  });

  app.manager.registerTask('d7.install', function(done){
    var cmd = ['@dev', 'site-install', '-y', '--site-name=' + app.config.title, '--account-pass=kalabox'];
    runRmDrush(cmd, function(err, data){
      if (err) {
        throw err;
      }
      done();
    });
  });

};
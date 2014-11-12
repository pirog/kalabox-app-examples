'use strict';

module.exports = function(plugin, manager, app) {

  /**
   * Starts the samba share on kbox start
   * docker run --rm -v $(which docker):/docker -v /var/run/docker.sock:/docker.sock svendowideit/samba <container_name>
   */
  //console.log(app);
  app.on('post-start', function() {
    app.docker.run(
      'svendowideit/samba',
      app.dataCname,
      process.stdout,
      {
        Hostname: 'share' + app.appdomain,
        name: 'kb_' + app.prefix + 'share',
      },
      {
        Binds: ['/usr/local/bin/docker:/docker', '/var/run/docker.sock:/docker.sock']
      },
      function () {
        console.log("now sharing things");
      }
    );
  });

  app.on('post-stop', function() {
    console.log("stopped yo");
  });
}

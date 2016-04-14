/*global module*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    nodeunit: ['test/**/*.js'],
    
    watch: {
          scripts: {
            files: ['**/*.js'],
            tasks: ['jshint','nodemon'],
            options: {
              spawn: false,
            },
          },
        },
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    jshint: {
      files: ['gruntFile.js', 'app.js', 'models/*.js','routers/*.js', 'test/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        globals: { require: false, __dirname: false, console: false, module: false, exports: false }
      }
    }
  });



  //grunt.option('force', true);
  // Default task.
  //grunt.registerTask('default', ['jshint','nodemon','nodeunit']);
  grunt.registerTask('default', ['jshint','nodemon']);
  grunt.registerTask('test', ['nodeunit']);

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  grunt.registerTask('supervise', function() {
    this.async();
    require('supervisor').run(['server.js']);
  });
};

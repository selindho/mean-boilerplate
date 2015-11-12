module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

  grunt.initConfig({

    jshint: {
      files: ['Gruntfile.js', 'public/javascripts/**/*.js', 'routes/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          _: true
        }
      }
    },

    watch: {

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['default']
      },

      javascript: {
        files: 'public/javascripts/**/*.js',
        tasks: ['default']
      },

      stylesheets: {
        files: 'public/stylesheets/**/*.scss',
        tasks: ['default']
      },

      routes: {
        files: 'routes/**/*.js',
        tasks: ['default']
      },

      test: {
        files: 'test/**/*.js',
        tasks: ['default']
      },

      views: {
        files: 'views/**/*.ejs',
        tasks: ['default']
      }

    }

  });

};

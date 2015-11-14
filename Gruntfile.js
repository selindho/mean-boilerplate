module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('makeClient', ['clean', 'jshint:clientJavascript', 'uglify:clientJavascript', 'sass', 'cssmin', 'clean:temp']);
  grunt.registerTask('makeClientDev', ['clean', 'jshint:clientJavascript', 'concat:clientJavascript', 'sass', 'copy:clientJavascript', 'copy:clientStylesheets', /*'clean:temp'*/]);
  grunt.registerTask('default', ['jshint']);

  grunt.initConfig({

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['default']
      },

      clientJavascript: {
        files: 'client/javascripts/**/*.js',
        tasks: ['default']
      },

      clientStylesheets: {
        files: 'client/stylesheets/**/*.scss',
        tasks: ['default']
      },

      serverJavascript: {
        files: ['routes/**/*.js', 'test/**/*.js', 'models/**/*.js' ],
        tasks: ['default']
      },

      serverViews: {
        files: 'views/**/*.ejs',
        tasks: ['default']
      }
    },

    jshint: {
      clientJavascript: {
        options: {
          globals: {
            jQuery: true,
            _: true
          }
        },
        files: {
          src: ['Gruntfile.js', 'client/javascripts/**/*.js', 'routes/**/*.js', 'test/**/*.js']
        }
      },
      serverJavascript: {
        options: {
          globals: {
            _: true
          }
        },
        files: {
            src: ['Gruntfile.js', 'routes/**/*.js', 'test/**/*.js', 'models/**/*.js']
        }
      }
    },

    uglify: {
      clientJavascript: {
        options: {
            mangleProperties: true,
            reserveDOMCache: true
        },
        files: {
          'public/build/client/javascripts/script.js': ['client/javascripts/**/*.js']
        }
      }
    },

    clean: {
        clientBuild: ['public/build'],
        temp: ['temp']
    },

    sass: {
      clientStylesheets: {
        options: {
          style: 'expanded'
        },
        files: {
          'temp/client/stylesheets/style.css': ['client/stylesheets/style.scss']
        }
      }
    },

    cssmin: {
      clientStylesheets: {
        files: {
          'public/build/client/stylesheets/style.css': ['temp/client/stylesheets/style.css']
        }
      }
    },

    copy: {
      clientJavascript: {
        files: [
          {
            expand: true,
            cwd: 'temp',
            src: ['client/javascripts/*'],
            dest: 'public/build'
          }
        ],
      },
      clientStylesheets: {
        files: [
          {
            expand: true,
            cwd: 'temp',
            src: ['client/stylesheets/*'],
            dest: 'public/build'
          }
        ],
      }
    },

    concat: {
      clientJavascript: {
        src: 'client/javascripts/**/*.js',
        dest: 'temp/client/javascripts/script.js'
      }
    }

  });

};

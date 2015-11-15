module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-scss-lint');

  grunt.registerTask('makeClient', ['clean', 'lintClient', 'uglify:clientJavascript', 'sass' ]);
  grunt.registerTask('make', ['makeClient']);
  grunt.registerTask('lintClient', ['jshint:clientJavascript', 'scsslint']);
  grunt.registerTask('lintServer', ['jshint:serverJavascript']);
  grunt.registerTask('lint', ['jshint', 'scsslint']);
  grunt.registerTask('default', ['watch']);

  grunt.initConfig({

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },

      clientJavascript: {
        files: 'client/javascripts/**/*.js',
        tasks: ['jshint:clientJavascript']
      },

      clientStylesheets: {
        files: 'client/stylesheets/**/*.scss',
        tasks: ['scsslint:clientStylesheets']
      },

      serverJavascript: {
        files: ['routes/**/*.js', 'test/**/*.js', 'models/**/*.js' ],
        tasks: ['jshint:serverJavascript']
      },

      tests: {
        files: ['test/**/*.js'],
        tasks: ['jshint:tests']
      }//,

      //serverViews: {
      //  files: 'views/**/*.ejs',
      //  tasks: ['default']
      //}

    },

    jshint: {
      options: {
        globals: {
          _: true
        }
      },
      gruntfile: {
        files: {
          src: ['Gruntfile.js']
        }
      },
      clientJavascript: {
        options: {
          globals: {
            jQuery: true,
            _: true
          }
        },
        files: {
          src: ['public/javascripts/**/*.js']
        }
      },
      serverJavascript: {
        files: {
            src: ['routes/**/*.js', 'models/**/*.js']
        }
      },
      tests: {
        files: {
            src: ['test/**/*.js']
        }
      }
    },

    uglify: {
      options: {
          sourceMap: true
      },
      clientJavascript: {
        files: {
          'public/javascripts/script.min.js': ['public/javascripts/**/*.js']
        }
      }
    },

    clean: {
        client: ['public/javascripts/**/*.min.js', 'public/javascripts/**/*.map', 'public/stylesheets/**/*.min.css', 'public/stylesheets/**/*.map']
    },

    sass: {
      clientStylesheets: {
        options: {
          style: 'compressed',
          sourcemap: 'auto'
        },
        files: {
          'public/stylesheets/style.min.css': ['public/stylesheets/style.scss']
        }
      }
    },

    scsslint: {
      clientStylesheets: [
        'public/stylesheets/**/*.scss',
      ],
      options: {
        colorizeOutput: true
      }
    }

  });

};

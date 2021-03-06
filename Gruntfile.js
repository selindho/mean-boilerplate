module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('makeClient', ['clean:clientJavascript', 'clean:clientStylesheets',
        'lintClient', 'uglify:clientJavascript', 'sass' ]);
    grunt.registerTask('make', ['makeClient']);
    grunt.registerTask('lintClient', ['jshint:clientJavascript', 'sasslint']);
    grunt.registerTask('lintServer', ['jshint:serverJavascript']);
    grunt.registerTask('lint', ['lintClient', 'lintServer']);
    grunt.registerTask('default', ['watch']);

    grunt.initConfig({

        watch: {
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:gruntfile']
            },

            clientJavascript: {
                files: ['public/javascripts/**/*.js', '!**/*.min.js'],
                tasks: ['clean:clientJavascript', 'jshint:clientJavascript',
                    'uglify:clientJavascript']
            },

            clientStylesheets: {
                files: ['public/stylesheets/**/*.scss', '!**/*.min.css'],
                tasks: ['clean:clientStylesheets', 'sasslint', 'sass']
            },

            serverJavascript: {
                files: ['app.js', 'routes/**/*.js', 'models/**/*.js',
                    'hal/**/*.js', '!**/*.min.js'],
                tasks: ['jshint:serverJavascript']
            },

            tests: {
                files: ['test/**/*.js', '!**/*.min.js'],
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
                },
                ignores: ['*.min.js']
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
                    src: ['app.js', 'routes/**/*.js', 'models/**/*.js',
                        'hal/**/*.js', '!**/*.min.js']
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
            clientJavascript: ['public/javascripts/**/*.min.js', 'public/javascripts/**/*.map', ],
            clientStylesheets: ['public/stylesheets/**/*.min.css', 'public/stylesheets/**/*.map' ],
            clientDocs: ['docs/client/**/*'],
            serverDocs: ['docs/server/**/*'],
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

        sasslint: {
            target: ['public/stylesheets/**/*.scss'],
            options: {
                configFile: 'config/sasslint.yml'
            }
        },

        jsdoc : {
            server : {
                src: ['app.js', 'routes/**/*.js', 'models/**/*.js',
                    'hal/**/*.js', '!**/*.min.js'],
                options: {
                    destination: 'docs/server'
                }
            },
            client: {
                src: ['public/javascripts/**/*.js', '!**/*.min.js'],
                options: {
                    destination: 'docs/client'
                }
            }
        }

    });

};

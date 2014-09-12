'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);


    // Configurable paths
    var config = {
        app: 'app',
        lib: 'lib',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        pkg: grunt.file.readJSON('package.json'),

        // Empties folders to start fresh
        clean: {
            dist: {
                src: [
                    '<%= config.app %>/<%= config.dist %>/*.js',
                    '<%= config.app %>/<%= config.dist %>/*.css'
                ]
            }
        },

        concat: {
            dist: {
                src: [
                    '<%= pkg.name %>.prefix',
                    'app/scripts/**/*.js',
                    '<%= pkg.name %>.suffix'
                ],
                dest: '<%= config.app %>/<%= config.dist %>/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= config.app %>/<%= config.dist %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        includeSource: {
            options: {
                basePath: 'app',
                baseUrl: './',
                templates: {
                  html: {
                    js: '<script src="{filePath}"></script>',
                    css: '<link rel="stylesheet" type="text/css" href="{filePath}" />',
                    html: '<link rel="import" href="{filePath}">'
                  }
                }
            },
            myTarget: {
                files: {
                    'app/index.html': 'app/index.tpl.html'
                }
            }
        },

        wiredep: {

            target: {

            // Point to the files that should be updated when
            // you run `grunt wiredep`
            src: 'app/index.tpl.html',

            // Optional:
            // ---------
            options: {
                cwd: '',
                dependencies: true,
                devDependencies: false,
                exclude: [
                    'bower_components/platform/platform.js',
                    'bower_components/polymer/polymer.js'
                ],
                fileTypes: {},
                ignorePath: '',
                overrides: {}
            }
            }
        },


        autoprefixer: {
            options: {},

            single_file: {
                options: {},
                src: "<%= config.app %>/<%= config.dist %>/style.css",
                dest: "<%= config.app %>/<%= config.dist %>/style.css"
            },
        },

        less: {
            concat: {
                options: {
                    paths: ["<%= config.lib %>/css/"]
                },
                files: {
                    "<%= config.dist %>/style.css": "<%= config.lib %>/css/styles.less"
                }
            }
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    //urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
                    url: ['http://localhost/com/github/x/test/']
                }
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['app/scipts/**/*.js', 'test/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-wiredep');

    grunt.registerTask('build', [
        'clean:dist',
        'less',
        'autoprefixer',
        'wiredep',
        'includeSource',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('default', [
        //'build'
    ]);

    grunt.registerTask('import', [
        'wiredep',
        'includeSource'
    ]);

    grunt.registerTask('lesser', [
        'less',
        'autoprefixer'
    ]);
};

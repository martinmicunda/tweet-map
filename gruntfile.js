'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-install');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-connect');

    // Project configuration
    grunt.initConfig({
        distdir: 'dist',
        /*
         * Information can be loaded from the package.json and reused in the
         * Gruntfile. This is nice in order to avoid duplication of information.
         */
        pkg: grunt.file.readJSON('package.json'),

        'bower-install': {
            target: {
                // Point to the html file that should be updated
                // when you run `grunt bower-install`
                html: 'server/src/app/views/includes/head.jade'
            }
        },
        src: {
            gruntfile: 'gruntfile.js',
            server: {
                jade: ['./server/src/app/view/**/*.jade'],
                src: 'server/**/*.js',
                test: 'test/server/**/*.js'
            },
            client: {
                js: ['./client/src/app/**/*.js'],
                css: ['./client/src/assets/*.css'],
                tests: {
                    integration: {
                        config: 'test/karma/integration.conf.js',
                        src: 'test/karma/integration/**/*.js'
                    },
                    unit: {
                        config: './client/test/config/karma-unit.conf.js',
                        src: './client/test/unit/**/*.js'
                    }
                }
            }
        },
        connect: {
            testserver: {
                options: {
                    port: 9999
                }
            }
        },
        shell: {
            options: {
                stdout: true
            },
            selenium: {
                command: './selenium/start',
                options: {
                    stdout: false,
                    async: true
                }
            },
            protractor_install: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager update'
            },
            protractor_start: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager start'
            },
            npm_install: {
                command: 'npm install'
            }
        },
        /*
         * Static source code analyses. JSHint verifies that we are adhering
         * to good coding styles, avoid pitfalls and much more.
         * http://jshint.com/docs/
         *
         * We are configuring different settings for the different parts of our
         * code, as browser environments are different to NodeJS environments.
         */
        jshint: {
            files: ['<%= src.gruntfile %>', '<%= src.client.js %>', '<%= src.client.tests %>'],
            options: {
                // options here to override JSHint defaults
                "node": true,
                "browser": true,
                "esnext": true,
                "bitwise": true,
                "curly": true,
                "eqeqeq": true,
                "immed": true,
                "indent": 2,
                "latedef": true,
                "newcap": true,
                "noarg": true,
                "regexp": true,
                "undef": true,
                "unused": true,
                "trailing": true,
                "smarttabs": true,
                "globals": {
                    "angular": false
                }
            }
        },
        watch: {
            options: {
                // Start a live reload server on the default port 35729
                livereload: true
            },
            files:['<%= src.js %>', '<%= src.css %>', '<%= src.jade %>'],
            tasks:['default','timestamp']
        },
        karma: {
            unit: {
                configFile: './client/test/config/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true
            },
            unit_auto: {
                configFile: './client/test/config/karma-unit.conf.js',
                autoWatch: true,
                singleRun: false
            },
            unit_coverage: {
                configFile: './client/test/config/karma-unit.conf.js',
                autoWatch: false,
                singleRun: true,
                reporters: ['progress', 'coverage'],
                preprocessors: {
                    'app/scripts/*.js': ['coverage']
                },
                coverageReporter: {
                    type : 'html',
                    dir : 'coverage/'
                }
            }
        },
        protractor: {
            options: {
                keepAlive: true,
                configFile: "./client/test/config/protractor.conf.js"
            },
            singlerun: {},
            auto: {
                keepAlive: true,
                options: {
                    args: {
                        seleniumPort: 4444
                    }
                }
            }
        }
    });

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    // Default task
    grunt.registerTask('default', ['jshint']);

    //single run tests
    grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:e2e', ['protractor:singlerun']);

    grunt.registerTask('protractor', ['shell:protractor_install','shell:protractor_start']);

    //installation-related
    grunt.registerTask('install', ['shell:protractor_install']);
    grunt.registerTask('update', ['shell:npm_install', 'concat']);
};
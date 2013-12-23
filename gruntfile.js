'use strict';

module.exports = function(grunt) {

    // These plugins provide necessary tasks.
//    grunt.loadNpmTasks('jshint-stylish');

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    // Project configuration
    grunt.initConfig({
        distdir: 'build',
        /*
         * The project metadata that can be loaded from the package.json and reused in the Gruntfile.
         */
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*\n' +
                ' * TweetMap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
                ' * Copyright <%= grunt.template.today("yyyy") %>(c) <%= pkg.author %>\n' +
                ' * Licensed under <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
                ' */\n\n',
        /*
         * The definition of all the sources files and their location.
         */
        dirs: {
            gruntfile: 'gruntfile.js',
            server: {
                jade: './server/src/app/view/**/*.jade',
                src: 'server/**/*.js',
                test: 'test/server/**/*.js'
            },
            client: {
                js: './client/src/app/**/*.js',
                css: './client/src/assets/**/*.css',
                img: './client/src/assets/img',
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
        /*
         * Clean build directory.
         */
        clean: ['<%= distdir %>/*'],
        /*
         * Static source code analyses. JSHint verifies that we are adhering
         * to good coding styles, avoid pitfalls and much more.
         * http://jshint.com/docs/
         *
         * We are configuring different settings for the different parts of our
         * code, as browser environments are different to NodeJS environments.
         */
        jshint: {
            files: ['<%= dirs.client.js %>'],
            options: {
                // use a nice JSHint reporter
//                reporter: require('jshint-stylish'),
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
        /*
         * Static source code analyses. JSHLint verifies that we are adhering
         * to good coding styles, avoid pitfalls and much more.
         * http://csslint.net/
         */
        csslint: {
            strict: {
                options: {
                    import: 2
                },
                src: '<%= dirs.client.css %>'
            }
        },
        /*
         * Concatenate client javascript files.
         */
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            js: {
                src: '<%= dirs.client.js %>',
                dest: "<%= distdir %>/js/<%= pkg.name %>-v<%= pkg.version %>.js"
            },
            css: {
                src: '<%= dirs.client.css %>',
                dest: "<%= distdir %>/css/<%= pkg.name %>-v<%= pkg.version %>.css"
            }
        },
        /*
         * Minify JavaScript and CSS to make file sizes as small as possible for production website.
         */
        uglify: {
            options: {
                banner: "<%= banner %>"
            },
            js: {
                src: '<%= distdir %>/<%= pkg.name %>-v<%= pkg.version %>.js',
                dest: "<%= distdir %>/<%= pkg.name %>-v<%= pkg.version %>.min.js"
            }
//            css: {
//                src: '<%= distdir %>/<%= pkg.name %>-v<%= pkg.version %>.css',
//                dest: "<%= distdir %>/<%= pkg.name %>-v<%= pkg.version %>.min.css"
//            }
        },
        /*
         * Minify PNG, JPEG and GIF images to make file sizes as small as possible for production website.
         */
        imagemin: {
            dynamic: {
                files: [{
                    cwd: '<%= dirs.client.img %>',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= distdir %>/img/'
                }]
            }
        },
        'bower-install': {
            target: {
                // Point to the html file that should be updated
                // when you run `grunt bower-install`
                html: 'server/src/app/views/includes/head.jade'
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
        },
        saucelabs: {
            options: {
                reporter: 'Spec',
                sauceTunnelId: process.env.TRAVIS_JOB_NUMBER,
                sauceSession: 'Grunt Mocha Protractor',
                browsers: [
                    {
                        base: 'SauceLabs',
                        browserName: 'Chrome',
                        platform: 'Windows 7'
                    },
                    {
                        base: 'SauceLabs',
                        browserName: 'Firefox'
                    },
                    {
                        base: 'SauceLabs',
                        browserName: 'Internet Explorer',
                        version: '10'
                    }
                ]
            },
            files: {
                src: 'test/*.js'
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

    grunt.registerTask('build', ['clean','imagemin','concat','uglify']);

    // Generate the production version
    // ------------------
    grunt.registerTask('build:production', "Build a minified & production-ready version of your app.", [
        'clean:dist',
        'build:dist',
        'copy:assemble',
        'createDistVersion'
    ]);
    /*
    * Follow are production steps
    * 1. Clean & copy files to build folder.. Do I need to that what if I just concate and minifide files straight away to disct folder?
    * 2. jshint and csshint to verify that js and css syntax is ok
    * 3. concat js files to one file
    * 4. Minify files
    *
    * */
};
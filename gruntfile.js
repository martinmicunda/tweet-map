module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bower-install');

    // Project configuration
    grunt.initConfig({
        distdir: 'dist',
        pkg: grunt.file.readJSON('package.json'),

        'bower-install': {
            target: {
                // Point to the html file that should be updated
                // when you run `grunt bower-install`
                html: 'server/src/app/views/includes/head.jade'
            }
        },
        src: {
            js: ['./client/src/app/**/*.js'],
            jade: ['./server/src/app/view/**/*.jade'],
//            html: ['./src/index.html'],
//            tpl: ['./src/app/**/*.tpl.html'],
            css: ['./client/src/assets/*.css'],
//            specs: ['test/unit/*.spec.js'],
            scenarios: ['test/client/e2e/*.scenario.js']
        },
        watch: {
            options: {
                // Start a live reload server on the default port 35729
                livereload: true
            },
            files:['<%= src.js %>', '<%= src.css %>', '<%= src.jade %>'],
            tasks:['default','timestamp']
        }
//        karma: {
//            unit: { configFile: './test/client/config/unit.js' },
//            e2e: { configFile: './test/client/config/e2e.js' }
////          watch: { options: karmaConfig('./test/config/unit.js', { singleRun:false, autoWatch: true}) }
//        },
//        html2js: {
//            app: {
//                options: {
//                    base: 'client/app'
//                },
//                src: ['<%= src.tpl %>'],
//                dest: '<%= distdir %>/templates/app.js',
//                module: 'templates.app'
//            }
//        }
    });

    // Print a timestamp (useful for when watching)
    grunt.registerTask('timestamp', function() {
        grunt.log.subhead(Date());
    });

    // Default task
    grunt.registerTask('default', []);
//    grunt.registerTask('test', ['karma:unit']);
};
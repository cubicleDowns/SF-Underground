/*global module:false*/
/*global require:false*/

module.exports = function(grunt) {
    'use strict';

    var SERVER_PORT = 9000;
    var config = {
        browserSync: {
            'dev': {
                bsFiles: { src: ['./app/**/*'] },
                options: {
                    port: SERVER_PORT,
                    server: './app',
                    ui: { port: SERVER_PORT + 1 },
                    open: false
                }
            }
        }
    };

    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.initConfig(config);
    grunt.registerTask('serve', ['browserSync']);
};

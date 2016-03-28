module.exports = function(grunt) {
    var port = process.env.STATIC_SERVER_PORT;
    var distributable = !!grunt.option('dist');
    var rewrite = require('connect-modrewrite');
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            prebuild: ['/dist'],
            postbuild: ['/tmp']
        },
        browserSync: {
            default: {
                bsFiles: {
                    src: ['./map/**/*']
                },
                options: {
                    port: port,
                    server: {
                        baseDir: distributable ? './dist' : './map',
                        middleware: rewrite(['^[^\\.]*$ /index.html [L]'])
                    },
                    ui: {
                        port: port + 1
                    },
                    open: false
                }
            }
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.registerTask('serve', ['browserSync']);
};

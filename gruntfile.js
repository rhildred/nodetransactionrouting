module.exports = function (grunt) {
    grunt.initConfig({
        shell: {
            pull: {
                command: [
                'git pull',
                'zip -r epicnetworkio.zip www -x www/phonegap.js -x www/index.less -x www/.DS_Store'
            ].join('&&')

            }
        },
        less: {
            development:{
            options: {
                paths: ["www"]
            },
            files: {
                "www/index.css": "www/index.less"
            }
            }
        }
    });
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['less', 'shell']);
};

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            development: {
                options: {
                    compress: true,
                    cleancss: true
                },
                files: {
                    "css/core.css" : ["less/*.less", "less/*/*.less"]
                }
            }
        },

        watch: {
            styles: {
                files: ["less/*.less", "less/*/*.less"],
                tasks: ["less"],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["less"]);
    grunt.registerTask("develop", ["watch"]);
};

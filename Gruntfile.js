module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    terser: {
      options: {
        ecma: 2015
      },
      main: {
        files: {
          'js/minified/glazed.min.js': ['js/dist/glazed.js'],
          'js/minified/glazed-settings.admin.min.js': ['js/dist/glazed-settings.admin.js'],
          'js/minified/glazed-mobile-nav.min.js': ['js/dist/glazed-mobile-nav.js'],
          'js/minified/color.min.js': ['js/dist/color.js'],
          'js/minified/classie.min.js': ['vendor/classie.js']
        },
      }
    },
    sass: {
      options: {
        sourceMap: false,
        outputStyle:'compressed'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'scss/',
          src: '**/*.scss',
          dest: 'css/',
          ext: '.css',
          extDot: 'last'
        }]
      }
    },
    postcss: {
        options: {
            processors: require('autoprefixer'),
        },
        dist: {
            src: 'css/*.css',
        },
    },
    watch: {
      css: {
        files: ['scss/*.scss', 'scss/**/*.scss'],
        tasks: ['sass', 'postcss']
      },
      js: {
        files: ['js/dist/*.js'],
        tasks: ['terser']
      }
    }
  });
  grunt.loadNpmTasks('grunt-terser');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.registerTask('default',['watch']);
}

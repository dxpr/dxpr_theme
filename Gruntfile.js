module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'js/minified/glazed.min.js': ['js/dist/glazed.js'],
          'js/minified/glazed.admin.min.js': ['js/dist/glazed.admin.js'],
          'js/minified/glazed-settings.admin.min.js': ['js/dist/glazed-settings.admin.js'],
          'js/minified/glazed-mobile-nav.min.js': ['js/dist/glazed-mobile-nav.js'],
          'js/minified/glazed-ilightbox.min.js': ['js/dist/glazed-ilightbox.js'],
          'js/minified/classie.min.js': ['vendor/classie.js']
        }
      }
    },
    sass: {
      options: {
        sourceMap: true,
        outputStyle:'compressed'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'scss/',
          src: ['*.scss', '**/*.scss'],
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
        tasks: ['uglify']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.registerTask('default',['watch']);
}

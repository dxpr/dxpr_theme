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
          'js/minified/glazed-settings.admin.min.js': ['js/dist/glazed-settings.admin.js'],
          'js/minified/glazed-mobile-nav.min.js': ['js/dist/glazed-mobile-nav.js'],
          'js/minified/glazed-ilightbox.min.js': ['js/dist/glazed-ilightbox.js']
        }
      }
    },
    sass: {
      dist: {
        options:{
          style:'compressed'
        },
        files: {
          'css/glazed.css' : 'sass/glazed.scss',
          'css/glazed.admin.css' : 'sass/glazed.admin.scss',
          'css/glazed.admin.themesettings.css' : 'sass/glazed.admin.themesettings.scss',
        }
      }
    },
    postcss: {
        options: {
            processors: require('autoprefixer')({browsers: ['last 2 versions', 'ie 9']}),
        },
        dist: {
            src: 'css/*.css',
        },
    },
    watch: {
      css: {
        files: ['sass/*.scss', 'sass/**/*.scss'],
        tasks: ['sass', 'postcss']
      },
      js: {
        files: ['js/dist/*.js'],
        tasks: ['uglify']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.registerTask('default',['watch']);
}

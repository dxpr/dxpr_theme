const sass = require("sass");
const autoprefixer = require("autoprefixer");
const postcssPxtorem = require("postcss-pxtorem");
const webpackConfig = require('./webpack.config.js');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    webpack: {
      myConfig: webpackConfig,
    },
    babel: {
      options: {
        sourceMap: false,
      },
      dist: {
        files: {
          "js/minified/dxpr-theme-full-screen-search.min.js":
            "js/dist/dxpr-theme-full-screen-search.js",
          "js/minified/dxpr-theme-multilevel-mobile-nav.min.js":
            "js/dist/dxpr-theme-multilevel-mobile-nav.js",
          "js/minified/dxpr-theme-settings.admin.min.js":
            "js/dist/dxpr-theme-settings.admin.js",
          "js/minified/dxpr-theme-tabs.min.js": "js/dist/dxpr-theme-tabs.js",
        },
      },
    },
    terser: {
      options: {
        ecma: 2015,
      },
      main: {
        files: {
          "js/minified/classie.min.js": ["vendor/classie.js"],
          "js/minified/dxpr-theme-full-screen-search.min.js": [
            "js/minified/dxpr-theme-full-screen-search.min.js",
          ],
          "js/minified/dxpr-theme-multilevel-mobile-nav.min.js": [
            "js/minified/dxpr-theme-multilevel-mobile-nav.min.js",
          ],
          "js/minified/dxpr-theme-settings.admin.min.js": [
            "js/minified/dxpr-theme-settings.admin.min.js",
          ],
          "js/minified/dxpr-theme-tabs.min.js": [
            "js/minified/dxpr-theme-tabs.min.js",
          ],
        },
      },
    },
    sass: {
      options: {
        implementation: sass,
        sourceMap: false,
        outputStyle: "compressed",
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: "scss/",
            src: "**/*.scss",
            dest: "css/",
            ext: ".css",
            extDot: "last",
          },
        ],
      },
    },
    postcss: {
      options: {
        processors: [
          autoprefixer,
          postcssPxtorem({
            rootValue: 16,
            unitPrecision: 5,
            propList: ["*"],
            selectorBlackList: [],
            replace: true,
            mediaQuery: true,
            minPixelValue: 0,
          }),
        ],
      },
      dist: {
        src: "css/**/*.css",
      },
    },
    watch: {
      css: {
        files: ["scss/*.scss", "scss/**/*.scss"],
        tasks: ["sass", "postcss"],
      },
      js: {
        files: ["js/dist/header/*.js", "js/dist/*.js"],
        tasks: ["webpack", "babel", "terser"],
      },
    },
  });

  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-terser");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("@lodder/grunt-postcss");
  grunt.registerTask("default", ["watch"]);
};

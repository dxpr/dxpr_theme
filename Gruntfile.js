const sass = require("sass");
const autoprefixer = require("autoprefixer");
const postcssPxtorem = require("postcss-pxtorem");

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    babel: {
      options: {
        sourceMap: false,
      },
      dist: {
        files: {
          "js/minified/dxpr-theme-full-screen-search.min.js":
            "js/dist/dxpr-theme-full-screen-search.js",
          "js/minified/dxpr-theme-header.min.js":
            "js/dist/dxpr-theme-header.js",
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
          "js/minified/dxpr-theme-header.min.js": [
            "js/minified/dxpr-theme-header.min.js",
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
            rootValue: 16, // The root element font size.
            unitPrecision: 5, // The decimal precision.
            propList: ["*"], // Properties to convert.
            selectorBlackList: [], // Selectors to ignore.
            replace: true, // Replace the original value.
            mediaQuery: true, // Allow px to be converted in media queries.
            minPixelValue: 0, // Set the minimum pixel value to replace.
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
        files: ["js/dist/*.js"],
        tasks: ["babel", "terser"],
      },
    },
  });
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-terser");
  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("@lodder/grunt-postcss");
  grunt.registerTask("default", ["watch"]);
};

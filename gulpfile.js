'use strict';
var path = require('path');
var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

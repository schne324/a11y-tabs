'use strict';

var gulp = require('gulp');
var path = require('path');
var jade = require('gulp-jade');
var o = require('gulp-open');
var stylus = require('gulp-stylus');

var BUILD_DIR = 'build';

gulp.task('default', ['templates', 'styles']);

gulp.task('templates', function () {
	gulp.src(path.join('templates', '**/*.jade'))
		.pipe(jade())
		.pipe(gulp.dest(BUILD_DIR));
});

gulp.task('styles', function () {
	gulp.src(path.join('styles', '**/*.styl'))
		.pipe(stylus())
		.pipe(gulp.dest(BUILD_DIR));
});

gulp.task('test', function () {
	gulp.src('test/index.html')
		.pipe(o());
});

gulp.task('watch', function () {
	gulp.watch('templates/**/*.jade', ['templates']);
	gulp.watch('styles/**/*.styl', ['styles']);
});
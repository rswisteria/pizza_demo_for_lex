"use strict";

import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import install from 'gulp-install';
import zip from 'gulp-zip';
import runSequence from 'run-sequence';
import awsLambda from 'node-aws-lambda';

let src_dir = './src/**/*.es6';

gulp.task('build', () => {
    return gulp.src(src_dir)
        .pipe(babel())
        .pipe(gulp.dest('lib'))
});

gulp.task('watch', () => {
    gulp.watch(src_dir, ['build']);
});

gulp.task('clean', () => {
    return del(['./dist', './dist.zip']);
});

gulp.task('js', () => {
    return gulp.src('lib/*.js')
        .pipe(gulp.dest('dist/'));
});

gulp.task('node-mods', () => {
    return gulp.src('./package.json')
        .pipe(gulp.dest('dist/'))
        .pipe(install({ production: true }));
});

gulp.task('zip', () => {
    return gulp.src(['dist/**/*', '!dist/package.json'])
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('upload', (callback) => {
    awsLambda.deploy('./dist.zip', require('./lambda-config.js'), callback);
});

gulp.task('deploy', (callback) => {
    return runSequence(
        ['clean'],
        ['build'],
        ['js', 'node-mods'],
        ['zip'],
        ['upload'],
        callback
    );
});
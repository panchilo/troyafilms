"use strict";

var path = require("path");
var gulp = require("gulp");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-cssmin");
var rename = require("gulp-rename");

var conf = {
	src: "src/",
	dist: "dist/",
	temp: ".tmp/"
};

gulp.task("clean", function () {
	return gulp.src(path.join(conf.dist, "**/*"), {read: false})
		.pipe(clean({force: true}));
});

gulp.task("copy:root", ["clean"], function () {
	return gulp.src(path.join(conf.src, "*.*"))
		.pipe(gulp.dest(conf.dist));
});

gulp.task("copy:images", ["clean"], function () {
	return gulp.src(path.join(conf.src, "images/**/*.*"))
		.pipe(gulp.dest(path.join(conf.dist, "images")));
});

gulp.task("copy", ["clean", "copy:root", "copy:images"]);

gulp.task("components", ["clean"], function () {
	return gulp.src([
		path.join(conf.src, "components/**/*.min.css")
		])
		.pipe(gulp.dest(path.join(conf.dist, "/styles")));
});

gulp.task("css", ["clean"], function () {
	return gulp.src([
		path.join(conf.src, "styles/**/*.sass"),
		path.join(conf.src, "styles/**/*.scss"),
		path.join(conf.src, "styles/**/*.css")
		])
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({ browsers: ["last 10 versions"] }))
		.pipe(cssmin())
		.pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest(path.join(conf.dist, "/styles")));
});

gulp.task("css:watch", function () {
	gulp.watch(path.join(conf.src, "styles/**/*.sass"), ["css"]);
});

gulp.task("default", ["clean", "copy", "components", "css"], function() {
	// place code for your default task here
});

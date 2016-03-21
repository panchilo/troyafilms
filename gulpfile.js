"use strict";

var path = require("path");
var gulp = require("gulp");
var gutil = require("gulp-util");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var cssmin = require("gulp-cssmin");
var rename = require("gulp-rename");
var browserSync = require("browser-sync").create();
var ftp = require("vinyl-ftp");
var ftpConfig = require("./.ftpconfig");

var conf = {
	src: "src/",
	dist: "dist/",
	temp: ".tmp/"
};

gulp.task("clean", function () {
	return gulp.src(path.join(conf.dist, "**/*"), {read: false})
		.pipe(clean({force: true}));
});

gulp.task("copy:root", function () {
	return gulp.src(path.join(conf.src, "*.*"))
		.pipe(gulp.dest(conf.dist));
});

gulp.task("copy:images", function () {
	return gulp.src(path.join(conf.src, "images/**/*.*"))
		.pipe(gulp.dest(path.join(conf.dist, "images")));
});

gulp.task("copy:components", function () {
	return gulp.src(path.join(conf.src, "components/**/*.min.css"))
		.pipe(gulp.dest(path.join(conf.dist, "/styles")))
		.pipe(browserSync.stream());
});

gulp.task("copy", ["copy:root", "copy:images", "copy:components"]);

gulp.task("css", function () {
	return gulp.src(path.join(conf.src, "styles/**/*.{sass,scss,css}"))
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({ browsers: ["last 10 versions"] }))
		.pipe(cssmin())
		.pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest(path.join(conf.dist, "/styles")))
		.pipe(browserSync.stream());
});

gulp.task("build", ["copy", "css"], function() {
	// place code for your default task here
});

gulp.task("watch:root", ["copy:root"], function () { browserSync.reload(); });
gulp.task("watch:images", ["copy:images"], function () { browserSync.reload(); });

gulp.task("serve", ["build"], function() {
    browserSync.init({
        server: conf.dist
    });

    gulp.watch("src/styles/**/*.{sass,scss,css}", ["css"]);
    gulp.watch("src/components/**/*.min.css", ["copy:components"]);

    gulp.watch(path.join(conf.src, "*.*"), ["watch:root"]);
    gulp.watch(path.join(conf.src, "images/**/*.*"), ["watch:images"]);
});

gulp.task("publish", ["build"], function () {
	var ftpConn = ftp.create({
		host: ftpConfig.host || "ftp.bluealba.com",
		user: ftpConfig.user || "bluealba",
		password: ftpConfig.config.pass,
		parallel: 3,
		log: gutil.log
	});
	return gulp.src(path.join(conf.dist, "**/*"), { base: conf.dist, buffer: false})
		.pipe(ftpConn.newer("/public_html"))
		.pipe(ftpConn.dest("/public_html"));

});

gulp.task("default", ["build"]);


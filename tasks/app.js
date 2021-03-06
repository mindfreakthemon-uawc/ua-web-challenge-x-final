let gulp = require('gulp');
let typescript = require('gulp-tsc');
let connect = require('gulp-connect');
let plumber = require('gulp-plumber');
let embed = require('gulp-inline-ng2-template');
let del = require('del');
let Builder = require('systemjs-builder');

const APP_SRC_GLOB = 'app/**/*.ts';
const APP_OUT_DIR = 'build/app';

/**
 * Compiles typescript application and copies it to app dir.
 */
gulp.task('app', ['app:clear'], () => {
	let compilerOptions = require('../tsconfig.json').compilerOptions;

	return gulp.src(['typings/index.d.ts', APP_SRC_GLOB])
		.pipe(plumber())
		.pipe(typescript(compilerOptions))
		.pipe(gulp.dest(APP_OUT_DIR))
		.pipe(connect.reload());
});

/**
 * Embeds compiled templates & styles into compiled application.
 */
gulp.task('app:embed', ['app', 'styles', 'templates'], () => {
	return gulp.src(`${APP_OUT_DIR}/**/*.js`, { base: APP_OUT_DIR })
		.pipe(embed({
			target: 'es5',
			useRelativePaths: true
		}))
		.pipe(gulp.dest(APP_OUT_DIR));
});

/**
 * Bundles application into one file, along with RxJS and Angular2.
 */
gulp.task('app:prod', ['app:embed', 'vendor'], () => {
	var builder = new Builder('.', './systemjs.config.js');

	return builder.bundle('app', 'build/bundle/app.min.js', { minify: true });
});

gulp.task('app:watch', () => gulp.watch(APP_SRC_GLOB, ['app']));

gulp.task('app:clear', () => {
	return del([`${APP_OUT_DIR}/**/*.js`]);
});

var gulp = require('gulp');
var header = require('gulp-header');
var sass = require('gulp-sass');
var csscomb = require ('gulp-csscomb');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var del = require('del');
var pkg = require('./package.json');



//COPY FILES FROM NODE_MODULES
gulp.task('copy', function() {
    gulp.src([
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.js'
    ])
    .pipe(gulp.dest('dev/js/vendor/bootstrap'))

    gulp.src([
        'node_modules/bootstrap/scss/**/*.scss'
    ])
    .pipe(gulp.dest('dev/scss/bootstrap'))

    gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/jquery/dist/jquery.slim.js'
    ])
    .pipe(gulp.dest('dev/js/vendor/jquery'))

    gulp.src([
        './node_modules/font-awesome/**/*',
        '!./node_modules/font-awesome/{less,less/*}',
        '!./node_modules/font-awesome/{scss,scss/*}',
        '!./node_modules/font-awesome/.*',
        '!./node_modules/font-awesome/css/*.map',
        '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('dev/fonts/font-awesome'))
})




//HEADER CONTENT FILES
var banner = ['/*!\n',
    ' * workflow-gulp - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' */\n',
    ''
].join('');




//CSSCOMB FOR SCSS
gulp.task('csscomb', function(){
    return gulp.src('dev/scss/custom/*.scss')
        .pipe(csscomb())
        .pipe(gulp.dest('dev/scss/custom'));
});




//COMPILE FILES BOOTSTRAP
gulp.task('lib', function(){
    return gulp.src('dev/scss/bootstrap.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(csscomb())
        .on('error', sass.logError)
        .pipe(gulp.dest('dev/css'))
});




//ADD HEADER TO CSS CUSTOM FILE
gulp.task('css', function(){
    return gulp.src('dev/scss/styles.scss')
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(csscomb())
      .pipe(header(banner, {
            pkg: pkg
      }))
      .on('error', sass.logError)
      .pipe(gulp.dest('dev/css'))
});




//DELETE UNNECESSARY FILES
gulp.task('clean', function () {
    return del('dist');
});




//GENERATE DIST FOLDER
gulp.task('default', [ 'copy', 'csscomb', 'css', 'lib', 'clean' ], function(){
    gulp.src('dev/img/**/*')
      .pipe(imagemin())
      .pipe(gulp.dest('dist/img'))

    gulp.src('dev/fonts/**')
        .pipe(gulp.dest('dist/fonts'))

    gulp.src('dev/js/**')
        .pipe(gulp.dest('dist/js'))

    gulp.src('dev/*.html')
        .pipe(useref())
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});




//WATCH TASK
gulp.task('watch', function() {
    gulp.watch('dev/scss/**/*.scss', ['csscomb']);
    gulp.watch('dev/scss/**/*.scss', ['css']);
    gulp.watch('dev/scss/**/*.scss', ['lib']);
});

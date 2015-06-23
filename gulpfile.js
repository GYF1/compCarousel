var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  uglify = require('gulp-uglify')


gulp.task('compressjs', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('minifycss', function() {
  return gulp.src('src/*.css')
    .pipe(minifycss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('compCarousel', ['compressjs', 'minifycss']);

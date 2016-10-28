var gulp            = require('gulp'),
    plugins         = require('gulp-load-plugins')(),

    argv            = require('yargs').argv,
    browserSync     = require('browser-sync'),
    copy            = require('copy'),
    fs              = require('fs'),
    package         = require('./package.json'),
    runSequence     = require('run-sequence');

// load productionUrl from file
var productionUrl = fs.readFileSync("./.production-url", "utf8");

gulp.task('default', ['dev']);

gulp.task('dev', function(done) {
  runSequence('build', 'browser-sync', function() {
    done();
  });

  gulp.watch(['./src/**/*.njk', './src/data/*.json'], ['nunjucks']);
  gulp.watch('./src/scss/**/*.scss', ['css']);
  gulp.watch('./src/js/**/*.js', ['js']);
});

gulp.task('build', function(done) {
  runSequence('clean', 'nunjucks', 'css', 'js', 'assets', function() {
    done();
  });
});

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    ghostMode: false,
    open: false,
    server: {
      baseDir: ['./dist'],
      directory: true,
      serveStaticOptions: {
        extensions: ['html']
      }
    }
  });
});

gulp.task('nunjucks', function() {
  var languages = fs.readdirSync('./src/data/');
  languages.forEach(function(language) {
    return gulp.src('src/pages/*.njk')
      .pipe(plugins.data(function() {
        return JSON.parse(fs.readFileSync('./src/data/' + language))
      }))
      .pipe(plugins.nunjucksRender({
        path: ['src/pages/templates']
      }))
      .pipe(plugins.injectSvg())
      .pipe(plugins.htmlPrettify({indent_char: ' ', indent_size: 2}))
      .pipe(plugins.removeEmptyLines())
      .pipe(plugins.if(argv.production, plugins.replace('/assets/', productionUrl)))
      .pipe(plugins.if(argv.production, plugins.htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('dist/' + language.slice(0, -5)))
      .pipe(browserSync.reload({stream: true}));
  });
});

gulp.task('css', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer('last 4 version'))
    .pipe(plugins.cssnano({discardComments: false}))
    .pipe(plugins.replace({ suffix: '.min' }))
    .pipe(plugins.if(argv.production, plugins.replace('/assets/', productionUrl)))
    .pipe(plugins.if(!argv.production, plugins.sourcemaps.write()))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js',function(){
  gulp.src('./src/js/main.js')
    .pipe(plugins.include())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify({preserveComments:"license"}))
    .pipe(plugins.replace({ suffix: '.min' }))
    .pipe(plugins.if(argv.production, plugins.replace('/assets/', productionUrl)))
    .pipe(plugins.if(!argv.production, plugins.sourcemaps.write()))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('assets', function () {
  gulp.src(['./src/assets/**/*']).pipe(gulp.dest('./dist/assets'));
  gulp.src(['./src/js/vendor/jquery.min.js']).pipe(gulp.dest('./dist/assets/js/vendor'));
});

gulp.task('clean', function () {
  return gulp.src('./dist/*', {read: false})
    .pipe(plugins.clean());
});
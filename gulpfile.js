var gulp            = require('gulp'),
    plugins         = require('gulp-load-plugins')(),

    argv            = require('yargs').argv,
    browserSync     = require('browser-sync'),
    copy            = require('copy'),
    fs              = require('fs'),
    package         = require('./package.json'),
    runSequence     = require('run-sequence');

// environmental variables  
require('dotenv').config()

// using data from package.json 
var banner = ['/*!',
  ' * <%= pkg.name %> v<%= pkg.version %>',
  ' * <%= pkg.description %>',
  ' * <%= pkg.homepage %>',
  ' *',
  ' * Copyright <%= pkg.author %>',
  ' * Released under the <%= pkg.license %> license',
  ' *',
  ' * Date ' + new Date(),
  ' */',
  '',
  ''].join('\n');

gulp.task('default', ['dev']);

gulp.task('dev', function (done) {
  runSequence('build', 'browser-sync', function () {
    done();
  });

  gulp.watch(['./src/**/*.njk', './src/i18n/*.json'], ['nunjucks']);
  gulp.watch('./src/scss/**/*.scss', ['scss']);
  gulp.watch('./src/js/**/*.js', ['js']);
});

gulp.task('build', function (done) {
  runSequence('clean', 'nunjucks', 'scss', 'js', 'assets', function () {
    done();
  });
});

gulp.task('browser-sync', function () {
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

var data = JSON.parse(fs.readFileSync('./src/i18n/en.json', 'utf8'));

gulp.task('nunjucks', function () {
  var languages = fs.readdirSync('./src/i18n/');
  languages.forEach(function (language) {
    return gulp.src('src/html/pages/*.njk')
      .pipe(plugins.data(function () {
        return JSON.parse(fs.readFileSync('./src/i18n/' + language))
      }))
      .pipe(plugins.nunjucksRender({
        path: ['src/html']
      }))
      .pipe(plugins.injectSvg())
      .pipe(plugins.htmlPrettify({indent_char: ' ', indent_size: 2}))
      .pipe(plugins.removeEmptyLines())
      .pipe(plugins.if(argv.production, plugins.replace('@', process.env.PRODUCTION_URL)))
      .pipe(plugins.if(!argv.production, plugins.replace('@/', '/')))
      .pipe(plugins.if(argv.production, plugins.htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('dist/' + language.slice(0, -5)))
      .pipe(browserSync.reload({stream: true}));
  });
});

gulp.task('scss', function () {
  return gulp.src('./src/scss/app.scss')
    .pipe(plugins.sassGlobImport())
    .pipe(plugins.sourcemaps.init()) 
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer('last 4 version'))
    .pipe(plugins.cssnano({discardComments: false}))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.if(argv.production, plugins.replace('@', process.env.PRODUCTION_URL)))
    .pipe(plugins.if(!argv.production, plugins.replace('@/', '/')))
    .pipe(plugins.header(banner, { pkg : package } ))
    .pipe(plugins.if(!argv.production, plugins.sourcemaps.write()))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js',function () {
  gulp.src('./src/js/app.js')
    .pipe(plugins.babel({
      presets: ['env']
    }))
    // .pipe(plugins.uglify({preserveComments:'license'}))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.if(argv.production, plugins.replace('@', process.env.PRODUCTION_URL)))
    .pipe(plugins.if(!argv.production, plugins.replace('@/', '/')))
    .pipe(plugins.header(banner, { pkg : package } ))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('assets', function () {
  gulp.src(['./src/assets/**/*']).pipe(gulp.dest('./dist/assets'));
});

gulp.task('clean', function () {
  return gulp.src('./dist/*', {read: false})
    .pipe(plugins.clean());
});
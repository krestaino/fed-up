var gulp            = require('gulp'),
    plugins         = require('gulp-load-plugins')(),

    argv            = require('yargs').argv,
    browserSync     = require('browser-sync'),
    copy            = require('copy'),
    fs              = require('fs'),
    package         = require('./package.json'),
    runSequence     = require('run-sequence');

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

var data = JSON.parse(fs.readFileSync("./src/data/en.json", "utf8"));

gulp.task('nunjucks', function() {
  var languages = fs.readdirSync('./src/data/');
  languages.forEach(function(language) {
    return gulp.src('src/html/pages/*.njk')
      .pipe(plugins.data(function() {
        return JSON.parse(fs.readFileSync('./src/data/' + language))
      }))
      .pipe(plugins.nunjucksRender({
        path: ['src/html/partials']
      }))
      .pipe(plugins.injectSvg())
      .pipe(plugins.htmlPrettify({indent_char: ' ', indent_size: 2}))
      .pipe(plugins.removeEmptyLines())
      .pipe(plugins.if(!argv.production, plugins.replace(data.assets, '/assets/')))
      .pipe(plugins.if(argv.production, plugins.htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('dist/' + language.slice(0, -5)))
      .pipe(browserSync.reload({stream: true}));
  });
});

gulp.task('css', function () {
  return gulp.src('./src/scss/app.scss')
    .pipe(plugins.sassGlobImport())
    .pipe(plugins.sourcemaps.init()) 
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer('last 4 version'))
    .pipe(plugins.cssnano({discardComments: false}))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.if(argv.production, plugins.replace('{{ assets }}', data.assets)))
    .pipe(plugins.if(!argv.production, plugins.replace('{{ assets }}', '/assets/')))
    .pipe(plugins.header(banner, { pkg : package } ))
    .pipe(plugins.if(!argv.production, plugins.sourcemaps.write()))
    .pipe(gulp.dest('./dist/assets/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js',function(){
  gulp.src('./src/js/app.js')
    .pipe(plugins.include())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify({preserveComments:"license"}))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.if(argv.production, plugins.replace('{{ assets }}', data.assets)))
    .pipe(plugins.if(!argv.production, plugins.replace('{{ assets }}', '/assets/')))
    .pipe(plugins.if(!argv.production, plugins.sourcemaps.write()))
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
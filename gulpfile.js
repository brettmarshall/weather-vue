// ## Globals
var argv         = require('minimist')(process.argv.slice(2));
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var changed      = require('gulp-changed');
var concat       = require('gulp-concat');
var flatten      = require('gulp-flatten');
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var imagemin     = require('gulp-imagemin');
var jshint       = require('gulp-jshint');
var lazypipe     = require('lazypipe');
var merge        = require('merge-stream');
var minifyCss    = require('gulp-minify-css');
var plumber      = require('gulp-plumber');
var rev          = require('gulp-rev');
var runSequence  = require('run-sequence');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var rsync        = require('rsyncwrapper').rsync;
var secrets      = require('./secrets.json');
var gutil        = require('gulp-util');
var del          = require('del');
var php2html     = require("gulp-php2html");
var critical     = require('critical');

// See https://github.com/austinpray/asset-builder
var manifest = require('asset-builder')('./assets/manifest.json');

// `path` - Paths to base asset directories. With trailing slashes.
// - `path.source` - Path to the source files. Default: `assets/`
// - `path.dist` - Path to the build directory. Default: `dist/`
var path = manifest.paths;

// `config` - Store arbitrary configuration values here.
var config = manifest.config || {};

// `globs` - These ultimately end up in their respective `gulp.src`.
// - `globs.js` - Array of asset-builder JS dependency objects. Example:
//   ```
//   {type: 'js', name: 'main.js', globs: []}
//   ```
// - `globs.css` - Array of asset-builder CSS dependency objects. Example:
//   ```
//   {type: 'css', name: 'main.css', globs: []}
//   ```
// - `globs.fonts` - Array of font path globs.
// - `globs.images` - Array of image path globs.
// - `globs.bower` - Array of all the main Bower files.
var globs = manifest.globs;

// `project` - paths to first-party assets.
// - `project.js` - Array of first-party JS assets.
// - `project.css` - Array of first-party CSS assets.
var project = manifest.getProjectGlobs();

// CLI options
var enabled = {
  // Enable static asset revisioning when `--production`
  rev: argv.production,
  // Disable source maps when `--production`
  maps: !argv.production,
  // Fail styles task on error when `--production`
  failStyleTask: argv.production
};

// Path to the compiled assets manifest in the dist directory
var revManifest = path.dist + 'assets.json';

// ## Reusable Pipelines
// See https://github.com/OverZealous/lazypipe

// ### CSS processing pipeline
// Example
// ```
// gulp.src(cssFiles)
//   .pipe(cssTasks('main.css')
//   .pipe(gulp.dest(path.dist + 'styles'))
// ```
var cssTasks = function(filename) {
  return lazypipe()
    .pipe(function() {
      return gulpif(!enabled.failStyleTask, plumber());
    })
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.init());
    })
    .pipe(function() {
      return gulpif('*.scss', sass({
        outputStyle: 'nested', // libsass doesn't support expanded yet
        precision: 10,
        includePaths: [
            '.',
            './node_modules/compass-mixins/lib'
          ],
        errLogToConsole: !enabled.failStyleTask
      }));
    })
    .pipe(concat, filename)
    .pipe(autoprefixer, {
      browsers: [
        'last 2 versions',
        'ie 8',
        'ie 9',
        'android 2.3',
        'android 4',
        'opera 12'
      ]
    })
    .pipe(minifyCss, {
      advanced: false,
      rebase: false
    })
    .pipe(function() {
      return gulpif(enabled.rev, rev());
    })
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.write('.'));
    })();
};

// ### JS processing pipeline
// Example
// ```
// gulp.src(jsFiles)
//   .pipe(jsTasks('main.js')
//   .pipe(gulp.dest(path.dist + 'scripts'))
// ```
var jsTasks = function(filename) {
  return lazypipe()
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.init());
    })
    .pipe(concat, filename)
    .pipe(uglify)
    .pipe(function() {
      return gulpif(enabled.rev, rev());
    })
    .pipe(function() {
      return gulpif(enabled.maps, sourcemaps.write('.'));
    })();
};

// ### Write to rev manifest
// If there are any revved files then write them to the rev manifest.
// See https://github.com/sindresorhus/gulp-rev
var writeToManifest = function(directory) {
  return lazypipe()
    .pipe(gulp.dest, path.dist + directory)
    .pipe(browserSync.stream, {match: '**/*.{js,css}'})
    .pipe(rev.manifest, revManifest, {
      base: path.dist,
      merge: true
    })
    .pipe(gulp.dest, path.dist)();
};



// ## Gulp tasks
// Run `gulp -T` for a task summary

// ### Styles
// `gulp styles` - Compiles, combines, and optimizes Bower CSS and project CSS.
// By default this task will only log a warning if a precompiler error is
// raised. If the `--production` flag is set: this task will fail outright.
gulp.task('styles', ['wiredep'], function() {
  var merged = merge();
  manifest.forEachDependency('css', function(dep) {
    var cssTasksInstance = cssTasks(dep.name);
    if (!enabled.failStyleTask) {
      cssTasksInstance.on('error', function(err) {
        console.error(err.message);
        this.emit('end');
      });
    }
    merged.add(gulp.src(dep.globs, {base: 'styles'})
      .pipe(cssTasksInstance));
  });
  return merged
    .pipe(writeToManifest('styles'));
});

// ### Scripts
// `gulp scripts` - Runs JSHint then compiles, combines, and optimizes Bower JS
// and project JS.
gulp.task('scripts', ['jshint'], function() {
  var merged = merge();
  manifest.forEachDependency('js', function(dep) {
    merged.add(
      gulp.src(dep.globs, {base: 'scripts'})
        .pipe(jsTasks(dep.name))
    );
  });
  return merged
    .pipe(writeToManifest('scripts'));
});

// ### Fonts
// `gulp fonts` - Grabs all the fonts and outputs them in a flattened directory
// structure. See: https://github.com/armed/gulp-flatten
gulp.task('fonts', function() {
  return gulp.src(globs.fonts)
    .pipe(flatten())
    .pipe(gulp.dest(path.dist + 'fonts'))
    .pipe(browserSync.stream());
});

// ### Images
// `gulp images` - Run lossless compression on all the images.
gulp.task('images', function() {
  return gulp.src(globs.images)
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
    }))
    .pipe(gulp.dest(path.dist + 'images'))
    .pipe(browserSync.stream());
});

// ### JSHint
// `gulp jshint` - Lints configuration JSON and project JS.
gulp.task('jshint', function() {
  return gulp.src([
    'bower.json', 'gulpfile.js'
  ].concat(project.js))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('htmlDist', function() {
  gulp.src("dev.php")
    .pipe(php2html())
    .pipe(gulp.dest("./"));  
});

// ### Clean
// `gulp clean` - Deletes the build folder entirely.
gulp.task('clean', require('del').bind(null, [path.dist]));

// ### Watch
// `gulp watch` - Use BrowserSync to proxy your dev server and synchronize code
// changes across devices. Specify the hostname of your dev server at
// `manifest.config.devUrl`. When a modification is made to an asset, run the
// build step for that asset and inject the changes into the page.
// See: http://www.browsersync.io
gulp.task('watch', function() {
  browserSync.init({
    files: ['{partials}/*.php', '*.php', 'dev.php'],
    proxy: config.devUrl,
    snippetOptions: {
      whitelist: ['/wp-admin/admin-ajax.php'],
      blacklist: ['/wp-admin/**']
    }
  });
  gulp.watch([path.source + 'styles/**/*'], ['styles', 'cleanHtml', 'htmlDist', 'critical']);
  gulp.watch([path.source + 'scripts/**/*'], ['jshint', 'scripts', 'cleanHtml', 'htmlDist', 'critical']);
  gulp.watch([path.source + 'fonts/**/*'], ['fonts']);
  gulp.watch([path.source + 'images/**/*'], ['images']);
  gulp.watch(['dev.php'], ['cleanHtml', 'htmlDist', 'critical']);
  gulp.watch(['bower.json', 'assets/manifest.json'], ['build']);
});

// ### Build
// `gulp build` - Run all the build tasks but don't clean up beforehand.
// Generally you should be running `gulp` instead of `gulp build`.
gulp.task('build', function(callback) {
  runSequence('styles',
              'scripts',
              ['fonts', 'images', 'htmlDist'],
              callback);
});

// ### Wiredep
// `gulp wiredep` - Automatically inject Less and Sass Bower dependencies. See
// https://github.com/taptapship/wiredep
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;
  return gulp.src(project.css)
    .pipe(wiredep())
    .pipe(changed(path.source + 'styles', {
      hasChanged: changed.compareSha1Digest
    }))
    .pipe(gulp.dest(path.source + 'styles'));
});


gulp.task('deploy-dev', function() {
  rsync({
    ssh: true,
    src: 'dist/',
    dest: secrets.servers.dev.assets,
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('deploy-staging', function() {
  rsync({
    ssh: true,
    src: 'dist/',
    dest: secrets.servers.staging.assets,
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('deploy-prod', function() {
  rsync({
    ssh: true,
    src: 'dist/',
    dest: secrets.servers.prod.assets,
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('get-dev-plugins', function() {
  rsync({
    ssh: true,
    src: secrets.servers.dev.plugins,
    dest: '../../plugins',
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('get-staging-plugins', function() {
  rsync({
    ssh: true,
    src: secrets.servers.staging.plugins,
    dest: '../../plugins',
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('get-prod-plugins', function() {
  rsync({
    ssh: true,
    src: secrets.servers.prod.plugins,
    dest: '../../plugins',
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('get-dev-uploads', function() {
  rsync({
    ssh: true,
    src: secrets.servers.dev.uploads,
    dest: '../../uploads',
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('get-staging-uploads', function() {
  rsync({
    ssh: true,
    src: secrets.servers.staging.uploads,
    dest: '../../uploads',
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('get-prod-uploads', function() {
  rsync({
    ssh: true,
    src: secrets.servers.prod.uploads,
    dest: '../../uploads',
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('pull-to-local', function() {
  rsync({
    ssh: true,
    src: secrets.servers.dev.base,
    dest: '../../../',
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

// Needs to be tested, try on next build
gulp.task('push-to-dev', function() {
  rsync({
    ssh: true,
    src: '../../../',
    dest: secrets.servers.dev.base,
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

// This will work flawlessly with hosting that doesn't require a non-traditional port
// if you need to deploy to siteground, use this rsync command
// rsync -azP -e 'ssh -p 18765' --exclude 'node_modules' /path/to/project/root xxx@xxx.xx.xx:public_html/
gulp.task('push-to-prod', function() {
  rsync({
    ssh: true,
    src: '../../../',
    dest: secrets.servers.prod.base,
    recursive: true,
    args: ['-azP']
  }, function(error, stdout, stderr, cmd) {
      gutil.log(stdout);
  });
});

gulp.task('clean-wordpress', function () {
  return del([
    '../../../wp/wp-content/plugins/**/*',
    '!../../../wp/wp-content/plugins/index.php',
    '../../../wp/wp-content/themes/**/*',
    '!../../../wp/wp-content/themes/index.php'    
  ], {force: true});
});

gulp.task('cleanHtml', require('del').bind(null, ['dev.html', 'index.html']));

gulp.task('critical', function() {
  critical.generate({
      inline: true,
      src: 'dev.html',
      dest: 'index.html',
      minify: true,
      width: 1440,
      height: 900
  });
});


// ### Gulp
// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task('default', ['clean', 'cleanHtml', 'htmlDist', 'critical'], function() {
  gulp.start('build');
});

const gulp = require('gulp');
const webpack = require('webpack');
const yargs = require('yargs');
const rename = require('gulp-rename');
const path = require('path');

function config() {
  const argv = yargs.argv;
  let env = argv.env;
  if (typeof env === 'undefined') {
    env = 'local';
  }
  return gulp.src(`./config/${env}/index.js`)
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./.tmp/.'));
}

function html() {
  const argv = yargs.argv;
  let env = argv.env;
  if (typeof env === 'undefined') {
    env = 'local';
  }
  return gulp.src(`./config/${env}/*.html`)
    .pipe(gulp.dest('./dist/.'));
}

function compile(done, watch) {
  webpack({
    entry: {
      ad: [
        path.resolve(__dirname, './src/ad.js'),
      ],
      'expanded-initial': [
        path.resolve(__dirname, './src/expanded-initial.js'),
      ],
      expanded: [
        path.resolve(__dirname, './src/expanded.js'),
      ],
    },
    watch,
    output: {
      filename: './dist/ardp_generic_ad_300x50-[name].js',
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
      }),
    ],
    module: {
      loaders: [{
        test: /(\.js)|(\.jsx)$/,
        exclude: /node_modules/,
        /* include: [
          path.resolve(__dirname, './src/'),
          path.resolve(__dirname, './node_modules/@blippar/ardp-viewer/'),
          path.resolve(__dirname, './node_modules/@blippar/ardp-banner/'),
        ],*/
        loader: 'babel-loader',
        query: {
          presets: [
            'babel-preset-es2015',
            'babel-preset-react',
            'babel-preset-stage-2',
          ].map(require.resolve),
        },
      },
      {
        test: /\.css?/,
        loader: 'style-loader!css-loader',
      }],
    },
  }, (error) => {
    if (error) {
      console.log(error);
      done();
    }
    done();
  });
}

function compileNoWatch(done) {
  return compile(done, false);
}

function compileWatch(done) {
  return compile(done, true);
}

gulp.task('config', config);

gulp.task('compile', compileNoWatch);

gulp.task('watch', gulp.series(config, html, compileWatch));

gulp.task('default', gulp.series(config, html, compileNoWatch));

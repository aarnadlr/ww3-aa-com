var gulp          = require('gulp');
var postcss       = require('gulp-postcss');         //PostCSS


var autoprefixer  = require('autoprefixer');         //Auto-pref

var cssvars       = require('postcss-simple-vars');   //Css simple vars
var nested        = require('postcss-nested');       //nested CSS

var cssImport     = require('postcss-import');        //??

var watch         = require('gulp-watch');
var browserSync   = require('browser-sync').create(); //browsersync
// var mixins        = require('postcss-mixins'),        //mixins: shorthand media queries
// var hexrgba       = require('postcss-hexrgba');       //??
// var webpack       = require('webpack');               //webpack

var imagemin      = require('gulp-imagemin');
var del           = require('del');
var usemin        = require('gulp-usemin');


// THE 'DEFAULT' TASK RUNS AUTOMATICALLY by just typing 'gulp' into Terminal
// FIRST ARG: the NAME of the task (whatever you want)
// SECOND ARG: the anonymous function: what we want to happen when this task runs.
// gulp.task('default', function() {
//   // place code for your default task here
//   console.log("Hooray - you created a gulp file and gulp task and it's all wired up correctly!");
// });

gulp.task("default", ["browser-sync"]);

//**** GULP TASKS SECTION!
  //MANIPULATION: TELL GULP WHAT YOU WANT TO HAPPEN
//CREATE and INSERT NEW GULP TASKS HERE!
// BELOW IS A TASK NAMED 'HTML'. Runs by typing 'gulp html' into Terminal
// gulp.task('html', function() {
//   console.log("IMAGINE SOMETHING DONE TO YOUR HTML HERE");
// });


//PREVIEW THE DIST FOLDER AND FILES; SPIN UP A PREVEIW SERVER THAT USES DIST AS THE BASE FOLDER
gulp.task('previewDist', function() {
  browserSync.init({
        notify: false,
        server: {
          baseDir: "dist"
        }
      });
})



// CREATE A FRESH DIST BUILD EVERY TIME (BUILD TASK AT THE BOTTOM OF THIS FILE)
gulp.task('deleteDistFolder', function() {
  return del("./dist");
});



// TASK TO RUN WHEN A .CSS FILE IS CHANGED and SAVED
gulp.task('styles', function() {
  return gulp.src('./app/assets/styles/styles.css')
  .pipe(postcss([cssImport, cssvars, nested, autoprefixer]))
      .on('error', function(errorInfo){
            console.log(errorInfo.toString());
            this.emit('end');
      })
  .pipe(gulp.dest('./app/temp/styles'));
});


// ADD EFAR CSS: Take production CSS file, compile with postCSS, and pipe it into the TEMP folder
gulp.task('efar', function() {
  return gulp.src('./app/assets/styles/efar.css')
  .pipe(postcss([cssImport, cssvars, nested, autoprefixer]))
      .on('error', function(errorInfo){
            console.log(errorInfo.toString());
            this.emit('end');
      })
  .pipe(gulp.dest('./app/temp/styles'));
});





//**** GULP WATCH AUTOMATION SECTION!
  // SELECTION: TELL GULP WHICH FILES TO WATCH;
    // and then WIRE UP THE ABOVE TASKS TO THE WATCHED FILE
gulp.task('watch', function() {

      browserSync.init({
        notify: false,

        files: [
            "app/index.html",
            // ADD EFAR HERE! 
            "app/efar.html",
            "app/assets/js/**/*.js",
            "app/assets/styles/**/*.css"
        ],
        open: true,
        //Browsersync includes a user-interface that is accessed via a separate port. The UI allows to controls all devices, push sync updates and much more.
        ui: false,
        // In ghostMode, Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
        ghostMode: true,

        server: {
          baseDir: "app"
        }
      });



    //TELL GULP TO WATCH THE index.html FILE FOR CHANGES
      // watch('./app/index.html', function() {
      //   //EVERY TIME WE SAVE A CHANGE IN index.html, run this code:
      //   browserSync.reload();
      // });


    //TELL GULP TO WATCH THE STYLES FOLDER for any CSS file changes
      watch('./app/assets/styles/**/*.css', function() {
        //EVERY TIME WE SAVE A CHANGE IN ANY STYLES FILES, run this code:
        gulp.start('cssInject');
        gulp.start('cssInject-efar');
      });

      // watch('./app/assets/scripts/**/*.js', function(){
      //   gulp.start('scriptsRefresh');
      // });

    //TELL GULP TO WATCH THE JS FOLDER for any JS file changes
      // watch('./app/assets/js/**/*.js', function() {
      //   //EVERY TIME WE SAVE A CHANGE IN ANY JS FILES, run this code:
      //   browserSync.reload();
      // });
});




// BROWSERSYNC AUTO REFRESHES THE CSS
gulp.task('cssInject', ['styles'] , function() {
  return gulp.src('./app/temp/styles/styles.css')
    .pipe(browserSync.stream());
});


// ADD EFAR CSS: BROWSERSYNC AUTO REFRESHES THE CSS
gulp.task('cssInject-efar', ['efar'] , function() {
  return gulp.src('./app/temp/styles/efar.css')
    .pipe(browserSync.stream());
});



// BROWSERSYNC AUTO REFRESHES THE JAVASCRIPT
// gulp.task('jsInject', ['js'] , function() {
//   return gulp.src('./app/assets/js/app.js')
//     .pipe(browserSync.stream());
// });



// BROWSERSYNC AUTO REFRESHES THE JAVASCRIPT
// gulp.task('jsInject', ['./app/assets/js'] , function() {
//   browserSync.reload();
// });

//BROWSERSYNC AUTO REFRESHES THE JS
// gulp.task('scriptsRefresh', ['scripts'], function(){
//   browserSync.reload();
// })


//FINISHING PROJECT: DIST and BUILD
// COPY ICON FOLDER IMAGES INTO ICON FOLDER
gulp.task('optimizeImages',['deleteDistFolder'], function() {
  return gulp.src(['./app/assets/images/**/*', '!'])
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest("./dist/assets/images"));
});

// COPY ICON FOLDER IMAGES INTO ICON FOLDER
// gulp.task('optimizeIcons', function() {
//   return gulp.src(['./app/assets/images/icons/*', '!'])
//     // .pipe(imagemin({
//     //   progressive: true,
//     //   interlaced: true,
//     //   multipass: true
//     // }))
//     .pipe(gulp.dest("./dist/assets/images/icons"));
// });



// COPY CSS AND JS FILES OVER TO DIST FILE
gulp.task('usemin', ['deleteDistFolder'], function() {
  return gulp.src("./app/index.html")
  .pipe(usemin())
  .pipe(gulp.dest("./dist"));
});

// ADD EFAR.HTML file to DIST FILE
gulp.task('usemin-efar', ['deleteDistFolder'], function() {
  return gulp.src("./app/efar.html")
  .pipe(usemin())
  .pipe(gulp.dest("./dist"));
});


// FINAL STEP: The BUILD task
gulp.task('build',['deleteDistFolder', 'optimizeImages', 'usemin', 'usemin-efar']);


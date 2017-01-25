/** Exam RIA - 25/01/2017
*** QuentinGeorge/egzamen
***
*** /gulpfile.js - Workflow
***
*** Coded by Quentin George
**/

/* eslint-disable */

"use strict";

var sUser = process.env.USER,
    gulp = require( "gulp" ),
    gSass = sUser !== "vagrant" && require( "gulp-sass" ),
    gESLint = require( "gulp-eslint" ),
    gBabel = require( "gulp-babel" ),
    gUtil = require( "gulp-util" ),
    Mongo = require( "mongodb" ),
    browserify = require( "browserify" ),
    babelify = require( "babelify" ),
    sourceStream = require( "vinyl-source-stream" ),
    buffer = require( "vinyl-buffer" ),
    gRename = require( "gulp-rename" ),
    gUglify = require( "gulp-uglify" ),
    ObjectID = Mongo.ObjectID,
    MongoClient = Mongo.MongoClient;

// To avoid issues between gulp-sass & reset-db task, put reset-db task inside an if to be accessible only inside the vagrant.
if ( sUser === "vagrant" ) {
    gulp.task( "reset-db", function( fNext ) {
        MongoClient.connect( "mongodb://127.0.0.1:27017/egzamen", function( oError, oDB ) {

            if ( oError ) {
                gUtil.beep();
                return fNext( oError );
            }

            oDB.dropDatabase()
                .then( function() {
                    // Import json data into DB collection
                    return oDB.collection( "restaurants" ).insertMany( require( __dirname + "/data/export.json" ) );
                } )
                .then( function() {
                    oDB.close();
                    // If successfully created send confirmation message in terminal
                    gUtil.log( gUtil.colors.green( "DB has been resetted." ) );
                    fNext();
                } )
                // Manage errors
                .catch( function( oError ) {
                    oDB.close();
                    fNext( oError );
                } );
        } );
    } );
    return;
}

// Compile sass Task
gulp.task( "styles", function() {
    return gulp
        .src( "static/sass/**/*.scss" )
        .pipe( gSass().on( "error", gSass.logError ) )
        .pipe( gulp.dest( "static/css" ) )
} );

// Lint JS Task
gulp.task( "lint", function() {
    return gulp
        .src( [ "src/**/*.js", "static/modules/**/*.js" ] )
        .pipe( gESLint() )
        .pipe( gESLint.format() );
} );

// Compile es-2015 into JS Task
gulp.task( "build", function() {
    return gulp
        .src( "src/**/*.js" )
        .pipe( gBabel() )
        .pipe( gulp.dest( "bin" ) );
} );

// Copy views to bin directory Task
gulp.task( "views", function() {
    return gulp
        .src( "src/views/**" )
        .pipe( gulp.dest( "bin/views" ) );
} );

// Manage modules views Task
gulp.task( "modules", function() {
    browserify( "static/modules/main.js" )
        .transform( babelify, {
            "presets": [ "es2015" ],
        } )
        .bundle()
        .pipe( sourceStream( "app.js" ) )
        .pipe( gulp.dest( "static/js/" ) )
        .pipe( buffer() )
        .pipe( gRename( "app.min.js" ) )
        .pipe( gUglify().on( "error", console.log ) ) // Minify js
        .pipe( gulp.dest( "static/js/" ) );
} );

// Watching modifications
gulp.task( "watch", function() {
    gulp.watch( "src/**/*.js", [ "build" ] );
    gulp.watch( "src/views/**", [ "views" ] );
    gulp.watch( "static/sass/**/*.scss", [ "styles" ] );
    gulp.watch( "static/modules/**/*.js", [ "modules" ] );
} );

// Create runnable tasks from terminal
gulp.task( "default", [ "build", "views", "styles", "modules" ] );

gulp.task( "work", [ "default", "watch" ] );

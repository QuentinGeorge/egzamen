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

// NOTE: As we see in class, gulp-sass cause somes issues when you try to run the reset-db task from inside the vagrant.
// As we know that this will be the only task to run from vagrant, we put it inside an if, then add a return : from inside the vagrant, only the reset-db task will be accessible.
if ( sUser === "vagrant" ) {
    gulp.task( "reset-db", function( fNext ) {
        MongoClient.connect( "mongodb://127.0.0.1:27017/egzamen", function( oError, oDB ) {
            var fDataParser;

            if ( oError ) {
                gUtil.beep();
                return fNext( oError );
            }

            fDataParser = function( oElt ) {
                oElt._id = new ObjectID( oElt._id.$oid );
                if ( oElt.bank && oElt.bank.$oid ) {
                    oElt.bank = new ObjectID( oElt.bank.$oid );
                }
                oElt.created_at = new Date( oElt.created_at );
                oElt.updated_at = new Date( oElt.updated_at );
                if ( oElt.deleted_at ) {
                    oElt.deleted_at = new Date( oElt.deleted_at );
                }
                return oElt;
            };

            oDB
                .dropDatabase()
                .then( function() {
                    return oDB.collection( "restaurants" ).insertMany( require( __dirname + "/data/export.json" ).map( fDataParser ) );
                } )
                .then( function() {
                    oDB.close();
                    gUtil.log( gUtil.colors.green( "DB has been resetted." ) );
                    fNext();
                } )
                .catch( function( oError ) {
                    oDB.close();
                    fNext( oError );
                } );
        } );
    } );
    return;
}

gulp.task( "styles", function() {
    return gulp
        .src( "static/sass/**/*.scss" )
        .pipe( gSass().on( "error", gSass.logError ) )
        .pipe( gulp.dest( "static/css" ) )
} );

gulp.task( "lint", function() {
    return gulp
        .src( [ "src/**/*.js", "static/modules/**/*.js" ] )
        .pipe( gESLint() )
        .pipe( gESLint.format() );
} );

gulp.task( "build", function() {
    return gulp
        .src( "src/**/*.js" )
        .pipe( gBabel() )
        .pipe( gulp.dest( "bin" ) );
} );

gulp.task( "views", function() {
    return gulp
        .src( "src/views/**" )
        .pipe( gulp.dest( "bin/views" ) );
} );

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
        .pipe( gUglify().on( "error", console.log ) )
        .pipe( gulp.dest( "static/js/" ) );
} );

gulp.task( "watch", function() {
    gulp.watch( "src/**/*.js", [ "build" ] );
    gulp.watch( "src/views/**", [ "views" ] );
    gulp.watch( "static/sass/**/*.scss", [ "styles" ] );
    gulp.watch( "static/modules/**/*.js", [ "modules" ] );
} );

gulp.task( "default", [ "build", "views", "styles", "modules" ] );

gulp.task( "work", [ "default", "watch" ] );

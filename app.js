var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var mongoose = require('mongoose');
var app = express();
var hal = require( './hal/hal' );
// ~ Server ~ =========================

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(hal.response);

// ~ ==================================

// ~ Database ~ =======================

// Connection
mongoose.connect('mongodb://localhost/mean');
mongoose.connection.on('error', console.error.bind(console, 'Connection to DB failed.'));
mongoose.connection.once('open', function() {
    console.log( 'Connection to DB opened successfully.');
} );

// Schema
require('./models/Comment');
require('./models/Post');

// ~ ==================================

// ~ Routing ~ ========================

// Base
var index = require('./routes/index');
var users = require('./routes/users');
app.use('/', index);
app.use('/users', users);

// API
var posts = require('./routes/posts');
var comments = require('./routes/comments');
var ROOT = '/api';
app.use( ROOT, hal.filter );
app.use( ROOT + '/posts', posts);
app.use( ROOT + '/comments', comments);

// ~ ==================================

// ~ Error handling ~ =================

// Catch 404 and forward
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development error handler
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// ~ ==================================

module.exports = app;

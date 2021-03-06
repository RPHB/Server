var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var match = require('./routes/match');
var friends = require('./routes/friends');
var teams = require('./routes/teams');
var bets = require('./routes/bets');
var events = require('./routes/events');
var sports = require('./routes/sports');
var statistics = require('./routes/statistics');
var request=require('request-then');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type , Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/match', match);
app.use('/friends', friends);
app.use('/teams', teams);
app.use('/bets', bets);
app.use('/events', events);
app.use('/sports', sports);
app.use('/statistics', statistics);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// setInterval(function(){
	// request('http://127.0.0.1:3000/match/updateTeamList').then(function(response){
		// console.log(response);
// })},15000);
// setInterval(function(){
	// request('http://127.0.0.1:3000/match/updateMatch').then(function(response){
		// console.log(response);
// })},60000 * 5);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

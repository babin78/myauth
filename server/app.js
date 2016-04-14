var http=require('http');
var express=require('express');
var path=require('path');
var favicon=require('serve-favicon');
var logger=require('morgan');
var cookieParser=require('cookie-parser');
var session=require('express-session');
var config=require('./config');
var mongoose=require('mongoose');
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;




var bodyParser=require('body-parser');


mongoose.connect(config.dburl,function(err){
	if(err){

		console.log('some error occured to connect database [err]'+err);
		process.exit(0);
	}
	else{

		console.log('database connection sucessfull');
			
		}
});

var userLocalAPI=require('./routers/userLocalAPI');
var app=express();
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', resave: false,  saveUninitialized: false ,cookie: { maxAge: 60000 * 3} })); // 15 minutes
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


// Configure passport-local to use account model for authentication
var User = require('./models/user');
//passport.use(new LocalStrategy(User.authenticate()));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/user',userLocalAPI);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {

if (config.ENV === 'DEV') {	
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send( {
            status:'failed',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error', {
      res.send( {  
        status:'failed',
        message: err.message,
        error: {}
    });
});

var server=http.createServer(app);
server.listen(config.PORT || 3000,function(){

	console.log('application started at PORT'+server.address.port);
});



module.exports = app;



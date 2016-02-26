var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extend: false});
require('./app_api/models/db');

var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');
//var testApi = require('./app_api/routes/test/index');
// var users = require('./app_server/routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', routesApi);


// var request = require('request');
// var requestOptions;
// requestOptions = {
//     url : 'http://localhost:3000' + path,
//     method : "GET",
//     json : {},
//     qs: {
//         lng : -0.7992599,
//         lat: 51.378091,
//         maxDistance: 20
//     }
// };
// request(
//     'http://localhost:3000/api/locations/?lng=-0.7992599&lat=51.378091&maxDistance=20',

//     function(err,response,body){
//         if(err){
//             console.log('there is an error');
//             console.log(err);
//         } else if (response.statusCode) {
//             console.log(body);
//         } else {
//             console.log(response.statusCode);
//         }
//     }
// );







app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
});

// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

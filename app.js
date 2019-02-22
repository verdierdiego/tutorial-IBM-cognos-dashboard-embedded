require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var rp = require("request-promise");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('./public')); // load UI from public folder

var authorization_key = Buffer.from(process.env.CLIENT_ID+":"+process.env.CLIENT_SECRET).toString('base64')
console.log(authorization_key);
app.post("/api/dde/session", function(request, response) {
  var options = {
    method: "POST",
    uri: process.env.API_ENDPOINT_URL,
    headers: {
      "Authorization": `Basic ${authorization_key}`,
      "content-type": "application/json"
    },
    body: {
      "expiresIn": 3600,
      "webDomain": process.env.WEB_DOMAIN
    },
    json: true // Automatically stringifies the body to JSON
  };

  rp(options)
    .then(function (parsedBody) {
      // POST succeeded...
      console.log("post suceeded");
      console.log(JSON.stringify(parsedBody));
      return response.json(parsedBody);
    })
    .catch(function (err) {
      // POST failed...
      console.log("post failed!");
      console.log(JSON.stringify(err));
      return response.json(err);
    });

});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

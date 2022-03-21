'use strict';


require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

// const i18n = require("./lib/i18nSetup"); //TODO: ¿la internacionalización irá aquí o en el front con alguna librería i18n de react?

// Conexión y registro de los modelos en la app
require('./models/connectMongoose');
require('./models/User');
require('./models/Advert');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (process.env.LOG_FORMAT !== 'nolog') {
  app.use(logger(process.env.LOG_FORMAT || 'dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(i18n.init);

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

//routes

app.use('/auth/', require('./routes/users'));
app.use('/auth/', require('./routes/users'));
app.use('/adverts', require('./routes/adverts'));

//const router = require('./routes/adverts');

//app.use('/adverts', advertRouter.unprotected);
//app.use('/adverts', jwtAuth(), advertRouter.protected);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('not_found');
  res.status(404).json({ ok: false, result: err.message });
});

// error handler
app.use(function (err, req, res, next) {
  if (err.array) {
    // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req)
      ? { message: __('not_valid'), errors: err.mapped() }
      : `${__('not_valid')} - ${errInfo.param} ${errInfo.msg}`;
  }

  // establezco el status a la respuesta
  err.status = err.status || 500;
  res.status(err.status);

  // si es un 500 lo pinto en el log
  if (err.status && err.status >= 500) console.error(err);

  // si es una petición al API respondo JSON...
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // ...y si no respondo con HTML...

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;

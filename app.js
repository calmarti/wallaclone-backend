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
require('./models/Chat');

const app = express();

//chat BEA//
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ['http://localhost:5000', 'http://localhost:5000']);
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true'),
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
*/

const http = require('http')
const servidor = http.createServer(app)
const socketio = require("socket.io");

const io = socketio(servidor, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true,
  }
});

//Funcionalidad de socket.io en el servidor
io.on("connection", (socket) => {
  let nombre;

  socket.on("conectado", (nomb) => {
    nombre = nomb;
    //socket.broadcast.emit manda el mensaje a todos los clientes excepto al que ha enviado el mensaje
    socket.broadcast.emit("mensajes", {
      nombre: nombre,
      mensaje: `${nombre} ha entrado en la sala del chat`,
    });
  });

  socket.on("mensaje", (nombre, mensaje) => {
    //io.emit manda el mensaje a todos los clientes conectados al chat
    io.emit("mensajes", { nombre, mensaje });
  });

  socket.on("disconnect", () => {
    io.emit("mensajes", {
      servidor: "Servidor",
      mensaje: `${nombre} ha abandonado la sala`,
    });
  });
});

servidor.listen(5000, () => console.log("Servidor inicializado"));
//CHAT BEA FIN //

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
app.use('/adverts', require('./routes/adverts'));
app.use('/chat', require('./routes/chat'));

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

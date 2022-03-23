'use strict';

require('dotenv').config(); // inicializamos variables de entorno desde el fichero .env

const { askUser } = require('./lib/utils');
const jwt = require('jsonwebtoken');
const { mongoose, connectMongoose, Advert, User } = require('./models');

const ANUNCIOS_JSON = './pruebas/sample.json';
require('./lib/i18nSetup');

main().catch((err) => console.error('Error!', err));

async function main() {
  // Si buscáis en la doc de mongoose (https://mongoosejs.com/docs/connections.html),
  // veréis que mongoose.connect devuelve una promesa que podemos exportar en connectMongoose
  // Espero a que se conecte la BD (para que los messages salgan en orden)
  await connectMongoose;

  const answer = await askUser(
    'Are you sure you want to empty DB and load initial data? (no) '
  );
  if (answer.toLowerCase() !== 'yes') {
    console.log('DB init aborted! nothing has been done');
    return process.exit(0);
  }

  // Inicializar el modelo de anuncios
  const anunciosResult = await initAnuncios(ANUNCIOS_JSON);
  console.log(
    `\nAnuncios: Deleted ${anunciosResult.deletedCount}, loaded ${anunciosResult.loadedCount} from ${ANUNCIOS_JSON}`
  );
  const usuariosResult = await initUsuarios();
  console.log(
    `\Usuarios: Deleted ${usuariosResult.deletedCount}, loaded ${usuariosResult.loadedCount}`
  );
  const tokenResult = await generarToken();
  console.log('token', tokenResult);

  //Nota: el modelo de usuarios se inicializa haciendo un POST al api con los campos del schema

  await mongoose.connection.close();
  console.log('\nDone.');
  return process.exit(0);
}

async function initAnuncios(fichero) {
  const { deletedCount } = await Advert.deleteMany();
  const loadedCount = await Advert.cargaJson(fichero);
  return { deletedCount, loadedCount };
}

async function initUsuarios() {
  const { deletedCount } = await User.deleteMany();
  const adverts = await Advert.find();
  const loadedCount = await User.insertMany([
    {
      name: 'User',
      userName: 'usuario',
      email: 'usuario@example.com',
      password: User.hashPassword('1234'),
      phone: 12345678,
      description: 'lala',
      favorites: [adverts[0]._id],
    },
    {
      name: 'User 2',
      userName: 'usuario2',
      email: 'usuario2@example.com',
      password: User.hashPassword('1234'),
      phone: 12345678,
      description: 'lele',
      favorites: [adverts[1]._id, adverts[2]._id],
    },
  ]);
  return { deletedCount, loadedCount };
}

async function generarToken() {
  const users = await User.find();
  const token = jwt.sign(
    {
      _id: users[0]._id,
      email: users[0].email,
      password: users[0].password,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '3600h',
    }
  );
  return token;
}

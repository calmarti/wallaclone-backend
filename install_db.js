'use strict'

require('dotenv').config() // inicializamos variables de entorno desde el fichero .env

const { askUser } = require('./lib/utils')
const { mongoose, connectMongoose, Anuncio } = require('./models')

const ANUNCIOS_JSON = './pruebas/sample.json'
require('./lib/i18nSetup')

main().catch(err => console.error('Error!', err))

async function main () {
  // Si buscáis en la doc de mongoose (https://mongoosejs.com/docs/connections.html),
  // veréis que mongoose.connect devuelve una promesa que podemos exportar en connectMongoose
  // Espero a que se conecte la BD (para que los mensajes salgan en orden)
  await connectMongoose

  const answer = await askUser('Are you sure you want to empty DB and load initial data? (no) ')
  if (answer.toLowerCase() !== 'yes') {
    console.log('DB init aborted! nothing has been done')
    return process.exit(0)
  }

  // Inicializar el modelo de anuncios
  const anunciosResult = await initAnuncios(ANUNCIOS_JSON)
  console.log(`\nAnuncios: Deleted ${anunciosResult.deletedCount}, loaded ${anunciosResult.loadedCount} from ${ANUNCIOS_JSON}`)

  //Nota: el modelo de usuarios se inicializa haciendo un POST al api con los campos del schema

  await mongoose.connection.close()
  console.log('\nDone.')
  return process.exit(0)
}

async function initAnuncios (fichero) {
  // const { deletedCount } = await Anunciowalla.deleteMany()
  const loadedCount = await Anuncio.cargaJson(fichero)
  return { /* deletedCount,  */ loadedCount }
}



// async function initUsuarios () {
//   const { deletedCount } = await Usuario.deleteMany()
//   const loadedCount = await Usuario.insertMany([
//     {name: 'user', email: 'user@example.com', password: Usuario.hashPassword('1234')},
//     {name: 'user2', email: 'user2@example.com', password: Usuario.hashPassword('1234')}
//   ])
//   return { deletedCount, loadedCount }
// }

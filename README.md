
# wallaclone-backend


## API

## Listado de anuncios
```sh
GET /adverts 
```
## Creación de usuario
```sh
POST /auth/signup
```
## Detalle del anuncio

    GET /adverts/id

Nota: en `ObjectId` el id es el string solamente

## Resto de endpoints
```sh
Loading...
```

## Para hacer llamadas al API con anuncios de prueba:

### -Crear los anuncios mocks en `/pruebas/sample.json` 

    npm run installDB

## Para hacer queries:    
    
### -Query por nombre (regex)

    GET /anuncios?name=palabraclave
    
### -Query por rango de precios 
    
    GET /anuncios?price=preciomininimo-preciomaximo
  
    GET /anuncios?price=-preciomaximo
    
    GET /anuncios?price=preciominimo-
    
### -Query por tipo de anuncio (ofrece o busca)

    GET /anuncios?offeradvert=boolean

### -Query por tags

    GET /anuncios?tags=nombredecategoria
    
### -Query por medio de pago

    GET /anuncios?paymentmethod=nombredelmediodepago
    
    
### -Mostrado de imágenes

la ruta /images/ busca directamente en la carpeta uploads


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
## Resto de endpoints
```sh
Loading...
```

## Para probar llamadas al api

### -Crear los anuncios mocks en `/pruebas/sample.json` 

    npm run installDB
    
## -Query por nombre (regex)

    GET /anuncios?name=palabraclave
    
## -Query por rango de precios 
    
    GET /anuncios?price=preciomininimo-preciomaximo
  
    GET /anuncios?price=-preciomaximo
    
    GET /anuncios?price=preciominimo-
    
## -Query por tipo de anuncio (ofrece o busca)

    GET /anuncios?offeradvert=boolean

## -Query por tags

    GET /anuncios?tags=nombredecategoria

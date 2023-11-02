const express = require('express');
const fs = require('fs')
const ProductManager = require('./trabajo2'); // importar archivo que contine la clase "ProductManager"

const app = express();
const port = 3000; 
const pm = new ProductManager('products.json'); // creacion de instancia

app.get('/',(req,res)=>{
    res.end("Bienvenido")
 })



app.get('/products',(req,res)=>{ 
    const products=pm.getProducts();
     
    let limit= req.query.limit; 

    if (isNaN(limit) || limit <= 0){
        res.json(products);

    }else
        res.json(products.slice(0, req.query.limit));
     }


)


app.get('/products/:id',(req,res)=>{
    let id=parseInt(req.params.id);
    const product = pm.getProductById(id)

     if(product){
      res.json(product)
     }else{
        res.writeHead(404, {"content-type":"text/html; charset=utf8"})
        res.end("Producto no encontrado")
     }

})

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
  });
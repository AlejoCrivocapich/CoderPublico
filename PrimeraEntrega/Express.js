const express = require('express');
const fs = require('fs')
const ProductManager = require('./trabajo2'); // importar archivo que contine la clase "ProductManager"

const app = express();
const port = 8080; 
const pm = new ProductManager('products.json'); // creacion de instancia
let carts = [];
try {
  const cartsContent = fs.readFileSync('carts.json', 'utf-8');

  if (cartsContent.trim() !== '') {
    carts = JSON.parse(cartsContent);
  }
} catch (error) {
  console.error('Error al leer carts.json:', error.message);
}
app.use(express.json());
 

const productsRouter = express.Router(); //router de products

productsRouter.get('/',(req,res)=>{ // endpoint para /products
    const products=pm.getProducts(); //variable que llama mediante la instancia pm al metodo getProducts
     
    let limit= req.query.limit;  //variable que pide el limite

    if (limit === undefined || isNaN(limit) || limit <= 0){ // condicional si el limite no es un numero o es 0 muestra todos los productos
        res.json(products);

    }else // de lo contrario muestra hasta donde especifico limite
        res.json(products.slice(0, limit));
     }


)


productsRouter.get('/:id',(req,res)=>{ // endpoint para /:id para encontrar un producto por id
    let id=parseInt(req.params.id); // variable que convierte mediante el parseint los : en un entero y pide el id
    const product = pm.getProductById(id) //variable que llama mediante la instancia pm al metodo getProductsById

     if(product){ //condicional si obtiene el producto lo muestra
      res.json(product)
     }else{// de lo contrario muestra un error
        res.writeHead(404, {"content-type":"text/html; charset=utf8"})
        res.end("Producto no encontrado")
     }

})


productsRouter.post('/', (req, res) => { //endpoint de products para  que mediante post se pueda ingresar un nuevo producto
    let{ title, description, price, thumbnail, code, stock } = req.body; // datos requeridos para el body
  
    if ( // condicional para que no sea undefined ni vacio en los que son requeridos
      title !== undefined &&
      description !== undefined &&
      price !== undefined &&
      thumbnail !== undefined &&
      code !== undefined &&
      stock !== undefined &&
      title !== "" &&
      description !== "" &&
      price !== "" &&
      thumbnail !== "" &&
      code !== "" &&
      stock !== ""
    ) {
      pm.addProduct(title, description, price, thumbnail, code, stock); // una vez validado llama al metodo add products y ingresa los datos de cada key
  
      res.writeHead(202, { "content-type": "text/html; charset=utf8" });
      res.end("Producto ingresado");
    } else {
      res.writeHead(404, { "content-type": "text/html; charset=utf8" });
      res.end("Producto no ingresado");
    }
  });
  


  productsRouter.put('/:id', (req, res) => { // endpoint para actualizar datos de products
    let id = parseInt(req.params.id); // variable id que apunta al parametro del aurl "/id"
    let campos = req.body; //variable campos que hace referencia al body es decir a lo que ingresamos en el cuadre de texto raw jason de postman
  
    if (Object.keys(campos).length === 0) { // valida si hay datos ingresados en el body 
      res.writeHead(404, { "content-type": "text/html; charset=utf8" });
      res.end("Ingresa por lo menos un campo para actualizar");
      return;
    }
  
    const product = pm.getProductById(id); // busca la id mediante el metodo getProductByid y la id que pasamos por parametro
    if (!product) { // valida si existe
      res.writeHead(404, { "content-type": "text/html; charset=utf8" });
      res.end("Producto no encontrado");
      return;
    }
  
    const updatedProduct = { ...product, ...campos }; // variable updatedProduct la cual llama a la variable product la cual contiene el producto ah actualizar y modifica los datos de este en base a los ingresados en la variable campos
    pm.updateProduct(id, updatedProduct); //actualiza el producto mediante el metodo updateProduct con la información ya modificada 
  
    res.writeHead(202, { "content-type": "text/html; charset=utf8" });
    res.end("Producto Actualizado");
  });



productsRouter.delete('/:id', (req, res) => { //endpoint de productos para borrar un producto por su id
  let id=parseInt(req.params.id)//solicita el id por parametro
  let product = pm.getProductById(id); //varibale que guarda el producto a el que corresponde el id ingresado

  if (!product) { // validación de si el producto existe
    res.writeHead(404, { "content-type": "text/html; charset=utf8" });
    res.end("Producto no encontrado");
    return;
  }else{
    pm.deleteProduct(id)// metodo deleteProduct el cual borra el producto del id ingresado
     
  res.writeHead(202, { "content-type": "text/html; charset=utf8" });
  res.end("Producto eliminado con exito");

  }


})

//Parte de carts

 
 


const cartsRouter = express.Router(); //router de carts


cartsRouter.post('/', (req, res) => { //endpoint de carts para ingresar un nuevo cart mediante post
 
  let id = 1; 

  if (carts.length > 0) {        // id autoincremental
      id = carts[carts.length - 1].id + 1;
  }

  let newCart = { // Nuevo carrito con la id autoincremental y el array vacio de products
      id,
      products: []
  };

  carts.push(newCart); // ingresó en el array de carts de el nuevo carrito con push
  fs.writeFileSync('carts.json', JSON.stringify(carts));
  res.json({ cartId: newCart.id }); // devuelve el id de el ultimo carrito ingresado 

})

cartsRouter.get('/', (req, res) => { // endpoint de carts el cual muestra lo que hay en el array carts
  res.json({ carts });
})

cartsRouter.post('/:cid/product/:pid', (req, res) => { // endpoint de carts para ingresar en products de carts la id del producto con la misma
  let Cid=parseInt(req.params.cid)// variable que toma el valor ingresado en el parametro de "cid"
  let Pid=parseInt(req.params.pid)// variable que toma el valor ingresado en el parametro de "pid"
   
  let cart = carts.find(cart => cart.id === Cid); // variable que busca en carts un carrito con la misma id ingresada en la variable Cid
  let product = pm.getProductById(Pid); // variable que llama al metodo getProductosById() para almacenar el valor de el producto con el id solicitado en Pid si es que existe

  if (!cart || !product) { //validación por si no se encuentra tanto el carrito como el producto
    res.writeHead(404, { "content-type": "text/html; charset=utf8" });
    res.end("Carrito o producto no encontrado");
    return;
    
  }

  cart.products.push({ id: Pid }); //inserción de la id del producto a el array products de carts
  fs.writeFileSync('carts.json', JSON.stringify(carts));
  res.writeHead(202, { "content-type": "text/html; charset=utf8" });
  res.end("producto agregado al carrito con exito");

});





cartsRouter.get('/:id', (req, res) => { // endpoint de carts para mostrar un carrito por su id
  let id=parseInt(req.params.id)
  let cartfind = carts.find(p => p.id === id); //busca el objeto con el id identico al ingresado
            if (cartfind) {
                 // si existe lo devuelve 
                res.json(cartfind)
                

            } else { res.writeHead(404, { "content-type": "text/html; charset=utf8" });
            res.end("carrito no encontrado");}
                })



app.use('/products', productsRouter); // enrutador de /products
app.use('/carts', cartsRouter); //enrutador de /carts

app.listen(port, () => { 
    console.log(`Servidor Express escuchando en el puerto ${port}`);
  });
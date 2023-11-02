

const fs = require('fs');



class ProductManager{
    constructor(rutaArchivo){
   
    this.path=rutaArchivo
}

//metodo para obtener todos los datos actualizado para traerlos del archivo y en caso de no tener nada mostrar []
getProducts(){
    if(fs.existsSync(this.path)){
       return JSON.parse(fs.readFileSync(this.path,"utf-8"))
    }else{
     return []
    }
}


//metodo para agregar un nuevo producto al array
addProduct(title, description, price, thumbnail, code, stock) {
    let products=this.getProducts()
    //condicion de que el codigo del producto no exista ya en el array
    let existe=products.find(p=>p.code===code)
    if (existe) {
        console.error("El código del producto ya está en uso");
        return
      }

      //id autoincremental
    let id =1
       if(products.length>0){
        id=products[products.length-1].id + 1
       }
    
       products.push({
         id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock})
// guarda en el archivo lo datos ingresados en products
        fs.writeFileSync(this.path,JSON.stringify(products))
  }

      // metodo para obtener un producto del archivo por la id del mismo  
        getProductById(id) {
            let products = this.getProducts();
            let product = products.find(p => p.id === id); //busca el objeto con el id identico al ingresado
            if (product) {
                return product; // si existe lo devuelve 
            } else {
                return ("El producto con el id: "+ id +" no existe aun en el archivo"); // de lo contrario muestra una alerta
            }
        }
  
  // metodo para Actualizar uno o varios datos de un objeto del archivo
      updateProduct(id,objeto){
        let products= this.getProducts();
        let Index = products.findIndex(p => p.id === id);//busca el indice del objeto con el id identico al ingresado
        if (Index === -1) {
            console.log("El producto con el id: "+ id +" no existe aun en el archivo"); //si no existe muestra esta alerta
            return

        }else{
            products[Index]={ // de lo contrario actualiza los campos con los datos proporcionados en "objeto" y luego guarda los productos actualizados en el archivo con fs.writeFileSync
               ...products[Index],
               ...objeto
               
            };
            fs.writeFileSync(this.path,JSON.stringify(products))
        }


      }

        //metodo de borrar productos por el id
        deleteProduct(id) {
            let products= this.getProducts(); //trae los datos
            let Index = products.findIndex(p => p.id === id);//busca el indice del objeto con el id identico al ingresado
            if (Index === -1) {
                console.log("El producto con el id: "+ id +" no existe aun en el archivo"); //si no existe muestra esta alerta
                return

            }else{
              products.splice(Index, 1);// de lo contrario elimina en el indicie ingresado una posición es decir ese mismo objeto luego guarda los productos 
              fs.writeFileSync(this.path,JSON.stringify(products))
            }
          }
      


}
module.exports = ProductManager;

//creacion de instancia con la dirección del archivo utilizado
const pm =new ProductManager("/products.json")
console.log(pm.getProducts())

//creación de algunos productos 
/*
pm.addProduct("p1","aaa1",30,"imagenp1","AAA1",5)
pm.addProduct("p2","aaa2",30,"imagenp1","AAA2",5)
pm.addProduct("p3","aaa3",30,"imagenp1","AAA3",5)
pm.addProduct("p4","aaa4",30,"imagenp1","AAA4",5)
pm.addProduct("p5","aaa5",30,"imagenp1","AAA5",5)*/



//Obteneción del producto con el id 5
const productoN = pm.getProductById(5);
console.log("elemento encontrado")
console.log(productoN);
console.log("elemento encontrado")
//Borrado del producto con el id 2 
//pm.deleteProduct(2);
//console.log("Producto eliminado");
//console.log(pm.getProducts())

//Actualización del Producto con id 1 y los siguientes datos
/*
pm.updateProduct(1,{title:"p11",description:"aaa11",thumbnail:"imagenp11"})
console.log(pm.getProducts())*/


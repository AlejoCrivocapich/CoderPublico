const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose'); // Agregamos la importación correcta para mongoose
const fs = require('fs'); // Asegúrate de requerir fs
const exphbs = require('express-handlebars');
const router = express.Router();

const messagesRouter = require('../routes/messagesRoute.js');
const cartsRouter = require('../routes/cartsRouter.js');
const productsRouter = require('../routes/productRouter.js');
const Message = require('./messageModel');
const Cart = require('./cartModel')
const Product = require('./src/productModel');
const mongoDb = require('../mongodb.js');
const ProductManager = require('./manager/manager.js');
const pm = new ProductManager();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;
let carts = [];


// Conéctate a MongoDB

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conexión a MongoDB exitosa');
})
.catch((error) => {
  console.error('Error al conectar a MongoDB:', error.message);
});

try {
  const cartsContent = fs.readFileSync('routes/carts.json', 'utf-8'); //verifica si el contenido del archivo no está vacío antes de intentar analizarlo como JSON.

  if (cartsContent.trim() !== '') {
    carts = JSON.parse(cartsContent);
  }
} catch (error) {
  console.error('Error al leer carts.json:', error.message);
}
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');



app.get('/chat', async (req, res) => {
  try {
    const messages = await Message.find();
    res.render('chat', { messages });
  } catch (error) {
    console.error('Error al obtener mensajes del chat:', error);
    res.status(500).send('Error interno del servidor');
  }
});


app.use(express.json());


app.get('/home', async (req, res) => {
  try {
      const products = await Product.find();
      res.render('home', { products });
  } catch (error) {
      console.error('Error al renderizar la vista:', error);
      res.status(500).send('Error interno del servidor');
  }
});










io.on('connection', (socket) => {
  console.log(`Nuevo usuario conectado ${socket.id}`);

  socket.on('chatMessage', async (data) => {
      // Guardar el mensaje en MongoDB
      try {
          const newMessage = new Message({ user: data.user, message: data.message });
          await newMessage.save();
          io.emit('chatMessage', data); // Enviar el mensaje a todos los clientes conectados
      } catch (error) {
          console.error('Error al guardar el mensaje en MongoDB:', error);
      }
  });

  socket.on('disconnect', () => {
      console.log(`Usuario desconectado ${socket.id}`);
  });
});

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/messages', messagesRouter);

server.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
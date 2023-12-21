const mongoose = require('mongoose');
const Product = require('./productModel');
const Cart = require('./cartModel');
const Message = require('./messageModel');

mongoose.connect('mongodb+srv://coder:12345@cluster0.kmvvlog.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch((error) => {
        console.error('Error en la conexión a MongoDB:', error);
    });

module.exports = { Product, Cart, Message };
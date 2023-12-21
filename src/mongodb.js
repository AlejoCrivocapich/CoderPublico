const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://coder:12345@cluster0.kmvvlog.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión a MongoDB exitosa');
});

module.exports = mongoose;
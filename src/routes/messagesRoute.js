const express = require('express');
const router = express.Router();
const Message = require('./dao/messageModel.js');

// GET /messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error('Error al obtener mensajes del chat:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// POST /messages
router.post('/', async (req, res) => {
    const { user, message } = req.body;
    try {
        const newMessage = new Message({ user, message });
        await newMessage.save();
        res.status(201).send('Mensaje agregado con éxito');
    } catch (error) {
        console.error('Error al agregar un nuevo mensaje al chat:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
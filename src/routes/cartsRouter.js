const express = require('express');
const router = express.Router();
const fs = require('fs');

let carts = [];

// POST /carts
router.post('/', (req, res) => {
    let id = 1;

    if (carts.length > 0) {
        id = carts[carts.length - 1].id + 1;
    }

    let newCart = {
        id,
        products: []
    };

    carts.push(newCart);
    fs.writeFileSync('routes/carts.json', JSON.stringify(carts));
    res.json({ cartId: newCart.id });
});

// GET /carts
router.get('/', (req, res) => {
    res.json({ carts });
});

// POST /carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    let Cid = parseInt(req.params.cid);
    let Pid = parseInt(req.params.pid);

    let cart = carts.find(cart => cart.id === Cid);
    let product = pm.getProductById(Pid);

    if (!cart || !product) {
        res.writeHead(404, { "content-type": "text/html; charset=utf8" });
        res.end("Carrito o producto no encontrado");
        return;
    }

    cart.products.push({ id: Pid });
    fs.writeFileSync('routes/carts.json', JSON.stringify(carts));
    res.writeHead(202, { "content-type": "text/html; charset=utf8" });
    res.end("producto agregado al carrito con exito");
});

// GET /carts/:id
router.get('/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let cartfind = carts.find(p => p.id === id);
    if (cartfind) {
        res.json(cartfind);
    } else {
        res.writeHead(404, { "content-type": "text/html; charset=utf8" });
        res.end("carrito no encontrado");
    }
});

module.exports = router;
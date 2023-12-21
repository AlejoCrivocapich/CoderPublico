router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const product = await Product.findById(id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// POST /products
router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
        const newProduct = new Product({ title, description, price, thumbnail, code, stock });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al agregar un nuevo producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// PUT /products/:id
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const campos = req.body;
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        const updatedProduct = { ...product.toObject(), ...campos };
        await Product.findByIdAndUpdate(id, updatedProduct);
        res.status(202).send('Producto actualizado');
    } catch (error) {
        console.error('Error al actualizar producto por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// DELETE /products/:id
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        await Product.findByIdAndRemove(id);
        res.status(202).send('Producto eliminado con éxito');
    } catch (error) {
        console.error('Error al eliminar producto por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
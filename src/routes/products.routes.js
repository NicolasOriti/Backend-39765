import { Router } from 'express';
import ProductManager from '../ProductManager.js';

const router = Router();
const productManager = new ProductManager('./db/products.json');

router.get('/', async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();

  if (limit) {
    return res.json(products.slice(0, limit));
  }

  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const { pid } = req.params;

  const product = await productManager.getProductById(parseInt(pid));

  if (!product) {
    res.status(400);
    res.send(`El producto con id ${pid} no existe.`);
  }
  res.json(product);
});

router.post('/', async (req, res) => {
  const productToAdd = req.body;

  const newProduct = await productManager.addProduct(productToAdd);

  if (!newProduct) {
    res.status(400);
    res.send('El producto no pudo agregarse');
  }

  res.status(201).json({ product: newProduct, message: 'Producto agregado correctamente' });
});

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const productToUpdate = req.body;

  const productUpdated = await productManager.updateProduct(parseInt(pid), productToUpdate);

  if (!productUpdated) {
    res.status(400);
    res.send('El producto no se pudo actualizar');
  }

  res.json({ product: productUpdated, message: 'Producto actualizado correctamente' });
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;

  const isDeleted = await productManager.deleteProduct(parseInt(pid));

  if (!isDeleted) {
    res.status(404).send('Not found');
  }

  res.json({ message: `Producto con id ${pid} fue eliminado correctamente` });
});

export default router;

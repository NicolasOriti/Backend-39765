import { Router } from 'express';
import CartManager from './../CartManager.js';

const router = Router();
const cartManager = new CartManager('./db/carts.json');

router.get('/', async (req, res) => {
  const carts = await cartManager.getCarts();

  res.json(carts);
});

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;

  const cart = await cartManager.getCartById(parseInt(cid));
  if (!cart) {
    res.status(400);
    res.send(`El producto con id ${cid} no existe.`);
  }
  res.json(cart);
});

router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();

  if (!newCart) {
    res.status(400).send('Error al crear un nuevo carrito');
  }
  res.status(201).json({ cart: newCart, message: 'Se creo correctamente' });
});

export default router;

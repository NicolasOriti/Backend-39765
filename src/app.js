import ProductManager from './ProductManager.js';
import express from 'express';

const productManager = new ProductManager('./db/products.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// localhost:8080/products?limit=2
app.get('/products', async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();

  if (limit) {
    return res.json(products.slice(0, limit));
  }

  res.json(products);
});

app.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  console.log('Entre aca: ', pid);
  const product = await productManager.getProductById(parseInt(pid));
  if (!product) {
    res.status(400);
    res.send(`El producto con id ${pid} no existe.`);
  }
  res.json(product);
});

app.listen(8080, () => {
  console.log('Server up  http://localhost:8080');
});

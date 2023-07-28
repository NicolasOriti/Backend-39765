// const { promises: fs } = require('fs');
import { promises as fs } from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const products = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(products);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      let product = products.find((prod) => prod.id === id);
      if (!product) {
        throw new Error('Not found');
      }
      return product;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      const products = await this.getProducts();
      products.forEach((prod) => {
        if (prod.code === code) {
          throw new Error('El codigo ya existe');
        }
      });

      const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      product.id = 0;
      if (products.length > 0) {
        product.id = products[products.length - 1].id + 1;
      }

      products.push(product);
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error(error);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts();

      const index = products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        throw new Error('Not found');
      }

      products.forEach((prod) => {
        if (prod.code === updatedFields.code) {
          throw new Error('El codigo ya existe');
        }
      });

      const productToUpdate = { ...products[index], ...updatedFields };

      products[index] = productToUpdate;

      await fs.writeFile(this.path, JSON.stringify(products, null, 2));

      return productToUpdate;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((prod) => prod.id === id);
      if (index === -1) {
        throw new Error('Not found');
      }

      // Elimina el producto de la lista
      products.splice(index, 1);

      // Escribe la lista actualizada en el archivo
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error(error);
    }
  }
}

export default ProductManager;

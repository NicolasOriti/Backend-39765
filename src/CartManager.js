// const { promises: fs } = require('fs');
import { promises as fs } from 'fs';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      const carts = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(carts);
    } catch (error) {
      return [];
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      let cart = carts.find((cart) => cart.id === id);
      if (!cart) {
        throw new Error('Not found');
      }
      return cart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();

      const newCart = {
        id: 0,
        products: [],
      };

      if (carts.length > 0) {
        newCart.id = carts[carts.length - 1].id + 1;
      }

      carts.push(newCart);
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateCart(id, updatedFields) {
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
      return null;
    }
  }

  async deleteCart(id) {
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
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default CartManager;

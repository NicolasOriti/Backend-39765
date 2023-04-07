const { promises: fs } = require('fs');

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

const test = async () => {
  const productManager1 = new ProductManager('./productos.json');
  console.log('Deberia devolver un arreglo vacio:', await productManager1.getProducts());
  await productManager1.addProduct({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25,
  });
  console.log('Ahora con un producto', await productManager1.getProducts());
  console.log(await productManager1.getProductById(3));
  console.log(
    'Este deberia devolver el producto con id 0: ',
    await productManager1.getProductById(0)
  );
  await productManager1.updateProduct(0, { title: 'Nuevo titulo de prueba' });
  console.log(
    'Este deberia devolver el producto con id 0 y el titulo actualizado: ',
    await productManager1.getProductById(0)
  );
  await productManager1.deleteProduct(0);
  console.log('Este deberia devolver un arreglo vacio:', await productManager1.getProducts());
};

test();

class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    try {
      let product = this.products.find((prod) => prod.id === id);
      if (!product) {
        throw new Error('Not found');
      }
      return product;
    } catch (error) {
      console.error(error);
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    try {
      this.products.forEach((prod) => {
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

      if (this.products.length === 0) {
        product.id = 0;
      } else {
        product.id = this.products[this.products.length - 1].id + 1;
      }

      this.products.push(product);
    } catch (error) {
      console.error(error);
    }
  }
}

const productManager1 = new ProductManager();
// console.log(productManager1.getProducts());
productManager1.addProduct(
  'producto prueba',
  'Este es un producto prueba',
  200,
  'https://hola.png',
  'abc123',
  25
);
// productManager1.addProduct(
//   'producto prueba',
//   'Este es un producto prueba',
//   200,
//   'https://hola.png',
//   'abc123',
//   25
// );
productManager1.addProduct(
  'producto prueba 2',
  'Este es un producto prueba 2',
  400,
  'https://hola2.png',
  'abc125',
  25
);
console.log(productManager1.getProducts());
console.log(productManager1.getProductById(3));

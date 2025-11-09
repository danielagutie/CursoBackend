import { Router } from 'express';
import fs from 'fs/promises';

const routerCarts = Router();
const PATH_CARTS = './data/carts.json';

routerCarts.post('/', async (req, res) => {
  try {
    const data = await fs.readFile(PATH_CARTS, 'utf-8');
    const carts = JSON.parse(data);

    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;

    const newCart = { id: newId, products: [] };

    carts.push(newCart);

    await fs.writeFile(PATH_CARTS, JSON.stringify(carts, null, 2));

    res.status(201).json({ status: 'success', message: 'Carrito guardado.', data: newCart });

  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Se produjo un error al guardar el carrito.' });
  }
});

routerCarts.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const data = await fs.readFile(PATH_CARTS, 'utf-8');
    const carts = JSON.parse(data);

    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: `Carrito no encontrado. [id=${cartId}]` });
    }

    res.json({ status: 'success', message: `Productos en el carrito [id=${cartId}]`, data: cart.products });

  } catch (err) {
    res.status(500).json({ status: 'error', message: `Se produjo un error al obtener el carrito. [id=${cartId}]` });
  }
});

routerCarts.post('/:cid/product/:pid', async (req, res) => {
  try {
    //ToDo: validar que el producto existe en el json de productos.
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);

    const data = await fs.readFile(PATH_CARTS, 'utf-8');
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) {
      return res.status(404).json({ status: 'error', message: `Carrito no encontrado. [id=${cartId}]` });
    }

    const cart = carts[cartIndex];
    const prodIndex = cart.products.findIndex(p => p.prodId === prodId);

    if (prodIndex === -1) {
      cart.products.push({ prodId, quantity: 1 });
    } else {
      cart.products[prodIndex].quantity += 1;
    }

    carts[cartIndex] = cart;
    await fs.writeFile(PATH_CARTS, JSON.stringify(carts, null, 2));

    res.json({ status: 'success', message: `Producto agregado al carrito [id=${cartId}]`, data: cart.products });

  } catch (err) {
    res.status(500).json({ status: 'error', message: `Error al agregar producto [id=${prodId}] al carrito [id=${cartId}]` });
  }
});


export default routerCarts;

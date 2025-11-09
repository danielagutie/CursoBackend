import { Router } from 'express';
import fs from 'fs/promises';

const routerProducts = Router();
const PATH_PRODUCTS = './data/products.json';

routerProducts.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(PATH_PRODUCTS, 'utf-8');
    const products = JSON.parse(data);
    res.json({ status: 'success', data: products });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Se produjo un error al obtener los productos.' });
  }
});

routerProducts.get('/:pid', async (req, res) => {
  try {
    const prodId = parseInt(req.params.pid);
    const data = await fs.readFile(PATH_PRODUCTS, 'utf-8');
    const product = JSON.parse(data).find(p => p.id === prodId);

    if (!product) {
      return res.status(404).json({ status: 'error', message: `Producto no encontrado. [id=${prodId}]` });
    }

    res.json({ status: 'success', data: product });
  } catch (err) {
    res.status(500).json({ status: 'error', message: `Se produjo un error al obtener el producto. [id=${prodId}]` });
  }
});

routerProducts.post('/', async (req, res) => {
  try {
    const data = await fs.readFile(PATH_PRODUCTS, 'utf-8');
    const products = JSON.parse(data);

    const newProduct = req.body;
    const newId = products.length ? products[products.length - 1].id + 1 : 1;
    newProduct.id = newId;

    products.push(newProduct);
    await fs.writeFile(PATH_PRODUCTS, JSON.stringify(products, null, 2));

    res.status(201).json({ status: 'success', message: 'Producto guardado.', data: newProduct });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Se produjo un error al guardar el producto.' });
  }
});

routerProducts.delete('/:pid', async (req, res) => {
  try {
    const prodId = parseInt(req.params.pid);
    const data = await fs.readFile(PATH_PRODUCTS, 'utf-8');
    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id === prodId);

    if (index === -1) {
      return res.status(404).json({ status: 'error', message: `Producto no encontrado. [id=${prodId}]` });
    }

    const deleted = products.splice(index, 1)[0];
    await fs.writeFile(PATH_PRODUCTS, JSON.stringify(products, null, 2));

    res.json({ status: 'success', message: `Producto eliminado. [id=${prodId}]`, data: deleted });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Se produjo un error al eliminar el producto.' });
  }
});

routerProducts.put('/:pid', async (req, res) => {
  try {
    const prodId = parseInt(req.params.pid);
    const data = await fs.readFile(PATH_PRODUCTS, 'utf-8');
    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id === prodId);

    if (index === -1) {
      return res.status(404).json({ status: 'error', message: `Producto no encontrado. [id=${prodId}]` });
    }

    products[index] = { ...products[index], ...req.body };
    await fs.writeFile(PATH_PRODUCTS, JSON.stringify(products, null, 2));

    res.json({ status: 'success', message: `Producto actualizado. [id=${prodId}]`, data: products[index] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: `Se produjo un error al actualizar el producto. [id=${prodId}]` });
  }
});

export default routerProducts;

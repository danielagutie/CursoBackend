import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', message: 'Carrito creado.', data: newCart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al crear carrito.' });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.productId', 'title price');
    if (!cart) return res.status(404).json({ status: 'error', message: `Carrito no encontrado [id=${req.params.cid}]` });

    res.json({ status: 'success', data: cart.products });
  } catch (err) {
    res.status(400).json({ status: 'error', message: 'ID de carrito inválido.' });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: `Carrito no encontrado [id=${cid}]` });

    // Validar que el producto exista
    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: `Producto no encontrado [id=${pid}]` });

    const prodIndex = cart.products.findIndex(p => p.productId.equals(pid));
    if (prodIndex === -1) {
      cart.products.push({ productId: pid, quantity: 1 });
    } else {
      cart.products[prodIndex].quantity += 1;
    }

    await cart.save();
    res.json({ status: 'success', message: 'Producto agregado al carrito.', data: cart.products });

  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error agregando producto al carrito.' });
  }
};

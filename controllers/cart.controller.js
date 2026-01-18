import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

//Crea carrito vacio
export const createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', message: 'Carrito creado.', data: newCart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error al crear carrito.' });
  }
};

//Get carrito por ID
export const getCartById = async (req, res) => {
  try {
    const cart = await Cart
      .findById(req.params.cid)
      .populate('products.productId')
      .lean();

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.render('carts/show', {
      cartId: cart._id,
      products: cart.products
    });

  } catch (err) {
    res.status(400).json({ status: 'error', message: 'ID inválido' });
  }
};


//Agregar producto al carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: `Carrito no encontrado [id=${cid}]` });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: `Producto no encontrado [id=${pid}]` });

    const prodIndex = cart.products.findIndex(p => p.productId.equals(pid));
    if (prodIndex === -1) {
      cart.products.push({ productId: pid, quantity: 1 });
    } else {
      cart.products[prodIndex].quantity += 1;
    }

    await cart.save();
    const updatedCart = await cart.populate('products.productId', 'title price stock status category thumbnails');
    res.json({ status: 'success', message: 'Producto agregado al carrito.', data: updatedCart.products });

  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error agregando producto al carrito.' });
  }
};

//Elimina producto del carrito
export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: `Carrito no encontrado [id=${cid}]` });

    const newProducts = cart.products.filter(p => !p.productId.equals(pid));
    cart.products = newProducts;

    await cart.save();
    const updatedCart = await cart.populate('products.productId', 'title price stock status category thumbnails');
    res.json({ status: 'success', message: `Producto eliminado del carrito [id=${pid}].`, data: updatedCart.products });

  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error eliminando producto del carrito.' });
  }
};

//Actualiza todos los productos del carrito
export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: `Carrito no encontrado [id=${cid}]` });

    for (let p of products) {
      const prodExists = await Product.findById(p.productId);
      if (!prodExists) return res.status(404).json({ status: 'error', message: `Producto no encontrado [id=${p.productId}]` });
    }

    cart.products = products;
    await cart.save();
    const updatedCart = await cart.populate('products.productId', 'title price stock status category thumbnails');
    res.json({ status: 'success', message: 'Carrito actualizado.', data: updatedCart.products });

  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error actualizando carrito.' });
  }
};

//Actualizar la cantidad de un producto
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) return res.status(400).json({ status: 'error', message: 'Cantidad inválida.' });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: `Carrito no encontrado [id=${cid}]` });

    const prodIndex = cart.products.findIndex(p => p.productId.equals(pid));
    if (prodIndex === -1) return res.status(404).json({ status: 'error', message: `Producto no encontrado en carrito [id=${pid}]` });

    cart.products[prodIndex].quantity = quantity;
    await cart.save();
    const updatedCart = await cart.populate('products.productId', 'title price stock status category thumbnails');
    res.json({ status: 'success', message: 'Cantidad de producto actualizada.', data: updatedCart.products });

  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error actualizando cantidad de producto.' });
  }
};

//Vacia carrito
export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: `Carrito no encontrado [id=${cid}]` });

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito vaciado.', data: cart.products });

  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error vaciando carrito.' });
  }
};

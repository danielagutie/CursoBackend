import { Router } from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    let filter = {};
    if (query) {
      const [key, value] = query.split(':');
      if (key && value !== undefined) {
        filter[key] = key === 'status' ? value === 'true' : value;
      }
    }

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      lean: true,
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
    };

    const result = await Product.paginate(filter, options);

    res.render('products/index', {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      limit: options.limit
    });
  } catch (err) {
    res.status(500).send('Error cargando productos.');
  }
});

// Vista de carrito por ID
router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid)
      .populate('products.productId');

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    res.render('carts/show', {
      cartId: cart._id,
      products: cart.products
    });

  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});


export default router;

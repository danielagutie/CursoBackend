import Product from '../models/product.model.js';

import Product from '../models/product.model.js';

export const getProducts = async (req, res) => {
  try {
    let { limit, page, sort, query } = req.query;

    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    const filter = {};
    if (query) {
      const [key, value] = query.split(':');
      if (key && value !== undefined) {
        if (key === 'status') {
          filter[key] = value === 'true';
        } else {
          filter[key] = value;
        }
      }
    }

    //Paginado
    const options = {
      page,
      limit,
      lean: true
    };

    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };

    const result = await Product.paginate(filter, options);

    //prevPage y nextPage
    const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`
      : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Se produjo un error al obtener los productos.'
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: `Producto no encontrado. [id=${req.params.pid}]`
      });
    }

    res.json({ status: 'success', data: product });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'ID inválido.'
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Producto guardado.',
      data: newProduct
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Se produjo un error al guardar el producto.'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.pid);

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: `Producto no encontrado. [id=${req.params.pid}]`
      });
    }

    res.json({
      status: 'success',
      message: `Producto eliminado. [id=${req.params.pid}]`,
      data: deleted
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'ID inválido.'
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: `Producto no encontrado. [id=${req.params.pid}]`
      });
    }

    res.json({
      status: 'success',
      message: `Producto actualizado. [id=${req.params.pid}]`,
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'ID inválido.'
    });
  }
};

import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct
} from '../controllers/product.controller.js';

const routerProducts = Router();

routerProducts.get('/', getProducts);
routerProducts.get('/:pid', getProductById);
routerProducts.post('/', createProduct);
routerProducts.delete('/:pid', deleteProduct);
routerProducts.put('/:pid', updateProduct);

export default routerProducts;

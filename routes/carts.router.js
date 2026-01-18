import { Router } from 'express';
import { createCart, getCartById, addProductToCart, deleteProductFromCart } from '../controllers/cart.controller.js';

const routerCarts = Router();

routerCarts.post('/', createCart);
routerCarts.get('/:cid', getCartById);
routerCarts.post('/:cid/product/:pid', addProductToCart);
routerCarts.delete('/:cid/product/:pid', deleteProductFromCart);

export default routerCarts;

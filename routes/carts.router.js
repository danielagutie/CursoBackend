import { Router } from 'express';
import { createCart, getCartById, addProductToCart } from '../controllers/cart.controller.js';

const routerCarts = Router();

routerCarts.post('/', createCart);
routerCarts.get('/:cid', getCartById);
routerCarts.post('/:cid/product/:pid', addProductToCart);

export default routerCarts;

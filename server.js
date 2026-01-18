import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import routerProducts from './routes/products.router.js';
import routerCarts from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import connectDB from './db.js';

import Cart from './models/cart.model.js';

import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine(
  'handlebars',
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

await connectDB();

let testCartId;

const existingCart = await Cart.findOne();
if (existingCart) {
  testCartId = existingCart._id;
} else {
  const newCart = await Cart.create({ products: [] });
  testCartId = newCart._id;
}

app.locals.cartId = testCartId;

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/', viewsRouter);

app.get('/', (req, res) => {
  res.send('API de Productos y Carritos. Accede a /products');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🛒 Carrito de prueba: ${testCartId}`);
});

import express from 'express';
import routerProducts from './routes/products.router.js';
import routerCarts from './routes/carts.router.js';
import connectDB from './db.js';

import 'dotenv/config';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Para recibir info html de forms

await connectDB();

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.get('/', (req, res) => {
  res.send('API de Productos Y Carritos');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


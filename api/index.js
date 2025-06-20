import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './database/configpostgre.js';
import userRoute from './routes/user.route.js';
import exemploeroute from './routes/example.route.js';
import productRoute from './routes/product.route.js';
import commentRoute from './routes/comment.route.js';
import ratingRoute from './routes/rating.route.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://arte-local-front-end.vercel.app',
  'http://localhost:5173',
  'https://glowing-fiesta-pvj6qqj9g76crx5-5173.app.github.dev'
];

// Configuração CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rotas da API
app.use('/products', productRoute);
app.use('/user', userRoute);
app.use('/protected', exemploeroute);
app.use('/comments', commentRoute);
app.use('/ratings', ratingRoute);

// Health Check
app.get('/', (req, res) => {
  res.send({ message: 'Seja bem-vindo ao backend do ArteLocal. A API está ativa e pronta para uso.' });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Error Handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// Inicialização do servidor
connect().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('\n Backend do ArteLocal iniciado com sucesso.');
    console.log(` Servidor disponível na porta ${PORT}`);
    console.log(' A API está pronta para receber requisições.');
  });
});

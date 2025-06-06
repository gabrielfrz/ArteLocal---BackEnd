import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg'; 
import { connect } from './database/configpostgre.js';
import User from './models/User.js';
import userRoute from './routes/user.route.js';
import exemploeroute from './routes/example.route.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use("/user", userRoute);
app.use("/protected", exemploeroute);

app.get('/', (req, res) => {
  res.send({ message: 'Seja bem-vindo ao backend do ArteLocal. A API está ativa e pronta para uso.' });
});

connect().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('\nBackend do ArteLocal iniciado com sucesso.');
    console.log(`Servidor disponível em: http://localhost:${PORT}/`);
    console.log('A API está pronta para receber requisições.');
  });
});

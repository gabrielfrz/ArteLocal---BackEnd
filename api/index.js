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
  res.send({ message: 'Hello World from Vercel!' });
});


await connect();


export default app;

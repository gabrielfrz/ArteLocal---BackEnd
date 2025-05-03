import express from 'express';
import dotenv from 'dotenv';
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
  res.send({ message: 'Hello World!' });
});

connect().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/`);
  });
});

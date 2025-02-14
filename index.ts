import express from 'express';
import dotenv from 'dotenv';
import userRouter from './router/userRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);


app.listen(PORT, () => console.log(`Express Server running on port ${PORT}`));

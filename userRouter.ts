import express from 'express';
import { login, register } from '../controller/userController';
import { jwtMiddleware } from '../connection';

const userRouter = express.Router();


userRouter.post('/login', login);

userRouter.post('/register', register);

userRouter.get('/check', jwtMiddleware, (req:any, res:any) => {
    res.status(200).json({ message: 'You have access to the protected route', user: req.user });
  });
  

export default userRouter;


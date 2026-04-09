import express from 'express';
import { AddToCart, clearCart, isAuth, login, logout, register, removeFromCart, updateUser } from '../controllers/user-controller.js';
import authUser from '../middlewares/user-middleware.js';
const userRoute = express.Router();
import { upload } from '../database/multer.js';

userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.get('/is-auth', authUser, isAuth);
userRoute.get('/logout', authUser, logout);
userRoute.post('/update', upload.single('image'), authUser, updateUser);
userRoute.post('/add-to-cart', authUser, AddToCart);
userRoute.post('/remove-from-cart', authUser, removeFromCart);
userRoute.post('/clear-cart', authUser, clearCart);

export default userRoute;

import express from 'express';
import { addAddress, getAddress } from '../controllers/address-controller.js';
import authUser from '../middlewares/user-middleware.js';
const addressRoute = express.Router();

addressRoute.post('/add', authUser, addAddress);
addressRoute.get('/get', authUser, getAddress);

export default addressRoute;
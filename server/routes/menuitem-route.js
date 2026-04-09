import express from 'express';
import { addMenuitem, deleteMenuItem, getMenuitem, getTopSellingItems, reviews, search, toggleStock, updateMenuItem } from '../controllers/menuitem-controller.js';
import { upload } from '../database/multer.js';
import authAdmin from '../middlewares/admin-middleware.js';
import authUser from '../middlewares/user-middleware.js';
const menuitemRoute = express.Router();

menuitemRoute.post('/add', upload.single('image'), authAdmin, addMenuitem);
menuitemRoute.get('/get', getMenuitem);
menuitemRoute.get('/top-selling', getTopSellingItems);
menuitemRoute.post('/stock', authAdmin, toggleStock);
menuitemRoute.post('/delete', authAdmin, deleteMenuItem);
menuitemRoute.post('/update', upload.single('image'), authAdmin, updateMenuItem);
menuitemRoute.post('/review', authUser, reviews);
menuitemRoute.post('/search', search);

export default menuitemRoute;
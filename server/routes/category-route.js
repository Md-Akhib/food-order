import express from 'express';
const categoryRoute = express.Router();
import { upload } from '../database/multer.js';
import { addCategory, getCategories, deleteCategory } from '../controllers/category-controller.js';
import authAdmin from '../middlewares/admin-middleware.js';

categoryRoute.post('/add', upload.single('image'), authAdmin, addCategory);
categoryRoute.get('/get', getCategories);
categoryRoute.post('/delete', authAdmin, deleteCategory);

export default categoryRoute;

import express from 'express';
const heroRoute = express.Router();
import { upload } from '../database/multer.js';
import { addHero, getHero } from '../controllers/hero-controller.js';
import authAdmin from '../middlewares/admin-middleware.js'

heroRoute.post('/add', upload.single('image'), authAdmin, addHero);
heroRoute.get('/get', getHero);

export default heroRoute;
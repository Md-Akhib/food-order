import express from 'express';
import rateLimit from 'express-rate-limit';
import { addNotification, getAllNotifications } from '../controllers/notification-controller.js';
import authAdmin from '../middlewares/admin-middleware.js';
import authUser from '../middlewares/user-middleware.js';
const notificationRoute = express.Router();

// Rate limiter for contact form: max 3 requests per hour from a single IP
const contactFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { success: false, message: "Too many messages sent. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

notificationRoute.post('/add', contactFormLimiter, authUser, addNotification);
notificationRoute.get('/get-all', authAdmin, getAllNotifications);

export default notificationRoute;

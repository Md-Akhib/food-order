import express from 'express';
import authUser from '../middlewares/user-middleware.js';
import authAdmin from '../middlewares/admin-middleware.js';
import { allOrders, cancelOrder, changeOrderStatus, codOrder, onlineOrder, rejectCancel, requestCancel, userOrders, verifyStripe } from '../controllers/order-controller.js';
const orderRoute = express.Router();

orderRoute.post('/cod', authUser, codOrder);
orderRoute.get('/user', authUser, userOrders);
orderRoute.get('/all', authAdmin, allOrders);
orderRoute.post('/status', authAdmin, changeOrderStatus);
orderRoute.post('/reqCancel', authUser, requestCancel);
orderRoute.post('/cancel', authAdmin, cancelOrder);
orderRoute.post('/rejectCancel', authAdmin, rejectCancel);
orderRoute.post('/online', authUser, onlineOrder);
orderRoute.post('/verify', authUser, verifyStripe);

export default orderRoute;

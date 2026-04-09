import express from 'express';
import { adminLogin, adminLogout, dashboard, filteredDashboardData, isAdminAuth } from '../controllers/admin-controller.js';
import authAdmin from '../middlewares/admin-middleware.js';
const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/is-auth', authAdmin, isAdminAuth);
adminRouter.post('/logout', authAdmin, adminLogout);
adminRouter.get('/dashboard', authAdmin, dashboard);
adminRouter.post('/dashboard-filter', authAdmin, filteredDashboardData);

export default adminRouter;

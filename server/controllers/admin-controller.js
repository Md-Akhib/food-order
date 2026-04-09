import jwt from 'jsonwebtoken'
import User from '../modals/user-modal.js'
import Order from '../modals/order-modal.js';
import MenuItem from '../modals/menuitem-modal.js';

// seller login - /api/admin/login
export const adminLogin = (req, res) => {
    try {
        const { email, password } = req.body;

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })
            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.json({ success: true, message: "Admin logged in successfully" })
        } else {
            return res.json({ success: false, message: "Invalid crediantials" })
        }
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// check admin is authorized - /api/admin/is-auth
export const isAdminAuth = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// logout user = /api/admin/logout
export const adminLogout = async (req, res) => {
    try {
        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "Logged out" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

//Overall Dashboard Data (All-Time) - /api/admin/dashboard
export const dashboard = async (req, res) => {
    try {
        const validOrderFilter = { $or: [{ paymentType: "COD" }, { isPaid: true }] };

        const [
            userCount,
            itemCount,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            cancelRequests,
            cancelledOrders,
            refundBalanceCount,
            revenueData
        ] = await Promise.all([
            User.countDocuments(),
            MenuItem.countDocuments(),
            Order.countDocuments(validOrderFilter),
            Order.countDocuments({ status: "placed", ...validOrderFilter }),
            Order.countDocuments({ status: "delivered", ...validOrderFilter }),
            Order.countDocuments({ isCancel: true, ...validOrderFilter }),
            Order.countDocuments({ status: { $in: ["cancelled", "refunded"] }, ...validOrderFilter }),
            Order.countDocuments({ status: "cancelled", isPaid: true, ...validOrderFilter }),
            Order.aggregate([
                { $match: { isPaid: true, ...validOrderFilter } },
                { $group: { _id: null, total: { $sum: "$price" } } }
            ])
        ]);

        const totalAmount = revenueData.length > 0 ? revenueData[0].total : 0;

        const dashboard = [
            { title: "Total Customers", value: userCount },
            { title: "Total Items", value: itemCount },
            { title: "Total Orders", value: totalOrders },
            { title: "Pending Orders", value: pendingOrders },
            { title: "Delivered Orders", value: deliveredOrders },
            { title: "Cancel Requests", value: cancelRequests },
            { title: "Cancelled Orders", value: cancelledOrders },
            { title: "Refund Balance", value: refundBalanceCount },
            { title: "Total Revenue", value: totalAmount },
        ];

        return res.json({ success: true, dashboard });

    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
};

//Filtered Dashboard Data (Yearly, Monthly, Daily) - /api/admin/dashboard-filter
export const filteredDashboardData = async (req, res) => {
    try {
        const { filterType, year, month, day } = req.body;

        if (!filterType) {
            return res.json({ success: false, message: "Filter type is required" });
        }

        let startDate, endDate;

        if (filterType === "yearly") {
            if (!year) return res.json({ success: false, message: "Year is required" });
            startDate = new Date(year, 0, 1);
            endDate = new Date(Number(year) + 1, 0, 1);
        } else if (filterType === "monthly") {
            if (!year || !month) return res.json({ success: false, message: "Year and month are required" });
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            let monthIndex = typeof month === "string" ? monthNames.indexOf(month) : month - 1;
            startDate = new Date(year, monthIndex, 1);
            endDate = new Date(year, monthIndex + 1, 1);
        } else if (filterType === "daily") {
            if (!year || !month || !day) return res.json({ success: false, message: "Year, month, and day are required" });
            startDate = new Date(year, month - 1, day, 0, 0, 0);
            endDate = new Date(year, month - 1, day, 23, 59, 59);
        } else {
            return res.json({ success: false, message: "Invalid filter type" });
        }

        const dateRange = { createdAt: { $gte: startDate, $lt: endDate } };
        const validOrderFilter = { $or: [{ paymentType: "COD" }, { isPaid: true }] };

        const [
            userCount,
            itemCount,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            cancelRequests,
            cancelledOrders,
            refundBalanceCount,
            revenueData
        ] = await Promise.all([
            User.countDocuments(dateRange),
            MenuItem.countDocuments(),
            Order.countDocuments({ ...dateRange, ...validOrderFilter }),
            Order.countDocuments({ ...dateRange, status: "placed", ...validOrderFilter }),
            Order.countDocuments({ ...dateRange, status: "delivered", ...validOrderFilter }),
            Order.countDocuments({ ...dateRange, isCancel: true, ...validOrderFilter }),
            Order.countDocuments({ ...dateRange, status: "cancelled", ...validOrderFilter }),
            Order.countDocuments({ ...dateRange, status: "cancelled", isPaid: true, ...validOrderFilter }),
            Order.aggregate([
                { $match: { ...dateRange, isPaid: true, ...validOrderFilter } },
                { $group: { _id: null, total: { $sum: "$price" } } }
            ])
        ]);

        const totalAmount = revenueData.length > 0 ? revenueData[0].total : 0;

        const dashboard = [
            { title: "Total Customers", value: userCount },
            { title: "Total Items", value: itemCount },
            { title: "Total Orders", value: totalOrders },
            { title: "Pending Orders", value: pendingOrders },
            { title: "Delivered Orders", value: deliveredOrders },
            { title: "Cancel Requests", value: cancelRequests },
            { title: "Cancelled Orders", value: cancelledOrders },
            { title: "Refund Balance", value: refundBalanceCount },
            { title: "Total Revenue", value: totalAmount },
        ];

        return res.json({ success: true, dashboard });

    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
};
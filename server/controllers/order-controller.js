import Order from "../modals/order-modal.js";
import { v4 as uuidv4 } from "uuid";
import Stripe from 'stripe';
import User from '../modals/user-modal.js';
import MenuItem from "../modals/menuitem-modal.js";

// global variables
const currency = "inr";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// order with COD - /api/order/cod
export const codOrder = async (req, res) => {
    try {
        const { userId, items, price, address, statusHistory, paymentType } = req.body;

        if (!userId || !items || !price || !address || !paymentType) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const orderId = "#" + uuidv4().slice(0, 8).toUpperCase();

        const order = await Order.create({
            user: userId,
            orderId,
            items,
            price,
            address,
            statusHistory,
            paymentType,
            isPaid: false
        });

        // Increment soldCount for each item in the order
        for (const item of items) {
            const itemId = item.id || item.menuitem;
            await MenuItem.findByIdAndUpdate(itemId, { $inc: { soldCount: item.quantity } });
        }

        return res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Online orders with Stripe - /api/order/online
export const onlineOrder = async (req, res) => {
    try {
        const { userId, items, address, statusHistory, paymentType } = req.body;
        const { origin } = req.headers;

        if (!userId || !items || !address || !paymentType) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const orderId = "#" + uuidv4().slice(0, 8).toUpperCase();

        const dbItems = await Promise.all(
            items.map(async (item) => {
                const itemId = item.id || item.menuitem;
                const menuItemObj = await MenuItem.findById(itemId);

                if (!menuItemObj) throw new Error(`Menu item not found for ID: ${itemId}`);

                return {
                    name: menuItemObj.title,
                    price: menuItemObj.price,
                    quantity: item.quantity
                };
            })
        );

        let totalPrice = dbItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        const orderData = {
            user: userId,
            orderId,
            items,
            price: totalPrice,
            address,
            statusHistory: statusHistory || [],
            paymentType,
            isPaid: false
        };

        const newOrder = await Order.create(orderData);

        const line_items = dbItems.map(item => ({
            price_data: {
                currency: currency,
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&userId=${userId}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });

        return res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log("Stripe Order Error:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Verify orders with Stripe - /api/order/verify
export const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true" || success === true) {
            const order = await Order.findByIdAndUpdate(orderId, { isPaid: true, status: "placed" }, { new: true });

            if (order && order.items) {
                for (const item of order.items) {
                    const itemId = item.menuitem || item.id;
                    await MenuItem.findByIdAndUpdate(itemId, { $inc: { soldCount: item.quantity } });
                }
            }

            if (userId) {
                await User.findByIdAndUpdate(userId, { $set: { cartItems: [] } });
            }

            return res.json({ success: true, message: "Payment verified successfully" });
        } else {
            await Order.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Payment failed or cancelled, order not placed" });
        }
    } catch (error) {
        console.log("Verify Stripe Error:", error.message);
        return res.json({ success: false, message: error.message });
    }
};

// fetch user orders - /api/order/user
export const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "UserId is required" });
        }

        const orders = await Order.find({
            user: userId,
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ]
        })
            .populate("items.menuitem")
            .populate("address")
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// fetch all orders - /api/order/all
export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { paymentType: "COD" },
                { isPaid: true }
            ]
        })
            .populate("items.menuitem")
            .populate("address")
            .populate("user")
            .sort({ createdAt: -1 });

        return res.json({ success: true, orders });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// change order status - /api/order/status
export const changeOrderStatus = async (req, res) => {
    try {
        const { order_id, status } = req.body;
        const order = await Order.findById(order_id);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        order.status = status;
        order.statusHistory.push({ status });

        if (order.status === 'delivered') {
            order.isPaid = true;
        } else if (order.status === 'refunded') {
            order.isPaid = false;
        }

        await order.save();
        return res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// request user cancellation - /api/order/reqCancel
export const requestCancel = async (req, res) => {
    try {
        const { order_id } = req.body;
        const order = await Order.findById(order_id);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        order.isCancel = true;
        await order.save();
        return res.json({ success: true, message: "Requested cancel successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// cancel order - /api/order/cancel
export const cancelOrder = async (req, res) => {
    try {
        const { order_id } = req.body;
        const order = await Order.findById(order_id);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        let status = 'cancelled';
        order.status = status;
        order.isCancel = false;
        order.statusHistory.push({ status });
        await order.save();
        return res.json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// NEW: Reject cancellation request - /api/order/rejectCancel
export const rejectCancel = async (req, res) => {
    try {
        const { order_id } = req.body;
        const order = await Order.findById(order_id);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        order.isCancel = false;
        await order.save();
        return res.json({ success: true, message: "Cancellation request rejected" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
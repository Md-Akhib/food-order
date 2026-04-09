import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    items: [
        {
            menuitem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
            quantity: { type: Number, default: 1 },
        }
    ],
    price: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    status: { type: String, default: "placed" },
    isCancel: { type: Boolean, default: false },
    statusHistory: [
        {
            status: { type: String, required: true },
            date: { type: Date, default: Date.now },
        }
    ],
    paymentType: { type: String, enum: ["COD", "Online"], required: true },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
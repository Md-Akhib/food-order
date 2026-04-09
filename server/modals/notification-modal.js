import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;

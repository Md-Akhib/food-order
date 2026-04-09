import Notification from '../modals/notification-modal.js';

// Add notification = /api/notification/add
export const addNotification = async (req, res) => {
    try {
        const { firstName, lastName, phone, subject, message } = req.body;

        if (!firstName || !lastName || !phone || !subject || !message) {
            return res.json({ success: false, message: "All fields are required" });
        }

        // Create notification in database
        const notification = await Notification.create({
            firstName,
            lastName,
            phone,
            subject,
            message
        });

        return res.json({
            success: true,
            message: "Message Sent successfully",
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// Get all notifications = /api/notification/get-all
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });

        if (!notifications) {
            return res.json({ success: false, message: "No message found" });
        }

        return res.json({
            success: true,
            notifications
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

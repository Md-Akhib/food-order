import { v2 as cloudinary } from "cloudinary";
import MenuItem from "../modals/menuitem-modal.js";

// add menuitem - /api/menu/add
export const addMenuitem = async (req, res) => {
    try {
        const { title, category, description, price } = req.body;
        const image = req.file;

        if (!title || !image || !category || !description || !price) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const imageUpload = await cloudinary.uploader.upload(image.path, {
            resource_type: "image"
        });
        if (!imageUpload) {
            return res.json({ success: false, message: "Image upload failed" });
        }

        const menuitem = await MenuItem.create({
            title,
            category,
            description,
            price,
            image: imageUpload.secure_url
        })
        return res.json({ success: true, message: "Menu Item Added Successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// add menuitem - /api/menu/get
export const getMenuitem = async (req, res) => {
    try {
        const menuitems = await MenuItem.find().populate('reviews.userId', 'name image');
        return res.json({ success: true, menuitems });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// toggle stock - /api/menu/stock
export const toggleStock = async (req, res) => {
    try {
        const { menuitemId } = req.body;
        const menuitem = await MenuItem.findById(menuitemId);
        if (!menuitem) {
            return res.json({ success: false, message: "Menu Item not found" });
        }
        menuitem.inStock = !menuitem.inStock;
        await menuitem.save();
        return res.json({ success: true, message: "Stock status updated successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// delete menu item - /api/menu/delete
export const deleteMenuItem = async (req, res) => {
    try {
        const { menuitemId } = req.body;
        const menuitem = await MenuItem.findById(menuitemId);
        if (!menuitem) {
            return res.json({ success: false, message: "Menu Item not found" });
        }
        await menuitem.deleteOne();
        return res.json({ success: true, message: "Menu Item deleted successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// get top selling items - /api/menu/top-selling
export const getTopSellingItems = async (req, res) => {
    try {
        const topItems = await MenuItem.find()
            .sort({ soldCount: -1 })
            .limit(5)
            .populate('reviews.userId', 'name image');

        return res.json({ success: true, topSellingItems: topItems });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// update menu item - /api/menu/update
export const updateMenuItem = async (req, res) => {
    try {
        const { title, category, description, price, menuitemId } = req.body;

        let updateData = { title, category, description, price };

        // If image is uploaded, upload to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
            });
            updateData.image = result.secure_url;
        }

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuitemId, updateData, { new: true });

        res.json({
            success: true,
            message: 'menu Item updated successfully',
            menuItem: updatedMenuItem,
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// add comment to database - /api/menu/review
export const reviews = async (req, res) => {
    try {
        const { userId, rating, review, menuId } = req.body;
        if (!userId || !rating || !review || !menuId) {
            return res.json({ success: false, message: "Missing credentials" });
        }

        const menuitem = await MenuItem.findById(menuId);

        if (!menuitem) {
            return res.json({ success: false, message: "Menu Item not found" });
        }

        // Add the new review
        menuitem.reviews.push({
            userId: userId,
            review: review,
            rating: rating,
            date: new Date()
        });

        // Calculate the new average
        let totalStars = 0;
        if (menuitem.reviews && menuitem.reviews.length > 0) {
            for (let i = 0; i < menuitem.reviews.length; i++) {
                totalStars += menuitem.reviews[i].rating;
            }
            menuitem.stars = Math.round((totalStars / menuitem.reviews.length) * 10) / 10;
        } else {
            menuitem.stars = 0;
        }

        await menuitem.save();

        return res.json({ success: true, message: "Review added successfully" });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// search products - /api/menu/search
export const search = async (req, res) => {
    try {
        const { search } = req.body;
        if (!search) {
            return res.json({ success: false, message: "Search query is required" });
        }

        const menuitems = await MenuItem.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ]
        });

        return res.json({ success: true, menuitems });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
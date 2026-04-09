import Category from "../modals/category-modal.js";
import { v2 as cloudinary } from "cloudinary";

// add category to database = /api/category/add
export const addCategory = async (req, res) => {
    try {
        const { title } = req.body;
        const image = req.file;

        if (!title || !image) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const imageUpload = await cloudinary.uploader.upload(image.path, {
            resource_type: "image"
        });
        if (!imageUpload) {
            return res.json({ success: false, message: "Image upload failed" });
        }

        const category = await Category.create({
            title,
            image: imageUpload.secure_url
        });

        return res.json({ success: true, message: "Category added successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// get all categories from database = /api/category/get
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.json({ success: true, categories });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// delete category = /api/category/delete
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }
        return res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

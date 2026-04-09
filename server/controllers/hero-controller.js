import Hero from "../modals/hero-modal.js";
import { v2 as cloudinary } from "cloudinary";

// upload hero details to database = /api/hero/add
export const addHero = async (req, res) => {
    try {
        const { title, paragraph, } = req.body;
        const image = req.file;

        if (!title || !paragraph || !image) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const imageUpload = await cloudinary.uploader.upload(image.path, {
            resource_type: "image"
        });
        if (!imageUpload) {
            return res.json({ success: false, message: "Image upload failed" });
        }

        await Hero.deleteMany({});

        const hero = await Hero.create({
            title,
            paragraph,
            image: imageUpload.secure_url
        });

        return res.json({ success: true, message: "Data added successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// get hero details to database = /api/hero/get
export const getHero = async (req, res) => {
    try {
        const hero = await Hero.findOne();
        return res.json({ success: true, hero });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
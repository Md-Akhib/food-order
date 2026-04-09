import mongoose from "mongoose";

const menuitemSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true }, // Simple string is fine, just ensure it matches your category titles
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stars: { type: Number, default: 0 },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: { type: String },
        rating: { type: Number },
        date: { type: Date, default: Date.now } // Added default date here
    }],
    inStock: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 }
}, { timestamps: true });

const MenuItem = mongoose.model("MenuItem", menuitemSchema);
export default MenuItem;
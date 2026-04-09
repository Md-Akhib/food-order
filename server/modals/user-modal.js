import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, match: /.+\@.+\..+/, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    phone: { type: Number },
    gender: { type: String },
    birthday: { type: Date },
    cartItems: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
            quantity: { type: Number, default: 1 }
        }
    ],
    isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;

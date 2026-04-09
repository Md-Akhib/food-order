import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../modals/user-modal.js'
import { v2 as cloudinary } from "cloudinary";

// register user = /api/user/register 
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All inputs are required" });
        }

        // check if user exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.json({ success: false, message: "User Already Exist" });
        }

        // encrypting password
        const hashPassword = await bcrypt.hash(password, 10);

        // create user in data base
        const user = await User.create({ name, email, password: hashPassword });

        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            success: true, user: {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// user login - /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "All inputs are required" });
        }

        // find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // decrepting pasword and verifying it
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            success: true, user: {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// check weather user is authenticated - /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password");
        return res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

// logout user = /api/user/logout 
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "logged out" })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

// update user data - /api/user/update
export const updateUser = async (req, res) => {
    try {
        const { userId, name, phone, gender, birthday } = req.body;

        let updateData = { name, phone, gender, birthday };

        // If image is uploaded, upload to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'image',
            });
            updateData.image = result.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser,
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add to cart - /api/user/add-to-cart
export const AddToCart = async (req, res) => {
    try {
        const { menuId, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const itemIndex = user.cartItems.findIndex(item => item.id.toString() === menuId);

        if (itemIndex > -1) {
            user.cartItems[itemIndex].quantity += 1;
        } else {
            user.cartItems.unshift({ id: menuId, quantity: 1 });
        }
        await user.save();

        res.json({ success: true, message: "successfully added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove from cart - /api/user/remove-from-cart
export const removeFromCart = async (req, res) => {
    try {
        const { menuId, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const itemIndex = user.cartItems.findIndex(item => item.id.toString() === menuId);

        if (itemIndex > -1) {
            if (user.cartItems[itemIndex].quantity > 1) {
                user.cartItems[itemIndex].quantity -= 1;
            } else {
                user.cartItems.splice(itemIndex, 1);
            }

            await user.save();
            return res.json({ success: true, message: "Successfully removed from cart" });
        } else {
            return res.json({ success: false, message: "Item not found in cart" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// clear cart - /api/user/clear-cart
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        user.cartItems = [];
        await user.save();
        res.json({ success: true, message: "Cart cleared successfully", user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
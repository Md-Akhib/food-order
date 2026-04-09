import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    const { adminToken } = req.cookies;

    if (!adminToken) {
        return res.json({ success: false, message: 'Unauthorized' })
    }

    try {
        const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET);
        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next()
        } else {
            return res.json({ success: false, message: 'Unauthorixed' })
        }
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export default authAdmin;

import Address from "../modals/address-modal.js";

//create address - /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { userId, firstName, lastName, phone, street, city, state, country, zipcode } = req.body;

        await Address.create({
            user: userId,
            firstName,
            lastName,
            phone,
            street,
            city,
            state,
            country,
            zipcode,
        });

        return res.json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};

// get address - /api/address/get
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        const addresses = await Address.find({ user: userId }).sort({ _id: -1 });
        return res.json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}
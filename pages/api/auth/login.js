import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');

const handler = async (req, res) => {

    if (req.method !== 'POST') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    let admin;
    try {
        admin = await Admin.findOne({ "email": req.body.email })
        if (!admin) {
            res.status(200).json({ success: false, error: 'Admin not found' })
            return
        }
    } catch (error) {
        console.log(error);
    }

    const matchPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!matchPassword) {
        res.status(200).json({ success: false, error: 'Invalid Credentials' });
        return
    }

    let token = jwt.sign({ email: admin.email, name: admin.name }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token, admin });
    return
}
export default connectDb(handler);
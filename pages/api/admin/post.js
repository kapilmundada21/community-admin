import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');

const handler = async (req, res) => {

    if (req.method !== 'POST') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    try {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin){
            res.status(200).json({ success: false, error: `Admin with this Email ID already exist.` })
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    if ((req.body.setPasswordType === "password")) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        let newAdmin = new Admin({ ...req.body, password: passwordHash })
        await newAdmin.save();
        res.status(200).json({ success: true, admin: newAdmin })
        return
    }
    else {
        // set set-password mail token for 24hrs 
        let token = jwt.sign({ email: req.body.email, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 60 * 24 });
        
        let newAdmin = new Admin({ ...req.body, setPasswordToken: token })
        await newAdmin.save();

        res.status(200).json({ success: true, admin: newAdmin })
        return
    }
}
export default connectDb(handler);
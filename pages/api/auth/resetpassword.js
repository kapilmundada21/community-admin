import connectDb from "@/middleware/mongoose"
import Admin from "@/models/admin"
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    if (req.body.sendMail) {

        // Check if the admin exists in the Database
        try {
            let admin = await Admin.findOne({ "email": req.body.email })
            if (!admin) {
                res.status(400).json({ error: 'Admin not found' });
                return
            }
        } catch (error) {
            console.error("Error in finding Admin", error);
        }

        let token = jwt.sign({ email: admin.email, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 10 });
        await Admin.findOneAndUpdate({ email: admin.email }, { resetPasswordToken: token })
        res.status(200).json({ success: true, token });
        return
    }
    else {

        let myAdmin;
        try {
            myAdmin = await Admin.findOne({ setPasswordToken: req.body.token })
        } catch (error) {
            console.error("Error in finding admin by token", error);
        }

        if (!myAdmin) {
            res.status(200).json({ success:false, error: 'Invalid Token' })
            return
        }

        let valid = await jwt.verify(myAdmin.setPasswordToken, process.env.JWT_SECRET, (error, result) => {
            return result ? true : false
        })
        if (!valid) {
            res.status(200).json({ success:false, error: 'Token Expired' });
            return
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        await Admin.findOneAndUpdate({ email: myAdmin.email }, { password: passwordHash, setPasswordToken: null })
        res.status(200).json({ success:true })
        return
    }
}
export default connectDb(handler);
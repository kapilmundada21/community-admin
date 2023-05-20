import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"
const bcrypt = require("bcrypt");

const handler = async (req, res) => {
    if (req.method == 'POST') {
        let admin;
        try{
            admin = await Admin.findOne({ email: req.body.email })
        }
        catch(error){
            console.error(error);
        }
        
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash( req.body.password, salt );
            let newAdmin = new Admin({...req.body, password : passwordHash })
            await newAdmin.save();
            res.status(200).json({ success: true, admin: newAdmin })
            return
        }
        else{
            res.status(200).json({ success: false, error: `Admin with this Email ID already exist. Your account status is ${admin.status}` })
            return
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);
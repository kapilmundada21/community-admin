import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"
const bcrypt = require("bcrypt");

const handler = async (req, res) => {
    if (req.method == 'DELETE') {
        let admin;
        const adminId = req.query.id;
        try{
            admin = await Admin.findById( adminId )
        }
        catch(error){
            console.error(error);
        }
        
        if (admin) {
            let deletedAdmin = await Admin.deleteOne({ _id: adminId })
            res.status(200).json({ success: true, admin: deletedAdmin })
            return
        }
        else{
            res.status(200).json({ success: false, error: `Admin does not exist.` })
            return
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);
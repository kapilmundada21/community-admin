import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'PATCH') {
        let admin;
        try{
            admin = await Admin.findOne({ email: req.body.email })
        }
        catch(error){
            console.error(error);
        }
        
        if (admin) {
            let updatedAdmin = await Admin.findByIdAndUpdate({ _id: req.body._id }, req.body )
            await updatedAdmin.save();
            res.status(200).json({ success: true, admin: updatedAdmin })
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
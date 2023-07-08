import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    if (req.method !== 'PATCH') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    try {
        let admin = await Admin.findOne({ email: req.body.email });
        if (!admin) {
            res.status(200).json({ success: false, error: `Admin does not exist.` });
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    let updatedAdmin = await Admin.findByIdAndUpdate({ _id: req.body._id }, req.body)
    await updatedAdmin.save();
    res.status(200).json({ success: true, admin: updatedAdmin })
    return
}
export default connectDb(handler);
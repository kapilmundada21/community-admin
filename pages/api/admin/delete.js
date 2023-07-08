import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'DELETE') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    try {
        let admin = await Admin.findById(adminId)
        if (!admin) {
            res.status(200).json({ success: false, error: `Admin does not exist.` })
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    const adminId = req.query.id;
    let deletedAdmin = await Admin.deleteOne({ _id: adminId })
    res.status(200).json({ success: true, admin: deletedAdmin })
    return
}
export default connectDb(handler);
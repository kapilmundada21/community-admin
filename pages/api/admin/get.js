import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'GET') {
        let adminType = req.query.type;
        let admin = await Admin.find({ type: adminType });
        res.status(200).json({ success: true, allAdmin: admin })
        return
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);
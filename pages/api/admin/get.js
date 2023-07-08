import Admin from "@/models/admin"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'GET') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
    
    let adminType = req.query.type;
    const { page, offset, sortBy, orderBy } = req.query;
    const sortQuery = {};
    sortQuery[sortBy] = orderBy;
    let totalAdmins = await Admin.countDocuments({ type: adminType });
    let admin = await Admin.find({ type: adminType }).sort(sortQuery).skip(page * offset).limit(offset);
    res.status(200).json({ success: true, allAdmin: admin, totalAdmins })
    return
}
export default connectDb(handler);
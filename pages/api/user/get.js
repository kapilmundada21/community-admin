import User from "../../../models/user"
import connectDb from "../../../middleware/mongoose"

const findAllUsers = async (req, res) => {
    let users = await User.find();
    res.status(200).json({ success: true, allUser: users })
    return
}

const findUserByStatus = async (req, res) => {
    const userStatus = req.query.status;
    const { page, offset, sortBy, orderBy } = req.query;
    const sortQuery = {};
    sortQuery[sortBy] = orderBy;
    let totalUsers = await User.countDocuments({ status: userStatus });
    let users = await User.find({ status: userStatus })
                          .sort(sortQuery)
                          .skip(page * offset)
                          .limit(offset);
    res.status(200).json({ success: true, allUser: users, totalUsers })
    return
}

const handler = async (req, res) => {
    
    if (req.method !== 'GET') {
        res.status(400).json({ error: "This method is not allowed" });
        return;
    }

    const userStatus = req.query.status;
    if (userStatus) {
        await findUserByStatus(req, res);
    } else {
        await findAllUsers(req, res);
    }
}
export default connectDb(handler);
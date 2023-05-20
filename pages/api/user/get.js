import User from "../../../models/user"
import connectDb from "../../../middleware/mongoose"

const findAllUsers = async (req, res) => {
    let users = await User.find();
    res.status(200).json({ success: true, allUser: users })
    return
}

const findUserByStatus = async (req, res) => {
    const userStatus = req.query.status;
    let users = await User.find({ status: userStatus })
    res.status(200).json({ success: true, allUser: users })
    return
}

const handler = async (req, res) => {
    if (req.method == 'GET') {
        let userStatus = req.query.status;
        userStatus ? findUserByStatus(req, res) : findAllUsers(req, res);
        return
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);
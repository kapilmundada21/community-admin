import User from "../../../models/user"
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'DELETE') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    const userId = req.query.id;
    try {
        let user = await User.findById(userId);
        if (!user) {
            res.status(200).json({ success: false, error: `User does not exist.` });
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    let deletedUser = await User.deleteOne({ _id: userId })
    res.status(200).json({ success: true, user: deletedUser })
    return
}
export default connectDb(handler);
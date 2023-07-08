import User from "../../../models/user"
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'PATCH') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(200).json({ success: false, error: `User does not exist.` });
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    let updatedUser = await User.findByIdAndUpdate({ _id: req.body._id }, req.body)
    await updatedUser.save();
    res.status(200).json({ success: true, user: updatedUser })
    return
}
export default connectDb(handler);
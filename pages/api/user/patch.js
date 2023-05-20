import User from "../../../models/user"
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'PATCH') {
        let user;
        try{
            user = await User.findOne({ email: req.body.email })
        }
        catch(error){
            console.error(error);
        }
        
        if (user) {
            let updatedUser = await User.findByIdAndUpdate({ _id: req.body._id }, req.body )
            await updatedUser.save();
            res.status(200).json({ success: true, user: updatedUser })
            return
        }
        else{
            res.status(200).json({ success: false, error: `User does not exist.` })
            return
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);
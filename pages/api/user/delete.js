import User from "../../../models/user"
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'DELETE') {
        let user;
        const userId = req.query.id;
        try{
            user = await User.findById( userId )
        }
        catch(error){
            console.error(error);
        }
        
        if (user) {
            let deletedUser = await User.deleteOne({ _id: userId })
            res.status(200).json({ success: true, user: deletedUser })
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
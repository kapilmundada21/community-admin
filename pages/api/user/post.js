import User from "../../../models/user"
import connectDb from "../../../middleware/mongoose"
const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');

const handler = async (req, res) => {

    if (req.method !== 'POST') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            res.status(200).json({ success: false, error: `User with this Email ID already exist. Your account status is ${user.status}` })
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    if ((req.body.setPasswordType === "password")) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        let newUser = new User({ ...req.body, password: passwordHash })
        await newUser.save();
        res.status(200).json({ success: true, user: newUser })
        return
    }
    else {
        // set set-password mail token for 24hrs 
        let token = jwt.sign({ email: req.body.email, iat: Math.floor(Date.now() / 1000) }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 60 * 24 });

        let newUser = new User({ ...req.body, setPasswordToken: token })
        await newUser.save();

        res.status(200).json({ success: true, user: newUser })
        return
    }
}
export default connectDb(handler);
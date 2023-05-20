const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    password: { type: String },
    status: { type: String, required: true, default: 'Pending' },
    resetPasswordToken : { type: String, },
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("User", UserSchema);
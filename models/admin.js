const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    password: { type: String },
    type: { type: String, required: true, default: 'Supervisor' },
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("Admin", AdminSchema);
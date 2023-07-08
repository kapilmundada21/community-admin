const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true, unique:true },
    description: { type: String, required: true },
    img: { type: String },
    publishedBy: { type: String },
    status: { type: String, required: true, default: 'Pending' },
    rejectionMessage: { type: String, default: null },
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("News", NewsSchema);
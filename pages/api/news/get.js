import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'GET') {
        const newsStatus = req.query.status; 
        const page = req.query.page; 
        const offset = req.query.offset;
        let totalNews = await News.find({ status: newsStatus }).count();
        let news = await News.find({ status: newsStatus }).sort({ "createdAt": -1 }).skip(page*offset).limit(offset);
        res.status(200).json({ success: true, allNews: news, totalNews })
        return
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);
import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'GET') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    const newsStatus = req.query.status;
    const { page, offset, sortBy, orderBy } = req.query;
    const sortQuery = {};
    sortQuery[sortBy] = orderBy;
    let totalNews = await News.countDocuments({ status: newsStatus });
    let news = await News.find({ status: newsStatus }).sort(sortQuery).skip(page * offset).limit(offset);
    res.status(200).json({ success: true, allNews: news, totalNews })
    return

}
export default connectDb(handler);
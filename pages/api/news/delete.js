import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'DELETE') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
    
    try {
        let news = await News.findOne({ _id: newsId })
        if (!news) {
            res.status(200).json({ success: false, error: `news does not exist.` })
            return
        }
    }
    catch (error) {
        console.error(error);
    }
    
    const newsId = req.query.id;
    let deletedNews = await News.deleteOne({ _id: newsId })
    res.status(200).json({ success: true, news: deletedNews })
    return
}
export default connectDb(handler);
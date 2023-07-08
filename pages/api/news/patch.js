import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    if (req.method !== 'PATCH') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }

    try {
        let news = await News.findOne({ title: req.body.title });
        if (!news) {
            res.status(200).json({ success: false, error: `news with this title does not exist.` });
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    let updatedNews = await News.findOneAndUpdate({ title: req.body.title }, req.body)
    await updatedNews.save();
    res.status(200).json({ success: true, news: updatedNews })

}
export default connectDb(handler);
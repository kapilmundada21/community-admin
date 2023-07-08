import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {

    if (req.method !== 'POST') {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
    
    try {
        let news = await News.findOne({ title: req.body.title });
        if (news) {
            res.status(200).json({ success: false, error: `news with this title already exist.` })
            return
        }
    }
    catch (error) {
        console.error(error);
    }

    let newNews = new News(req.body)
    await newNews.save();
    res.status(200).json({ success: true, status: newNews.status, id: newNews._id })
    return
}
export default connectDb(handler);
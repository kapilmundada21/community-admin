import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'DELETE') {
        let news;
        const newsId = req.query.id;
        try{
            news = await News.findOne({ _id: newsId })
        }
        catch(error){
            console.error(error);
        }

        if (news) {
            let deletedNews = await News.deleteOne({ _id: newsId })
            res.status(200).json({ success: true, news: deletedNews })
            return
        }
        else{
            res.status(200).json({ success: false, error: `news does not exist.` })
            return
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);
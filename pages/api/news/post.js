import News from "@/models/news"
import connectDb from "@/middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'POST') {
        let news;
        try{
            news = await News.findOne({ title: req.body.title })
        }
        catch(error){
            console.error(error);
        }

        if (!news) {
            let newNews = new News(req.body)
            await newNews.save();
            res.status(200).json({ success: true, status: newNews.status, id: newNews._id })
            return
        }
        else{
            res.status(200).json({ success: false, error: `news with this title already exist.` })
            return
        }
    }
    else {
        res.status(400).json({ error: "This method is not allowed" })
        return
    }
}
export default connectDb(handler);
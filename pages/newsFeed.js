import News from "@/models/news";
import mongoose from "mongoose";
import NewsCard from "./newsCard";

function NewsFeed({ allNews }) {
  return (
    <div className="p-5">
      {allNews.map((news, index) => (
        <NewsCard key={index} news={news} />
      ))}
    </div>
  );
}

export default NewsFeed;

export async function getServerSideProps(context) {
  if (!mongoose.connections[0].readyState) {
      await mongoose.connect(process.env.MONGO_URI)
  }
  let allNews;
  try{
    allNews = await News.find({"status":"Pending"}).sort({ "createdAt": -1 });
  }
  catch(error){
      console.error(error);
  }

  return {
      props: { allNews: JSON.parse(JSON.stringify(allNews)) }, 
  }
}
import { Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography";
import Link from "next/link";

function NewsCard({ news, pendingActionBtn, footer }) {
  const description = (news.description).slice(0, 250) + "....";
  return (
    <>
      <Card sx={{ maxWidth: 345 }}>

        <Link href={`/news/${news._id}`} target="_blank">
          <CardMedia
            sx={{ height: 140 }}
            image={news.img}
            title=" "
          />
          <CardContent>
            <Typography gutterBottom variant="b" component="b" className="hover:underline">
              {news.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} dangerouslySetInnerHTML={{ __html: description}} />
          </CardContent>
        </Link>

        {
          footer &&
          <CardActions>
            <Button onClick={() => footer.handleEditNews(news)} variant="contained" className="bg-[#1565c0] w-1/2">Edit</Button>
            <Button onClick={() =>
              window.confirm(
                "Do you want to delete this News?"
              ) === true
                ? footer.handleDeleteNews(news)
                : ""
            } variant="contained" className="bg-red-500 hover:bg-red-500 w-1/2">Delete</Button>
          </CardActions>
        }
        {
          pendingActionBtn &&
          <CardActions>
            <Button onClick={(e) => pendingActionBtn.handleApprovedNews(e, news)} variant="contained" className="bg-[#1565c0] w-1/2">Approve</Button>
            <Button onClick={() => {
              pendingActionBtn.setCurrentNews(news);
              pendingActionBtn.setOpenModal(true)
            }} variant="contained" className="bg-red-500 hover:bg-red-500 w-1/2">Reject</Button>
          </CardActions>
        }
      </Card>
    </>
  );
}

export default NewsCard;

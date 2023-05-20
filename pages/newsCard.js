import React, { useState } from "react";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";

function NewsCard({ news }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {
        news &&
        <Card
          onClick={() => setOpen(!open)}
          sx={{
            minWidth: 300,
            margin: 3,
            border: "1px solid rgba(211,211,211,0.6)",
          }}
        >
          <CardHeader
            title={news.title}
            action={
              <IconButton aria-label="expand" size="small">
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          ></CardHeader>
          <div
            style={{
              backgroundColor: "rgba(211,211,211,0.4)",
            }}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <CardContent>
                <Container
                  sx={{
                    lineHeight: 2,
                  }}
                >
                  <div className="">
                    <Image
                      // src={ process.env.NEXT_PUBLIC_CLIENT_HOST + news.img }
                      src={"/static/images/cards/contemplative-reptile.jpg"}
                      alt={news.img}
                      height={100}
                      width={300}
                    />
                    <div className="p-5">
                      {news.description}
                      <p className="mt-6 flex float-right text-gray-600">
                        Published By - <span className="text-blue-600"> {news.publishedBy}</span>
                      </p>
                    </div>
                  </div>
                </Container>
              </CardContent>
            </Collapse>
          </div>
        </Card>
      }
    </>
  );
}

export default NewsCard;

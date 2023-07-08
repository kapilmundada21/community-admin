import News from '../../models/news';
import mongoose from "mongoose";
import { useRouter } from 'next/router'
import Error from 'next/error'
import Image from 'next/image';
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

const drawerWidth = 400;

export default function Slug({ error, news, allNews }) {
    const router = useRouter();
    const { slug } = router.query;

    if (error == 404) {
        return <Error statusCode={404} />
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                {/* News */}
                <div className='md:mx-12 md:my-4'>
                    <div className='space-y-4 md:space-y-8'>
                        <h2 className='text-2xl font-bold'>{news.title}</h2>
                        <span className='text-sm text-gray-600'>
                            Published By -  
                            <span className="text-blue-600"> {news.publishedBy}</span>
                        </span>
                        <Image src={news.img} alt='' height={400} width={500} loading="lazy" />
                        <div dangerouslySetInnerHTML={{ __html: news.description }}></div>
                    </div>
                </div>
            </Box>
            
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                    zIndex: 1,
                }}
                variant="permanent"
                anchor="right"
            >
                <Toolbar />
                <Divider />
                <Typography variant="h5" component="span" sx={{ m: 4, mb: 0 }} className='text-blue-600'>
                    Recent News
                </Typography>
                <List>
                    {Object.keys(allNews).map((news, index) => (
                        <ListItem key={index} disablePadding>
                            <Link href={`/news/${allNews[index]._id}`} target='_blank' className='text-blue-600' >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Image src={allNews[index].img} alt='' width={120} height={120} className='mr-2' loading="lazy" />
                                    </ListItemIcon>
                                    <ListItemText primary={allNews[index].title} className="hover:underline" />
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            
        </Box>
    )
}

export async function getServerSideProps(context) {
    if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGO_URI)
    }
    let news;
    let allNews;
    try {
        allNews = await News.find({"status":"Approved"}).sort( { "createdAt": -1 } );
        news = await News.findOne({ _id: context.query.slug })
    }
    catch (error) {
        console.error(error);
    }

    if (!news) {
        return {
            props: { error: 404 },
        }
    }

    return {
        props: { news: JSON.parse(JSON.stringify(news)), allNews: JSON.parse(JSON.stringify(allNews)) }, // will be passed to
    }
}

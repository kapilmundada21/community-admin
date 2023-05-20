import Grid from "@mui/material/Grid";
import NewsCard from "@/components/NewsCard";
import Modal from "@/components/Modal";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PendingNews() {
    const [allNews, setAllNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [offset, setOffset] = useState(8);
    const [totalNews, setTotalNews] = useState(8);
    const [openModal, setOpenModal] = useState(false);
    const [rerenderComponent, setRerenderComponent] = useState(false);
    const [currentNews, setCurrentNews] = useState({
        title: "",
        description: "",
        img: "",
        publishedBy: "",
        status: "",
    });

    useEffect(() => {
        async function fetchData() {
            let URL = `${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/get?status=Pending&page=${page}&offset=${offset}`
            let data = await fetch(URL);
            let parsedData = await data.json();
            await setAllNews(Array.from(parsedData.allNews));
            await setTotalNews(parsedData.totalNews);
            setLoading(false);
        }
        fetchData();
        //eslint-disable-next-line
    }, [rerenderComponent])

    const updateData = async () => {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/get?status=Pending&page=${page + 1}&offset=${offset}`;
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setAllNews(allNews.concat(Array.from(parsedData.allNews)));
        setTotalNews(parsedData.totalNews);
        setLoading(false);
    }

    const handleApprovedNews = (e, newsObj) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/patch`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "PATCH",

            // Fields that to be updated are passed
            body: JSON.stringify({
                ...newsObj,
                status: "Approved",
            })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    toast.success("News Approved Sucessfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setRerenderComponent(!rerenderComponent);
                    setPage(0);
                    closeModal();
                }
                else {
                    toast.error(data.error, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
    };

    const handleRejectNews = (e, newsObj) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/patch`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "PATCH",

            // Fields that to be updated are passed
            body: JSON.stringify({
                ...newsObj,
                status: "Rejected",
            })
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    toast.success("News Rejected Sucessfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setRerenderComponent(!rerenderComponent);
                    setPage(0);
                    closeModal();
                }
                else {
                    toast.error(data.error, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
    };

    const closeModal = () => {
        setOpenModal(false);
        setCurrentNews({
            title: "",
            description: "",
            img: "",
            publishedBy: "",
            status: "",
        })
    };

    const pendingActionBtn = {
        handleApprovedNews,
        handleRejectNews,
        setCurrentNews,
        setOpenModal,
    }

    return (
        <>
            {openModal && (
                <Modal
                    title="Confirm Reject News"
                    endTitle="Confirm"
                    handleSubmit={(e) => { handleRejectNews(e, currentNews) }}
                    onClose={closeModal}
                    showmodal={openModal}
                    hasfooter={"true"}
                >
                </Modal>
            )}
            
            <div className="mt-12">
                <InfiniteScroll
                    dataLength={(page + 1) * offset}
                    next={updateData}
                    hasMore={((page + 1) * offset) <= totalNews}
                >
                    <Grid
                        container
                        spacing={{ xs: 2, md: 5 }}
                        columns={{ xs: 1, sm: 8, md: 12 }}
                    >
                        {Object.keys(allNews).map((news, index) => (
                            <Grid item xs={2} sm={4} md={3} key={index}>
                                <NewsCard news={allNews[index]} pendingActionBtn={pendingActionBtn} />
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>


                {
                    !(allNews.length) &&
                    <div className='md:pt-16 text-center'>
                        No data available
                    </div>
                }

                {loading && (
                    <div className="flex justify-center mt-5">
                        <CircularProgress />
                    </div>
                )}
            </div>
        </>
    )
}
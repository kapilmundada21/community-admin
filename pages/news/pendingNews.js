import axios from 'axios';
import Grid from "@mui/material/Grid";
import NewsCard from "@/components/NewsCard";
import Modal from "@/components/Modal";
import { useEffect, useState } from 'react';
import { CircularProgress, TextareaAutosize } from '@mui/material';
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
        rejectionMessage: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/api/news/get`, {
                    params: {
                        status: 'Pending',
                        page: page,
                        offset: offset
                    }
                });
                const parsedData = response.data;

                await Promise.all([
                    setAllNews(Array.from(parsedData.allNews)),
                    setTotalNews(parsedData.totalNews)
                ]);

                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
        //eslint-disable-next-line
    }, [rerenderComponent])

    const updateData = async () => {
        try {
            setLoading(true);
            setPage(page + 1);
            const response = await axios.get(`/api/news/get?status=Pending&page=${page + 1}&offset=${offset}`);
            const parsedData = response.data;
            setAllNews(allNews.concat(Array.from(parsedData.allNews)));
            setTotalNews(parsedData.totalNews);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleApprovedNews = async (e, newsObj) => {
        e.preventDefault();
        try {
            const response = await axios.patch('/api/news/patch', {
                ...newsObj,
                status: 'Approved',
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (data.success) {
                toast.success('News Approved Successfully!', {
                    position: 'top-right',
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
            } else {
                toast.error(data.error, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Error approving news:', error);
        }
    };

    const handleRejectNews = async (e, newsObj) => {
        e.preventDefault();
        try {
            const response = await axios.patch('/api/news/patch', {
                ...newsObj,
                status: 'Rejected',
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (data.success) {
                toast.success('News Rejected Successfully!', {
                    position: 'top-right',
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
            } else {
                toast.error(data.error, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Error rejecting news:', error);
        }
    };

    const handleRejectionMessage = (e) => {
        setCurrentNews({
            ...currentNews,
            rejectionMessage: e.target.value,
        });
    }

    const closeModal = () => {
        setOpenModal(false);
        setCurrentNews({
            title: "",
            description: "",
            img: "",
            publishedBy: "",
            status: "",
            rejectionMessage: "",
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
                    title="News Rejection Message"
                    endTitle="Reject News"
                    handleSubmit={(e) => { handleRejectNews(e, currentNews) }}
                    onClose={closeModal}
                    showmodal={openModal}
                    hasfooter={"true"}
                >
                    <TextareaAutosize
                        minRows={4}
                        placeholder="Rejection Message..."
                        value={(currentNews.rejectionMessage) ? currentNews.rejectionMessage : ""}
                        onChange={handleRejectionMessage}
                        required
                        className="w-full p-2"
                    />
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
                    !(allNews.length) && !loading &&
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
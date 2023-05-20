import { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import { CircularProgress, Fab, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import NewsCard from "@/components/NewsCard";
import Modal from "@/components/Modal";
import NewsModal from '@/components/Modals/NewsModal';
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AllNews() {
    const [statusType, setStatusType] = useState('Approved');
    const [allNews, setAllNews] = useState([]);
    const [page, setPage] = useState(0);
    const [offset, setOffset] = useState(8);
    const [totalNews, setTotalNews] = useState(8);
    const [loading, setLoading] = useState(true);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [rerenderComponent, setRerenderComponent] = useState(false);
    const [newsForModal, setNewsForModal] = useState({
        title: "",
        description: "",
        img: "",
        publishedBy: "",
        status: "",
    });

    useEffect(() => {
        async function fetchData() {
            let URL = `${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/get?status=${statusType}&page=${page}&offset=${offset}`
            let data = await fetch(URL);
            let parsedData = await data.json();
            await setAllNews(Array.from(parsedData.allNews));
            await setTotalNews(parsedData.totalNews);
            setLoading(false);
        }
        fetchData();
        //eslint-disable-next-line
    }, [rerenderComponent])

    const handleStatusType = (e) => {
        if (e.target.name === "status") {
            setStatusType(e.target.value);
            setPage(0)
            setRerenderComponent(!rerenderComponent)
        }
    }

    const updateData = async () => {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/get?status=${statusType}&page=${page + 1}&offset=${offset}`;
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setAllNews(allNews.concat(Array.from(parsedData.allNews)));
        setTotalNews(parsedData.totalNews);
        setLoading(false);
    }

    // -----Start EditNews modal functions-----
    const handleEditNews = (newsObj) => {
        setNewsForModal({
            title: "",
            description: "",
            img: "",
            publishedBy: "",
            status: "",
            ...newsObj,
        });
        setOpenEditModal(!openEditModal);
    };

    const handleEditNewsSave = (e, newsObj) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/patch`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "PATCH",

            // Fields that to be updated are passed
            body: JSON.stringify(newsObj),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    toast.success("News Updated Sucessfully!", {
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
            });
    };
    // -----End EditNews modal functions-----

    // -----Start CreateNews modal functions-----
    const handleCreateNews = () => {
        setNewsForModal({
            title: "",
            description: "",
            img: "",
            publishedBy: "",
            status: "",
        });
        setOpenCreateModal(!openCreateModal);
    };

    const handleCreateNewsNew = (e, newsObj) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/post`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",

            // Fields that to be updated are passed
            body: JSON.stringify(newsObj),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    toast.success("News Created Sucessfully!", {
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
                } else {
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
            .catch((err) => {
                console.error(err);
            });
    };
    // -----End CreateNews modal functions-----

    const handleDeleteNews = (newsObj) => {
        let id = newsObj._id;
        fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/news/delete/?id=${id}`, {
            method: "DELETE"
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setAllNews(allNews.filter((news) => news._id !== newsObj._id));
                    toast.success("News Deleted Sucessfully!", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
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

    // -----Start Modal handlers-----
    const closeModal = () => {
        setNewsForModal({});
        setOpenEditModal(false);
        setOpenCreateModal(false);
    };

    const handleNewsChange = (e) => {
        if (e.target.name === "status") {
            setNewsForModal({ ...newsForModal, status: e.target.value });
        }
        else {
            setNewsForModal({ ...newsForModal, [e.target.id]: e.target.value });
        }
    }

    const footer = {
        handleEditNews,
        handleDeleteNews,
    }

    return (
        <>
            {openEditModal && (
                <Modal
                    title="Edit News Info"
                    endTitle="Save Changes"
                    handleSubmit={(e) => { handleEditNewsSave(e, newsForModal) }}
                    onClose={closeModal}
                    showmodal={openEditModal}
                    hasfooter={"true"}
                >
                    <NewsModal news={newsForModal} onFieldChange={handleNewsChange} />
                </Modal>
            )}
            {openCreateModal && (
                <Modal
                    title="Create New News"
                    endTitle="Upload News"
                    handleSubmit={(e) => handleCreateNewsNew(e, newsForModal)}
                    onClose={closeModal}
                    showmodal={openCreateModal}
                    hasfooter={"true"}
                >
                    <NewsModal news={newsForModal} onFieldChange={handleNewsChange} />
                </Modal>
            )}

            <div className='flex fixed right-12 -mt-8 bg-white my-8 z-10 space-x-4'>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="status"
                        name="status"
                        value={statusType}
                        label="Status"
                        onChange={handleStatusType}
                    >
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>

                <Tooltip title="New News" className="bg-[#1565c0]">
                    <Fab color="primary" aria-label="add">
                        <AddIcon onClick={handleCreateNews} />
                    </Fab>
                </Tooltip>
            </div>

            <div className="mt-16">
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
                        {allNews.map((news, index) => (
                            <Grid item xs={2} sm={4} md={3} key={index}>
                                <NewsCard news={allNews[index]} footer={footer} />
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
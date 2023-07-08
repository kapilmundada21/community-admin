import { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import { CircularProgress, Fab, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import axios from 'axios';
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
    const [dbSortBy, setDbSortBy] = useState('updatedAt');
    const [dbOrderBy, setDbOrderBy] = useState(-1);
    const [totalNews, setTotalNews] = useState(8);
    const [loading, setLoading] = useState(true);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
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
            try {
                const response = await axios.get(`/api/news/get`, {
                    params: {
                        status: statusType,
                        page: page,
                        offset: offset,
                        sortBy: dbSortBy,
                        orderBy: dbOrderBy,
                    }
                });
                const parsedData = response.data;
                await setAllNews(Array.from(parsedData.allNews));
                await setTotalNews(parsedData.totalNews);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
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
        try {
            setLoading(true);
            setPage(page + 1);
            const response = await axios.get(`/api/news/get`, {
                params: {
                    status: statusType,
                    page: page+1,
                    offset: offset,
                    sortBy: dbSortBy,
                    orderBy: dbOrderBy,
                }
            });
            const parsedData = response.data;
            setAllNews(allNews.concat(Array.from(parsedData.allNews)));
            setTotalNews(parsedData.totalNews);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

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

    const handleEditNewsSave = async (e, newsObj) => {
        e.preventDefault();
        try {
            const response = await axios.patch('/api/news/patch', newsObj, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (data.success) {
                toast.success('News Updated Successfully!', {
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
            console.error(error);
        }
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

    const handleCreateNewsNew = async (e, newsObj) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/news/post', newsObj, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (data.success) {
                toast.success('News Created Successfully!', {
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
            console.error(error);
        }
    };
    // -----End CreateNews modal functions-----

    const handleDeleteModel = (newsObj) => {
        setNewsForModal({
            title: "",
            description: "",
            img: "",
            publishedBy: "",
            status: "",
            ...newsObj
        });
        setOpenDeleteModal(!openDeleteModal);
    };

    const handleDeleteNews = async (e, newsObj) => {
        e.preventDefault();

        try {
            const id = newsObj._id;
            const response = await axios.delete(`/api/news/delete/?id=${id}`);
            const data = response.data;
            if (data.success) {
                setAllNews(allNews.filter((news) => news._id !== newsObj._id));
                setTotalNews(totalNews - 1);
                toast.success('News Deleted Successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
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
            console.error(error);
        }
    };
    // -----Start Modal handlers-----
    const closeModal = () => {
        setNewsForModal({});
        setOpenEditModal(false);
        setOpenCreateModal(false);
        setOpenDeleteModal(false);
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
        handleDeleteModel,
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
            {openDeleteModal && (
                <Modal
                    title="Conform Delete News"
                    endTitle="Delete News"
                    handleSubmit={(e) => handleDeleteNews(e, newsForModal)}
                    onClose={closeModal}
                    showmodal={openDeleteModal}
                    hasfooter={"true"}
                />
            )}

            <div className='w-full md:w-min flex justify-between fixed md:right-12 -mt-0 p-4 md:-mt-3 md:p-0 bg-white my-8 z-10 space-x-4'>
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

            <div className="px-5 md:my-16 mt-24">
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
                            <Grid item xs={2} sm={4} md={3} key={index} className='flex justify-center'>
                                <NewsCard news={allNews[index]} footer={footer} />
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
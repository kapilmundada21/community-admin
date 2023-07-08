import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import Fab from "@mui/material/Fab";
import Fade from '@mui/material/Fade';
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { Button, CircularProgress, Divider, FormControl, IconButton, InputLabel, Menu, MenuItem, Radio, RadioGroup, Select } from "@mui/material";
// -------------REQUIRED IMPORTS----------------------
import axios from 'axios';
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import Modal from "@/components/Modal";
import EditAdmin from "@/components/Modals/EditAdmin";
import CreateAdmin from "@/components/Modals/CreateAdmin";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

function AdminSupervisorTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "700" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

AdminSupervisorTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function AdminSupervisorTableToolbar(props) {
  const { numSelected, handleCreateAdmin, adminType, handleAdminType, values, handleChange, handleSubmit } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    e.preventDefault();
    setAnchorEl(null);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", fontWeight: 700 }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          All {adminType}
        </Typography>
      )}

      <div className="flex space-x-4 md:space-x-8">
        <div title="Filters">
          <IconButton
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <form onSubmit={(e) => { handleClose(e); handleSubmit(e) }} className="flex flex-col space-y-3 px-4 pt-2">
              <FormControl className="space-x-4">
                <Typography variant="span" component="span" className="font-semibold"> Sort By </Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  id="dbSortBy"
                  name="dbSortBy"
                  value={values.dbSortBy}
                  onChange={handleChange}
                >
                  <FormControlLabel value="updatedAt" control={<Radio />} label="Last Updated" />
                  <FormControlLabel value="createdAt" control={<Radio />} label="Created" />
                  <FormControlLabel value="name" control={<Radio />} label="Name" />
                </RadioGroup>
              </FormControl>

              <Divider />

              <FormControl className="space-x-4">
                <Typography variant="span" component="span" className="font-semibold"> Order By </Typography>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  id="dbOrderBy"
                  name="dbOrderBy"
                  value={values.dbOrderBy}
                  onChange={handleChange}
                >
                  <FormControlLabel value={1} control={<Radio />} label="Ascending" />
                  <FormControlLabel value={-1} control={<Radio />} label="Descending" />
                </RadioGroup>
              </FormControl>

              <Button variant="contained" type="submit" className="place-self-end w-min bg-[#1976d2]">
                Apply
              </Button>
            </form>
          </Menu>
        </div>

        <FormControl>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="type"
            name="type"
            value={adminType}
            label="Type"
            onChange={handleAdminType}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Supervisor">Supervisor</MenuItem>
          </Select>
        </FormControl>

        <Tooltip title={`Create ${adminType}`} className="bg-[#1565c0]">
          <Fab color="primary" aria-label="add">
            <AddIcon onClick={() => handleCreateAdmin()} />
          </Fab>
        </Tooltip>
      </div>
    </Toolbar>
  );
}

AdminSupervisorTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function AdminSupervisorTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [offset, setOffset] = React.useState(5);
  const [totalAdmins, setTotalAdmins] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(offset);
  // -------------divider----------------
  const [allAdmin, setAllAdmin] = useState([]);
  const [dbSortBy, setDbSortBy] = useState('updatedAt');
  const [dbOrderBy, setDbOrderBy] = useState(-1);
  const [pageVisited, setPageVisited] = useState([0]);
  const [openCreateAdminModal, setOpenCreateAdminModal] = useState(false);
  const [openEditAdminModal, setOpenEditAdminModal] = useState(false);
  const [openDeleteAdminModal, setOpenDeleteAdminModal] = useState(false);
  const [adminType, setAdminType] = useState('Admin');
  const [loading, setLoading] = useState(true);
  const [rerenderComponent, setRerenderComponent] = useState(false);
  const [adminForModal, setAdminForModal] = useState({
    name: "",
    email: "",
    type: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/admin/get`, {
          params: {
            type: adminType,
            page: page,
            offset: offset,
            sortBy: dbSortBy,
            orderBy: dbOrderBy,
          }
        });

        const parsedData = response.data;
        const alladmins = parsedData.allAdmin;

        await Promise.all([
          setTotalAdmins(parsedData.totalAdmins),
          setAllAdmin(Array.from(alladmins))
        ]);

        setLoading(false);
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();
    //eslint-disable-next-line
  }, [rerenderComponent, offset])

  const updateData = async (newPage) => {
    try {
      setLoading(true);

      const response = await axios.get(`/api/admin/get`, {
        params: {
          type: adminType,
          page: newPage,
          offset: offset,
          sortBy: dbSortBy,
          orderBy: dbOrderBy,
        }
      });

      const parsedData = response.data;
      const alladmins = parsedData.allAdmin;

      await Promise.all([
        setTotalAdmins(parsedData.totalAdmins),
        setAllAdmin(allAdmin.concat(Array.from(alladmins)))
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const initialValues = {
    dbSortBy,
    dbOrderBy,
  }

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    onSubmit: async (values) => {
      setDbOrderBy(values.dbOrderBy)
      setDbSortBy(values.dbSortBy)
      setPageVisited([0])
      setPage(0)
      setAllAdmin([])
      setLoading(true)
      setRerenderComponent(!rerenderComponent)
    }
  })

  function createData(name, email, type, actionObject) {
    return {
      name,
      email,
      type,
      actionObject,
    };
  }

  const rows = allAdmin.map((item) => {
    return createData(item.name, item.email, item.type, item);
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (!pageVisited.includes(newPage)) {
      updateData(newPage)
      pageVisited.push(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setOffset(parseInt(event.target.value, 10))
    setPage(0);
    setPageVisited([0]);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with Userty rows.
  const UsertyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // -----Start EditAdmin modal functions-----
  const handleEditAdmin = (adminObj) => {
    setAdminForModal({
      name: "",
      email: "",
      type: "",
      ...adminObj,
    });
    setOpenEditAdminModal(!openEditAdminModal);
  };

  const handleEditAdminSave = async (e, adminObj) => {
    e.preventDefault();

    try {
      const response = await axios.patch('/api/admin/patch', adminObj, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (data.success) {
        toast.success(`${adminObj.type} Updated Successfully!`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        setRerenderComponent(!rerenderComponent);
        closeModal();
      } else {
        toast.error(data.error, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  }; // -----End EditAdmin modal functions-----

  // -----Start CreateAdmin modal functions-----
  const handleCreateAdmin = () => {
    setAdminForModal({
      name: "",
      email: "",
      type: "",
      setPasswordType: "mail",
      password: "",
    });
    setOpenCreateAdminModal(!openCreateAdminModal);
  };

  const handleCreateAdminNew = async (e, adminObj) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/admin/post', adminObj, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;

      if (data.success) {
        toast.success(`${adminObj.type} Created Successfully!`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        setRerenderComponent(!rerenderComponent);
        closeModal();
        
        // send mail to admin/supervisor
        if(adminObj.setPasswordType === "mail"){
          const emailData = {
            to: data.admin.email,
            token: data.admin.setPasswordToken,
          };
          try {
            const emailResponse = await axios.post(`/api/mail/setUserPassword`, emailData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
          } catch (error) {
            console.error('Error sending set password mail:', error);
          }
        }

      } else {
        toast.error(data.error, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  }; // -----End CreateAdmin modal functions-----

  // -----Start Delete Admin modal functions-----
  const handleDeleteAdminModel = (adminObj) => {
    setAdminForModal({
      name: "",
      email: "",
      type: "",
      password: "",
      ...adminObj
    });
    setOpenDeleteAdminModal(!openDeleteAdminModal);
  };

  const handleDeleteAdmin = (e, adminObj) => {
    e.preventDefault();

    const id = adminObj._id;

    axios.delete(`/api/admin/delete?id=${id}`)
      .then((response) => {
        const data = response.data;

        if (data.success) {
          setAllAdmin(allAdmin.filter((admin) => admin._id !== adminObj._id));
          setTotalAdmins(totalAdmins - 1);
          toast.success(`${adminObj.type} Deleted Successfully!`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
          setRerenderComponent(!rerenderComponent);
          closeModal();
        } else {
          toast.error(data.error, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting admin:', error);
      });
  }; // -----End Delete Admin modal functions-----

  // -----Start Modal handlers-----
  const closeModal = () => {
    setAdminForModal({});
    setOpenEditAdminModal(false);
    setOpenCreateAdminModal(false);
    setOpenDeleteAdminModal(false);
  };

  const handleAdminChange = (e) => {
    if (e.target.name) {
      setAdminForModal({ ...adminForModal, [e.target.name]: e.target.value });
    }
    else {
      setAdminForModal({ ...adminForModal, [e.target.id]: e.target.value });
    }
  }

  const handleAdminType = (e) => {
    if (e.target.name === "type") {
      setAdminType(e.target.value);
      setRerenderComponent(!rerenderComponent)
    }
  }

  return (
    <div>
      {openEditAdminModal && (
        <Modal
          title="Edit User Info"
          endTitle="Save Changes"
          handleSubmit={(e) => { handleEditAdminSave(e, adminForModal) }}
          onClose={closeModal}
          showmodal={openEditAdminModal}
          hasfooter={"true"}
        >
          <EditAdmin admin={adminForModal} onFieldChange={handleAdminChange} />
        </Modal>
      )}
      {openCreateAdminModal && (
        <Modal
          title="Create New Account"
          endTitle="Create Account"
          handleSubmit={(e) => handleCreateAdminNew(e, adminForModal)}
          onClose={closeModal}
          showmodal={openCreateAdminModal}
          hasfooter={"true"}
        >
          <CreateAdmin admin={adminForModal} onFieldChange={handleAdminChange} />
        </Modal>
      )}
      {openDeleteAdminModal && (
        <Modal
          title="Conform Delete"
          endTitle="Delete"
          handleSubmit={(e) => handleDeleteAdmin(e, adminForModal)}
          onClose={closeModal}
          showmodal={openDeleteAdminModal}
          hasfooter={"true"}
        />
      )}

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }} className='p-3 mt-3'>
          <AdminSupervisorTableToolbar
            numSelected={selected.length}
            handleCreateAdmin={handleCreateAdmin}
            handleAdminType={handleAdminType}
            adminType={adminType}
            values={values}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <AdminSupervisorTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows.length ? stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.actionObject._id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>
                          <div className="flex space-x-4 text-xl">
                            <AiFillEdit
                              onClick={() => handleEditAdmin(row.actionObject)}
                              className="cursor-pointer"
                            />
                            <MdDeleteForever
                              className="cursor-pointer"
                              onClick={() => handleDeleteAdminModel(row.actionObject)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }) : !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                {UsertyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * UsertyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {loading && (
            <div className="flex justify-center mt-5">
              <CircularProgress />
            </div>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalAdmins}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </Box>
      </Box>
    </div>
  );
}
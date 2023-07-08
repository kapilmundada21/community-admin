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
import FilterListIcon from "@mui/icons-material/FilterList";
import Fade from '@mui/material/Fade';
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { Button, CircularProgress, Divider, FormControl, IconButton, Menu, Radio, RadioGroup, TextareaAutosize } from "@mui/material";
// -------------REQUIRED IMPORTS----------------------
import { useState, useEffect } from "react";
import axios from 'axios';
import { useFormik } from 'formik';
import Modal from "@/components/Modal";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
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
    label: "User Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

function PendingusersTableHead(props) {
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

PendingusersTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function PendingusersTableToolbar(props) {
  const { numSelected, values, handleChange, handleSubmit } = props;
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
          Pending Users
        </Typography>
      )}

      <div title="Filters" className="flex space-x-4 md:space-x-8">
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
    </Toolbar>
  );
}

PendingusersTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function PendingusersTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [offset, setOffset] = React.useState(5);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(offset);
  // -------------divider----------------
  const [allUser, setAllUser] = useState([]);
  const [dbSortBy, setDbSortBy] = useState('updatedAt');
  const [dbOrderBy, setDbOrderBy] = useState(-1);
  const [pageVisited, setPageVisited] = useState([0]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rerenderComponent, setRerenderComponent] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    status: "",
    rejectionMessage: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/user/get`, {
          params: {
            status: 'Pending',
            page: page,
            offset: offset,
            sortBy: dbSortBy,
            orderBy: dbOrderBy,
          }
        })
        const parsedData = response.data;
        const allusers = parsedData.allUser;
        await Promise.all([
          setTotalUsers(parsedData.totalUsers),
          setAllUser(Array.from(allusers))
        ]);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
    //eslint-disable-next-line
  }, [rerenderComponent, offset])

  const updateData = async (newPage) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/user/get`, {
        params: {
          status: 'Pending',
          page: newPage,
          offset: offset,
          sortBy: dbSortBy,
          orderBy: dbOrderBy,
        }
      });
      const parsedData = response.data;
      const allusers = parsedData.allUser;

      await Promise.all([
        setTotalUsers(parsedData.totalUsers),
        setAllUser(allUser.concat(Array.from(allusers)))
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
      setAllUser([])
      setLoading(true)
      setRerenderComponent(!rerenderComponent)
    }
  })

  function createData(name, email, status, actionObject) {
    return {
      name,
      email,
      status,
      actionObject,
    };
  }

  const rows = allUser.map((item) => {
    return createData(item.name, item.email, item.status, item);
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

  const handleApprovedUser = async (e, userObj) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/api/user/patch', {
        ...userObj,
        status: 'Approved',
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      if (data.success) {
        toast.success('User Approved Successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
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
          progress: undefined,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectUser = async (e, userObj) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/api/user/patch', {
        ...userObj,
        status: 'Rejected',
      }, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      if (data.success) {
        toast.success('User Rejected Successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
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
          progress: undefined,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectionMessage = (e) => {
    setCurrentUser({
      ...currentUser,
      rejectionMessage: e.target.value,
    });
  }

  // -----Start Modal handlers-----
  const closeModal = () => {
    setOpenModal(false);
    setCurrentUser({
      name: "",
      email: "",
      status: "", 
      rejectionMessage: "",
    })
  };

  return (
    <div>
      {openModal && (
        <Modal
          title="User Rejection Message"
          endTitle="Reject User"
          handleSubmit={(e) => { handleRejectUser(e, currentUser) }}
          onClose={closeModal}
          showmodal={openModal}
          hasfooter={"true"}
        >
          <TextareaAutosize
            minRows={4} 
            placeholder="Rejection Message..."
            value={(currentUser.rejectionMessage) ? currentUser.rejectionMessage : ""}
            onChange={handleRejectionMessage}
            required
            className="w-full p-2"
          />
        </Modal>
      )}

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }} className='p-3 mt-3'>
          <PendingusersTableToolbar
            numSelected={selected.length}
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
              <PendingusersTableHead
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
                        <TableCell>{row.status}</TableCell>
                        <TableCell>
                          <div className="flex space-x-4 text-xl">
                            <CheckCircleIcon
                              onClick={(e) => handleApprovedUser(e, row.actionObject)}
                              className="cursor-pointer text-green-600"
                            />
                            <CancelIcon
                              className="cursor-pointer font-bold text-red-500"
                              onClick={() => {
                                setCurrentUser(row.actionObject)
                                setOpenModal(!openModal)
                              }}
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
            count={totalUsers}
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
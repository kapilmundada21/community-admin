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
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// -------------REQUIRED IMPORTS----------------------
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import EditUser from "@/components/Modals/EditUser";
import CreateUser from "@/components/Modals/CreateUser";
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

function AllusersTableHead(props) {
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

AllusersTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function AllusersTableToolbar(props) {
  const { numSelected, handleCreateUser, statusType, handleStatusType } = props;

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
          All Users
        </Typography>
      )}

      <div className="flex space-x-8">
        <FormControl>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="status"
            name="status"
            value={statusType}
            label="Age"
            onChange={handleStatusType}
          >
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Create User" className="bg-[#1565c0]">
          <Fab color="primary" aria-label="add">
            <AddIcon onClick={() => handleCreateUser()} />
          </Fab>
        </Tooltip>
      </div>
    </Toolbar>
  );
}

AllusersTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function AllusersTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // -------------divider----------------
  const [allUser, setAllUser] = useState([]);
  const [statusType, setStatusType] = useState('Approved');
  const [loading, setLoading] = useState(true);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false);
  const [rerenderComponent, setRerenderComponent] = useState(false);
  const [userForModal, setUserForModal] = useState({
    name: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    async function fetchData() {
      let data = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/user/get?status=${statusType}`);
      let parsedData = await data.json();
      let allusers = parsedData.allUser;
      await setAllUser(allusers);
      setLoading(false);
    }
    fetchData();
    //eslint-disable-next-line
  }, [rerenderComponent])

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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with Userty rows.
  const UsertyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // -----Start EditUser modal functions-----
  const handleEditUser = (userObj) => {
    setUserForModal({
      name: "",
      email: "",
      status: "",
      ...userObj,
    });
    setOpenEditUserModal(!openEditUserModal);
  };

  const handleEditUserSave = (e, userObj) => {
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/user/patch`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",

      // Fields that to be updated are passed
      body: JSON.stringify(userObj),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.success) {
          toast.success("User Updated Sucessfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setRerenderComponent(!rerenderComponent);
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
  // -----End EditUser modal functions-----

  // -----Start CreateUser modal functions-----
  const handleCreateUser = () => {
    setUserForModal({
      name: "",
      email: "",
      status: "",
      password: "",
    });
    setOpenCreateUserModal(!openCreateUserModal);
  };

  const handleCreateUserNew = (e, UserObj) => {
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/user/post`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",

      // Fields that to be updated are passed
      body: JSON.stringify(UserObj),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.success) {
          toast.success("User Created Sucessfully!", {
            position: "top-right",
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
  // -----End CreateUser modal functions-----

  const handleDeleteUser = (userObj) => {
    let id = userObj._id;
    fetch(`${process.env.NEXT_PUBLIC_ADMIN_HOST}/api/user/delete/?id=${id}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllUser(allUser.filter((user) => user._id !== userObj._id));
          toast.success("User Deleted Sucessfully!", {
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
    setUserForModal({});
    setOpenEditUserModal(false);
    setOpenCreateUserModal(false);
  };

  const handleUserChange = (e) => {
    if (e.target.name === "status") {
      setUserForModal({ ...userForModal, status: e.target.value });
    }
    else {
      setUserForModal({ ...userForModal, [e.target.id]: e.target.value });
    }
  }

  const handleStatusType = (e) => {
    if (e.target.name === "status") {
      setStatusType(e.target.value);
      setRerenderComponent(!rerenderComponent)
    }
  }

  return (
    <div>
      {openEditUserModal && (
        <Modal
          title="Edit User Info"
          endTitle="Save Changes"
          handleSubmit={(e) => { handleEditUserSave(e, userForModal) }}
          onClose={closeModal}
          showmodal={openEditUserModal}
          hasfooter={"true"}
        >
          <EditUser user={userForModal} onFieldChange={handleUserChange} />
        </Modal>
      )}
      {openCreateUserModal && (
        <Modal
          title="Create New User"
          endTitle="Create User"
          handleSubmit={(e) => handleCreateUserNew(e, userForModal)}
          onClose={closeModal}
          showmodal={openCreateUserModal}
          hasfooter={"true"}
        >
          <CreateUser user={userForModal} onFieldChange={handleUserChange} />
        </Modal>
      )}

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <AllusersTableToolbar
            numSelected={selected.length}
            handleCreateUser={handleCreateUser}
            handleStatusType={handleStatusType}
            statusType={statusType}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <AllusersTableHead
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
                            <AiFillEdit
                              onClick={() => handleEditUser(row.actionObject)}
                              className="cursor-pointer"
                            />
                            <MdDeleteForever
                              className="cursor-pointer"
                              onClick={() =>
                                window.confirm(
                                  "Do you want to delete this User?"
                                ) === true
                                  ? handleDeleteUser(row.actionObject)
                                  : ""
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
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
            count={rows.length}
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
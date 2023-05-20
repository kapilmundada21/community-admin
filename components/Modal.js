import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, handleClose } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }}>
      {children}
      {handleClose ? (
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  showmodal: PropTypes.bool,
  hasfooter: PropTypes.string,
  endTitle: PropTypes.string,
};

export default function Modal(props) {
  const { title, children, onClose, endTitle, handleSubmit, ...other } = props;

  return (
    <div>
      {children && (
        <div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <BootstrapDialog
            component="form"
            autoComplete="off"
            aria-labelledby="customized-dialog-title"
            fullWidth
            open={other.showmodal}
            onClose={onClose}
            onSubmit={handleSubmit}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              handleClose={onClose}
            >
              {title}
            </BootstrapDialogTitle>
            <DialogContent dividers>{children}</DialogContent>
            {other.hasfooter === "true" && (
              <DialogActions>
                <Button variant="contained" type="submit" className="bg-[#1976d2]">
                  {endTitle}
                </Button>
              </DialogActions>
            )}
          </BootstrapDialog>
        </div>
      )}
      {
        !children && 
        <div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <BootstrapDialog
            component="form"
            autoComplete="off"
            aria-labelledby="customized-dialog-title"
            fullWidth
            open={other.showmodal}
            onClose={onClose}
            onSubmit={handleSubmit}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              handleClose={onClose}
            >
              {title}
            </BootstrapDialogTitle>
            {other.hasfooter === "true" && (
              <DialogActions>
                <Button variant="contained" type="submit" className="bg-[#1976d2]">
                  {endTitle}
                </Button>
              </DialogActions>
            )}
          </BootstrapDialog>
        </div>
      }
    </div>
  );
}

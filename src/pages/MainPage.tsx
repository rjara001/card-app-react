import { makeStyles } from "@material-ui/styles";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useState } from "react";
import { Login } from "../components/Login/Login";
// import { UserContext } from '../context/context.create';
import { Header } from "../components/Header";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { IUserInfo } from "../interfaces/IUserInfo.js";
import { Adapter } from "../locals/adapter";
import { UserContext } from "../context/context.user";
import { useKeycloak } from "@react-keycloak/web";
import { User } from "../models/User";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
    padding: 4,
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
    position: "fixed",
    top: "10px",
  },
  description: {
    fontSize: "1.5rem",
    textAlign: "center",
    marginBottom: 4,
  },
  button: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: `2px 4px`,
    borderRadius: "50px",
  },
}));

export const MainPage = () => {
  const classes = useStyles();
  const { userInfo, updateValue } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const { keycloak } = useKeycloak();

  const handleGoLoginClick = () => {
    // setOpen(true);
    keycloak.login();
  };

  keycloak.onAuthSuccess = () => {
    // Your code here

    // updateValue() // TODO
    if (keycloak.authenticated) {
      User.Login(userInfo, keycloak);
      updateValue(userInfo);
    }
  };

  keycloak.onAuthError = (errorData) => {
    // Handle the authentication error
  };

  keycloak.onAuthLogout = () => {
    // Your code to handle logout
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectionProvider = (user: IUserInfo) => {
    setOpen(false);
  };

  useEffect(() => {
    if (keycloak.authenticated) {
      User.Login(userInfo, keycloak);
      updateValue(userInfo);
    } else {
      User.LoginClean(userInfo);
    }
  }, [keycloak.authenticated]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Login handleSelectionProvider={handleSelectionProvider}></Login>
        </DialogContent>
      </Dialog>

      <div>
        <Header title="FladyCard" />
      </div>
      <div className={classes.root}>
        <Typography variant="h4" className={classes.description}>
          Hey there, Welcome {keycloak?.tokenParsed?.name}
        </Typography>

        {!keycloak.authenticated && (
          <Button onClick={handleGoLoginClick}>Go to Login</Button>
        )}

        <Typography
          variant="body1"
          className={classes.description}
          style={{ paddingTop: "50px" }}
        >
          Expand your vocabulary by learning, memorizing, and playing
        </Typography>
      </div>
    </>
  );
};

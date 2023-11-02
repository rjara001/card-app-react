import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Avatar, Button, Menu, MenuItem, List, ListItem, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material';
import { AccountCircle, ArrowBack } from '@mui/icons-material';
import { useContext, useState } from "react";
// import { UserContext } from "../context/context.create";
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
// import { GoogleLogout } from "react-google-login";
// import { UserContext } from "../context/context.user";
import { User } from "../models/User";
import { useKeycloak } from '@react-keycloak/web';
import { UserContext } from "../context/context.user";

interface Props {
  title: string;
  hasBack?: boolean;
  logOut?: ()=>void
}

export const Header: React.FC<Props> = ({ title, hasBack, logOut }) => {
  const navigate = useNavigate();
  // const [open, setOpen] = useState(false);
  const { userInfo } = useContext(UserContext);
  const { keycloak } = useKeycloak();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackClick = () => {

    navigate(-1);

  };

  const _logout = () =>{
    keycloak.logout();
    User.LoginClean(userInfo);
    navigate("/");
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {hasBack && (
            <IconButton edge="start" color="inherit" onClick={handleBackClick} sx={{ marginRight: 2 }}>
              <ArrowBack />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {title}
          </Typography>
          {keycloak?.authenticated
            ? <Avatar alt={keycloak?.tokenParsed?.name} src={keycloak?.tokenParsed?.imageUrl} onClick={handleAvatarClick}/>
            : <Avatar sx={{ width: 40, height: 40 }} onClick={handleAvatarClick}>
              <AccountCircle />
            </Avatar>
          }

        </Toolbar>
      </AppBar>

      {keycloak.authenticated===true && <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >

        <MenuItem onClick={handleMenuClose}>
          <List sx={{ pt: 0 }}>

            <ListItem disableGutters>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={keycloak?.tokenParsed?.email} />
              </ListItemButton>
            </ListItem>
            <ListItem disableGutters>
              <ListItemButton>

                    <Button onClick={_logout}>Logout</Button>

              </ListItemButton>
            </ListItem>
          </List>

        </MenuItem>

      </Menu>}
    </>
  );
};
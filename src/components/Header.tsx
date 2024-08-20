import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Typography, Avatar, Button, Menu, MenuItem, List, ListItem, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material';
import { AccountCircle, ArrowBack } from '@mui/icons-material';
import { useContext, useState } from "react";
// import { UserContext } from "../context/context.create";
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { GoogleLogout } from "react-google-login";
import { UserContext } from "../context/context.user";
import { User } from "../models/User";

interface Props {
  title: string;
  hasBack?: boolean;
}

const Header: React.FC<Props> = ({ title, hasBack }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { updateValue, userInfo } = useContext(UserContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {

    updateValue(User.LoginClean(userInfo));
    
    navigate('/');
  }
  const handleLogoutSuccess = () => {
    // Perform any necessary logout actions, such as clearing local storage or redirecting to the login page

  };
  
  const handleBackClick = () => {

    navigate(-1);

  };
  function handleLogoutFailure(): void {
    throw new Error("Function not implemented.");
  }

  const facebookLogout = ()=>{

    updateValue(User.LoginClean(userInfo));

    navigate('/');
    console.log('logout ok');
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
          {userInfo.IsInLogin
            ? <Avatar alt={userInfo.FullName} src={userInfo.imageUrl} onClick={handleAvatarClick}/>
            : <Avatar sx={{ width: 40, height: 40 }} onClick={handleAvatarClick}>
              <AccountCircle />
            </Avatar>
          }

        </Toolbar>
      </AppBar>

      {userInfo.IsInLogin===true && <Menu
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
                <ListItemText primary={userInfo.UserId} />
              </ListItemButton>
            </ListItem>
            <ListItem disableGutters>
              <ListItemButton onClick={handleLogout}>

                    {userInfo.provider === 'google'?<GoogleLogout
                       clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
                      buttonText="Logout"
                      onLogoutSuccess={handleLogoutSuccess}
                      onFailure={handleLogoutFailure}
                    />:<Button onClick={facebookLogout}>Logout</Button>
                  
                  }

              </ListItemButton>
            </ListItem>
          </List>

        </MenuItem>

      </Menu>}
    </>
  );
};

export default Header;


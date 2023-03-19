import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from "../../context/context.create";
import { IUserInfo } from '../../interfaces/IUserInfo.js';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import { Theme } from "@mui/material/styles";


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from 'react-router-dom';
import GoogleLogin, { GoogleLogout } from "react-google-login";
import { gapi } from 'gapi-script';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 2,
    },
    avatar: {
        width: 20,
        height: 20,
    },
    button: {
        marginTop: 2,
    },
}));

interface ProfileProps {
    username: string;
    email: string;
    avatarUrl: string;
}

export function SettingsPage() {
    const classes = useStyles();
    const navigate = useNavigate();

    var CLIENT_ID = process.env.REACT_APP_PUBLIC_GOOGLE_CLIENT_ID || '';

    
      useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: process.env.REACT_APP_PUBLIC_GOOGLE_CLIENT_ID,
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, []);

    const { userInfo, updateValue } = useContext(UserContext);
    //   const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        // setIsToggled(!isToggled);
        userInfo.FirstShowed = !userInfo.FirstShowed;
        updateValue(userInfo);
    };
 
    const onSuccess = (response: any) => {

        userInfo.UserName = response.profileObj.name;
        userInfo.UserEmail = response.profileObj.email;
        userInfo.IsInLogin = true;
        // navigate('/play');
    }

    const onFailure = (err: any) => {
        console.error(err);
    };
    
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem>
                <ListItemAvatar>

                    {!userInfo.IsInLogin && <GoogleLogin
                        clientId={CLIENT_ID} // "967034721711-20e7u0gm5bqr2ic1intjer5agfs35a5n.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true} />}
                    <Avatar>

                    </Avatar>
                </ListItemAvatar>
                {userInfo.IsInLogin && <ListItemText primary={userInfo.UserName} secondary={userInfo.UserEmail} sx={{ paddingLeft: '10px' }} />}
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemIcon>
                    <ChangeCircleIcon />
                </ListItemIcon>
                <ListItemText id="switch-list-label-wifi" primary="Turn Card" />
                <Switch checked={userInfo.FirstShowed} onChange={handleToggle} color="primary" />
            </ListItem>

        </List>
    );

    // return (
    //     <div>
    //         <div>
    //             <Grid container spacing={3} className={classes.root}>
    //                 <Grid item xs={12} sm={3}>
    //                     <Avatar sx={{ bgcolor: deepOrange[500] }}>R</Avatar>

    //                 </Grid>
    //                 <Grid item xs={12} sm={9}>
    //                     <Typography variant="h2">{username}</Typography>
    //                     <Typography variant="h5">{email}</Typography>
    //                     <Button variant="contained" color="primary" className={classes.button}>
    //                         Edit Profile
    //                     </Button>
    //                 </Grid>
    //             </Grid>
    //         </div>
    //         <div>
    //             <h1>Settings</h1>
    //             <FormControlLabel
    //                 control={<Switch checked={userInfo.FirstShowed} onChange={handleToggle} color="primary" />}
    //                 label="Turn the card"
    //                 labelPlacement="start"
    //             />

    //         </div></div>
    // );
};
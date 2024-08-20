import Switch from '@mui/material/Switch';
import { useContext, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from "@mui/material/styles";


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { UserContext } from '../../context/context.user';
import { User } from '../../models/User';

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
// Configuration object constructed.
const config = {
    auth: {
        clientId: '3d5f5d7f-f9a1-47a8-9363-5d5a826ff716'
    }
};
export function SettingsPage() {
    const navigate = useNavigate();

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
   
    if (!userInfo) {
        return <div>Loading user information...</div>;
    }


    const handleToggleTurnCard = () => {
        
        userInfo.FirstShowed = !userInfo.FirstShowed;
        updateValue(userInfo);
    };

    const handleToggleActivePrompt = () => {
        userInfo.PromptActived = !userInfo.PromptActived;
        if (userInfo.TimeOutActived>0)
            userInfo.TimeOutActived = -1;

        updateValue(userInfo);
    }

    const handleToggleActiveTimeOut = () => {
        userInfo.TimeOutActived = (userInfo.TimeOutActived<0?5:-1);
        if (userInfo.TimeOutActived>0)
            userInfo.PromptActived = false;
        updateValue(userInfo);
    }

    const onSuccess = (response: any) => {

        userInfo.UserName = response.profileObj.name;
        userInfo.UserEmail = response.profileObj.email;
        userInfo.IsInLogin = User.hasAccessToken(userInfo);
        // navigate('/play');
    }

    const onFailure = (err: any) => {
        console.error(err);
    };

    const handleUploadFile = () => {
        navigate('upload');
    }
    
    // function signInClickHandler(instance) {
    //     instance.loginPopup();
    //   }
      
    // create PublicClientApplication instance
    const publicClientApplication = new PublicClientApplication(config);

        // SignInButton Component returns a button that invokes a popup login when clicked
    // function SignInButton() {
    //     // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    //     const { instance } = useMsal();
    
    //     return <button onClick={() => signInClickHandler(instance)}>Sign In</button>;
    // }
  
    return (
        <MsalProvider instance={publicClientApplication}>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                
                <ListItem>
                    <ListItemIcon>
                        <ChangeCircleIcon />
                    </ListItemIcon>
                    <ListItemText id="switch-list-label-wifi" primary="Turn Card" />
                    <Switch checked={userInfo.FirstShowed} onChange={handleToggleTurnCard} color="primary" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ChangeCircleIcon />
                    </ListItemIcon>
                    <ListItemText id="switch-list-label-wifi" primary="Active Prompt" />
                    <Switch checked={userInfo.PromptActived} onChange={handleToggleActivePrompt} color="primary" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ChangeCircleIcon />
                    </ListItemIcon>
                    <ListItemText id="switch-list-label-wifi" primary="Active Timeout (5s)" />
                    <Switch checked={(userInfo.TimeOutActived>0?true:false)} onChange={handleToggleActiveTimeOut} color="primary" />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ChangeCircleIcon />
                    </ListItemIcon>
                    <ListItemText id="switch-list-label-wifi" primary="Active Voice" />
                    <Switch color="primary" />
                </ListItem>
            </List></ MsalProvider>
    );
};
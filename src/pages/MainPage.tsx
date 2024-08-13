import { makeStyles } from '@material-ui/styles';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { Login } from '../components/Login/Login';
// import { UserContext } from '../context/context.create';
import Header from '../components/Header';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { IUserInfo } from '../interfaces/IUserInfo';
import { UserContext } from '../context/context.user';
import { useNavigate } from 'react-router-dom';
import { LoginStatus } from '../models/Enums';
import { signin } from '../locals/auth/signin';
import { User } from '../models/User';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        padding: 4,
        textAlign: 'center'
    },
    title: {
        fontSize: '3rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
        position: 'fixed',
        top: '10px'
    },
    description: {
        fontSize: '1.5rem',
        textAlign: 'center',
        marginBottom: 4,

    },
    button: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        padding: `2px 4px`,
        borderRadius: '50px',
    },
}));

export const MainPage = () => {
    const classes = useStyles();
    const { userInfo , updateValue} = useContext(UserContext);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleSignIn = async () => {
            if (userInfo?.Login.LoginStatus === LoginStatus.SignIn) {
                try {
                    // Sign in the user
                    await signin(userInfo);                    

                    User.LoginGoogle(userInfo);
                    
                    updateValue(userInfo);

                } catch (error) {
                    console.error('An error occurred during sign-in:', error);
                    // Handle errors as needed
                }
            }
        };
    
        handleSignIn();
    }, [updateValue, userInfo]);

    if (!userInfo) {
        return <div>Loading user information...</div>;
    }


    const handleGoLoginClick = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectionProvider = (user: IUserInfo) => {
        setOpen(false);
    }
   

    if (!userInfo.IsInLogin)
        navigate('/');

    return (
        <>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    <IconButton sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }} onClick={handleClose}>
                        <Close />
                    </IconButton></DialogTitle>
                <DialogContent>
                    <Login handleSelectionProvider={handleSelectionProvider}></Login>
                </DialogContent>

            </Dialog>

            <div>
                <Header title="Glimmind" />
            </div> 
            <div className={classes.root}>

                <Typography variant="h4" className={classes.description}>
                    Hey there, Welcome {userInfo.FullName}
                </Typography>

                {!userInfo.IsInLogin && <Button onClick={handleGoLoginClick}>Go to Login</Button>}

                <Typography variant="body1" className={classes.description} style={{ paddingTop: '50px' }}>
                    Expand your vocabulary by learning, memorizing, and playing
                </Typography>
            </div>
        </>
    );
}
import { Close } from "@mui/icons-material";
import { Dialog, DialogTitle, IconButton, DialogContent, Typography, Button } from "@mui/material";
import { userInfo } from "os";
import { HeaderLand } from "../../components/HeaderLand";
import { useContext, useEffect, useState } from "react";
import { Login } from '../../components/Login/Login';
import { IUserInfo } from "../../interfaces/IUserInfo";
import { makeStyles } from "@material-ui/styles";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/context.user';

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

export const LandingPage = () => {
    const [open, setOpen] = useState(false);
    const { userInfo } = useContext(UserContext);
    const classes = useStyles();
    const navigate = useNavigate();

    
    const handleGoLoginClick = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectionProvider = (user: IUserInfo) => {
        setOpen(false);
    }

    useEffect(()=> {
        if (userInfo?.IsInLogin) { 
            navigate('home'); 
        }
    }, [userInfo]);

    if (!userInfo) {
        return <div>Loading user information...</div>;
    }

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
                <HeaderLand title="Glimmind" />
            </div>
            <div className={classes.root}>

           { !userInfo.IsInLogin && <Button onClick={handleGoLoginClick}>Go to Login</Button>}
           { userInfo.IsInLogin && 'Welcome ' + userInfo.FullName}

                <Typography variant="body1" className={classes.description} style={{ paddingTop: '50px' }}>
                    Expand your vocabulary by learning, memorizing, and playing
                </Typography>
            </div>
        </>
    );
}
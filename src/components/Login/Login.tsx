
import { Grid, Box, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/styles';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { ReactFacebookLoginProps } from 'react-facebook-login';
import { FC, useContext } from 'react';
// import { UserContext } from "../../context/context.create";
import { IUserInfo } from '../../interfaces/IUserInfo';
import { CustomLogin } from './CustomLogin';
import { User } from '../../models/User';
import { UserContext } from '../../context/context.user';
import { GoogleLogin } from 'react-google-login';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
// import { FaFacebookF } from 'react-icons/fa';
// import { Fa } from 'react-icons/fa';
import { FaFacebookF } from 'react-icons/fa';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {

        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        margin: 1,
        width: '100%',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 2,
    },
    input: {
        margin: 1,
        width: '100%',
        padding: '4px 0px 4px 0px'
    },
    description: {
        fontSize: '1.5rem',
        textAlign: 'center',
        marginBottom: 4,
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#4285F4',
        color: '#ffffff',
        border: 'none',
        alignText: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 1px 1px',
        '&:hover': {
            backgroundColor: '#3c77d9',
        },
    },

    facebookButton: {
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        padding: 0,
        marginRight: 2,
        backgroundColor: '#3b5998',
        color: 'white',
        minWidth: 'auto',
        '&:hover': {
            backgroundColor: '#2f477a',
        },
    },
    logo: {
        fontSize: '24px',
        marginRight: 1,
    },

}));

function CircleFacebookButton() {
    const classes = useStyles();
    return (
        <Button
            variant="contained"
            className={classes.facebookButton}
            startIcon={<FaFacebookF className={classes.logo} />}
        />
    );
}

type LoginProps = {
    handleSelectionProvider: (user: IUserInfo) => void
}

export const Login: FC<LoginProps> = ({ handleSelectionProvider }): JSX.Element => {
    const classes = useStyles();
    const { userInfo, updateValue } = useContext(UserContext);
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        // handle Google login logic here
    };
    const handleFacebookLoginSuccess = (response: any) => {
        User.LoginFacebook(userInfo, response);

        updateValue(userInfo);
        handleSelectionProvider(userInfo);

        navigate('/home');
    };

    const handleGoogleLoginSuccess = (response: any) => {

        User.LoginGoogle(userInfo, response);

        updateValue(userInfo);
        handleSelectionProvider(userInfo);

        navigate('/home');
    };

    const handleCustomLoginSuccess = (response: any) => {
        User.LoginCustom(userInfo, response);

        updateValue(userInfo);
        handleSelectionProvider(userInfo);

        navigate('/home');
    }

    const handleGoogleLoginFailure = (response: any) => {
        // Handle failed login response
    };

    return (
        <div className={classes.root}>

            <Grid container spacing={0} sx={{ justifyContent: 'center' }}>

                <Grid item xs={12}>
                    <CustomLogin handleCustomLoginSuccess={handleCustomLoginSuccess}></CustomLogin>
                    <Box textAlign="center" sx={{ paddingTop: '18px', paddingBottom: '18px' }}>
                        <Typography variant="subtitle2">Or sign in with social media</Typography>
                    </Box>
                </Grid>
                <Grid container spacing={0} sx={{ justifyContent: 'center' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sx={{ textAlign: '-webkit-right'}}>
                            <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
                                render={renderProps => (
                                    <button className={classes.googleButton} onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                        <FontAwesomeIcon icon={faGoogle} />
                                    </button>
                                )}
                                onSuccess={handleGoogleLoginSuccess}
                                onFailure={handleGoogleLoginFailure}
                                cookiePolicy={'single_host_origin'}
                            /></Grid>
                        <Grid item xs={6}>
                            <FacebookLogin
                                appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID || ''}
                                fields="name,email,picture"
                                // onClick={handleFacebookLoginSuccess}
                                callback={handleFacebookLoginSuccess}
                                render={(renderProps: any) => (
                                    <Button className={classes.facebookButton} onClick={renderProps.onClick} disabled={renderProps.isDisabled}>
                                        <FaFacebookF className={classes.logo} />
                                    </Button>
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

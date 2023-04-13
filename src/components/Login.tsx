
import { Grid, Button, TextField, Box, Divider, Typography } from '@mui/material';
import { GoogleLoginButton, FacebookLoginButton } from "react-social-login-buttons";
import { makeStyles } from '@material-ui/styles';
import { Separator } from '../elements/Separator/Separator';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { FC, useContext } from 'react';
import { UserContext } from "../context/context.create";
import { IUser } from '../interfaces/IUser.js';
import { IUserInfo } from '../interfaces/IUserInfo';

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
}));

type LoginProps = {
    handleSelectionProvider:(user:IUserInfo)=>void
}

export const Login: FC<LoginProps> = ({handleSelectionProvider}): JSX.Element => {
    const classes = useStyles();
    const { userInfo, updateValue } = useContext(UserContext);

    const handleGoogleLogin = () => {
        // handle Google login logic here
    };
    const handleFacebookLogin = (response:any) => {
        // handle the Facebook response here
        console.log(response);
        
        userInfo.IsInLogin = true;
        userInfo.UserId = response.email;
        userInfo.FullName = response.name;
        userInfo.imageUrl = response.picture.data.url;
        userInfo.provider = 'facebook';

        updateValue(userInfo);
        handleSelectionProvider(userInfo);
        console.log('logeado ok');
      };
    
      const handleFacebookLogout = () => {
        // handle the Facebook logout here
       
      };


    const handleCustomLogin = () => {
        // handle custom login logic here
    };
    const handleSubmit = (event: any) => {
        event.preventDefault();
        // handle form submission logic
    }

    const handleGoogleLoginSuccess = (response: any) => {
        // Handle successful login response
        userInfo.IsInLogin = true;
        userInfo.UserId = response.profileObj.email;
        userInfo.FullName = response.profileObj.name;
        userInfo.imageUrl = response.profileObj.imageUrl;
        userInfo.provider = 'google';

        updateValue(userInfo);
        handleSelectionProvider(userInfo);
        console.log('logeado ok');
    };

    const handleGoogleLoginFailure = (response: any) => {
        // Handle failed login response
    };

    return (
        <div className={classes.root}>
            <Typography variant="h4" className={classes.description}>
                Login
            </Typography>
            <Grid container spacing={0} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12}>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <TextField size="small" className={classes.input} label="Username" inputProps={{ style: { width: '100%' } }} variant="outlined" />
                        <TextField size="small" className={classes.input} label="Password" type="password" inputProps={{ style: { width: '100%' } }} variant="outlined" />
                        <Button type="submit" variant="contained" className={classes.button}>Login</Button>
                    </form>
                </Grid>
                <Grid item xs={12}>
                    <Box textAlign="center" sx={{ paddingTop: '18px', paddingBottom: '18px' }}>
                        <Typography variant="subtitle2">Or sign in with social media</Typography>
                    </Box>
                </Grid>
                <Grid container spacing={0} sx={{ justifyContent: 'center' }}>
                    <Grid item xs={12}>
                        {/* <GoogleLoginButton onClick={handleGoogleLogin} style={{ backgroundColor: '#DB4437', color: '#FFFFFF', height: '40px' }} /> */}
                        <GoogleLogin
                        
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}
                            buttonText="Login with Google"
                            style={{ background: '#dd4b39', color: 'white', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold' }}
                            disabledStyle={{ opacity: 0.6 }}
                            onSuccess={handleGoogleLoginSuccess}
                            onFailure={handleGoogleLoginFailure}
                            className="google-login-button"
                            cookiePolicy={'single_host_origin'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {/* <FacebookLoginButton onClick={handleFacebookLogin} style={{ height: '40px' }} /> */}
                        <FacebookLogin
                            appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID || ''}
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={handleFacebookLogin}
                            />
                    </Grid> 
                </Grid>
            </Grid>
        </div>
    );
}

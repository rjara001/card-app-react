
import { Grid, Button, TextField, Box, Divider, Typography } from '@mui/material';
import { GoogleLoginButton, FacebookLoginButton } from "react-social-login-buttons";
import { makeStyles } from '@material-ui/styles';
import { Separator } from '../elements/Separator/Separator';

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
}));

export const Login = (): JSX.Element => {
    const classes = useStyles();

    const handleGoogleLogin = () => {
        // handle Google login logic here
    };

    const handleFacebookLogin = () => {
        // handle Facebook login logic here
    };

    const handleCustomLogin = () => {
        // handle custom login logic here
    };
    const handleSubmit = (event: any) => {
        event.preventDefault();
        // handle form submission logic
    }
    return (
        <div className={classes.root}>

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
                        <GoogleLoginButton onClick={handleGoogleLogin} style={{ backgroundColor: '#DB4437', color: '#FFFFFF', height: '40px' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <FacebookLoginButton onClick={handleFacebookLogin} style={{ height: '40px' }}/>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

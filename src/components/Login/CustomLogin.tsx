import { Grid, TextField, Button, Tab, Tabs, Box, Typography } from "@mui/material"
import { makeStyles } from '@material-ui/styles';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import { FC, useState } from "react";
import { MessageDialog } from "../../elements/Dialogs/MessageDialog";

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


const poolData = {
    UserPoolId: 'us-east-1_O0m2h2X7y',
    ClientId: '6u1mj0aqk36267tkgs2qn9p5ga'
};

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

const userPool = new CognitoUserPool(poolData);
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
type CustomLoginProps = {
    handleCustomLoginSuccess: (response: any) => void
}

export const CustomLogin: FC<CustomLoginProps> = ({ handleCustomLoginSuccess }) => {

    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [registerEmail, setRegisterEmail] = useState('');
    const [name, setName] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [repeatRegisterPassword, setRepeatRegisterPassword] = useState('');

    const [tabValue, setTabValue] = useState(0);
    const [messageLogin, setMessageLogin] = useState('');
    const [openMeesage, setOpenMeesage] = useState(false);

    const signIn = () => {

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });

        const userData = {
            Username: email,
            Pool: userPool
        };

        const cognitoUser = new CognitoUser(userData);

        return new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {

                    handleCustomLoginSuccess(result);

                    resolve(result);
                },
                onFailure: (err) => {
                    if (err.code === "UserNotFoundException") {
                        setMessageLogin(err.message);
                        setOpenMeesage(true);
                    }
                    if (err.code === "NotAuthorizedException") {
                        setMessageLogin(err.message);
                        setOpenMeesage(true);
                    }
                    reject(err);
                }
            })
        });
    }

    const signUp = () => {
        const emailAttribute = new CognitoUserAttribute({
            Name: 'email',
            Value: registerEmail
        });
        const nameAttribute = new CognitoUserAttribute({
            Name: 'name',
            Value: name
        });

        // Sign up the user
        userPool.signUp(registerEmail, registerPassword, [emailAttribute, nameAttribute], [], (err, result) => {
            if (err) {

                return;
            }

            handleCustomLoginSuccess(result);
        });
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        // handle form submission logic
    }
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const login = () => {
        return <>

            <MessageDialog open={openMeesage} message={messageLogin} severity='error'></MessageDialog>

            <Grid item xs={12}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField size="small" className={classes.input} label="email" inputProps={{ style: { width: '100%' } }} variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField size="small" className={classes.input} label="Password" type="password" inputProps={{ style: { width: '100%' } }} variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" variant="contained" className={classes.button} onClick={signIn}>Login</Button>
                </form>

            </Grid><Grid container spacing={0} sx={{ justifyContent: 'center' }}>
                <Grid item>
                    <Button variant="text">Forgot password?</Button>
                </Grid>
                <Grid item>|</Grid>
                <Grid item>
                    <Button variant="text" onClick={()=>setTabValue(1)}>Not a member? Register</Button>
                </Grid>
            </Grid></>
    }

    const register = () => {
        return <><Grid item xs={12}>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField size="small" className={classes.input} label="Email" inputProps={{ style: { width: '100%' } }} variant="outlined" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                <TextField size="small" className={classes.input} label="Name" inputProps={{ style: { width: '100%' } }} variant="outlined" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField size="small" className={classes.input} label="Password" type="password" inputProps={{ style: { width: '100%' } }} variant="outlined" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                <TextField size="small" className={classes.input} label="Repeat Password" type="password" inputProps={{ style: { width: '100%' } }} variant="outlined" value={repeatRegisterPassword} onChange={(e) => setRepeatRegisterPassword(e.target.value)} />
                <Button type="submit" variant="contained" className={classes.button} onClick={signUp}>Sign Up</Button>
            </form>

        </Grid>
        </>
    }

    return <>

        <Tabs value={tabValue} onChange={handleChange} aria-label="disabled tabs example" centered>
            <Tab label="Login" />

            <Tab label="Register" />
        </Tabs>
        <div>
            <TabPanel value={tabValue} index={0}>
                {login()}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                {register()}

            </TabPanel>

        </div>
    </>
}
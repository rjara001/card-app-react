import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, Stack, Button } from "@mui/material"
import { useContext, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import useSessionStorage from "../hooks/useSessionStorage";

import { _DRIVE } from "../constants/drive";
import { Login } from "@mui/icons-material";
import { UserContext } from "../context/context.user";
import { config } from '../config/config';

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  title: string
}


const drawerWidth = 240;
const navItems = ['Home', 'About', 'Contact'];

export const HeaderLand = (props: Props) => {
  const { title } = props;

  // const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [oauthState, setOauthState] = useSessionStorage<string>('oauth_state', '');
  const { userInfo, updateValue } = useContext(UserContext);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Stack direction="row" spacing={2}>
        <div>
          <Typography variant="h6" sx={{ my: 2 }}>
            <a href="https://www.glimmind.com">{title}</a>
          </Typography>
        </div>
        <div>
          <List sx={{ display: 'flex', alignItems: 'center', margin: 0, padding: 0 }}>

          </List>
        </div>
      </Stack>
      <Divider />

    </Box>
  );

  const container = () => window.document.body;

  const signIn = () => {
    const { homepage, googleClientId } = config;
    const baseUrl = homepage; // window.location.href + "/";

    // updateValue({...userInfo, Login: {...userInfo.Login, Redirect: baseUrl}});
 
    var clientId = googleClientId;
    const redirectUri = new URL('signin-google', baseUrl).toString();
    const scope = "openid email profile https://www.googleapis.com/auth/drive.file";
    const state = uuidv4().replace(/-/g, '');

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth
            ?client_id=${clientId}
            &redirect_uri=${encodeURIComponent(redirectUri)}
            &response_type=code
            &scope=${encodeURIComponent(scope)}
            &state=${state}
            &access_type=offline`.replace(/\s+/g, '');

    // const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth
    //           ?client_id=${clientId}
    //           &redirect_uri=${encodeURIComponent(redirectUri)}
    //           &response_type=code
    //           &scope=${encodeURIComponent(scope)}
    //           &state=${state}
    //           &prompt=consent
    //           &access_type=offline`.replace(/\s+/g, '');

    setOauthState(state);

    if (typeof window !== 'undefined') {
      const width = 500;
      const height = 600;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      window.location.href = oauthUrl;
      // window.open(
      //   oauthUrl,
      //   'GoogleOAuth',
      //   `width=${width},height=${height},top=${top},left=${left}`
      // );
    }
  }
  return <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          {title}
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button onClick={signIn}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<FontAwesomeIcon icon={faGoogle} />}
          >
            Sign in with Google
          </Button>

          {/* <Button href="#" className="btn btn-outline-light me-2" onClick={(e) => {
                e.preventDefault();
                signIn();
              }} >
                <img
                  src="assets/icons8-google-16.png"
                  alt="Google Logo"
                  width="24"
                  height="24"
                  className="me-2"
                />
                Sign in with Google
              </a> */}
        </Box>
      </Toolbar>
    </AppBar>
    <Box component="nav">
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
    </Box>

  </Box>
}
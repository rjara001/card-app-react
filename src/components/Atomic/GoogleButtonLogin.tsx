import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, Button } from "@mui/material"
import { getConfig } from "../../config/config"
import { v4 as uuidv4 } from 'uuid';
import useSessionStorage from "../../hooks/useSessionStorage";

export const GoogleButtonLogin = () => {
    const [oauthState, setOauthState] = useSessionStorage<string>('oauth_state', '');

    
    const signIn = () => {
        const { homepage, googleClientId } = getConfig();
        const baseUrl = homepage + "/";

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

    return (
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

        </Box>
    )

}
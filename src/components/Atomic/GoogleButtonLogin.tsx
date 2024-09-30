import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, Button } from "@mui/material"
import { getConfig } from "../../config/config"
import { v4 as uuidv4 } from 'uuid';
import useSessionStorage from "../../hooks/useSessionStorage";
import { openOAuthWindow } from "../Utility/Oauth";

export const GoogleButtonLogin: React.FC = () => {
    const [oauthState, setOauthState] = useSessionStorage<string>('oauth_state', '');
  
    const signIn = () => {
      const { homepage, googleClientId } = getConfig();
      const baseUrl = homepage + "/";
      openOAuthWindow(googleClientId, baseUrl, setOauthState);
    };
  
    return (
      <Box sx={{ display: 'block' }}>
        <Button
          onClick={signIn}
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faGoogle} />}
          sx={{
            padding: { xs: '6px 12px', sm: '8px 16px', md: '10px 20px' },
            fontSize: { xs: '12px', sm: '14px', md: '16px' },
          }}
        >
          Sign in with Google
        </Button>
      </Box>
    );
  };
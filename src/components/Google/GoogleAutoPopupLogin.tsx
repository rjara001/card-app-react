import React, { useEffect } from 'react'
import useSessionStorage from '../../hooks/useSessionStorage';
import { getConfig } from '../../config/config';
import { openOAuthWindow } from '../Utility/Oauth';

export const GoogleAutoPopupLogin: React.FC = () => {
    const [oauthState, setOauthState] = useSessionStorage<string>('oauth_state', '');
  
    useEffect(() => {
      const { homepage, googleClientId } = getConfig();
      const baseUrl = homepage + "/";
      openOAuthWindow(googleClientId, baseUrl, setOauthState);
    }, []);
  
    return (
      <div>
        <h2>Logging in with Google...</h2>
      </div>
    );
  };

export default GoogleAutoPopupLogin
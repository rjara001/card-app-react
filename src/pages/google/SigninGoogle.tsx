import React, { useContext, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';  // Spinner from Material UI
import Box from '@mui/material/Box';
import { UserContext } from '../../context/context.user';
import { LoginStatus } from '../../models/Enums';
import useSessionStorage from '../../hooks/useSessionStorage';
import { getConfig } from '../../config/config';
import { signin } from '../../locals/auth/signin';
import { IResponseObject } from '../../interfaces/AWS/IResponse';
import { User } from '../../models/User';

const SignInGoogle: React.FC = () => {
  const { homepage } = getConfig();
  const { updateValue } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);  // To manage loading state
  const [error, setError] = useState<string | null>(null);  // To capture error state
  // const [oauthState] = useSessionStorage<string>('oauth_state', '');

  const reloadOpenerSafelyAndClose = (): void => {
    if (window.opener && window.self !== window.top) {
      console.log('Reloading parent window and closing the popup...');
      window.opener.location.reload();  // Reload parent
      window.close();  // Close the popup
    } else if (window.opener) {
      console.log('This is a popup window, reloading parent and closing popup...');
      window.opener.location.reload();
      window.close();  // Close the popup
    } else {
      console.log('This is not a popup window or opener is undefined.');
    }
  };

  const getStorageFromOpener = (storageType: 'localStorage' | 'sessionStorage', key: string): string | null => {
    if (window.opener) {
      try {

        const storage = window.opener[storageType];
        const value = storage.getItem(key);
  
        // Check if the value is JSON and parse it if it is
        if (value && value.startsWith('"') && value.endsWith('"')) {
          return JSON.parse(value);
        }
  
        return value;
      } catch (error) {
        console.error(`Error accessing window.opener ${storageType}:`, error);
        return null;
      }
    } else {
      console.warn('window.opener is not available');
      return null;
    }
  }

  useEffect(() => {
    const handleSignIn = async () => {
      try {
        // Parse the URL query parameters
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        const code = params.get('code');
        const state = params.get('state');

        const oauthState = getStorageFromOpener('sessionStorage', 'oauth_state');

        if (code && state) {
          // Validate state parameter
          if (state !== oauthState) {
            throw new Error('Invalid state parameter');
          }

          // Update session data
          // userInfo.Login.Code = code;
          // userInfo.Login.LoginStatus = LoginStatus.SignIn;

          // if (!userInfo.Login.Redirect) {
          //   userInfo.Login.Redirect = `${homepage}/signin-google`;
          // }

          const singInObject : IResponseObject = await signin(code, `${homepage}/signin-google`);

          const userLogged = await User.SetAuth(singInObject.Data);

          updateValue(userLogged);

          // Reload parent window and close the popup
          reloadOpenerSafelyAndClose();
        }
      } catch (error: any) {
        console.error('Error during sign-in:', error);
        setError(error.message);  // Set error message
      } finally {
        setIsLoading(false);  // Hide spinner once process is complete
      }
    };

    handleSignIn();
  }, [homepage, updateValue]);

  if (isLoading) {
    // Show loading spinner while signing in
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />  {/* Material UI Spinner */}
      </Box>
    );
  }

  if (error) {
    // Show error message if something went wrong
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
      >
        <h2>Sign-in Failed</h2>
        <p>{error}</p>
      </Box>
    );
  }

  return null;
};

export default SignInGoogle;

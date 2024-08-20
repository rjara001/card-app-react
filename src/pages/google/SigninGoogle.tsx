import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useSessionStorage } from 'react-use'; // or any custom session storage hook
import { UserContext } from '../../context/context.user';
import { LoginStatus } from '../../models/Enums';
import useSessionStorage from '../../hooks/useSessionStorage';
import config from '../../config/config.json';

// interface Session {
//   User: {
//     Login: {
//       Code: string;
//       LoginStatus: string;
//       Redirect: string;
//     };
//   };
// }

const SignInGoogle: React.FC = () => {
  const { homepage } = config;
  const navigate = useNavigate();
  const { userInfo, updateValue } = useContext(UserContext);
  
  const [oauthState] = useSessionStorage<string>('oauth_state', '');

  useEffect(() => {
    const handleSignIn = async () => {
      // Parse the URL query parameters
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const code = params.get('code');
      const state = params.get('state');

      if (code && state) {
        // Update session data
        userInfo.Login.Code = code;
        userInfo.Login.LoginStatus = LoginStatus.SignIn;

        if (!userInfo.Login.Redirect)
          userInfo.Login.Redirect = `${homepage}/signin-google`;

        updateValue(userInfo);

        // Validate state parameter
        if (state !== oauthState) {
          throw new Error('Invalid state parameter');
        }

        // Navigate to dashboard
        navigate('/home');
        
        // Optional: Fetch user and update session
        try {
          // Replace with actual user fetching logic
          // const user = await getUser(session.User);
          // await setSession(user);
        } catch (error) {
          console.error('An error occurred:', error);
        }
      }
    };

    handleSignIn();
  }, []);

  return null; // or a loading spinner, or redirect UI
};

export default SignInGoogle;

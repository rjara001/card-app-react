import { v4 as uuidv4 } from 'uuid';

export const openOAuthWindow = (
  googleClientId: string,
  baseUrl: string,
  setOauthState: (state: string) => void
): void => {
  const redirectUri = new URL('signin-google', baseUrl).toString();
  const scope = "openid email profile https://www.googleapis.com/auth/drive.file";
  const state = uuidv4().replace(/-/g, '');

  const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth
        ?client_id=${googleClientId}
        &redirect_uri=${encodeURIComponent(redirectUri)}
        &response_type=code
        &scope=${encodeURIComponent(scope)}
        &state=${state}
        &access_type=offline`.replace(/\s+/g, '');

  setOauthState(state);

  if (typeof window !== 'undefined') {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    // Open the OAuth URL in a new window
    window.open(
      oauthUrl,
      'GoogleOAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  }
};

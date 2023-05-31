export const checkIfTokenExpired = (): boolean => {
    const expiryTime = localStorage.getItem('tokenExpiry'); // Example: Get the expiry time from storage
    const currentTime = new Date().getTime();
    
    return currentTime >= (expiryTime ? parseInt(expiryTime, 10) : 0); // Return true if the current time is greater than or equal to the expiry time
  }

export const refreshAccessToken = async (tokenRefresh: string) => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY || '',
            client_secret: process.env.REACT_APP_GOOGLE_DRIVE_SECRET || '',
            refresh_token: tokenRefresh,
        }),
    });

    const data = await response.json();

    return data.access_token;
}
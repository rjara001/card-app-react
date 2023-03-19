import Button from "@mui/material/Button"
import { useContext, useEffect, useState } from "react";

import { UserContext } from "../context/context.create";
import { gapi } from 'gapi-script';
import { useNavigate } from "react-router-dom";

export const MainPage = () => {
    // const { userInfo } = useContext(UserContext);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     function start() {
    //       gapi.client.init({
    //         clientId: process.env.REACT_APP_PUBLIC_GOOGLE_CLIENT_ID,
    //         scope: 'email',
    //       });
    //     }
    
    //     gapi.load('client:auth2', start);
    //   }, []);


    // var CLIENT_ID = process.env.REACT_APP_PUBLIC_GOOGLE_CLIENT_ID || '';

    return (
        <>
            {/* <GoogleLogout
                clientId={CLIENT_ID}
                onLogoutSuccess={onLogoutSuccess} />
                 */}
                </>
    );
}
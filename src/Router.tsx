import { Routes, Route, Navigate } from "react-router";
import SigninGoogle from "./pages/google/SigninGoogle";
import { GroupEdit } from "./pages/groups/GroupEdit";
import { GroupList } from "./pages/groups/GroupList";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { PlaySpace } from "./pages/play/PlaySpace";
import { SettingsPage } from "./pages/settings/Settings";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./context/context.user";
import { MainPage as HomePage } from './pages/MainPage';

function Router() {
    const { userInfo, loadUser } = useContext(UserContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // useEffect(() => {
    //     const initializeUser = async () => {
    //         await loadUser();  // Ensure loadUser completes before proceeding
    //     };

    //     initializeUser();
    // }, [loadUser]);

    useEffect(() => {
        if (userInfo) {
            setIsLoggedIn(userInfo.IsInLogin);
        }
    }, [userInfo]);

    return (
        <Routes>
            <Route path='/signin-google' element={<SigninGoogle />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/groups/:word?' element={isLoggedIn ? <GroupList /> : <Navigate to='/' />} />
            <Route path='/settings' element={isLoggedIn ? <SettingsPage /> : <Navigate to='/' />} />
            <Route path='/play' element={isLoggedIn ? <PlaySpace /> : <Navigate to='/' />} />
            <Route path='/group/:id?/:word?' element={isLoggedIn ? <GroupEdit /> : <Navigate to='/' />} />
            <Route path='/' element={<LandingPage />} />
        </Routes>
    );
}

export default Router;
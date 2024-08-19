
import './App.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { GroupList } from './pages/groups/GroupList';
import { MainPage as HomePage } from './pages/MainPage';

import { GroupEdit } from './pages/groups/GroupEdit';
import { PlaySpace } from './pages/play/PlaySpace';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';

import { PlayContext } from './context/context.create';

import { globalSummaryDefault } from './util/util';
import { IGlobalSummary } from './interfaces/IGlobalSummary';
import { MainMenu } from './components/MainMenu';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { MENU } from './constants/menu';
import { SettingsPage } from './pages/settings/Settings';
import { UserContextProvider } from './context/context.user';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { UserContext } from "./context/context.user";
import SigninGoogle from './pages/google/SigninGoogle';
import ErrorBoundaryWrapper from './components/Errors/Fallback';

function App() {
  const { userInfo } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(userInfo.IsInLogin);

  }, [userInfo]);

  // Create a client
  const queryClient = new QueryClient()

  const [summary, setSummary] = useState(globalSummaryDefault);



  const playContext = {
    summary, updateValue: (newObj: IGlobalSummary) => {
      setSummary(prevState => ({ ...prevState, ...newObj }));
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <PlayContext.Provider value={playContext}>

        <CssBaseline />
        <Container>
          <BrowserRouter>
            <ErrorBoundaryWrapper>
              <UserContextProvider>
                <Routes>
                  <Route path='/signin-google' element={<SigninGoogle />} />
                  <Route path='/home' element={<HomePage />} />
                  <Route path='/groups/:word?' element={isLoggedIn ? <GroupList /> : <Navigate to='/' />} />
                  <Route path='/settings' element={isLoggedIn ? <SettingsPage /> : <Navigate to='/' />} />
                  <Route path='/play' element={isLoggedIn ? <PlaySpace /> : <Navigate to='/' />} />
                  <Route path='/group/:id?/:word?' element={isLoggedIn ? <GroupEdit /> : <Navigate to='/' />} />
                  <Route path='/' element={<LandingPage />} />
                </Routes>
              </UserContextProvider>
              <MainMenu value={MENU.Home} />
            </ErrorBoundaryWrapper>
          </BrowserRouter>
        </Container>
      </PlayContext.Provider>
    </QueryClientProvider>
  );
}
export default App;

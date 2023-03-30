
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GroupList } from './pages/groups/GroupList';
import { MainPage as HomePage } from './pages/MainPage';

import { GroupEdit } from './pages/groups/GroupEdit';
import { PlaySpace } from './pages/play/PlaySpace';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

import { PlayContext, UserContext } from './context/context.create';

import { globalSummaryDefault, globalUserDefault } from './util/util';
import { IGlobalSummary } from './interfaces/IGlobalSummary';
import { MainMenu } from './components/MainMenu';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { MENU } from './constants/menu';
import ScrollTopButton from './components/BackButton';
import BackButton from './components/BackButton';
import { IUserInfo } from './interfaces/IUserInfo.js';
import {SettingsPage} from './pages/settings/Settings';

function App() {

  // Create a client
  const queryClient = new QueryClient()

  const [summary, setSummary] = useState(globalSummaryDefault);
  const [userInfo, setUserInfo] = useState(globalUserDefault);


  const playContext = {
    summary, updateValue: (newObj: IGlobalSummary) => {
      setSummary(prevState => ({ ...prevState, ...newObj }));
    }
  };

  const userContext = {
    userInfo, updateValue: (newObj: IUserInfo) => {
      setUserInfo(prevState => ({ ...prevState, ...newObj }));
    }
  };


  return (
    <QueryClientProvider client={queryClient}>
      <PlayContext.Provider value={playContext}>
        <UserContext.Provider value={userContext}>
          <CssBaseline />
          <Container>

            <BrowserRouter>
              <Routes>
                <Route path='/' element={<HomePage></HomePage>}></Route>
                <Route path='/groups' element={<GroupList></GroupList>}></Route>
                <Route path='/settings' element={<SettingsPage></SettingsPage>}></Route>
                <Route path='/play' element={<PlaySpace></PlaySpace>}></Route>
                <Route path='/group/:id?' element={<GroupEdit></GroupEdit>}></Route>
                {/* <Route path='/upload' element={<FileUpload></FileUpload>}></Route> */}
                
              </Routes>
              <MainMenu value={MENU.Home}></MainMenu>

            </BrowserRouter>

          </Container>
        </UserContext.Provider>


      </PlayContext.Provider>
    </QueryClientProvider>
  );
}

export default App;

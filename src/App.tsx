
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GroupList } from './pages/groups/GroupList';
import { MainPage as HomePage } from './pages/MainPage';

import { GroupEdit } from './pages/groups/GroupEdit';
import { PlaySpace } from './pages/play/PlaySpace';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useContext, useState } from 'react';

import { PlayContext } from './context/context.create';

import { globalSummaryDefault } from './util/util';
import { IGlobalSummary } from './interfaces/IGlobalSummary';
import { MainMenu } from './components/MainMenu';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { MENU } from './constants/menu';
import {SettingsPage} from './pages/settings/Settings';
import { UserContextProvider } from './context/context.user';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { UserContext } from "./context/context.user";

function App() {
  const { userInfo } = useContext(UserContext);
  
  const isLoggedIn = userInfo.IsInLogin;
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
        <UserContextProvider>
          <CssBaseline />
          <Container>

            <BrowserRouter>
              <Routes>
                <Route path='/home' element={<HomePage></HomePage>}></Route>
                <Route path='/groups/:word?' element={<GroupList></GroupList>}></Route>
                <Route path='/settings' element={<SettingsPage></SettingsPage>}></Route>
                <Route path='/play' element={<PlaySpace></PlaySpace>}></Route>
                <Route path='/group/:id?/:word?' element={<GroupEdit></GroupEdit>}></Route>
                <Route path='/' element={<LandingPage></LandingPage>}></Route>
                
              </Routes>
              <MainMenu value={MENU.Home}></MainMenu>

            </BrowserRouter>

          </Container>
        </UserContextProvider>


      </PlayContext.Provider>
    </QueryClientProvider>
  );
}

export default App;

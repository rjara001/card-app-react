
import './App.css';

import { BrowserRouter } from 'react-router-dom';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { PlayContext } from './context/context.create';

import { globalSummaryDefault } from './util/util';
import { IGlobalSummary } from './interfaces/IGlobalSummary';
import { MainMenu } from './components/MainMenu';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { MENU } from './constants/menu';
import { UserContextProvider } from './context/context.user';
import ErrorBoundaryWrapper from './components/Errors/Fallback';
import { getConfig } from './config/config';
import Router from './Router';

function App() {

  const { repository } = getConfig();
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
          <BrowserRouter  basename={repository}>
            <ErrorBoundaryWrapper>
              <UserContextProvider>
                <Router></Router>
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

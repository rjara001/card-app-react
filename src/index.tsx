import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Container, StyledEngineProvider } from '@mui/material';
import { UserContextProvider } from './context/context.user';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


Bugfender.init({
  appKey: 'fz9n0LeyK0bIyTaqjLVFhevohvK9bPTH',
  // apiURL: 'https://api.bugfender.com',
  // baseURL: 'https://dashboard.bugfender.com',
  // overrideConsoleMethods: true,
  // printToConsole: true,
  // registerErrorHandler: true,
  // logBrowserEvents: true,
  // logUIEvents: true,
  // version: '',
  // build: '',
});

root.render(

  <StyledEngineProvider injectFirst>
    <UserContextProvider>
      <App />
    </UserContextProvider>

  </StyledEngineProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

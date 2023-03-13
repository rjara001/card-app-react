
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GroupList } from './pages/groups/GroupList';
import { MainPage } from './pages/MainPage';

import { GroupEdit } from './pages/groups/GroupEdit';
import { PlaySpace } from './pages/play/PlaySpace';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

import { PlayContext } from './context/context.create';
import { globalSummaryDefault } from './util/util';
import { IGlobalSummary } from './interfaces/IGlobalSummary';

function App() {

  // Create a client
  const queryClient = new QueryClient()

  const [summary, setSummary] = useState(globalSummaryDefault);

  const updateValue = (newObj: IGlobalSummary) => {
    setSummary(prevState => ({ ...prevState, ...newObj }));
  };
  
  const playContext = { summary, updateValue };

  return (
    <QueryClientProvider client={queryClient}>
      <PlayContext.Provider value={playContext}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainPage></MainPage>}></Route>
            <Route path='/groups' element={<GroupList></GroupList>}></Route>
            <Route path='/group' element={<GroupEdit></GroupEdit>}></Route>
            <Route path='/play' element={<PlaySpace></PlaySpace>}></Route>
          </Routes>
        </BrowserRouter>
      </PlayContext.Provider>
    </QueryClientProvider>
  );
}

export default App;

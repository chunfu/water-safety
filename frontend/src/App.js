import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';

import 'gestalt/dist/gestalt.css';
import './App.css';

export const IndexContext = React.createContext({});

const App = props => {
  return (
    <IndexContext.Provider>
      <MapView />
    </IndexContext.Provider>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import MapView from './components/MapView';

import 'gestalt/dist/gestalt.css';
import './App.css';

Modal.setAppElement('#root');
export const IndexContext = React.createContext({});

const App = props => {
  const [contextValue, setContextValue] = useState({});

  useEffect(() => {
    async function getVars() {
      const { data } = await axios.get('/api/vars');
      setContextValue(data);
    }

    getVars();
  }, []);

  return (
    <IndexContext.Provider value={contextValue}>
      <MapView />
    </IndexContext.Provider>
  );
};

export default App;

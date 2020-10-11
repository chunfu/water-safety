import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import MapView from './components/MapView';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import userManagement from './utils/userManagement';

import 'gestalt/dist/gestalt.css';
import './App.css';

Modal.setAppElement('#root');
export const IndexContext = React.createContext({});

const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        userManagement.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const App = (props) => {
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
      <Router>
        <Switch>
          <Route exact path="/" component={MapView} />
          <Route exact path="/login" component={LoginPage} />
          <PrivateRoute exact path="/upload">
            <UploadPage />
          </PrivateRoute>
        </Switch>
      </Router>
    </IndexContext.Provider>
  );
};

export default App;

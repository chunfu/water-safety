import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MapView from './components/MapView';

import LoadingMask from './widget/LoadingMask';

import './App.css';

export const IndexContext = React.createContext({});

const App = props => {
  const [loading, showLoading] = useState(false);

  const [errDialogOpen, setErrDialogOpen] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const showErrDialog = errMsg => {
    setErrDialogOpen(true);
    setErrMsg(errMsg);
  };

  return (
    <IndexContext.Provider value={{ showLoading, showErrDialog }}>
      <MapView />
      <LoadingMask show={loading} />
      <Dialog
        open={errDialogOpen}
        onClose={() => setErrDialogOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">錯誤訊息</DialogTitle>
        <DialogContent>
          <DialogContentText>{errMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setErrDialogOpen(false)}
            color="primary"
            autoFocus
          >
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </IndexContext.Provider>
  );
};

export default App;

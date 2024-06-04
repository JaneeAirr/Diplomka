// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';
import { VisionUIControllerProvider } from 'context';
import { UserProvider } from './UserContext';

ReactDOM.render(
  <Router>
    <UserProvider>
      <SnackbarProvider maxSnack={3}>
        <VisionUIControllerProvider>
          <App />
        </VisionUIControllerProvider>
      </SnackbarProvider>
    </UserProvider>
  </Router>,
  document.getElementById('root')
);

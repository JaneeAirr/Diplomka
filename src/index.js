import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import App from './App';
import { VisionUIControllerProvider } from 'context';

ReactDOM.render(
  <Router>
    <SnackbarProvider maxSnack={3}>
      <VisionUIControllerProvider>
        <App />
      </VisionUIControllerProvider>
    </SnackbarProvider>
  </Router>,
  document.getElementById('root')
);

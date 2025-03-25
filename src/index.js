import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import store from './store';
import config from './config';

// Création du thème personnalisé basé sur la configuration
const theme = createTheme({
  palette: {
    primary: {
      main: config.THEME.PRIMARY_COLOR,
    },
    secondary: {
      main: config.THEME.SECONDARY_COLOR,
    },
    error: {
      main: config.THEME.ERROR_COLOR,
    },
    warning: {
      main: config.THEME.WARNING_COLOR,
    },
    info: {
      main: config.THEME.INFO_COLOR,
    },
    success: {
      main: config.THEME.SUCCESS_COLOR,
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

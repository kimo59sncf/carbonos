import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Composants
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import TrialLimitationMiddleware from './components/TrialLimitationMiddleware';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import EmissionsCalculator from './pages/EmissionsCalculator';
import Reports from './pages/Reports';
import Collaboration from './pages/Collaboration';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Subscription from './pages/Subscription';

// Thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Vert pour l'aspect écologique
      light: '#60ad5e',
      dark: '#005005',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1976d2', // Bleu pour l'aspect professionnel
      light: '#63a4ff',
      dark: '#004ba0',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Switch>
            <PublicRoute exact path="/" component={LandingPage} />
            <PublicRoute path="/login" component={Login} />
            <PublicRoute path="/register" component={Register} />
            <PublicRoute path="/subscription" component={Subscription} />
            <Route path="/dashboard">
              <Layout>
                <TrialLimitationMiddleware>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                </TrialLimitationMiddleware>
              </Layout>
            </Route>
            <Route path="/emissions">
              <Layout>
                <TrialLimitationMiddleware>
                  <PrivateRoute exact path="/emissions" component={EmissionsCalculator} />
                </TrialLimitationMiddleware>
              </Layout>
            </Route>
            <Route path="/reports">
              <Layout>
                <TrialLimitationMiddleware>
                  <PrivateRoute exact path="/reports" component={Reports} />
                </TrialLimitationMiddleware>
              </Layout>
            </Route>
            <Route path="/collaboration">
              <Layout>
                <TrialLimitationMiddleware>
                  <PrivateRoute exact path="/collaboration" component={Collaboration} />
                </TrialLimitationMiddleware>
              </Layout>
            </Route>
            <Route path="/settings">
              <Layout>
                <PrivateRoute exact path="/settings" component={Settings} />
              </Layout>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

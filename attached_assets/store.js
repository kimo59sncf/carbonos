import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Importation des reducers
import authReducer from './reducers/authReducer';
import emissionsReducer from './reducers/emissionsReducer';
import reportsReducer from './reducers/reportsReducer';
import dashboardReducer from './reducers/dashboardReducer';
import alertReducer from './reducers/alertReducer';

// Combinaison des reducers
const rootReducer = combineReducers({
  auth: authReducer,
  emissions: emissionsReducer,
  reports: reportsReducer,
  dashboard: dashboardReducer,
  alert: alertReducer,
});

// Configuration du store avec middleware thunk et devtools
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

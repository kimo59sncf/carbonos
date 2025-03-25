import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from './alertActions';

// Slice pour la gestion des essais
const trialSlice = createSlice({
  name: 'trial',
  initialState: {
    trialStatus: null,
    loading: false,
    error: null
  },
  reducers: {
    getTrialStatusRequest: (state) => {
      state.loading = true;
    },
    getTrialStatusSuccess: (state, action) => {
      state.trialStatus = action.payload;
      state.loading = false;
      state.error = null;
    },
    getTrialStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerTrialRequest: (state) => {
      state.loading = true;
    },
    registerTrialSuccess: (state, action) => {
      state.trialStatus = action.payload.company.trialStatus;
      state.loading = false;
      state.error = null;
    },
    registerTrialFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    upgradeTrialRequest: (state) => {
      state.loading = true;
    },
    upgradeTrialSuccess: (state) => {
      state.trialStatus = null; // L'essai n'est plus actif après la mise à niveau
      state.loading = false;
      state.error = null;
    },
    upgradeTrialFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Actions
export const {
  getTrialStatusRequest,
  getTrialStatusSuccess,
  getTrialStatusFail,
  registerTrialRequest,
  registerTrialSuccess,
  registerTrialFail,
  upgradeTrialRequest,
  upgradeTrialSuccess,
  upgradeTrialFail
} = trialSlice.actions;

// Action pour obtenir le statut de l'essai
export const getTrialStatus = () => async (dispatch) => {
  try {
    dispatch(getTrialStatusRequest());
    
    const res = await axios.get('/api/trial/status');
    
    dispatch(getTrialStatusSuccess(res.data));
  } catch (err) {
    dispatch(getTrialStatusFail(
      err.response && err.response.data.message 
        ? err.response.data.message 
        : err.message
    ));
    
    dispatch(setAlert('Erreur lors de la récupération du statut de l\'essai', 'error'));
  }
};

// Action pour s'inscrire à l'essai gratuit
export const registerTrial = (formData) => async (dispatch) => {
  try {
    dispatch(registerTrialRequest());
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const res = await axios.post('/api/trial/register', formData, config);
    
    dispatch(registerTrialSuccess(res.data));
    dispatch(setAlert('Inscription à l\'essai gratuit réussie', 'success'));
    
    return res.data;
  } catch (err) {
    const errors = err.response && err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }
    
    dispatch(registerTrialFail(
      err.response && err.response.data.message 
        ? err.response.data.message 
        : err.message
    ));
    
    throw err;
  }
};

// Action pour passer à un plan payant
export const upgradeTrial = (planType) => async (dispatch) => {
  try {
    dispatch(upgradeTrialRequest());
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const res = await axios.post('/api/trial/upgrade', { planType }, config);
    
    dispatch(upgradeTrialSuccess());
    dispatch(setAlert('Mise à niveau vers le plan payant réussie', 'success'));
    
    return res.data;
  } catch (err) {
    dispatch(upgradeTrialFail(
      err.response && err.response.data.message 
        ? err.response.data.message 
        : err.message
    ));
    
    dispatch(setAlert('Erreur lors de la mise à niveau vers le plan payant', 'error'));
    
    throw err;
  }
};

export default trialSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from './alertActions';

// Slice pour la gestion des abonnements
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    currentPlan: null,
    billingInfo: null,
    paymentHistory: [],
    loading: false,
    error: null
  },
  reducers: {
    getSubscriptionRequest: (state) => {
      state.loading = true;
    },
    getSubscriptionSuccess: (state, action) => {
      state.currentPlan = action.payload.currentPlan;
      state.billingInfo = action.payload.billingInfo;
      state.loading = false;
      state.error = null;
    },
    getSubscriptionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getPaymentHistoryRequest: (state) => {
      state.loading = true;
    },
    getPaymentHistorySuccess: (state, action) => {
      state.paymentHistory = action.payload;
      state.loading = false;
      state.error = null;
    },
    getPaymentHistoryFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    subscribeRequest: (state) => {
      state.loading = true;
    },
    subscribeSuccess: (state, action) => {
      state.currentPlan = action.payload.currentPlan;
      state.billingInfo = action.payload.billingInfo;
      state.loading = false;
      state.error = null;
    },
    subscribeFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBillingInfoRequest: (state) => {
      state.loading = true;
    },
    updateBillingInfoSuccess: (state, action) => {
      state.billingInfo = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateBillingInfoFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    cancelSubscriptionRequest: (state) => {
      state.loading = true;
    },
    cancelSubscriptionSuccess: (state) => {
      state.currentPlan = null;
      state.loading = false;
      state.error = null;
    },
    cancelSubscriptionFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Actions
export const {
  getSubscriptionRequest,
  getSubscriptionSuccess,
  getSubscriptionFail,
  getPaymentHistoryRequest,
  getPaymentHistorySuccess,
  getPaymentHistoryFail,
  subscribeRequest,
  subscribeSuccess,
  subscribeFail,
  updateBillingInfoRequest,
  updateBillingInfoSuccess,
  updateBillingInfoFail,
  cancelSubscriptionRequest,
  cancelSubscriptionSuccess,
  cancelSubscriptionFail
} = subscriptionSlice.actions;

// Action pour obtenir les informations d'abonnement
export const getSubscription = () => async (dispatch) => {
  try {
    dispatch(getSubscriptionRequest());
    
    const res = await axios.get('/api/subscription');
    
    dispatch(getSubscriptionSuccess(res.data));
  } catch (err) {
    dispatch(getSubscriptionFail(
      err.response && err.response.data.message 
        ? err.response.data.message 
        : err.message
    ));
    
    dispatch(setAlert('Erreur lors de la récupération des informations d\'abonnement', 'error'));
  }
};

// Action pour obtenir l'historique des paiements
export const getPaymentHistory = () => async (dispatch) => {
  try {
    dispatch(getPaymentHistoryRequest());
    
    const res = await axios.get('/api/subscription/payments');
    
    dispatch(getPaymentHistorySuccess(res.data));
  } catch (err) {
    dispatch(getPaymentHistoryFail(
      err.response && err.response.data.message 
        ? err.response.data.message 
        : err.message
    ));
    
    dispatch(setAlert('Erreur lors de la récupération de l\'historique des paiements', 'error'));
  }
};

// Action pour s'abonner à un plan
export const subscribeToPaymentPlan = (subscriptionData) => async (dispatch) => {
  try {
    dispatch(subscribeRequest());
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const res = await axios.post('/api/subscription', subscriptionData, config);
    
    dispatch(subscribeSuccess(res.data));
    dispatch(setAlert('Abonnement réussi', 'success'));
    
    return res.data;
  } catch (err) {
    const errors = err.response && err.response.data.errors;
    
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }
    
    dispatch(subscribeFail(
      err.response && err.response.data.message 
        ? err.response.data.message 
        : err.message
    ));
    
    dispatch(setAlert('Erreur lors de l\'abonnement', 'error'));
    
    throw err;
  }
};

// Action pour mettre à jour les informations de facturation
export const updateBillingInfo = (billingInfo) => async (dispatch) => {
  try {
    dispatch(updateBillingInfoRequest());
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const res = await axios.put('/api/subscription/billing', billingInfo, config);
    
    dispatch(updateBillingInfoSuccess(res.data));
    dispatch(setAlert('Informations de facturation mises à jour avec succès', 'success'));
    
    return res.data;
  } catch (err) {
    dispatch(updateBillingInfoFail(
      err.response && err.response.data.message 
        ? err.response.data.message 
        : err.message
    ));
    
    dispatch(setAlert('Erreur lors de la mise à jour des informations de facturation', 'error'));
    
    throw err;
  }
};

// Action pour annuler un abonnement
export const cancelSubscription = () => async (dispatch) => {
  try {
    dispatch(cancelSubscriptionRequest());
    
    await axios.delete('/api/subscription');
    
    dispatch(cancelSubscriptionSuccess());
    dispatch(setAlert('Abonnement annulé avec succès', 'success'));
  } catch (err) {
    dispatch(cancelSubscriptionFail(
      err.response && err.response.data.message 
        ? err.response.data.message 
        : err.message
    ));
    
    dispatch(setAlert('Erreur lors de l\'annulation de l\'abonnement', 'error'));
    
    throw err;
  }
};

export default subscriptionSlice.reducer;

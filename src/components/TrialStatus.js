import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Paper, Grid, Divider, Chip, Card, CardContent, LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { getTrialStatus } from '../actions/trialActions';
import { getSubscription } from '../actions/subscriptionActions';

const TrialStatus = () => {
  const dispatch = useDispatch();
  const { trialStatus } = useSelector(state => state.trial);
  const { currentPlan } = useSelector(state => state.subscription);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getTrialStatus());
        await dispatch(getSubscription());
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <LinearProgress />;
  }

  // Si l'utilisateur a un abonnement actif, on affiche les détails de l'abonnement
  if (currentPlan && currentPlan.status === 'active') {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5">
            Abonnement {currentPlan.id.charAt(0).toUpperCase() + currentPlan.id.slice(1)} actif
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Détails de l'abonnement
            </Typography>
            <Typography variant="body2">
              <strong>Plan:</strong> {currentPlan.id.charAt(0).toUpperCase() + currentPlan.id.slice(1)}
            </Typography>
            <Typography variant="body2">
              <strong>Date de début:</strong> {new Date(currentPlan.startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              <strong>Prochain renouvellement:</strong> {new Date(currentPlan.renewalDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Limites du plan
            </Typography>
            <Typography variant="body2">
              <strong>Sources d'émission:</strong> {currentPlan.limits.maxEmissionSources === -1 ? 'Illimitées' : currentPlan.limits.maxEmissionSources}
            </Typography>
            <Typography variant="body2">
              <strong>Rapports:</strong> {currentPlan.limits.maxReports === -1 ? 'Illimités' : currentPlan.limits.maxReports + ' par mois'}
            </Typography>
            <Typography variant="body2">
              <strong>Module collaboratif:</strong> {currentPlan.limits.hasCollaboration ? 'Inclus' : 'Non inclus'}
            </Typography>
            <Typography variant="body2">
              <strong>Benchmarking:</strong> {currentPlan.limits.hasBenchmarking ? 'Inclus' : 'Non inclus'}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button 
            component={Link} 
            to="/settings" 
            variant="outlined" 
            color="primary"
          >
            Gérer mon abonnement
          </Button>
        </Box>
      </Paper>
    );
  }

  // Si l'utilisateur est en période d'essai
  if (trialStatus && trialStatus.isTrialActive) {
    const daysLeft = Math.ceil((new Date(trialStatus.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24));
    const percentUsed = ((30 - daysLeft) / 30) * 100;
    
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WarningIcon color="warning" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5">
            Période d'essai en cours
          </Typography>
          <Chip 
            label={`${daysLeft} jours restants`} 
            color="warning" 
            size="small" 
            sx={{ ml: 2 }} 
          />
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={percentUsed} 
          color="warning"
          sx={{ height: 10, borderRadius: 5, mb: 2 }}
        />
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Votre période d'essai se termine le {new Date(trialStatus.trialEndDate).toLocaleDateString()}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Limites de l'essai
            </Typography>
            <Typography variant="body2">
              <strong>Sources d'émission utilisées:</strong> {trialStatus.emissionSourcesUsed} / 5
            </Typography>
            <Typography variant="body2">
              <strong>Rapports générés:</strong> {trialStatus.reportsGenerated} / 2
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card variant="outlined" sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Passez à un abonnement payant
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Débloquez toutes les fonctionnalités et supprimez les limitations
                </Typography>
                <Button 
                  component={Link} 
                  to="/subscription" 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                >
                  Voir les plans
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="subtitle2" gutterBottom>
            Besoin d'aide ?
          </Typography>
          <Typography variant="body2">
            Contactez notre développeur : Mk-dev au 0763349311
          </Typography>
        </Box>
      </Paper>
    );
  }

  // Si l'utilisateur n'a ni abonnement actif ni période d'essai active
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: 'error.light' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <WarningIcon color="error" sx={{ mr: 1, fontSize: 28 }} />
        <Typography variant="h5" color="error.contrastText">
          Accès limité
        </Typography>
      </Box>
      
      <Typography variant="body1" color="error.contrastText" paragraph>
        Votre période d'essai a expiré ou vous n'avez pas d'abonnement actif.
      </Typography>
      
      <Button 
        component={Link} 
        to="/subscription" 
        variant="contained" 
        color="secondary" 
        fullWidth
        sx={{ mt: 2 }}
      >
        S'abonner maintenant
      </Button>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="subtitle2" color="error.contrastText" gutterBottom>
          Besoin d'aide ?
        </Typography>
        <Typography variant="body2" color="error.contrastText">
          Contactez notre développeur : Mk-dev au 0763349311
        </Typography>
      </Box>
    </Paper>
  );
};

export default TrialStatus;

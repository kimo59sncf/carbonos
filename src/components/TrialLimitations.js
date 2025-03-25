import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Alert,
  AlertTitle,
  LinearProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import LockIcon from '@mui/icons-material/Lock';
import { useSelector, useDispatch } from 'react-redux';
import { getTrialStatus } from '../actions/trialActions';

const TrialLimitations = () => {
  const dispatch = useDispatch();
  const { trialStatus, loading } = useSelector(state => state.trial);
  const { user, company } = useSelector(state => state.auth);
  
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  
  useEffect(() => {
    dispatch(getTrialStatus());
  }, [dispatch]);
  
  useEffect(() => {
    if (trialStatus && trialStatus.trialEndDate) {
      const endDate = new Date(trialStatus.trialEndDate);
      const startDate = new Date(trialStatus.trialStartDate);
      const now = new Date();
      
      // Calculer les jours restants
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysTotal = Math.round((endDate - startDate) / msPerDay);
      const daysElapsed = Math.round((now - startDate) / msPerDay);
      const remaining = Math.max(0, daysTotal - daysElapsed);
      
      setDaysRemaining(remaining);
      
      // Calculer le pourcentage écoulé
      const percent = Math.min(100, Math.round((daysElapsed / daysTotal) * 100));
      setPercentComplete(percent);
    }
  }, [trialStatus]);
  
  if (loading) {
    return <LinearProgress />;
  }
  
  if (!trialStatus) {
    return (
      <Alert severity="error">
        <AlertTitle>Erreur</AlertTitle>
        Impossible de charger les informations d'essai
      </Alert>
    );
  }
  
  // Si l'essai n'est plus actif
  if (!trialStatus.isTrialActive) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Période d'essai expirée</AlertTitle>
          Votre période d'essai gratuit est terminée. Veuillez passer à un plan payant pour continuer à utiliser toutes les fonctionnalités de CarbonOS.
        </Alert>
        
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <LockIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Accès limité
          </Typography>
          <Typography variant="body1" paragraph>
            Vous êtes actuellement en mode lecture seule. Vous pouvez consulter vos données existantes, mais vous ne pouvez plus ajouter de nouvelles sources d'émission ni générer de nouveaux rapports.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            href="/subscription"
            sx={{ mt: 2 }}
          >
            Passer à un plan payant
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Statut de votre essai gratuit
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimerIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
              <Typography variant="h6">
                {daysRemaining} jours restants
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={percentComplete} 
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Début de l'essai
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {percentComplete}% écoulé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fin de l'essai
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Limitations actuelles :
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Rapports
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Typography variant="h3" color="primary">
                        {trialStatus.remainingReports}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        / 2
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                      rapports restants
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sources d'émission
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <Typography variant="h3" color="primary">
                        {trialStatus.remainingEmissionSources}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        / 5
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                      sources restantes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Alert severity="info">
              <AlertTitle>Conseil</AlertTitle>
              Pour profiter au maximum de votre période d'essai, nous vous recommandons de commencer par les sources d'émission les plus importantes pour votre entreprise.
            </Alert>
          </Paper>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            href="/subscription"
            fullWidth
          >
            Passer à un plan payant
          </Button>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fonctionnalités disponibles
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Tableau de bord" 
                  secondary="Visualisation des émissions carbone"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Calcul d'émissions" 
                  secondary="Limité à 5 sources d'émission"
                />
                <Chip 
                  label={`${trialStatus.remainingEmissionSources}/5`} 
                  color="primary" 
                  size="small" 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Génération de rapports" 
                  secondary="Limité à 2 rapports"
                />
                <Chip 
                  label={`${trialStatus.remainingReports}/2`} 
                  color="primary" 
                  size="small" 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <BlockIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Module collaboratif" 
                  secondary="Non disponible en version d'essai"
                  primaryTypographyProps={{ color: 'text.disabled' }}
                  secondaryTypographyProps={{ color: 'text.disabled' }}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <BlockIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Benchmarking" 
                  secondary="Non disponible en version d'essai"
                  primaryTypographyProps={{ color: 'text.disabled' }}
                  secondaryTypographyProps={{ color: 'text.disabled' }}
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Informations entreprise :
            </Typography>
            
            <Typography variant="body2">
              <strong>Nom :</strong> {company ? company.name : ''}
            </Typography>
            
            <Typography variant="body2">
              <strong>Utilisateur :</strong> {user ? `${user.firstName} ${user.lastName}` : ''}
            </Typography>
            
            <Typography variant="body2">
              <strong>Début d'essai :</strong> {trialStatus.trialStartDate ? new Date(trialStatus.trialStartDate).toLocaleDateString() : ''}
            </Typography>
            
            <Typography variant="body2">
              <strong>Fin d'essai :</strong> {trialStatus.trialEndDate ? new Date(trialStatus.trialEndDate).toLocaleDateString() : ''}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrialLimitations;

import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Alert,
  AlertTitle,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';
import { useSelector, useDispatch } from 'react-redux';
import { getTrialStatus } from '../actions/trialActions';

// Middleware pour vérifier les limitations de l'essai
const TrialLimitationMiddleware = ({ component: Component, ...props }) => {
  const dispatch = useDispatch();
  const { trialStatus } = useSelector(state => state.trial);
  const { company } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (!trialStatus) {
      dispatch(getTrialStatus());
    }
  }, [dispatch, trialStatus]);
  
  // Vérifier si l'utilisateur est en essai et si l'essai est actif
  const isTrialUser = company && company.subscription && company.subscription.plan === 'free';
  const isTrialActive = trialStatus && trialStatus.isTrialActive;
  
  // Vérifier les limitations spécifiques en fonction de la page
  const checkLimitations = () => {
    const { path } = props.match;
    
    // Si ce n'est pas un utilisateur en essai ou si l'essai est actif, pas de limitation
    if (!isTrialUser || !isTrialActive) return { limited: false };
    
    // Vérifier les limitations spécifiques à chaque page
    switch (path) {
      case '/emissions':
        return {
          limited: trialStatus.remainingEmissionSources <= 0,
          message: "Vous avez atteint la limite de sources d'émission pour votre essai gratuit.",
          action: "/trial-status"
        };
      case '/reports':
        return {
          limited: trialStatus.remainingReports <= 0,
          message: "Vous avez atteint la limite de rapports pour votre essai gratuit.",
          action: "/trial-status"
        };
      case '/collaboration':
        return {
          limited: true,
          message: "Le module collaboratif n'est pas disponible dans la version d'essai gratuit.",
          action: "/trial-status"
        };
      default:
        return { limited: false };
    }
  };
  
  const limitations = checkLimitations();
  
  // Si l'utilisateur est limité, afficher un message
  if (limitations.limited) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <BlockIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Fonctionnalité limitée
          </Typography>
          <Typography variant="body1" paragraph>
            {limitations.message}
          </Typography>
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <AlertTitle>Essai gratuit</AlertTitle>
            Vous utilisez actuellement la version d'essai gratuit de CarbonOS qui comporte certaines limitations.
            Pour accéder à toutes les fonctionnalités, veuillez passer à un plan payant.
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              href="/subscription"
            >
              Passer à un plan payant
            </Button>
            <Button 
              variant="outlined"
              href={limitations.action}
            >
              Voir mon statut d'essai
            </Button>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Besoin d'aide ?
          </Typography>
          <Typography variant="body2" paragraph>
            Contactez notre développeur : Mk-dev au 0763349311
          </Typography>
        </Paper>
      </Container>
    );
  }
  
  // Si l'utilisateur n'est pas limité, afficher le composant normalement
  return <Component {...props} />;
};

export default TrialLimitationMiddleware;

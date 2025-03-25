import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
  Shield as ShieldIcon,
  DataObject as DataObjectIcon,
  Gavel as GavelIcon,
  PrivacyTip as PrivacyTipIcon
} from '@mui/icons-material';
import SecurityMeasures from '../components/security/SecurityMeasures';

const Settings = () => {
  // Paramètres de sécurité
  const securitySettings = [
    {
      id: 1,
      title: 'Authentification à deux facteurs',
      description: 'Activez l\'authentification à deux facteurs pour renforcer la sécurité de votre compte.',
      icon: <LockIcon color="primary" />
    },
    {
      id: 2,
      title: 'Journalisation des accès',
      description: 'Consultez l\'historique des connexions et des actions effectuées sur votre compte.',
      icon: <SecurityIcon color="primary" />
    },
    {
      id: 3,
      title: 'Gestion des sessions',
      description: 'Configurez la durée de validité des sessions et déconnectez les sessions actives.',
      icon: <VerifiedUserIcon color="primary" />
    }
  ];

  // Paramètres RGPD
  const rgpdSettings = [
    {
      id: 1,
      title: 'Consentements',
      description: 'Gérez vos consentements pour le traitement des données personnelles.',
      icon: <GavelIcon color="secondary" />
    },
    {
      id: 2,
      title: 'Exportation des données',
      description: 'Exportez toutes vos données dans un format portable (droit à la portabilité).',
      icon: <DataObjectIcon color="secondary" />
    },
    {
      id: 3,
      title: 'Suppression du compte',
      description: 'Supprimez définitivement votre compte et toutes les données associées (droit à l\'oubli).',
      icon: <PrivacyTipIcon color="secondary" />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Paramètres
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader 
              title="Paramètres de sécurité" 
              avatar={<ShieldIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <List>
                {securitySettings.map((setting) => (
                  <ListItem key={setting.id} button>
                    <ListItemIcon>
                      {setting.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={setting.title}
                      secondary={setting.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader 
              title="Paramètres RGPD" 
              avatar={<PrivacyTipIcon color="secondary" />}
            />
            <Divider />
            <CardContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                <AlertTitle>Conformité RGPD</AlertTitle>
                CarbonOS respecte pleinement le Règlement Général sur la Protection des Données (RGPD).
              </Alert>
              <List>
                {rgpdSettings.map((setting) => (
                  <ListItem key={setting.id} button>
                    <ListItemIcon>
                      {setting.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={setting.title}
                      secondary={setting.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <SecurityMeasures />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;

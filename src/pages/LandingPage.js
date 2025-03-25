import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            CarbonOS
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Plateforme SaaS de Gestion Carbone pour les PME/ETI Françaises
          </Typography>
          <Typography variant="subtitle1" paragraph sx={{ mb: 4 }}>
            Conforme au RGPD et aux Réglementations Françaises
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              to="/free-trial"
              sx={{ mr: 2, px: 4, py: 1.5 }}
            >
              Essai Gratuit
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              component={Link}
              to="/login"
              sx={{ px: 4, py: 1.5 }}
            >
              Connexion
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Fonctionnalités Principales
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Simplifiez votre conformité réglementaire et réduisez votre empreinte carbone
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardHeader title="Tableau de Bord Centralisé" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  Visualisation des émissions (Scope 1, 2, 3) avec données anonymisées pour les benchmarks.
                </Typography>
                <Typography variant="body1">
                  Alertes automatisées sur les dérives carbone et les échéances réglementaires.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardHeader title="Calcul Automatisé des Émissions" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  Intégration RGPD-Safe avec les outils comptables (Sage, Cegid) via API chiffrées.
                </Typography>
                <Typography variant="body1">
                  Utilisation des bases de données françaises (Base Carbone® ADEME, INSEE) pour les coefficients d'émission.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardHeader title="Reporting Réglementaire" />
              <CardContent>
                <Typography variant="body1" paragraph>
                  Génération de rapports CSRD, DSN, et Bilan Carbone® pré-formatés.
                </Typography>
                <Typography variant="body1">
                  Export des données en formats standardisés (XBRL, PDF) avec traçabilité des modifications.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Trial Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Essai Gratuit de 30 Jours
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Testez CarbonOS sans engagement et découvrez comment nous pouvons vous aider
          </Typography>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Tableau de bord complet" 
                    secondary="Visualisez vos émissions carbone en temps réel"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Calcul d'émissions" 
                    secondary="Jusqu'à 5 sources d'émission pendant l'essai"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Génération de rapports" 
                    secondary="Jusqu'à 2 rapports réglementaires pendant l'essai"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Support technique" 
                    secondary="Assistance par email pendant toute la durée de l'essai"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Commencez votre essai gratuit
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  Aucune carte de crédit requise. Annulation possible à tout moment.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  component={Link}
                  to="/free-trial"
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  S'inscrire à l'essai gratuit
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Contactez-nous
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Vous avez des questions ? Notre équipe est là pour vous aider
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Contact Développeur
                </Typography>
                <Typography variant="body1" paragraph>
                  Mk-dev
                </Typography>
                <Divider sx={{ width: '50%', my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body1">
                    0763349311
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <EmailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Support Technique
                </Typography>
                <Typography variant="body1" paragraph>
                  Notre équipe de support est disponible pour vous aider
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  href="mailto:support@carbonos.fr"
                >
                  Contacter le support
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                CarbonOS
              </Typography>
              <Typography variant="body2" paragraph>
                Plateforme SaaS de Gestion Carbone pour les PME/ETI Françaises
              </Typography>
              <Typography variant="body2">
                Conforme au RGPD et aux Réglementations Françaises
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" paragraph>
                Mk-dev: 0763349311
              </Typography>
              <Typography variant="body2" paragraph>
                Email: contact@carbonos.fr
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Mentions Légales
              </Typography>
              <Typography variant="body2" paragraph>
                © 2025 CarbonOS - Tous droits réservés
              </Typography>
              <Typography variant="body2" paragraph>
                Hébergé en France - Conforme RGPD
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

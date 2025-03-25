import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
  Shield as ShieldIcon,
  BugReport as BugReportIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Https as HttpsIcon
} from '@mui/icons-material';

// Composant pour les mesures de sécurité OWASP
const SecurityMeasures = () => {
  // Liste des mesures de sécurité implémentées selon OWASP Top 10
  const securityMeasures = [
    {
      id: 1,
      title: 'Protection contre les injections',
      description: 'Validation des entrées utilisateur et utilisation de requêtes paramétrées pour prévenir les injections SQL et NoSQL.',
      icon: <CodeIcon color="primary" />
    },
    {
      id: 2,
      title: 'Authentification sécurisée',
      description: 'Implémentation de JWT avec rotation des tokens, protection contre les attaques par force brute et authentification à deux facteurs.',
      icon: <LockIcon color="primary" />
    },
    {
      id: 3,
      title: 'Gestion des sessions',
      description: 'Sessions sécurisées avec expiration automatique et invalidation lors de la déconnexion.',
      icon: <VerifiedUserIcon color="primary" />
    },
    {
      id: 4,
      title: 'Contrôle d\'accès',
      description: 'Système RBAC (Role-Based Access Control) pour limiter l\'accès aux fonctionnalités selon les rôles utilisateurs.',
      icon: <ShieldIcon color="primary" />
    },
    {
      id: 5,
      title: 'Protection XSS',
      description: 'Échappement des données utilisateur et utilisation de Content Security Policy pour prévenir les attaques cross-site scripting.',
      icon: <BugReportIcon color="primary" />
    },
    {
      id: 6,
      title: 'Sécurité des communications',
      description: 'Utilisation de HTTPS avec TLS 1.3 et HSTS pour sécuriser toutes les communications.',
      icon: <HttpsIcon color="primary" />
    },
    {
      id: 7,
      title: 'Sécurité des données',
      description: 'Chiffrement des données sensibles au repos et en transit, conformément aux exigences RGPD.',
      icon: <StorageIcon color="primary" />
    },
    {
      id: 8,
      title: 'Journalisation et surveillance',
      description: 'Journalisation sécurisée des événements de sécurité et surveillance continue des activités suspectes.',
      icon: <SecurityIcon color="primary" />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mesures de Sécurité OWASP
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Conformité OWASP Top 10</AlertTitle>
          CarbonOS implémente les mesures de sécurité recommandées par l'OWASP Top 10 pour garantir la protection de vos données.
        </Alert>
        
        <List>
          {securityMeasures.map((measure, index) => (
            <React.Fragment key={measure.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  {measure.icon}
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="h6">{measure.title}</Typography>}
                  secondary={measure.description}
                />
              </ListItem>
              {index < securityMeasures.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Certification et Conformité
          </Typography>
          <Typography variant="body2" paragraph>
            Notre application est régulièrement auditée par des experts en sécurité indépendants pour garantir le respect des meilleures pratiques de sécurité. Toutes les mesures de sécurité sont documentées et mises à jour conformément aux évolutions des standards de l'industrie.
          </Typography>
          <Typography variant="body2">
            En tant que solution conforme au RGPD, CarbonOS met la sécurité et la confidentialité des données au cœur de sa conception, avec une approche "Security by Design" et "Privacy by Design".
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SecurityMeasures;

import React from 'react';
import { Box, List, ListItem, ListItemText, Chip, Typography, Divider } from '@mui/material';
import { Warning as WarningIcon, Info as InfoIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const AlertsWidget = ({ alerts }) => {
  // Fonction pour déterminer l'icône en fonction du type d'alerte
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon />;
    }
  };

  // Fonction pour déterminer la couleur du chip en fonction du type d'alerte
  const getChipColor = (type) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {alerts.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
          Aucune alerte à afficher
        </Typography>
      ) : (
        <List dense>
          {alerts.map((alert, index) => (
            <React.Fragment key={alert.id}>
              <ListItem
                secondaryAction={
                  <Chip 
                    size="small" 
                    color={getChipColor(alert.type)} 
                    label={alert.type === 'warning' ? 'Attention' : alert.type === 'info' ? 'Info' : 'Succès'} 
                  />
                }
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mr: 1 }}>
                    {getAlertIcon(alert.type)}
                  </Box>
                  <ListItemText 
                    primary={alert.message}
                  />
                </Box>
              </ListItem>
              {index < alerts.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AlertsWidget;

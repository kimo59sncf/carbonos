import React from 'react';
import { Box, List, ListItem, ListItemText, Chip, Typography, Divider, Paper } from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

const RegulatoryCalendar = ({ events }) => {
  // Fonction pour formater la date au format français
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour calculer le nombre de jours restants
  const getDaysRemaining = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fonction pour déterminer la couleur du chip en fonction du nombre de jours restants
  const getChipColor = (daysRemaining) => {
    if (daysRemaining < 0) return 'default';
    if (daysRemaining <= 30) return 'error';
    if (daysRemaining <= 90) return 'warning';
    return 'success';
  };

  // Fonction pour obtenir le libellé du chip
  const getChipLabel = (daysRemaining) => {
    if (daysRemaining < 0) return 'Passé';
    if (daysRemaining === 0) return 'Aujourd\'hui';
    return `J-${daysRemaining}`;
  };

  return (
    <Box>
      {events.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
          Aucun événement réglementaire à afficher
        </Typography>
      ) : (
        <List dense>
          {events.map((event, index) => {
            const daysRemaining = getDaysRemaining(event.date);
            return (
              <React.Fragment key={event.id}>
                <ListItem
                  secondaryAction={
                    <Chip 
                      size="small" 
                      color={getChipColor(daysRemaining)} 
                      label={getChipLabel(daysRemaining)} 
                    />
                  }
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 1 }}>
                      <CalendarIcon color="primary" />
                    </Box>
                    <ListItemText 
                      primary={event.title}
                      secondary={formatDate(event.date)}
                    />
                  </Box>
                </ListItem>
                {index < events.length - 1 && <Divider component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default RegulatoryCalendar;

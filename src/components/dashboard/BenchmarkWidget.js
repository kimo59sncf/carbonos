import React from 'react';
import { Box, Typography, LinearProgress, Grid, Paper } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

const BenchmarkWidget = ({ data }) => {
  // Calcul du pourcentage pour la barre de progression
  const progressValue = 100 - data.percentile;
  
  // Détermination si l'entreprise est meilleure que la moyenne du secteur
  const isBetterThanAverage = data.company < data.industry;
  
  // Calcul de la différence en pourcentage
  const difference = Math.abs(((data.company - data.industry) / data.industry) * 100).toFixed(1);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Votre empreinte carbone
            </Typography>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {data.company.toLocaleString('fr-FR')} tCO2e
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Moyenne du secteur
            </Typography>
            <Typography variant="h5" component="div">
              {data.industry.toLocaleString('fr-FR')} tCO2e
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {isBetterThanAverage ? (
              <>
                <TrendingDown color="success" />
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  {difference}% en dessous de la moyenne du secteur
                </Typography>
              </>
            ) : (
              <>
                <TrendingUp color="error" />
                <Typography variant="body2" color="error.main" sx={{ ml: 1 }}>
                  {difference}% au-dessus de la moyenne du secteur
                </Typography>
              </>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Positionnement sectoriel (percentile)
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progressValue} 
              color={progressValue > 50 ? "success" : "warning"}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Meilleur
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {data.percentile}ème percentile
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Moins bon
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BenchmarkWidget;

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
// import { getDashboardData } from '../actions/dashboardActions';
import EmissionsChart from '../components/dashboard/EmissionsChart';
import EmissionsBySourceChart from '../components/dashboard/EmissionsBySourceChart';
import EmissionsTrend from '../components/dashboard/EmissionsTrend';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import RegulatoryCalendar from '../components/dashboard/RegulatoryCalendar';
import BenchmarkWidget from '../components/dashboard/BenchmarkWidget';

const Dashboard = () => {
  const dispatch = useDispatch();
  // const { data, loading, error } = useSelector(state => state.dashboard);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Données simulées pour le développement
  const data = {
    totalEmissions: 1250.75,
    emissionsChange: -5.2,
    scope1: 320.45,
    scope2: 430.30,
    scope3: 500.00,
    emissionsByMonth: [
      { month: 'Jan', emissions: 100 },
      { month: 'Fév', emissions: 120 },
      { month: 'Mar', emissions: 110 },
      { month: 'Avr', emissions: 105 },
      { month: 'Mai', emissions: 95 },
      { month: 'Juin', emissions: 90 },
      { month: 'Juil', emissions: 85 },
      { month: 'Août', emissions: 80 },
      { month: 'Sep', emissions: 85 },
      { month: 'Oct', emissions: 90 },
      { month: 'Nov', emissions: 95 },
      { month: 'Déc', emissions: 90 }
    ],
    emissionsBySources: [
      { source: 'Électricité', value: 430 },
      { source: 'Transport', value: 280 },
      { source: 'Chauffage', value: 180 },
      { source: 'Matériaux', value: 220 },
      { source: 'Déchets', value: 140 }
    ],
    alerts: [
      { id: 1, type: 'warning', message: 'Augmentation des émissions liées au transport (+15%)' },
      { id: 2, type: 'info', message: 'Échéance BEGES dans 30 jours' },
      { id: 3, type: 'success', message: 'Réduction des émissions liées à l\'électricité (-10%)' }
    ],
    regulatoryEvents: [
      { id: 1, date: '2025-04-15', title: 'Échéance déclaration BEGES' },
      { id: 2, date: '2025-06-30', title: 'Publication rapport CSRD' },
      { id: 3, date: '2025-09-01', title: 'Nouvelle réglementation carbone' }
    ],
    benchmarkData: {
      company: 1250.75,
      industry: 1500.25,
      percentile: 25
    }
  };

  useEffect(() => {
    // Charger les données du tableau de bord
    // dispatch(getDashboardData());
    
    // Simulation de chargement pour le développement
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [dispatch]);

  const handleRefresh = () => {
    // dispatch(getDashboardData());
    
    // Simulation de chargement pour le développement
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDownloadReport = () => {
    // Logique pour télécharger le rapport
    console.log('Téléchargement du rapport');
  };

  if (loading) {
    return <Box sx={{ p: 3 }}>Chargement des données...</Box>;
  }

  if (error) {
    return <Alert severity="error">Erreur lors du chargement des données: {error}</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tableau de Bord Carbone
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
            onClick={handleDownloadReport}
            sx={{ mr: 1 }}
          >
            Exporter
          </Button>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefresh}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {/* Résumé des émissions */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Émissions Totales</Typography>
              <Tooltip title="Émissions totales de CO2 en tonnes équivalent CO2">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 2 }}>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                {data.totalEmissions.toLocaleString('fr-FR')}
              </Typography>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                tCO2e
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {data.emissionsChange < 0 ? (
                <>
                  <TrendingDown color="success" />
                  <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                    {Math.abs(data.emissionsChange)}% par rapport à l'année précédente
                  </Typography>
                </>
              ) : (
                <>
                  <TrendingUp color="error" />
                  <Typography variant="body2" color="error.main" sx={{ ml: 1 }}>
                    {data.emissionsChange}% par rapport à l'année précédente
                  </Typography>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Répartition par Scope</Typography>
              <Tooltip title="Répartition des émissions selon les scopes 1, 2 et 3 du GHG Protocol">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ bgcolor: 'primary.light' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="primary.contrastText">Scope 1</Typography>
                    <Typography variant="h5" component="div" color="primary.contrastText">
                      {data.scope1.toLocaleString('fr-FR')} tCO2e
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                      Émissions directes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ bgcolor: 'secondary.light' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="secondary.contrastText">Scope 2</Typography>
                    <Typography variant="h5" component="div" color="secondary.contrastText">
                      {data.scope2.toLocaleString('fr-FR')} tCO2e
                    </Typography>
                    <Typography variant="body2" color="secondary.contrastText">
                      Électricité & chaleur
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card variant="outlined" sx={{ bgcolor: 'info.light' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="info.contrastText">Scope 3</Typography>
                    <Typography variant="h5" component="div" color="info.contrastText">
                      {data.scope3.toLocaleString('fr-FR')} tCO2e
                    </Typography>
                    <Typography variant="body2" color="info.contrastText">
                      Émissions indirectes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Évolution des Émissions</Typography>
            <Box sx={{ height: 300 }}>
              {/* Composant de graphique à implémenter */}
              <EmissionsTrend data={data.emissionsByMonth} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Émissions par Source</Typography>
            <Box sx={{ height: 300 }}>
              {/* Composant de graphique à implémenter */}
              <EmissionsBySourceChart data={data.emissionsBySources} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Widgets supplémentaires */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Alertes & Notifications</Typography>
            <AlertsWidget alerts={data.alerts} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Calendrier Réglementaire</Typography>
            <RegulatoryCalendar events={data.regulatoryEvents} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Benchmark Sectoriel</Typography>
            <BenchmarkWidget data={data.benchmarkData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

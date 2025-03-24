import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Grid, 
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import { 
  PictureAsPdf as PdfIcon,
  FileDownload as DownloadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
// import { getReports, generateReport, deleteReport } from '../actions/reportsActions';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    type: 'beges',
    period: '',
    format: 'pdf'
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Types de rapports disponibles
  const reportTypes = [
    { value: 'beges', label: 'Bilan d\'Émissions de Gaz à Effet de Serre (BEGES)' },
    { value: 'csrd', label: 'Corporate Sustainability Reporting Directive (CSRD)' },
    { value: 'carbon', label: 'Bilan Carbone®' },
    { value: 'custom', label: 'Rapport personnalisé' }
  ];

  // Formats d'export disponibles
  const exportFormats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'xbrl', label: 'XBRL' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' }
  ];

  // Données simulées pour le développement
  const mockReports = [
    { 
      id: 1, 
      title: 'BEGES 2024', 
      type: 'beges', 
      createdAt: '2024-03-15', 
      status: 'completed',
      format: 'pdf',
      totalEmissions: 1250.75
    },
    { 
      id: 2, 
      title: 'Rapport CSRD Semestriel', 
      type: 'csrd', 
      createdAt: '2024-02-28', 
      status: 'completed',
      format: 'xbrl',
      totalEmissions: 1180.50
    },
    { 
      id: 3, 
      title: 'Bilan Carbone 2023', 
      type: 'carbon', 
      createdAt: '2023-12-20', 
      status: 'completed',
      format: 'pdf',
      totalEmissions: 1320.25
    },
    { 
      id: 4, 
      title: 'Rapport d\'émissions par département', 
      type: 'custom', 
      createdAt: '2024-01-10', 
      status: 'completed',
      format: 'excel',
      totalEmissions: 1250.75
    }
  ];

  useEffect(() => {
    // Charger les rapports
    // dispatch(getReports());
    
    // Simulation de chargement pour le développement
    setLoading(true);
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setReportForm({
      ...reportForm,
      [name]: value
    });
  };

  const handleGenerateReport = () => {
    // Simulation de génération de rapport pour le développement
    console.log('Génération de rapport avec:', reportForm);
    
    // En production, on utiliserait:
    // dispatch(generateReport(reportForm));
    
    // Simulation de génération réussie
    const newReport = {
      id: reports.length + 1,
      title: reportForm.title,
      type: reportForm.type,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
      format: reportForm.format,
      totalEmissions: 1250.75
    };
    
    setReports([newReport, ...reports]);
    handleCloseDialog();
  };

  const handleDeleteReport = (id) => {
    // Simulation de suppression de rapport pour le développement
    console.log('Suppression du rapport:', id);
    
    // En production, on utiliserait:
    // dispatch(deleteReport(id));
    
    // Simulation de suppression réussie
    setReports(reports.filter(report => report.id !== id));
  };

  const getReportTypeLabel = (type) => {
    const reportType = reportTypes.find(rt => rt.value === type);
    return reportType ? reportType.label : type;
  };

  const getFormatLabel = (format) => {
    const exportFormat = exportFormats.find(ef => ef.value === format);
    return exportFormat ? exportFormat.label : format;
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return <Chip size="small" color="success" label="Complété" />;
      case 'pending':
        return <Chip size="small" color="warning" label="En cours" />;
      case 'failed':
        return <Chip size="small" color="error" label="Échec" />;
      default:
        return <Chip size="small" label={status} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Rapports Réglementaires
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nouveau Rapport
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Tous les rapports" />
          <Tab label="BEGES" />
          <Tab label="CSRD" />
          <Tab label="Bilan Carbone" />
        </Tabs>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Chargement des rapports...</Typography>
          </Box>
        ) : reports.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" gutterBottom>
              Aucun rapport disponible.
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
            >
              Créer votre premier rapport
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titre</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date de création</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell>Émissions</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports
                  .filter(report => {
                    if (tabValue === 0) return true;
                    if (tabValue === 1) return report.type === 'beges';
                    if (tabValue === 2) return report.type === 'csrd';
                    if (tabValue === 3) return report.type === 'carbon';
                    return true;
                  })
                  .map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.title}</TableCell>
                      <TableCell>{getReportTypeLabel(report.type)}</TableCell>
                      <TableCell>{new Date(report.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{getFormatLabel(report.format).toUpperCase()}</TableCell>
                      <TableCell>{report.totalEmissions.toLocaleString('fr-FR')} tCO2e</TableCell>
                      <TableCell>{getStatusChip(report.status)}</TableCell>
                      <TableCell>
                        <Tooltip title="Télécharger">
                          <IconButton size="small" color="primary">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Voir">
                          <IconButton size="small" color="info">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Partager">
                          <IconButton size="small" color="secondary">
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      
      {/* Dialogue de création de rapport */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Générer un nouveau rapport</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  name="title"
                  label="Titre du rapport"
                  value={reportForm.title}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="report-type-label">Type de rapport</InputLabel>
                  <Select
                    labelId="report-type-label"
                    id="type"
                    name="type"
                    value={reportForm.type}
                    label="Type de rapport"
                    onChange={handleFormChange}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="period"
                  name="period"
                  label="Période (ex: 2024 ou Q1 2024)"
                  value={reportForm.period}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="format-label">Format d'export</InputLabel>
                  <Select
                    labelId="format-label"
                    id="format"
                    name="format"
                    value={reportForm.format}
                    label="Format d'export"
                    onChange={handleFormChange}
                  >
                    {exportFormats.map((format) => (
                      <MenuItem key={format.value} value={format.value}>
                        {format.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleGenerateReport}
            startIcon={<PdfIcon />}
          >
            Générer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Reports;

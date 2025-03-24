import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Container,
  Tabs,
  Tab,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Calculate as CalculateIcon,
  Save as SaveIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
// import { calculateEmissions, saveEmissions } from '../actions/emissionsActions';

const EmissionsCalculator = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Données générales
    calculationPeriod: '',
    calculationYear: new Date().getFullYear(),
    
    // Scope 1 - Émissions directes
    fuelConsumption: [],
    companyVehicles: [],
    refrigerantLeaks: [],
    
    // Scope 2 - Émissions indirectes énergétiques
    electricityConsumption: [],
    heatConsumption: [],
    
    // Scope 3 - Autres émissions indirectes
    businessTravel: [],
    employeeCommuting: [],
    purchasedGoods: [],
    wasteDisposal: [],
    freightTransport: []
  });
  
  const [calculationResults, setCalculationResults] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (e, section, index, field) => {
    const { name, value } = e.target;
    
    if (section && index !== undefined && field) {
      // Mise à jour d'un champ dans un tableau d'objets
      const updatedArray = [...formData[section]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      
      setFormData({
        ...formData,
        [section]: updatedArray
      });
    } else {
      // Mise à jour d'un champ simple
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAddItem = (section, defaultItem) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], defaultItem]
    });
  };

  const handleRemoveItem = (section, index) => {
    const updatedArray = [...formData[section]];
    updatedArray.splice(index, 1);
    
    setFormData({
      ...formData,
      [section]: updatedArray
    });
  };

  const handleCalculate = () => {
    // Simulation de calcul pour le développement
    console.log('Calcul des émissions avec:', formData);
    
    // En production, on utiliserait:
    // dispatch(calculateEmissions(formData));
    
    // Simulation de résultats de calcul
    const results = {
      totalEmissions: 1250.75,
      scope1: 320.45,
      scope2: 430.30,
      scope3: 500.00,
      breakdown: {
        fuelConsumption: 150.20,
        companyVehicles: 120.25,
        refrigerantLeaks: 50.00,
        electricityConsumption: 380.30,
        heatConsumption: 50.00,
        businessTravel: 120.00,
        employeeCommuting: 80.00,
        purchasedGoods: 200.00,
        wasteDisposal: 30.00,
        freightTransport: 70.00
      }
    };
    
    setCalculationResults(results);
  };

  const handleSave = () => {
    // Simulation de sauvegarde pour le développement
    console.log('Sauvegarde des émissions:', calculationResults);
    
    // En production, on utiliserait:
    // dispatch(saveEmissions(formData, calculationResults));
  };

  const steps = ['Informations générales', 'Scope 1', 'Scope 2', 'Scope 3', 'Résultats'];

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Informations générales
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informations générales
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel id="calculation-period-label">Période de calcul</InputLabel>
                  <Select
                    labelId="calculation-period-label"
                    id="calculationPeriod"
                    name="calculationPeriod"
                    value={formData.calculationPeriod}
                    label="Période de calcul"
                    onChange={handleChange}
                  >
                    <MenuItem value="annual">Annuelle</MenuItem>
                    <MenuItem value="biannual">Semestrielle</MenuItem>
                    <MenuItem value="quarterly">Trimestrielle</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="calculationYear"
                  name="calculationYear"
                  label="Année de référence"
                  type="number"
                  value={formData.calculationYear}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1: // Scope 1
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scope 1 - Émissions directes
            </Typography>
            
            {/* Consommation de carburant */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Consommation de carburant
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddItem('fuelConsumption', { type: '', quantity: '', unit: 'litres' })}
                >
                  Ajouter
                </Button>
              </Box>
              
              {formData.fuelConsumption.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                  Aucune donnée de consommation de carburant. Cliquez sur "Ajouter" pour commencer.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type de carburant</TableCell>
                        <TableCell>Quantité</TableCell>
                        <TableCell>Unité</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.fuelConsumption.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <Select
                                value={item.type}
                                onChange={(e) => handleChange(e, 'fuelConsumption', index, 'type')}
                              >
                                <MenuItem value="diesel">Diesel</MenuItem>
                                <MenuItem value="gasoline">Essence</MenuItem>
                                <MenuItem value="naturalGas">Gaz naturel</MenuItem>
                                <MenuItem value="propane">Propane</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleChange(e, 'fuelConsumption', index, 'quantity')}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={item.unit}
                                onChange={(e) => handleChange(e, 'fuelConsumption', index, 'unit')}
                              >
                                <MenuItem value="litres">Litres</MenuItem>
                                <MenuItem value="m3">m³</MenuItem>
                                <MenuItem value="kg">kg</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveItem('fuelConsumption', index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
            
            {/* Véhicules de l'entreprise */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Véhicules de l'entreprise
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddItem('companyVehicles', { type: '', distance: '', unit: 'km' })}
                >
                  Ajouter
                </Button>
              </Box>
              
              {formData.companyVehicles.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                  Aucune donnée de véhicule. Cliquez sur "Ajouter" pour commencer.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type de véhicule</TableCell>
                        <TableCell>Distance parcourue</TableCell>
                        <TableCell>Unité</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.companyVehicles.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <Select
                                value={item.type}
                                onChange={(e) => handleChange(e, 'companyVehicles', index, 'type')}
                              >
                                <MenuItem value="car">Voiture</MenuItem>
                                <MenuItem value="van">Camionnette</MenuItem>
                                <MenuItem value="truck">Camion</MenuItem>
                                <MenuItem value="motorcycle">Moto</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.distance}
                              onChange={(e) => handleChange(e, 'companyVehicles', index, 'distance')}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={item.unit}
                                onChange={(e) => handleChange(e, 'companyVehicles', index, 'unit')}
                              >
                                <MenuItem value="km">km</MenuItem>
                                <MenuItem value="miles">miles</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveItem('companyVehicles', index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        );
      
      case 2: // Scope 2
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scope 2 - Émissions indirectes énergétiques
            </Typography>
            
            {/* Consommation d'électricité */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Consommation d'électricité
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddItem('electricityConsumption', { source: '', quantity: '', unit: 'kWh' })}
                >
                  Ajouter
                </Button>
              </Box>
              
              {formData.electricityConsumption.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                  Aucune donnée de consommation d'électricité. Cliquez sur "Ajouter" pour commencer.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Source d'électricité</TableCell>
                        <TableCell>Quantité</TableCell>
                        <TableCell>Unité</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.electricityConsumption.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <Select
                                value={item.source}
                                onChange={(e) => handleChange(e, 'electricityConsumption', index, 'source')}
                              >
                                <MenuItem value="grid">Réseau électrique</MenuItem>
                                <MenuItem value="renewable">Énergie renouvelable</MenuItem>
                                <MenuItem value="mixed">Mix énergétique</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleChange(e, 'electricityConsumption', index, 'quantity')}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={item.unit}
                                onChange={(e) => handleChange(e, 'electricityConsumption', index, 'unit')}
                              >
                                <MenuItem value="kWh">kWh</MenuItem>
                                <MenuItem value="MWh">MWh</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveItem('electricityConsumption', index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        );
      
      case 3: // Scope 3
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scope 3 - Autres émissions indirectes
            </Typography>
            
            {/* Déplacements professionnels */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                  Déplacements professionnels
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={() => handleAddItem('businessTravel', { mode: '', distance: '', unit: 'km' })}
                >
                  Ajouter
                </Button>
              </Box>
              
              {formData.businessTravel.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                  Aucune donnée de déplacement professionnel. Cliquez sur "Ajouter" pour commencer.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Mode de transport</TableCell>
                        <TableCell>Distance</TableCell>
                        <TableCell>Unité</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.businessTravel.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <Select
                                value={item.mode}
                                onChange={(e) => handleChange(e, 'businessTravel', index, 'mode')}
                              >
                                <MenuItem value="plane">Avion</MenuItem>
                                <MenuItem value="train">Train</MenuItem>
                                <MenuItem value="car">Voiture</MenuItem>
                                <MenuItem value="bus">Bus</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.distance}
                              onChange={(e) => handleChange(e, 'businessTravel', index, 'distance')}
                            />
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={item.unit}
                                onChange={(e) => handleChange(e, 'businessTravel', index, 'unit')}
                              >
                                <MenuItem value="km">km</MenuItem>
                                <MenuItem value="miles">miles</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveItem('businessTravel', index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        );
      
      case 4: // Résultats
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Résultats du calcul d'émissions
            </Typography>
            
            {!calculationResults ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" gutterBottom>
                  Cliquez sur "Calculer" pour obtenir les résultats de votre empreinte carbone.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<CalculateIcon />}
                  onClick={handleCalculate}
                  sx={{ mt: 2 }}
                >
                  Calculer
                </Button>
              </Box>
            ) : (
              <Box>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h5" gutterBottom align="center">
                    Émissions totales: {calculationResults.totalEmissions.toLocaleString('fr-FR')} tCO2e
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="subtitle1">Scope 1</Typography>
                        <Typography variant="h6">{calculationResults.scope1.toLocaleString('fr-FR')} tCO2e</Typography>
                        <Typography variant="body2">Émissions directes</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                        <Typography variant="subtitle1">Scope 2</Typography>
                        <Typography variant="h6">{calculationResults.scope2.toLocaleString('fr-FR')} tCO2e</Typography>
                        <Typography variant="body2">Émissions indirectes énergétiques</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                        <Typography variant="subtitle1">Scope 3</Typography>
                        <Typography variant="h6">{calculationResults.scope3.toLocaleString('fr-FR')} tCO2e</Typography>
                        <Typography variant="body2">Autres émissions indirectes</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Enregistrer les résultats
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<CloudUploadIcon />}
                  >
                    Exporter en PDF
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        );
      
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Calculateur d'Émissions Carbone
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Cet outil vous permet de calculer votre empreinte carbone selon les scopes 1, 2 et 3 du GHG Protocol.
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
          >
            Précédent
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (activeStep === steps.length - 1) {
                handleCalculate();
              } else {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
              }
            }}
          >
            {activeStep === steps.length - 1 ? 'Calculer' : 'Suivant'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EmissionsCalculator;

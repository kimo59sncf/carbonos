import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  Avatar,
  Container,
  Checkbox,
  FormControlLabel,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { PersonAddOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { register } from '../actions/authActions';

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Informations de l'entreprise
    companyName: '',
    siret: '',
    sector: '',
    employeeCount: '',
    
    // Consentements RGPD
    acceptTerms: false,
    acceptDataProcessing: false,
    acceptMarketing: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const steps = ['Informations personnelles', 'Informations entreprise', 'Consentements RGPD'];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('accept') ? checked : value
    });
    
    // Effacer l'erreur lorsque l'utilisateur commence à corriger
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Validation du prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    // Validation du nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    // Validation de l'email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    // Validation du nom de l'entreprise
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Le nom de l\'entreprise est requis';
    }
    
    // Validation du SIRET
    if (!formData.siret.trim()) {
      newErrors.siret = 'Le numéro SIRET est requis';
    } else if (!/^\d{14}$/.test(formData.siret.replace(/\s/g, ''))) {
      newErrors.siret = 'Format SIRET invalide (14 chiffres)';
    }
    
    // Validation du secteur
    if (!formData.sector.trim()) {
      newErrors.sector = 'Le secteur d\'activité est requis';
    }
    
    // Validation du nombre d'employés
    if (!formData.employeeCount.trim()) {
      newErrors.employeeCount = 'Le nombre d\'employés est requis';
    } else if (isNaN(formData.employeeCount) || parseInt(formData.employeeCount) <= 0) {
      newErrors.employeeCount = 'Veuillez entrer un nombre valide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    // Validation des conditions d'utilisation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }
    
    // Validation du traitement des données
    if (!formData.acceptDataProcessing) {
      newErrors.acceptDataProcessing = 'Vous devez accepter le traitement de vos données';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    switch (activeStep) {
      case 0:
        isValid = validateStep1();
        break;
      case 1:
        isValid = validateStep2();
        break;
      case 2:
        isValid = validateStep3();
        break;
      default:
        isValid = false;
    }
    
    if (isValid) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    // Simulation d'inscription pour le développement
    console.log('Tentative d\'inscription avec:', formData);
    
    // En production, on utiliserait:
    // dispatch(register(formData));
    
    // Simulation d'inscription réussie
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Prénom"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nom"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Adresse email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="companyName"
                  label="Nom de l'entreprise"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="siret"
                  label="Numéro SIRET"
                  name="siret"
                  value={formData.siret}
                  onChange={handleChange}
                  error={!!errors.siret}
                  helperText={errors.siret}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="sector"
                  label="Secteur d'activité"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  error={!!errors.sector}
                  helperText={errors.sector}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="employeeCount"
                  label="Nombre d'employés"
                  name="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  error={!!errors.employeeCount}
                  helperText={errors.employeeCount}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Consentements RGPD
            </Typography>
            <Typography variant="body2" paragraph>
              Conformément au Règlement Général sur la Protection des Données (RGPD), nous avons besoin de votre consentement explicite pour traiter vos données.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptTerms"
                      color="primary"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                    />
                  }
                  label="J'accepte les conditions d'utilisation et la politique de confidentialité *"
                />
                {errors.acceptTerms && (
                  <Typography variant="caption" color="error">
                    {errors.acceptTerms}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptDataProcessing"
                      color="primary"
                      checked={formData.acceptDataProcessing}
                      onChange={handleChange}
                    />
                  }
                  label="J'accepte que mes données soient traitées pour le calcul de mon empreinte carbone *"
                />
                {errors.acceptDataProcessing && (
                  <Typography variant="caption" color="error">
                    {errors.acceptDataProcessing}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acceptMarketing"
                      color="primary"
                      checked={formData.acceptMarketing}
                      onChange={handleChange}
                    />
                  }
                  label="J'accepte de recevoir des communications marketing (optionnel)"
                />
              </Grid>
            </Grid>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              * Champs obligatoires
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Vous pouvez à tout moment exercer vos droits d'accès, de rectification, d'effacement et de portabilité de vos données via votre espace personnel.
            </Typography>
          </Box>
        );
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Inscription à CarbonOS
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5, width: '100%' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Retour
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
            >
              {activeStep === steps.length - 1 ? 'S\'inscrire' : 'Suivant'}
            </Button>
          </Box>
        </Paper>
        
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid item>
            <Link href="/login" variant="body2">
              Déjà un compte ? Se connecter
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Register;

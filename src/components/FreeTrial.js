import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';

const FreeTrial = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    employees: '',
    email: '',
    firstName: '',
    lastName: '',
    position: '',
    phone: '',
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [errors, setErrors] = useState({});

  const steps = ['Informations entreprise', 'Informations personnelles', 'Conditions d\'utilisation', 'Confirmation'];

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};

    if (step === 0) {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Le nom de l\'entreprise est requis';
        isValid = false;
      }
      if (!formData.industry.trim()) {
        newErrors.industry = 'Le secteur d\'activité est requis';
        isValid = false;
      }
      if (!formData.employees.trim()) {
        newErrors.employees = 'Le nombre d\'employés est requis';
        isValid = false;
      }
    } else if (step === 1) {
      if (!formData.email.trim()) {
        newErrors.email = 'L\'email est requis';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'L\'email n\'est pas valide';
        isValid = false;
      }
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Le prénom est requis';
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Le nom est requis';
        isValid = false;
      }
      if (!formData.position.trim()) {
        newErrors.position = 'Le poste est requis';
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
        isValid = false;
      }
      if (!formData.acceptPrivacy) {
        newErrors.acceptPrivacy = 'Vous devez accepter la politique de confidentialité';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    // Simulation d'envoi des données
    console.log('Données soumises:', formData);
    // Passer à l'étape de confirmation
    setActiveStep(3);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'entreprise"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              margin="normal"
              error={!!errors.companyName}
              helperText={errors.companyName}
              required
            />
            <TextField
              fullWidth
              label="Secteur d'activité"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              margin="normal"
              error={!!errors.industry}
              helperText={errors.industry}
              required
            />
            <TextField
              fullWidth
              label="Nombre d'employés"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              margin="normal"
              error={!!errors.employees}
              helperText={errors.employees}
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
            />
            <TextField
              fullWidth
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
            />
            <TextField
              fullWidth
              label="Poste"
              name="position"
              value={formData.position}
              onChange={handleChange}
              margin="normal"
              error={!!errors.position}
              helperText={errors.position}
              required
            />
            <TextField
              fullWidth
              label="Email professionnel"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <TextField
              fullWidth
              label="Téléphone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Veuillez lire et accepter les conditions suivantes pour continuer.
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              Conditions d'utilisation de l'essai gratuit
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 2, maxHeight: 200, overflow: 'auto' }}>
              <Typography variant="body2">
                En acceptant ces conditions, vous reconnaissez que :
                <br /><br />
                1. L'essai gratuit est limité à 30 jours.
                <br />
                2. Certaines fonctionnalités sont limitées dans la version d'essai.
                <br />
                3. Les données saisies pendant l'essai seront conservées si vous passez à une version payante.
                <br />
                4. Nous pouvons vous contacter par email pour vous informer sur l'utilisation du produit.
                <br /><br />
                L'essai gratuit vous donne accès à :
                <br />
                - Tableau de bord limité
                <br />
                - Calcul d'émissions pour 5 sources maximum
                <br />
                - Génération de 2 rapports maximum
                <br />
                - Pas d'accès au module collaboratif
                <br />
                - Pas d'accès au benchmarking
              </Typography>
            </Paper>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.acceptTerms} 
                  onChange={handleChange} 
                  name="acceptTerms" 
                />
              }
              label="J'accepte les conditions d'utilisation"
            />
            {errors.acceptTerms && (
              <Typography color="error" variant="caption">
                {errors.acceptTerms}
              </Typography>
            )}
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Politique de confidentialité et RGPD
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 2, maxHeight: 200, overflow: 'auto' }}>
              <Typography variant="body2">
                Conformément au RGPD, nous nous engageons à :
                <br /><br />
                1. Protéger vos données personnelles et les données de votre entreprise.
                <br />
                2. Ne pas partager vos informations avec des tiers sans votre consentement explicite.
                <br />
                3. Vous permettre d'accéder, modifier ou supprimer vos données à tout moment.
                <br />
                4. Utiliser vos données uniquement dans le cadre de l'amélioration de nos services.
                <br />
                5. Stocker vos données sur des serveurs sécurisés situés en France/UE.
                <br /><br />
                Pour plus d'informations, veuillez consulter notre politique de confidentialité complète.
              </Typography>
            </Paper>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.acceptPrivacy} 
                  onChange={handleChange} 
                  name="acceptPrivacy" 
                />
              }
              label="J'accepte la politique de confidentialité"
            />
            {errors.acceptPrivacy && (
              <Typography color="error" variant="caption">
                {errors.acceptPrivacy}
              </Typography>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Félicitations !
            </Typography>
            <Typography variant="body1" paragraph>
              Votre compte d'essai gratuit a été créé avec succès.
            </Typography>
            <Typography variant="body1" paragraph>
              Un email de confirmation a été envoyé à {formData.email} avec vos identifiants de connexion.
            </Typography>
            <Typography variant="body1" paragraph>
              Vous pouvez maintenant commencer à utiliser CarbonOS pour gérer l'empreinte carbone de votre entreprise.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              href="/login"
            >
              Accéder à mon compte
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Essai gratuit de CarbonOS
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
        Testez gratuitement notre plateforme de gestion carbone pendant 30 jours
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
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
                onClick={handleBack}
              >
                Retour
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="primary" disabled>
                  Terminé
                </Button>
              ) : activeStep === steps.length - 2 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Créer mon compte d'essai
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  Suivant
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardHeader title="Avantages de l'essai gratuit" />
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  30 jours d'essai complet
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Conforme RGPD et réglementations françaises
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LockIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Données sécurisées et hébergées en France
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Fonctionnalités incluses :
              </Typography>
              
              <Typography variant="body2" paragraph>
                ✓ Tableau de bord de suivi des émissions
              </Typography>
              <Typography variant="body2" paragraph>
                ✓ Calcul automatisé (limité à 5 sources)
              </Typography>
              <Typography variant="body2" paragraph>
                ✓ Génération de rapports (limité à 2)
              </Typography>
              <Typography variant="body2" paragraph>
                ✓ Support technique par email
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                Aucune carte de crédit requise pour l'essai gratuit.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FreeTrial;

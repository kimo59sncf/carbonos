import React, { useState } from 'react';
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
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Chip,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SecurityIcon from '@mui/icons-material/Security';
import { useDispatch, useSelector } from 'react-redux';
import { upgradeTrial } from '../actions/trialActions';
import { subscribeToPaymentPlan } from '../actions/subscriptionActions';

const Subscription = () => {
  const dispatch = useDispatch();
  const { user, company } = useSelector(state => state.auth);
  const { trialStatus } = useSelector(state => state.trial);
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingInfo, setBillingInfo] = useState({
    companyName: company ? company.name : '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    vatNumber: '',
    contactName: user ? `${user.firstName} ${user.lastName}` : '',
    contactEmail: user ? user.email : '',
    contactPhone: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    savePaymentInfo: false
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '99€',
      period: 'par mois',
      description: 'Idéal pour les TPE et petites PME',
      features: [
        'Jusqu\'à 20 sources d\'émission',
        'Jusqu\'à 5 rapports par mois',
        'Tableau de bord basique',
        'Support par email',
        'Mises à jour incluses'
      ],
      limitations: [
        'Pas de module collaboratif',
        'Pas d\'intégration comptable',
        'Pas de benchmarking'
      ],
      recommended: false,
      color: 'default'
    },
    {
      id: 'business',
      name: 'Business',
      price: '299€',
      period: 'par mois',
      description: 'Pour les PME en croissance',
      features: [
        'Jusqu\'à 100 sources d\'émission',
        'Rapports illimités',
        'Tableau de bord avancé',
        'Module collaboratif',
        'Intégration comptable basique',
        'Support prioritaire',
        'Mises à jour incluses'
      ],
      limitations: [
        'Benchmarking limité',
        'Pas d\'API personnalisée'
      ],
      recommended: true,
      color: 'primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '499€',
      period: 'par mois',
      description: 'Solution complète pour les ETI',
      features: [
        'Sources d\'émission illimitées',
        'Rapports illimités',
        'Tableau de bord premium',
        'Module collaboratif avancé',
        'Intégration comptable complète',
        'Benchmarking avancé',
        'API personnalisée',
        'Support dédié 24/7',
        'Mises à jour prioritaires',
        'Formation incluse'
      ],
      limitations: [],
      recommended: false,
      color: 'secondary'
    }
  ];
  
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };
  
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  
  const handleBillingInfoChange = (event) => {
    setBillingInfo({
      ...billingInfo,
      [event.target.name]: event.target.value
    });
  };
  
  const handlePaymentInfoChange = (event) => {
    setPaymentInfo({
      ...paymentInfo,
      [event.target.name]: event.target.value
    });
  };
  
  const handleSavePaymentInfoChange = (event) => {
    setPaymentInfo({
      ...paymentInfo,
      savePaymentInfo: event.target.checked
    });
  };
  
  const handleAcceptTermsChange = (event) => {
    setAcceptTerms(event.target.checked);
  };
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubscribe = async () => {
    try {
      // Simuler le traitement du paiement
      setActiveStep(3); // Étape de confirmation
      
      // Envoyer les données d'abonnement au backend
      await dispatch(subscribeToPaymentPlan({
        planId: selectedPlan,
        billingInfo,
        paymentMethod,
        ...(paymentMethod === 'card' && { paymentInfo })
      }));
      
      // Si l'utilisateur est en essai, mettre à jour son statut
      if (trialStatus && trialStatus.isTrialActive) {
        await dispatch(upgradeTrial(selectedPlan));
      }
      
      // Rediriger vers le tableau de bord après quelques secondes
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      // Gérer l'erreur (afficher un message, etc.)
    }
  };
  
  const steps = ['Choisir un plan', 'Informations de facturation', 'Paiement', 'Confirmation'];
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Choisissez votre plan d'abonnement
            </Typography>
            <Typography variant="body1" paragraph>
              Sélectionnez le plan qui correspond le mieux aux besoins de votre entreprise.
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 2 }}>
              {plans.map((plan) => (
                <Grid item xs={12} md={4} key={plan.id}>
                  <Card 
                    elevation={selectedPlan === plan.id ? 8 : 2} 
                    sx={{ 
                      height: '100%',
                      border: selectedPlan === plan.id ? `2px solid ${plan.color === 'default' ? '#1976d2' : plan.color}` : 'none',
                      position: 'relative',
                      overflow: 'visible'
                    }}
                  >
                    {plan.recommended && (
                      <Chip
                        label="Recommandé"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: -15,
                          right: 20,
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    <CardHeader 
                      title={plan.name} 
                      titleTypographyProps={{ align: 'center', variant: 'h5' }}
                      sx={{ bgcolor: plan.color !== 'default' ? `${plan.color}.light` : 'grey.100' }}
                    />
                    <CardContent>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h4" component="span">
                          {plan.price}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="span">
                          {' '}{plan.period}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" align="center" sx={{ fontStyle: 'italic', mb: 2 }}>
                        {plan.description}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <List dense>
                        {plan.features.map((feature, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircleOutlineIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={feature} />
                          </ListItem>
                        ))}
                        {plan.limitations.map((limitation, index) => (
                          <ListItem key={`limit-${index}`}>
                            <ListItemIcon>
                              <CancelIcon color="error" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={limitation} 
                              primaryTypographyProps={{ color: 'text.secondary' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                      <Button 
                        variant={selectedPlan === plan.id ? "contained" : "outlined"}
                        color={plan.color !== 'default' ? plan.color : "primary"}
                        onClick={() => handlePlanSelect(plan.id)}
                        size="large"
                        fullWidth
                        sx={{ mx: 2 }}
                      >
                        {selectedPlan === plan.id ? "Sélectionné" : "Sélectionner"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!selectedPlan}
                sx={{ mt: 3, ml: 1 }}
              >
                Suivant
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Informations de facturation
            </Typography>
            <Typography variant="body1" paragraph>
              Veuillez fournir les informations de facturation pour votre abonnement.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="companyName"
                  name="companyName"
                  label="Nom de l'entreprise"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.companyName}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label="Adresse"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.address}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="Ville"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.city}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="postalCode"
                  name="postalCode"
                  label="Code postal"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.postalCode}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="country"
                  name="country"
                  label="Pays"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.country}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="vatNumber"
                  name="vatNumber"
                  label="Numéro de TVA"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.vatNumber}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Contact de facturation
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="contactName"
                  name="contactName"
                  label="Nom du contact"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.contactName}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="contactEmail"
                  name="contactEmail"
                  label="Email du contact"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.contactEmail}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="contactPhone"
                  name="contactPhone"
                  label="Téléphone du contact"
                  fullWidth
                  variant="outlined"
                  value={billingInfo.contactPhone}
                  onChange={handleBillingInfoChange}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                Retour
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ mt: 3, ml: 1 }}
                disabled={!billingInfo.companyName || !billingInfo.address || !billingInfo.city || 
                         !billingInfo.postalCode || !billingInfo.country || !billingInfo.contactName || 
                         !billingInfo.contactEmail}
              >
                Suivant
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Méthode de paiement
            </Typography>
            <Typography variant="body1" paragraph>
              Veuillez choisir votre méthode de paiement préférée.
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="payment-method"
                  name="payment-method"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel 
                    value="card" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PaymentIcon sx={{ mr: 1 }} />
                        <Typography>Carte bancaire</Typography>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="transfer" 
                    control={<Radio />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ReceiptIcon sx={{ mr: 1 }} />
                        <Typography>Virement bancaire</Typography>
                      </Box>
                    } 
                  />
                </RadioGroup>
              </FormControl>
            </Paper>
            
            {paymentMethod === 'card' && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Informations de carte bancaire
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Vos informations de paiement sont sécurisées avec un chiffrement SSL 256 bits.
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardNumber"
                      name="cardNumber"
                      label="Numéro de carte"
                      fullWidth
                      variant="outlined"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentInfoChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardName"
                      name="cardName"
                      label="Nom sur la carte"
                      fullWidth
                      variant="outlined"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentInfoChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="expiryDate"
                      name="expiryDate"
                      label="Date d'expiration (MM/AA)"
                      fullWidth
                      variant="outlined"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentInfoChange}
                      placeholder="MM/AA"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="cvv"
                      name="cvv"
                      label="CVV"
                      fullWidth
                      variant="outlined"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentInfoChange}
                      placeholder="123"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={paymentInfo.savePaymentInfo}
                          onChange={handleSavePaymentInfoChange}
                          name="savePaymentInfo"
                          color="primary"
                        />
                      }
                      label="Sauvegarder ces informations pour les paiements futurs"
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            {paymentMethod === 'transfer' && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Instructions pour le virement bancaire
                </Typography>
                <Typography variant="body1" paragraph>
                  Veuillez effectuer un virement bancaire aux coordonnées suivantes :
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Bénéficiaire :</strong> CarbonOS SAS
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>IBAN :</strong> FR76 1234 5678 9012 3456 7890 123
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>BIC :</strong> CARBFRPP
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Banque :</strong> Banque Exemple
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Référence :</strong> {`CARBONOS-${selectedPlan?.toUpperCase()}-${company?.id || 'NEW'}`}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Votre abonnement sera activé dès réception du paiement.
                </Typography>
              </Paper>
            )}
            
            <Box sx={{ mt: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptTerms}
                    onChange={handleAcceptTermsChange}
                    name="acceptTerms"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    J'accepte les conditions générales d'utilisation et la politique de confidentialité
                  </Typography>
                }
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                Retour
              </Button>
              <Button
                variant="contained"
                onClick={paymentMethod === 'card' ? handleSubscribe : handleNext}
                sx={{ mt: 3, ml: 1 }}
                disabled={!acceptTerms || (paymentMethod === 'card' && (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv))}
              >
                {paymentMethod === 'card' ? 'Payer et s\'abonner' : 'Confirmer l\'abonnement'}
              </Button>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Merci pour votre abonnement !
            </Typography>
            <Typography variant="body1" paragraph>
              {paymentMethod === 'card' 
                ? 'Votre paiement a été traité avec succès et votre abonnement est maintenant actif.' 
                : 'Votre demande d\'abonnement a été enregistrée. Votre abonnement sera activé dès réception de votre virement bancaire.'}
            </Typography>
            <Typography variant="body1" paragraph>
              Un email de confirmation a été envoyé à {billingInfo.contactEmail}.
            </Typography>
            <Typography variant="body1" paragraph>
              Vous allez être redirigé vers votre tableau de bord dans quelques secondes...
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" gutterBottom>
                Besoin d'aide ?
              </Typography>
              <Typography variant="body2" paragraph>
                Contactez notre développeur : Mk-dev au 0763349311
              </Typography>
            </Box>
          </Box>
        );
      default:
        return 'Étape inconnue';
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Abonnement CarbonOS
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Choisissez le plan qui correspond le mieux aux besoins de votre entreprise
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
      </Paper>
    </Container>
  );
};

export default Subscription;

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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Divider,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { 
  Share as ShareIcon,
  PersonAdd as PersonAddIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
// import { getCollaborators, inviteCollaborator } from '../actions/collaborationActions';

const Collaboration = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'viewer',
    message: ''
  });
  const [shareForm, setShareForm] = useState({
    documentType: 'emissions',
    documentId: '',
    accessLevel: 'view',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Données simulées pour le développement
  const mockCollaborators = [
    { 
      id: 1, 
      name: 'Marie Dupont', 
      email: 'marie.dupont@example.com', 
      role: 'admin',
      company: 'Votre Entreprise',
      lastActive: '2024-03-22T14:30:00Z'
    },
    { 
      id: 2, 
      name: 'Jean Martin', 
      email: 'jean.martin@fournisseur.com', 
      role: 'editor',
      company: 'Fournisseur A',
      lastActive: '2024-03-20T09:15:00Z'
    },
    { 
      id: 3, 
      name: 'Sophie Lefebvre', 
      email: 'sophie.lefebvre@consultant.com', 
      role: 'viewer',
      company: 'Cabinet Conseil',
      lastActive: '2024-03-18T16:45:00Z'
    }
  ];

  const mockSharedDocuments = [
    {
      id: 1,
      title: 'Rapport BEGES 2024',
      type: 'report',
      sharedWith: [
        { id: 2, name: 'Jean Martin', email: 'jean.martin@fournisseur.com', accessLevel: 'view' },
        { id: 3, name: 'Sophie Lefebvre', email: 'sophie.lefebvre@consultant.com', accessLevel: 'view' }
      ],
      createdAt: '2024-03-15T10:00:00Z',
      expiryDate: '2024-06-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Données d\'émissions Scope 3',
      type: 'emissions',
      sharedWith: [
        { id: 2, name: 'Jean Martin', email: 'jean.martin@fournisseur.com', accessLevel: 'edit' }
      ],
      createdAt: '2024-03-10T14:30:00Z',
      expiryDate: '2024-05-10T14:30:00Z'
    }
  ];

  const mockMessages = [
    {
      id: 1,
      sender: { id: 1, name: 'Marie Dupont', email: 'marie.dupont@example.com' },
      content: 'Bonjour à tous, j\'ai partagé le dernier rapport BEGES. Merci de me faire vos retours.',
      timestamp: '2024-03-22T09:30:00Z',
      attachments: []
    },
    {
      id: 2,
      sender: { id: 2, name: 'Jean Martin', email: 'jean.martin@fournisseur.com' },
      content: 'Merci Marie. J\'ai mis à jour les données de notre entreprise dans le document partagé.',
      timestamp: '2024-03-22T10:15:00Z',
      attachments: []
    },
    {
      id: 3,
      sender: { id: 3, name: 'Sophie Lefebvre', email: 'sophie.lefebvre@consultant.com' },
      content: 'J\'ai analysé le rapport et j\'ai quelques suggestions d\'amélioration. Voici mes commentaires en pièce jointe.',
      timestamp: '2024-03-22T14:45:00Z',
      attachments: [{ name: 'commentaires_beges.pdf', size: '1.2 MB' }]
    }
  ];

  useEffect(() => {
    // Charger les collaborateurs
    // dispatch(getCollaborators());
    
    // Simulation de chargement pour le développement
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenInviteDialog = () => {
    setOpenInviteDialog(true);
  };

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false);
  };

  const handleOpenShareDialog = () => {
    setOpenShareDialog(true);
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };

  const handleInviteFormChange = (e) => {
    const { name, value } = e.target;
    setInviteForm({
      ...inviteForm,
      [name]: value
    });
  };

  const handleShareFormChange = (e) => {
    const { name, value } = e.target;
    setShareForm({
      ...shareForm,
      [name]: value
    });
  };

  const handleSendInvite = () => {
    // Simulation d'envoi d'invitation pour le développement
    console.log('Envoi d\'invitation à:', inviteForm);
    
    // En production, on utiliserait:
    // dispatch(inviteCollaborator(inviteForm));
    
    handleCloseInviteDialog();
  };

  const handleShareDocument = () => {
    // Simulation de partage de document pour le développement
    console.log('Partage de document:', shareForm);
    
    // En production, on utiliserait une action Redux appropriée
    
    handleCloseShareDialog();
  };

  const getRoleChip = (role) => {
    switch (role) {
      case 'admin':
        return <Chip size="small" color="error" label="Administrateur" />;
      case 'editor':
        return <Chip size="small" color="primary" label="Éditeur" />;
      case 'viewer':
        return <Chip size="small" color="success" label="Lecteur" />;
      default:
        return <Chip size="small" label={role} />;
    }
  };

  const getAccessLevelChip = (accessLevel) => {
    switch (accessLevel) {
      case 'edit':
        return <Chip size="small" color="primary" label="Modification" />;
      case 'view':
        return <Chip size="small" color="success" label="Lecture seule" />;
      default:
        return <Chip size="small" label={accessLevel} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderCollaboratorsTab = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Collaborateurs ({mockCollaborators.length})
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            onClick={handleOpenInviteDialog}
          >
            Inviter
          </Button>
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Entreprise</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Dernière activité</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockCollaborators.map((collaborator) => (
                <TableRow key={collaborator.id}>
                  <TableCell>{collaborator.name}</TableCell>
                  <TableCell>{collaborator.email}</TableCell>
                  <TableCell>{collaborator.company}</TableCell>
                  <TableCell>{getRoleChip(collaborator.role)}</TableCell>
                  <TableCell>{formatDate(collaborator.lastActive)}</TableCell>
                  <TableCell>
                    <Tooltip title="Partager un document">
                      <IconButton size="small" color="primary" onClick={handleOpenShareDialog}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderSharedDocumentsTab = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Documents partagés ({mockSharedDocuments.length})
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ShareIcon />}
            onClick={handleOpenShareDialog}
          >
            Partager un document
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {mockSharedDocuments.map((document) => (
            <Grid item xs={12} md={6} key={document.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {document.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Type: {document.type === 'report' ? 'Rapport' : 'Données d\'émissions'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Partagé le: {formatDate(document.createdAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Expire le: {formatDate(document.expiryDate)}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Partagé avec:
                  </Typography>
                  <List dense>
                    {document.sharedWith.map((person) => (
                      <ListItem key={person.id}>
                        <ListItemAvatar>
                          <Avatar>{person.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={person.name} 
                          secondary={person.email} 
                        />
                        {getAccessLevelChip(person.accessLevel)}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<ShareIcon />}>
                    Modifier le partage
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderMessagesTab = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Messages ({mockMessages.length})
          </Typography>
        </Box>
        
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <List>
            {mockMessages.map((message, index) => (
              <React.Fragment key={message.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{message.sender.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">
                          {message.sender.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(message.timestamp)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.primary">
                          {message.content}
                        </Typography>
                        {message.attachments.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            {message.attachments.map((attachment, i) => (
                              <Chip
                                key={i}
                                icon={<AttachFileIcon />}
                                label={`${attachment.name} (${attachment.size})`}
                                variant="outlined"
                                size="small"
                                sx={{ mr: 1, mt: 1 }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < mockMessages.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
        
        <Paper elevation={1} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Écrivez votre message ici..."
              variant="outlined"
              sx={{ mr: 2 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                sx={{ mb: 1 }}
              >
                Envoyer
              </Button>
              <Button
                variant="outlined"
                startIcon={<AttachFileIcon />}
              >
                Joindre
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Espace Collaboratif
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Partagez vos données et rapports avec vos collaborateurs en toute sécurité, conformément au RGPD.
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab icon={<GroupIcon />} label="Collaborateurs" />
            <Tab icon={<ShareIcon />} label="Documents partagés" />
            <Tab icon={<CommentIcon />} label="Messages" />
          </Tabs>
        </Box>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Chargement des données...</Typography>
          </Box>
        ) : (
          <Box>
            {activeTab === 0 && renderCollaboratorsTab()}
            {activeTab === 1 && renderSharedDocumentsTab()}
            {activeTab === 2 && renderMessagesTab()}
          </Box>
        )}
      </Paper>
      
      {/* Dialogue d'invitation */}
      <Dialog open={openInviteDialog} onClose={handleCloseInviteDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Inviter un collaborateur</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Adresse email"
                  type="email"
                  value={inviteForm.email}
                  onChange={handleInviteFormChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="role-label">Rôle</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={inviteForm.role}
                    label="Rôle"
                    onChange={handleInviteFormChange}
                  >
                    <MenuItem value="admin">Administrateur</MenuItem>
                    <MenuItem value="editor">Éditeur</MenuItem>
                    <MenuItem value="viewer">Lecteur</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="message"
                  name="message"
                  label="Message personnalisé (optionnel)"
                  multiline
                  rows={4}
                  value={inviteForm.message}
                  onChange={handleInviteFormChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleSendInvite}
            startIcon={<SendIcon />}
          >
            Envoyer l'invitation
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de partage */}
      <Dialog open={openShareDialog} onClose={handleCloseShareDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Partager un document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="document-type-label">Type de document</InputLabel>
                  <Select
                    labelId="document-type-label"
                    id="documentType"
                    name="documentType"
                    value={shareForm.documentType}
                    label="Type de document"
                    onChange={handleShareFormChange}
                  >
                    <MenuItem value="emissions">Données d'émissions</MenuItem>
                    <MenuItem value="report">Rapport</MenuItem>
                    <MenuItem value="action-plan">Plan d'action</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="document-id-label">Document</InputLabel>
                  <Select
                    labelId="document-id-label"
                    id="documentId"
                    name="documentId"
                    value={shareForm.documentId}
                    label="Document"
                    onChange={handleShareFormChange}
                  >
                    <MenuItem value="1">BEGES 2024</MenuItem>
                    <MenuItem value="2">Rapport CSRD Semestriel</MenuItem>
                    <MenuItem value="3">Données Scope 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="access-level-label">Niveau d'accès</InputLabel>
                  <Select
                    labelId="access-level-label"
                    id="accessLevel"
                    name="accessLevel"
                    value={shareForm.accessLevel}
                    label="Niveau d'accès"
                    onChange={handleShareFormChange}
                  >
                    <MenuItem value="view">Lecture seule</MenuItem>
                    <MenuItem value="edit">Modification</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="expiryDate"
                  name="expiryDate"
                  label="Date d'expiration"
                  type="date"
                  value={shareForm.expiryDate}
                  onChange={handleShareFormChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <LockIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Le partage est sécurisé et conforme au RGPD. Les données sont chiffrées et les accès sont tracés.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShareDialog}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleShareDocument}
            startIcon={<ShareIcon />}
          >
            Partager
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Collaboration;

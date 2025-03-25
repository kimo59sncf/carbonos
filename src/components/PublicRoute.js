import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Composant pour les routes publiques (accessibles sans authentification)
const PublicRoute = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // Si l'utilisateur est déjà authentifié, rediriger vers le tableau de bord
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Sinon, afficher les routes publiques
  return <Outlet />;
};

export default PublicRoute;

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const checkAuth = async () => {
      try {
        // Vérifier les cookies côté client d'abord
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('carbonos-auth='));

        if (authCookie) {
          try {
            const userData = authCookie.split('=')[1];
            const user = JSON.parse(decodeURIComponent(userData));
            console.log('Utilisateur trouvé dans les cookies:', user.email);
            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          } catch (cookieError) {
            console.error('Erreur parsing cookie auth:', cookieError);
          }
        }

        // Puis vérifier côté serveur avec l'API
        try {
          const response = await fetch('/api/user', {
            credentials: 'include',
            headers: {
              'x-client-cookie': authCookie ? authCookie.split('=')[1] : '',
            },
          });

          if (response.ok) {
            const user = await response.json();
            console.log('Utilisateur confirmé par l\'API:', user.email);
            setAuthState({
              user,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }
        } catch (apiError) {
          console.error('Erreur API user:', apiError);
        }

        // Pas d'authentification trouvée
        console.log('Aucune authentification trouvée');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });

      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour les cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Les cookies sont automatiquement définis par l'API
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true, message: data.message || 'Connexion réussie' };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, message: data.error || 'Erreur de connexion' };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: 'Erreur de connexion' };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    company: string;
  }): Promise<{ success: boolean; message: string }> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('carbonos-user', JSON.stringify(data.user));
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });

        return { success: true, message: data.message || 'Inscription réussie' };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, message: data.error || 'Erreur lors de l\'inscription' };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: 'Erreur lors de l\'inscription' };
    }
  };

  const logout = async () => {
    try {
      // Appeler l'API de déconnexion
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }

    // Nettoyer les cookies côté client
    document.cookie = 'carbonos-auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push('/');
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
}
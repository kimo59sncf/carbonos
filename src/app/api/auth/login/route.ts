import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RegisteredUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'users.json');

// Fonction pour lire les utilisateurs inscrits
function getRegisteredUsers(): RegisteredUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture utilisateurs:', error);
    return [];
  }
}

// Fonction pour sauvegarder un utilisateur
function saveRegisteredUser(user: RegisteredUser): void {
  try {
    const users = getRegisteredUsers();
    users.push(user);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erreur sauvegarde utilisateur:', error);
  }
}

// Fonction de hashage simple (pour la démonstration)
function hashPassword(password: string): string {
  // Hash simple - en production utiliser bcrypt
  return Buffer.from(password).toString('base64');
}

// Fonction de vérification du mot de passe
function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation basique
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Récupérer les utilisateurs inscrits
    const registeredUsers = getRegisteredUsers();

    // Vérifier d'abord les utilisateurs inscrits
    const registeredUser = registeredUsers.find(user => user.email === email);
    if (registeredUser && verifyPassword(password, registeredUser.password)) {
      const user = {
        id: registeredUser.id,
        email: registeredUser.email,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        company: registeredUser.company,
      };

      const response = NextResponse.json({
        success: true,
        user,
        message: 'Connexion réussie'
      });

      response.cookies.set('carbonos-auth', JSON.stringify(user), {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });

      console.log('Utilisateur inscrit connecté:', user.email);
      return response;
    }

    // Vérifier les comptes de démonstration
    if (email === 'demo@carbonos.com' && password === 'demo123') {
      const user = {
        id: '1',
        email,
        firstName: 'Utilisateur',
        lastName: 'Demo',
        company: 'CarbonOS Demo',
      };

      const response = NextResponse.json({
        success: true,
        user,
        message: 'Connexion réussie'
      });

      response.cookies.set('carbonos-auth', JSON.stringify(user), {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });

      console.log('Utilisateur démo connecté:', user.email);
      return response;
    }

    // Vérifier le compte admin de démonstration
    if (email === 'admin@carbonos.com' && password === 'admin123') {
      const user = {
        id: '2',
        email,
        firstName: 'Administrateur',
        lastName: 'CarbonOS',
        company: 'CarbonOS Admin',
      };

      const response = NextResponse.json({
        success: true,
        user,
        message: 'Connexion administrateur réussie'
      });

      response.cookies.set('carbonos-auth', JSON.stringify(user), {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });

      return response;
    }

    // Essai avec le backend externe (si disponible)
    try {
      const backendResponse = await fetch('http://localhost:5000/api/direct-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();

        if (backendData.success && backendData.user) {
          const response = NextResponse.json({
            success: true,
            user: {
              id: backendData.user.id.toString(),
              email: backendData.user.email,
              firstName: backendData.user.firstName,
              lastName: backendData.user.lastName,
              company: 'CarbonOS Entreprise'
            },
            message: backendData.message || 'Connexion réussie'
          });

          response.cookies.set('carbonos-auth', JSON.stringify(backendData.user), {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
          });

          return response;
        }
      }
    } catch (backendError) {
      console.log('Backend externe non disponible');
    }

    return NextResponse.json(
      { error: 'Identifiants incorrects' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
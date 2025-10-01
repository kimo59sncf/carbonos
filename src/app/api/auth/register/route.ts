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

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, company } = await request.json();

    // Validation basique
    if (!firstName || !lastName || !email || !password || !company) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUsers = getRegisteredUsers();
    const existingUser = existingUsers.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Créer le nouvel utilisateur
    const newUser: RegisteredUser = {
      id: Date.now().toString(),
      email,
      password: hashPassword(password),
      firstName,
      lastName,
      company,
      createdAt: new Date().toISOString(),
    };

    // Sauvegarder l'utilisateur
    saveRegisteredUser(newUser);

    const user = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      company: newUser.company,
    };

    console.log('Nouvel utilisateur inscrit:', user.email);
    return NextResponse.json({
      success: true,
      user,
      message: 'Compte créé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
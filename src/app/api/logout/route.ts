import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    });

    // Supprimer le cookie d'authentification
    response.cookies.set('carbonos-auth', '', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 0, // Expire immédiatement
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
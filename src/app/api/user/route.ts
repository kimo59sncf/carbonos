import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Vérifier les cookies d'authentification côté serveur
    const cookies = request.headers.get('cookie') || '';
    const authCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('carbonos-auth='));

    if (authCookie) {
      try {
        const userData = authCookie.split('=')[1];
        const user = JSON.parse(decodeURIComponent(userData));

        console.log('Utilisateur authentifié trouvé:', user.email);
        return NextResponse.json(user);
      } catch (cookieError) {
        console.error('Erreur parsing cookie auth:', cookieError);
      }
    }

    // Vérifier si on a un cookie côté client (pour les appels AJAX)
    const clientCookie = request.headers.get('x-client-cookie');
    if (clientCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(clientCookie));
        console.log('Utilisateur trouvé via header client:', user.email);
        return NextResponse.json(user);
      } catch (error) {
        console.error('Erreur parsing client cookie:', error);
      }
    }

    // Essai avec le backend externe (si disponible)
    try {
      const backendResponse = await fetch('http://localhost:5000/api/user', {
        headers: {
          'Cookie': cookies,
        },
      });

      if (backendResponse.ok) {
        const user = await backendResponse.json();
        return NextResponse.json(user);
      }
    } catch (backendError) {
      console.log('Backend user API non disponible');
    }

    console.log('Aucun utilisateur authentifié trouvé');
    return NextResponse.json(
      { error: 'Non authentifié' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erreur lors de la vérification utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
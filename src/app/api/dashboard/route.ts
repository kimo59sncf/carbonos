import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    // Essaie d'abord de récupérer les vraies données du backend
    try {
      const backendUrl = `http://localhost:5000/api/dashboard-direct${username ? `?username=${username}` : ''}`;
      const backendResponse = await fetch(backendUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        return NextResponse.json(backendData);
      }
    } catch (backendError) {
      console.log('Backend non disponible, utilisation des données de démonstration');
    }

    // Données de démonstration si le backend n'est pas disponible
    const dashboardData = {
      summary: {
        scope1: 2450,
        scope2: 1230,
        scope3: 5670,
        total: 9350
      },
      emissionTrend: [
        { year: 2022, period: 'Annuel', scope1: 2800, scope2: 1400, scope3: 6200, total: 10400 },
        { year: 2023, period: 'Annuel', scope1: 2600, scope2: 1300, scope3: 5900, total: 9800 },
        { year: 2024, period: 'Prévisionnel', scope1: 2450, scope2: 1230, scope3: 5670, total: 9350 }
      ],
      deadlines: [
        {
          name: "BEGES",
          description: "Bilan d'Émissions de Gaz à Effet de Serre",
          dueDate: "2023-12-31",
          status: "pending"
        },
        {
          name: "CSRD",
          description: "Corporate Sustainability Reporting Directive",
          dueDate: "2023-05-15",
          status: "completed"
        }
      ],
      benchmarks: [
        {
          indicator: "Émissions totales / CA",
          value: "42 tCO₂e/M€",
          average: "56 tCO₂e/M€",
          position: "top25"
        },
        {
          indicator: "Émissions totales / employé",
          value: "8.1 tCO₂e/employé",
          average: "7.3 tCO₂e/employé",
          position: "median"
        }
      ]
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Erreur lors de la récupération du dashboard:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
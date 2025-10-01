/**
 * Spécification OpenAPI pour CarbonOS API
 * Documentation complète et interactive
 */

export const openAPISpec = {
  openapi: '3.0.3',
  info: {
    title: 'CarbonOS API',
    description: 'API complète pour la plateforme de gestion carbone CarbonOS',
    version: '2.0.0',
    contact: {
      name: 'API Support',
      email: 'api@carbonos.fr',
      url: 'https://carbonos.fr/support',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      description: 'Serveur de développement',
    },
    {
      url: 'https://api.carbonos.fr',
      description: 'Serveur de production',
    },
  ],
  security: [
    {
      bearerAuth: [],
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      // Schémas de données
      Company: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          sector: { type: 'string' },
          sectorCode: { type: 'string' },
          employeeCount: { type: 'integer' },
          address: { type: 'string' },
          postalCode: { type: 'string' },
          city: { type: 'string' },
          country: { type: 'string', default: 'France' },
          siret: { type: 'string' },
          dpoName: { type: 'string' },
          dpoEmail: { type: 'string' },
          dpoPhone: { type: 'string' },
          dpoIsExternal: { type: 'boolean' },
        },
      },
      EmissionData: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          companyId: { type: 'integer' },
          reportingPeriod: { type: 'string' },
          reportingYear: { type: 'integer' },
          submittedBy: { type: 'integer' },
          submittedAt: { type: 'string', format: 'date-time' },
          validatedBy: { type: 'integer' },
          validatedAt: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['draft', 'submitted', 'validated', 'rejected'] },
          scope1Total: { type: 'number' },
          scope2Total: { type: 'number' },
          scope3Total: { type: 'number' },
          totalEmissions: { type: 'number' },
          methodologyNotes: { type: 'string' },
        },
      },
      EmissionDetail: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          emissionDataId: { type: 'integer' },
          source: { type: 'string' },
          scope: { type: 'string', enum: ['1', '2', '3'] },
          category: { type: 'string' },
          value: { type: 'number' },
          unit: { type: 'string', default: 'tCO2e' },
          notes: { type: 'string' },
        },
      },
      Report: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          companyId: { type: 'integer' },
          name: { type: 'string' },
          type: { type: 'string' },
          year: { type: 'integer' },
          createdBy: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          status: { type: 'string', enum: ['draft', 'published', 'archived'] },
          data: { type: 'object' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          username: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin', 'validator'] },
          companyId: { type: 'integer' },
          lastLogin: { type: 'string', format: 'date-time' },
          consentDataProcessing: { type: 'boolean' },
          isActive: { type: 'boolean' },
        },
      },
      // Schémas de requête
      CreateCompanyRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          sector: { type: 'string' },
          sectorCode: { type: 'string' },
          employeeCount: { type: 'integer' },
          address: { type: 'string' },
          postalCode: { type: 'string' },
          city: { type: 'string' },
          country: { type: 'string' },
          siret: { type: 'string' },
          dpoName: { type: 'string' },
          dpoEmail: { type: 'string' },
          dpoPhone: { type: 'string' },
          dpoIsExternal: { type: 'boolean' },
        },
      },
      CreateEmissionDataRequest: {
        type: 'object',
        required: ['companyId', 'reportingPeriod', 'reportingYear'],
        properties: {
          companyId: { type: 'integer' },
          reportingPeriod: { type: 'string' },
          reportingYear: { type: 'integer' },
          scope1Total: { type: 'number' },
          scope2Total: { type: 'number' },
          scope3Total: { type: 'number' },
          totalEmissions: { type: 'number' },
          methodologyNotes: { type: 'string' },
        },
      },
      // Schémas de réponse
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object' },
          message: { type: 'string' },
          errors: { type: 'array', items: { type: 'string' } },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', default: false },
          error: { type: 'string' },
          code: { type: 'string' },
          details: { type: 'object' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { type: 'object' } },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
      },
    },
  },
  paths: {
    // Companies endpoints
    '/api/companies': {
      get: {
        summary: 'Liste des entreprises',
        description: 'Récupère la liste de toutes les entreprises',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Liste des entreprises',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Company' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
      post: {
        summary: 'Créer une entreprise',
        description: 'Crée une nouvelle entreprise',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCompanyRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Entreprise créée',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Company' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequestError' },
          401: { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
    },
    '/api/companies/{id}': {
      get: {
        summary: 'Détails d\'une entreprise',
        description: 'Récupère les détails d\'une entreprise spécifique',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Détails de l\'entreprise',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Company' },
                      },
                    },
                  ],
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFoundError' },
          401: { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
      put: {
        summary: 'Mettre à jour une entreprise',
        description: 'Met à jour les informations d\'une entreprise',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateCompanyRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Entreprise mise à jour',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Company' },
                      },
                    },
                  ],
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFoundError' },
          401: { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
      delete: {
        summary: 'Supprimer une entreprise',
        description: 'Supprime une entreprise (admin uniquement)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          204: { description: 'Entreprise supprimée' },
          404: { $ref: '#/components/responses/NotFoundError' },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
        },
      },
    },

    // Emissions endpoints
    '/api/emissions': {
      get: {
        summary: 'Liste des données d\'émissions',
        description: 'Récupère les données d\'émissions avec filtres',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'companyId',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'year',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['draft', 'submitted', 'validated', 'rejected'] },
          },
        ],
        responses: {
          200: {
            description: 'Données d\'émissions',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/EmissionData' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
      post: {
        summary: 'Créer des données d\'émissions',
        description: 'Crée de nouvelles données d\'émissions',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateEmissionDataRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Données d\'émissions créées',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/EmissionData' },
                      },
                    },
                  ],
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequestError' },
          401: { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
    },

    // Export endpoints
    '/api/export': {
      post: {
        summary: 'Exporter un rapport',
        description: 'Génère et télécharge un rapport au format demandé',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['data', 'options'],
                properties: {
                  data: { type: 'object' },
                  options: {
                    type: 'object',
                    properties: {
                      format: { type: 'string', enum: ['pdf', 'excel', 'csv', 'json'] },
                      template: { type: 'string', enum: ['standard', 'detailed', 'executive', 'regulatory'] },
                      includeCharts: { type: 'boolean' },
                      includeBenchmarks: { type: 'boolean' },
                      language: { type: 'string', enum: ['fr', 'en'] },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Rapport généré',
            content: {
              'application/pdf': { schema: { type: 'string', format: 'binary' } },
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
                schema: { type: 'string', format: 'binary' }
              },
              'text/csv': { schema: { type: 'string', format: 'binary' } },
              'application/json': { schema: { type: 'string', format: 'binary' } },
            },
          },
          400: { $ref: '#/components/responses/BadRequestError' },
          401: { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
    },

    // Carbon API endpoints
    '/api/carbon/factors': {
      get: {
        summary: 'Facteurs d\'émission',
        description: 'Récupère les facteurs d\'émission pour une activité',
        parameters: [
          {
            name: 'activity',
            in: 'query',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Facteurs d\'émission',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    factors: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          category: { type: 'string' },
                          unit: { type: 'string' },
                          factor: { type: 'number' },
                          source: { type: 'string' },
                          lastUpdated: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/carbon/calculate': {
      post: {
        summary: 'Calculer les émissions',
        description: 'Calcule les émissions pour une activité donnée',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['activity', 'quantity', 'unit'],
                properties: {
                  activity: { type: 'string' },
                  quantity: { type: 'number' },
                  unit: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Résultat du calcul',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    activity: { type: 'string' },
                    quantity: { type: 'number' },
                    unit: { type: 'string' },
                    factor: { type: 'number' },
                    emissions: { type: 'number' },
                    uncertainty: { type: 'number' },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequestError' },
        },
      },
    },

    // WebSocket endpoint pour la documentation
    '/api/websocket': {
      get: {
        summary: 'WebSocket endpoint',
        description: 'Point d\'entrée pour les connexions WebSocket temps réel',
        responses: {
          101: {
            description: 'Connexion WebSocket établie',
          },
        },
      },
    },
  },
  responses: {
    BadRequestError: {
      description: 'Requête invalide',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
    UnauthorizedError: {
      description: 'Non autorisé',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
    ForbiddenError: {
      description: 'Accès interdit',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
    NotFoundError: {
      description: 'Ressource non trouvée',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' },
        },
      },
    },
  },
  tags: [
    {
      name: 'companies',
      description: 'Gestion des entreprises',
    },
    {
      name: 'emissions',
      description: 'Gestion des données d\'émissions',
    },
    {
      name: 'reports',
      description: 'Gestion des rapports',
    },
    {
      name: 'export',
      description: 'Fonctionnalités d\'export',
    },
    {
      name: 'carbon',
      description: 'APIs carbone externes',
    },
    {
      name: 'websocket',
      description: 'Communication temps réel',
    },
  ],
};

/**
 * Génère la documentation HTML interactive
 */
export function generateAPIDocs(): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CarbonOS API Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #f8fafc;
        }
        .header {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 2rem 0;
            text-align: center;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        .endpoint {
            background: white;
            margin: 1rem 0;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #22c55e;
        }
        .method {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        .get { background: #dbeafe; color: #1e40af; }
        .post { background: #dcfce7; color: #166534; }
        .put { background: #fef3c7; color: #92400e; }
        .delete { background: #fee2e2; color: #dc2626; }
        .path {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 1.1rem;
            margin: 0.5rem 0;
        }
        .description {
            color: #64748b;
            margin: 0.5rem 0;
        }
        .schema {
            background: #f1f5f9;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.875rem;
            overflow-x: auto;
        }
        .tag {
            display: inline-block;
            background: #e2e8f0;
            color: #475569;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            margin-right: 0.5rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 CarbonOS API Documentation</h1>
        <p>API complète pour la plateforme de gestion carbone - Version 2.0.0</p>
    </div>

    <div class="container">
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2>📋 Endpoints Disponibles</h2>
            <p>Découvrez toutes les fonctionnalités de l'API CarbonOS</p>
        </div>

        ${Object.entries(openAPISpec.paths).map(([path, methods]) => `
            <div class="endpoint">
                ${Object.entries(methods as any).map(([method, config]: [string, any]) => `
                    <div class="method ${method}">${method.toUpperCase()}</div>
                    <div class="path">${path}</div>
                    <div class="description">${config.summary || 'No description'}</div>
                    ${config.description ? `<p>${config.description}</p>` : ''}

                    ${config.parameters ? `
                        <h4>Parameters:</h4>
                        <ul>
                            ${config.parameters.map((param: any) => `
                                <li><code>${param.name}</code> (${param.in}): ${param.schema?.type || 'any'} - ${param.description || ''}</li>
                            `).join('')}
                        </ul>
                    ` : ''}

                    ${config.requestBody ? `
                        <h4>Request Body:</h4>
                        <div class="schema">${JSON.stringify(config.requestBody.content['application/json'].schema, null, 2)}</div>
                    ` : ''}

                    <div style="margin-top: 1rem;">
                        <strong>Responses:</strong>
                        ${Object.entries(config.responses).map(([code, response]: [string, any]) => `
                            <div><code>${code}</code>: ${response.description || 'No description'}</div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
}

/**
 * Génère le schéma JSON pour les tests automatisés
 */
export function generateTestSchema(): string {
  return JSON.stringify({
    info: {
      name: 'CarbonOS API Tests',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    variable: [
      {
        key: 'baseUrl',
        value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
    ],
    item: [
      {
        name: 'Companies',
        item: [
          {
            name: 'Get Companies',
            request: {
              method: 'GET',
              header: [],
              url: {
                raw: '{{baseUrl}}/api/companies',
                host: ['{{baseUrl}}'],
                path: ['api', 'companies'],
              },
            },
          },
          {
            name: 'Create Company',
            request: {
              method: 'POST',
              header: [
                {
                  key: 'Content-Type',
                  value: 'application/json',
                },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  name: 'Test Company',
                  sector: 'Technologie',
                  employeeCount: 100,
                }, null, 2),
              },
              url: {
                raw: '{{baseUrl}}/api/companies',
                host: ['{{baseUrl}}'],
                path: ['api', 'companies'],
              },
            },
          },
        ],
      },
      {
        name: 'Emissions',
        item: [
          {
            name: 'Get Emissions',
            request: {
              method: 'GET',
              header: [],
              url: {
                raw: '{{baseUrl}}/api/emissions',
                host: ['{{baseUrl}}'],
                path: ['api', 'emissions'],
              },
            },
          },
        ],
      },
      {
        name: 'Export',
        item: [
          {
            name: 'Export PDF Report',
            request: {
              method: 'POST',
              header: [
                {
                  key: 'Content-Type',
                  value: 'application/json',
                },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  data: {
                    companyName: 'Test Company',
                    sector: 'Technologie',
                    period: '2023',
                    emissions: {
                      scope1: 100,
                      scope2: 50,
                      scope3: 200,
                      total: 350,
                    },
                  },
                  options: {
                    format: 'pdf',
                    template: 'standard',
                  },
                }, null, 2),
              },
              url: {
                raw: '{{baseUrl}}/api/export',
                host: ['{{baseUrl}}'],
                path: ['api', 'export'],
              },
            },
          },
        ],
      },
    ],
  }, null, 2);
}
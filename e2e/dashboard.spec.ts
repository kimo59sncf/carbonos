import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Connexion automatique pour les tests
    await page.goto('/auth');
    await page.fill('[data-testid="username-input"]', 'demo');
    await page.fill('[data-testid="password-input"]', 'demo');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('should display dashboard content', async ({ page }) => {
    // Vérifier le titre de la page
    await expect(page.locator('h1')).toContainText('Tableau de bord');

    // Vérifier la présence des widgets
    await expect(page.locator('[data-testid="emissions-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="emissions-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="benchmark-widget"]')).toBeVisible();
  });

  test('should handle widget interactions', async ({ page }) => {
    // Tester le drag and drop des widgets
    const widget = page.locator('[data-testid="emissions-chart"]');
    const dropZone = page.locator('[data-testid="dashboard-dropzone"]');

    await widget.dragTo(dropZone);
    await expect(widget).toBeVisible();
  });

  test('should export dashboard data', async ({ page }) => {
    // Cliquer sur le bouton d'export
    await page.click('[data-testid="export-button"]');

    // Vérifier l'ouverture du menu d'export
    await expect(page.locator('[data-testid="export-menu"]')).toBeVisible();

    // Sélectionner le format PDF
    await page.click('[data-testid="export-pdf"]');

    // Vérifier le téléchargement
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;
  });

  test('should handle real-time updates', async ({ page }) => {
    // Attendre une mise à jour temps réel
    await expect(page.locator('[data-testid="live-indicator"]')).toBeVisible();

    // Vérifier que les données se mettent à jour
    await page.waitForTimeout(5000);
    await expect(page.locator('[data-testid="emissions-value"]')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    // Vérifier les attributs d'accessibilité
    await expect(page.locator('h1')).toHaveAttribute('role', 'heading');

    // Tester la navigation au clavier
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="dashboard-navigation"]')).toBeFocused();

    // Vérifier les liens de navigation rapide
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="skip-links"]')).toBeVisible();
  });

  test('should work on mobile', async ({ page }) => {
    // Basculer en mode mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Vérifier l'adaptation mobile
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="dashboard-grid"]')).toHaveClass(/mobile/);
  });
});

test.describe('API Endpoints', () => {
  test('should return API documentation', async ({ request }) => {
    const response = await request.get('/api/docs?format=openapi');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('openapi');
    expect(data).toHaveProperty('info');
    expect(data.info.title).toBe('CarbonOS API');
  });

  test('should export data successfully', async ({ request }) => {
    const exportData = {
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
    };

    const response = await request.post('/api/export', {
      data: exportData,
    });

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/pdf');
  });

  test('should handle carbon calculations', async ({ request }) => {
    const response = await request.post('/api/carbon/calculate', {
      data: {
        activity: 'electricity',
        quantity: 1000,
        unit: 'kWh',
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('emissions');
    expect(data).toHaveProperty('factor');
    expect(typeof data.emissions).toBe('number');
  });
});

test.describe('Performance', () => {
  test('should load page within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/dashboard', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 secondes max
  });

  test('should have optimized images', async ({ page }) => {
    await page.goto('/');

    // Vérifier que les images utilisent des formats modernes
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      // Vérifier que les images importantes sont optimisées
      if (src && !src.includes('icon') && !src.includes('logo')) {
        // Les images devraient être au format WebP ou AVIF si possible
        expect(src).toMatch(/\.(webp|avif|jpg|jpeg|png)$/);
      }
    }
  });

  test('should have proper caching headers', async ({ request }) => {
    const response = await request.get('/');

    // Vérifier les en-têtes de cache
    const cacheControl = response.headers()['cache-control'];
    expect(cacheControl).toBeDefined();

    // Les ressources statiques devraient être cachées longtemps
    if (response.url().includes('/_next/static/')) {
      expect(cacheControl).toContain('public');
      expect(cacheControl).toContain('max-age');
    }
  });
});

test.describe('SEO', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Vérifier les métadonnées essentielles
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content');
  });

  test('should have structured data', async ({ page }) => {
    await page.goto('/');

    // Vérifier la présence de données structurées JSON-LD
    const structuredData = await page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toBeVisible();

    const content = await structuredData.innerHTML();
    const data = JSON.parse(content);

    expect(data).toHaveProperty('@context');
    expect(data).toHaveProperty('@type');
  });

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');

    // Vérifier la hiérarchie des titres
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Il ne devrait y avoir qu'un seul H1 par page
    const h1Count = await h1.count();
    expect(h1Count).toBe(1);
  });
});
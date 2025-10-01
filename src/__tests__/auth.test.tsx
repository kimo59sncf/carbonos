import { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '@/hooks/use-auth';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Test component
function TestAuthComponent() {
  const { login, register, logout, isAuthenticated, user, isLoading } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <div data-testid="user-email">{user?.email || 'No user'}</div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not loading'}</div>

      <button
        data-testid="login-btn"
        onClick={() => login('test@example.com', 'password123')}
      >
        Login
      </button>

      <button
        data-testid="register-btn"
        onClick={() => register({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: 'password123',
          company: 'Test Company'
        })}
      >
        Register
      </button>

      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('Authentication', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should show not authenticated initially', () => {
    render(<TestAuthComponent />);
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
  });

  it('should handle login successfully', async () => {
    // Mock successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          },
          message: 'Connexion réussie'
        }),
      })
    ) as jest.Mock;

    render(<TestAuthComponent />);

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });

  it('should handle login failure', async () => {
    // Mock failed API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          error: 'Identifiants incorrects'
        }),
      })
    ) as jest.Mock;

    render(<TestAuthComponent />);

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });
  });

  it('should handle logout', async () => {
    // First login
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          },
        }),
      })
    ) as jest.Mock;

    render(<TestAuthComponent />);

    // Login first
    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Then logout
    fireEvent.click(screen.getByTestId('logout-btn'));

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
  });

  it('should handle register successfully', async () => {
    // Mock successful register API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          user: {
            id: '2',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            company: 'Test Company'
          },
          message: 'Compte créé avec succès'
        }),
      })
    ) as jest.Mock;

    render(<TestAuthComponent />);

    fireEvent.click(screen.getByTestId('register-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });

  it('should handle register API failure', async () => {
    // Mock failed register API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          error: 'Tous les champs sont requis'
        }),
      })
    ) as jest.Mock;

    render(<TestAuthComponent />);

    fireEvent.click(screen.getByTestId('register-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });
  });
});
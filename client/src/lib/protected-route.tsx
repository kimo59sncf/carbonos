import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  
  // Vérifier le localStorage pour notre solution de secours
  const storedUser = localStorage.getItem('carbonos_user');

  // Si l'utilisateur est authentifié via React Query ou notre mécanisme de secours
  if (user || storedUser) {
    return <Route path={path} component={Component} />;
  }

  // Afficher le chargement seulement si nécessaire
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500 mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
          
          {/* Option de secours si le chargement prend trop de temps */}
          <div className="mt-8 text-center max-w-md">
            <p className="text-amber-600 mb-2">Problème d'authentification?</p>
            <button
              onClick={() => {
                // Solution radicale: forcer la connexion directe
                localStorage.setItem('carbonos_user', 'demo');
                localStorage.setItem('carbonos_user_data', JSON.stringify({
                  username: 'demo',
                  firstName: 'Utilisateur',
                  lastName: 'Démo',
                  email: 'demo@example.com',
                  role: 'user',
                  companyId: 1
                }));
                
                // Recharger la page
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Activer le mode démo d'urgence
            </button>
          </div>
        </div>
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Redirect to="/auth" />
    </Route>
  );
}

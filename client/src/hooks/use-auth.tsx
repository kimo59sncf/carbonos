import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Type definitions
type LoginData = Pick<InsertUser, "username" | "password">;

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

// Create context with a default value to avoid null checks
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider component
function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // User data query
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    onSuccess: (data) => {
      console.log("Auth user query successful:", data);
    },
    onError: (error) => {
      console.error("Auth user query error:", error);
    }
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Login attempt with:", credentials.username);
      try {
        const res = await apiRequest("POST", "/api/login", credentials);
        const data = await res.json();
        console.log("Login success, received data:", data);
        return data;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: async (user: SelectUser) => {
      console.log("Login mutation success, updating user data:", user);
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${user.firstName} ${user.lastName}`,
      });
      
      // Ajouter un délai pour laisser le temps aux cookies de s'enregistrer
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force la page à se recharger pour s'assurer que les cookies sont correctement appliqués
      window.location.href = "/";
    },
    onError: (error: Error) => {
      console.error("Login mutation error:", error);
      toast({
        title: "Échec de la connexion",
        description: "Nom d'utilisateur ou mot de passe incorrect",
        variant: "destructive",
      });
    },
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      console.log("Registration attempt with:", credentials.username);
      try {
        const res = await apiRequest("POST", "/api/register", credentials);
        const data = await res.json();
        console.log("Registration success, received data:", data);
        return data;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    onSuccess: async (user: SelectUser) => {
      console.log("Registration mutation success, updating user data:", user);
      queryClient.setQueryData(["/api/user"], user);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });
      
      // Ajouter un délai pour laisser le temps aux cookies de s'enregistrer
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force la page à se recharger pour s'assurer que les cookies sont correctement appliqués
      window.location.href = "/";
    },
    onError: (error: Error) => {
      console.error("Registration mutation error:", error);
      toast({
        title: "Échec de l'inscription",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("Logout attempt");
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      console.log("Logout mutation success, clearing user data");
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    },
    onError: (error: Error) => {
      console.error("Logout mutation error:", error);
      toast({
        title: "Échec de la déconnexion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Context value
  const value = {
    user: user ?? null,
    isLoading,
    error,
    loginMutation,
    logoutMutation,
    registerMutation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth context
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Export all components and hooks
export { AuthProvider, useAuth, AuthContext };

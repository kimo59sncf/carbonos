import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-neutral-600 hover:text-primary-500 focus:outline-none"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <Link href="/">
            <a className="flex items-center space-x-2">
              <svg className="w-8 h-8 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
              <span className="text-xl font-bold text-primary-600">CarbonOS</span>
            </a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-neutral-600 hover:text-neutral-800 focus:outline-none relative">
                  <i className="fas fa-bell text-xl"></i>
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">3</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="p-2 font-medium text-neutral-800 border-b">Notifications</div>
                <div className="py-2 max-h-64 overflow-y-auto">
                  <div className="px-3 py-2 hover:bg-neutral-100 cursor-pointer">
                    <div className="font-medium text-sm">Échéance BEGES à venir</div>
                    <div className="text-xs text-neutral-500">Il vous reste 30 jours pour soumettre votre rapport</div>
                  </div>
                  <div className="px-3 py-2 hover:bg-neutral-100 cursor-pointer">
                    <div className="font-medium text-sm">Nouvelles données d'émissions</div>
                    <div className="text-xs text-neutral-500">Les données d'avril ont été importées</div>
                  </div>
                  <div className="px-3 py-2 hover:bg-neutral-100 cursor-pointer">
                    <div className="font-medium text-sm">Mise à jour réglementaire</div>
                    <div className="text-xs text-neutral-500">Nouvelle directive CSRD publiée</div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary-500 cursor-pointer">
                  Voir toutes les notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                    {user?.firstName && user?.lastName ? (
                      <span className="text-sm font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <span className="hidden md:inline-block">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <i className="fas fa-user mr-2"></i>
                  <span>Mon profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="fas fa-cog mr-2"></i>
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  icon: string;
  href: string;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    items: [
      { label: "Tableau de bord", icon: "tachometer-alt", href: "/" },
      { label: "Calcul d'émissions", icon: "calculator", href: "/emissions" },
      { label: "Rapports réglementaires", icon: "file-alt", href: "/reports" },
      { label: "Collaboratif", icon: "users", href: "/collaborative" },
      { label: "Analytics", icon: "chart-line", href: "/analytics" },
      { label: "Profil entreprise", icon: "building", href: "/company" }
    ]
  },
  {
    title: "RGPD",
    items: [
      { label: "Conformité", icon: "shield-alt", href: "/rgpd" },
      { label: "Mes données", icon: "user-lock", href: "/my-data" }
    ]
  },
  {
    items: [
      { label: "Paramètres", icon: "cog", href: "/settings" },
      { label: "Aide", icon: "question-circle", href: "/help" }
    ]
  }
];

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside 
      className={cn(
        "w-64 bg-white shadow-md transition-all duration-300 ease-in-out flex-shrink-0 h-full fixed lg:static z-20 top-0 left-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <nav className="pt-6 pb-8 px-4 h-full overflow-y-auto">
        {sidebarSections.map((section, index) => (
          <div key={index} className={cn(index > 0 && "mt-8 pt-6 border-t border-neutral-200")}>
            {section.title && (
              <h3 className="px-4 mb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium",
                        location === item.href
                          ? "text-primary-600 bg-primary-50"
                          : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      <i className={`fas fa-${item.icon}`}></i>
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

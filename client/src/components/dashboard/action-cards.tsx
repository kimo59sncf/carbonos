import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export interface Deadline {
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

export interface Activity {
  title: string;
  description: string;
  date: string;
}

export interface ComplianceItem {
  title: string;
  status: boolean;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface ActionCardsProps {
  deadlines: Deadline[];
  activities: Activity[];
  complianceItems: ComplianceItem[];
  recommendations: Recommendation[];
  complianceScore: number;
}

export function ActionCards({
  deadlines,
  activities,
  complianceItems,
  recommendations,
  complianceScore
}: ActionCardsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };
  
  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const statusColors = {
    pending: 'bg-warning',
    completed: 'bg-success'
  };
  
  const priorityColors = {
    high: 'bg-primary-500',
    medium: 'bg-secondary-500',
    low: 'bg-neutral-500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {/* Regulatory Deadlines Card */}
      <Card className="flex flex-col">
        <CardHeader className="pb-2 border-b border-neutral-100">
          <CardTitle className="font-medium text-neutral-800">Échéances réglementaires</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          {deadlines.map((deadline, index) => (
            <div 
              key={index} 
              className="mb-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0 last:mb-0"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-neutral-800">{deadline.name}</span>
                {deadline.status === 'pending' ? (
                  <span className="text-white text-xs bg-warning px-2 py-0.5 rounded-full">
                    {getDaysRemaining(deadline.dueDate)} jours
                  </span>
                ) : (
                  <span className="text-white text-xs bg-success px-2 py-0.5 rounded-full">
                    Complété
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-600">{deadline.description} {deadline.status === 'pending' && `avant le ${formatDate(deadline.dueDate)}`}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter className="mt-auto p-4 pt-2 border-t border-neutral-100 bg-neutral-50">
          <Link href="/reports">
            <a className="text-primary-500 hover:text-primary-700 text-sm font-medium">
              Gérer les échéances →
            </a>
          </Link>
        </CardFooter>
      </Card>
      
      {/* Recent Activities Card */}
      <Card className="flex flex-col">
        <CardHeader className="pb-2 border-b border-neutral-100">
          <CardTitle className="font-medium text-neutral-800">Dernières activités</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="mb-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0 last:mb-0"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-neutral-800">{activity.title}</span>
                <span className="text-xs text-neutral-500">{activity.date}</span>
              </div>
              <p className="text-sm text-neutral-600">{activity.description}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter className="mt-auto p-4 pt-2 border-t border-neutral-100 bg-neutral-50">
          <Link href="/activities">
            <a className="text-primary-500 hover:text-primary-700 text-sm font-medium">
              Voir toutes les activités →
            </a>
          </Link>
        </CardFooter>
      </Card>
      
      {/* RGPD Compliance Card */}
      <Card className="flex flex-col">
        <CardHeader className="pb-2 border-b border-neutral-100">
          <CardTitle className="font-medium text-neutral-800">Conformité RGPD</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-neutral-600">Statut global</span>
              <span className="text-success font-medium">{complianceScore}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full" 
                style={{ width: `${complianceScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            {complianceItems.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                {item.status ? (
                  <i className="fas fa-check-circle text-success mr-2"></i>
                ) : (
                  <i className="fas fa-exclamation-circle text-warning mr-2"></i>
                )}
                <span className="text-neutral-700">{item.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="mt-auto p-4 pt-2 border-t border-neutral-100 bg-neutral-50">
          <Link href="/rgpd">
            <a className="text-primary-500 hover:text-primary-700 text-sm font-medium">
              Gérer la conformité RGPD →
            </a>
          </Link>
        </CardFooter>
      </Card>
      
      {/* Recommendations Card */}
      <Card className="flex flex-col">
        <CardHeader className="pb-2 border-b border-neutral-100">
          <CardTitle className="font-medium text-neutral-800">Recommandations</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          {recommendations.map((recommendation, index) => (
            <div 
              key={index} 
              className="mb-3 pb-3 border-b border-neutral-100 last:border-0 last:pb-0 last:mb-0"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-neutral-800">{recommendation.title}</span>
                <span className={`text-white text-xs ${priorityColors[recommendation.priority]} px-2 py-0.5 rounded-full`}>
                  {recommendation.priority === 'high' ? 'Élevée' : 
                   recommendation.priority === 'medium' ? 'Moyenne' : 'Faible'}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{recommendation.description}</p>
            </div>
          ))}
        </CardContent>
        <CardFooter className="mt-auto p-4 pt-2 border-t border-neutral-100 bg-neutral-50">
          <Link href="/recommendations">
            <a className="text-primary-500 hover:text-primary-700 text-sm font-medium">
              Voir toutes les recommandations →
            </a>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ActionCards;

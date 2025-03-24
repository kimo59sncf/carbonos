import { Card, CardContent } from "@/components/ui/card";

export interface EmissionSummaryProps {
  scope1: number;
  scope2: number;
  scope3: number;
  scope1Change?: number;
  scope2Change?: number;
  scope3Change?: number;
}

export function EmissionSummary({
  scope1,
  scope2,
  scope3,
  scope1Change,
  scope2Change,
  scope3Change
}: EmissionSummaryProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  const renderTrend = (change?: number) => {
    if (change === undefined) return null;
    
    const isPositive = change > 0;
    const iconClass = isPositive ? "fa-arrow-up" : "fa-arrow-down";
    const colorClass = isPositive ? "text-red-500" : "text-green-500";
    
    return (
      <div className="mt-3 flex items-center">
        <span className={`${colorClass} font-medium flex items-center mr-2`}>
          <i className={`fas ${iconClass} mr-1`}></i>
          {Math.abs(change)}%
        </span>
        <span className="text-neutral-500 text-sm">vs période précédente</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-neutral-500 text-sm font-medium">Scope 1</h3>
            <span className="text-white text-xs font-medium bg-blue-500 rounded-full px-2 py-1">Émissions directes</span>
          </div>
          <div className="flex items-end space-x-3">
            <p className="text-3xl font-bold text-neutral-800">{formatNumber(scope1)}</p>
            <p className="text-sm text-neutral-500 mb-1">tonnes CO₂e</p>
          </div>
          {renderTrend(scope1Change)}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-neutral-500 text-sm font-medium">Scope 2</h3>
            <span className="text-white text-xs font-medium bg-green-500 rounded-full px-2 py-1">Émissions indirectes énergétiques</span>
          </div>
          <div className="flex items-end space-x-3">
            <p className="text-3xl font-bold text-neutral-800">{formatNumber(scope2)}</p>
            <p className="text-sm text-neutral-500 mb-1">tonnes CO₂e</p>
          </div>
          {renderTrend(scope2Change)}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-neutral-500 text-sm font-medium">Scope 3</h3>
            <span className="text-white text-xs font-medium bg-purple-500 rounded-full px-2 py-1">Autres émissions indirectes</span>
          </div>
          <div className="flex items-end space-x-3">
            <p className="text-3xl font-bold text-neutral-800">{formatNumber(scope3)}</p>
            <p className="text-sm text-neutral-500 mb-1">tonnes CO₂e</p>
          </div>
          {renderTrend(scope3Change)}
        </CardContent>
      </Card>
    </div>
  );
}

export default EmissionSummary;

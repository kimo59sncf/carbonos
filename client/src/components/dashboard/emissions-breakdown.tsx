import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';

interface EmissionsBreakdownProps {
  scope1: number;
  scope2: number;
  scope3: number;
}

export function EmissionsBreakdown({ scope1, scope2, scope3 }: EmissionsBreakdownProps) {
  const total = scope1 + scope2 + scope3;
  const formatNumber = (num: number) => num.toLocaleString('fr-FR');
  
  const data = [
    { name: 'Scope 3', value: scope3, color: '#a855f7' },
    { name: 'Scope 2', value: scope2, color: '#22c55e' },
    { name: 'Scope 1', value: scope1, color: '#3b82f6' },
  ];
  
  const COLORS = ['#a855f7', '#22c55e', '#3b82f6'];
  
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-white p-3 border border-neutral-200 shadow-md rounded-md">
          <div className="font-medium">{entry.name}</div>
          <div className="flex items-center space-x-2 text-sm">
            <span>{entry.value} tonnes CO₂e</span>
            <span className="text-neutral-500">
              ({((entry.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle>Répartition des émissions</CardTitle>
        <button className="text-neutral-400 hover:text-primary-500 focus:outline-none">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-3xl font-bold text-neutral-800">{formatNumber(total)}</span>
            <span className="text-sm text-neutral-500">tonnes CO₂e</span>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-neutral-600">Scope 1</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-800">{formatNumber(scope1)}</span>
              <span className="text-xs text-neutral-500">tonnes CO₂e</span>
              <span className="text-xs text-neutral-400">({((scope1 / total) * 100).toFixed(0)}%)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-neutral-600">Scope 2</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-800">{formatNumber(scope2)}</span>
              <span className="text-xs text-neutral-500">tonnes CO₂e</span>
              <span className="text-xs text-neutral-400">({((scope2 / total) * 100).toFixed(0)}%)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              <span className="text-sm text-neutral-600">Scope 3</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-800">{formatNumber(scope3)}</span>
              <span className="text-xs text-neutral-500">tonnes CO₂e</span>
              <span className="text-xs text-neutral-400">({((scope3 / total) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <a href="#" className="text-primary-500 hover:text-primary-700 text-sm font-medium">Voir l'analyse détaillée →</a>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmissionsBreakdown;

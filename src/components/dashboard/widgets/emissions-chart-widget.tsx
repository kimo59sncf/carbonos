'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { WidgetContainer } from '../widget-container';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface EmissionsChartWidgetProps {
  id: string;
  isFullscreen?: boolean;
  onFullscreen?: (id: string) => void;
  onRemove?: (id: string) => void;
  onSettings?: (id: string) => void;
}

export function EmissionsChartWidget({
  id,
  isFullscreen,
  onFullscreen,
  onRemove,
  onSettings,
}: EmissionsChartWidgetProps) {
  // Simulation de données - à remplacer par de vraies données API
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['emissions-chart', id],
    queryFn: async () => {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      return [
        { month: 'Jan', scope1: 120, scope2: 80, scope3: 200, total: 400 },
        { month: 'Fév', scope1: 110, scope2: 75, scope3: 190, total: 375 },
        { month: 'Mar', scope1: 130, scope2: 85, scope3: 210, total: 425 },
        { month: 'Avr', scope1: 115, scope2: 70, scope3: 180, total: 365 },
        { month: 'Mai', scope1: 125, scope2: 80, scope3: 195, total: 400 },
        { month: 'Jun', scope1: 105, scope2: 65, scope3: 175, total: 345 },
      ];
    },
  });

  const currentMonth = chartData?.[chartData.length - 1];
  const previousMonth = chartData?.[chartData.length - 2];
  const trend = currentMonth && previousMonth
    ? ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100
    : 0;

  return (
    <WidgetContainer
      id={id}
      title="Évolution des émissions"
      isFullscreen={isFullscreen}
      onFullscreen={onFullscreen}
      onRemove={onRemove}
      onSettings={onSettings}
      actions={
        <div className="flex items-center gap-2 text-xs">
          {trend !== 0 && (
            <div className={`flex items-center gap-1 ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      }
    >
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-[200px] w-full" />
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                          <p className="font-medium">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value} tCO₂e
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="scope1"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="scope2"
                  stackId="1"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="scope3"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-red-500">
                {currentMonth?.scope1 || 0}
              </div>
              <div className="text-xs text-muted-foreground">Scope 1</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-500">
                {currentMonth?.scope2 || 0}
              </div>
              <div className="text-xs text-muted-foreground">Scope 2</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-500">
                {currentMonth?.scope3 || 0}
              </div>
              <div className="text-xs text-muted-foreground">Scope 3</div>
            </div>
          </div>
        </div>
      )}
    </WidgetContainer>
  );
}
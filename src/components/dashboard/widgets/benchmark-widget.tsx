'use client';

import { useQuery } from '@tanstack/react-query';
import { WidgetContainer } from '../widget-container';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BenchmarkWidgetProps {
  id: string;
  isFullscreen?: boolean;
  onFullscreen?: (id: string) => void;
  onRemove?: (id: string) => void;
  onSettings?: (id: string) => void;
}

interface BenchmarkData {
  indicator: string;
  value: string;
  average: string;
  position: 'top25' | 'median' | 'bottom33';
  trend: 'up' | 'down' | 'stable';
}

export function BenchmarkWidget({
  id,
  isFullscreen,
  onFullscreen,
  onRemove,
  onSettings,
}: BenchmarkWidgetProps) {
  const { data: benchmarks, isLoading } = useQuery({
    queryKey: ['benchmarks', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));

      return [
        {
          indicator: 'Émissions totales / CA',
          value: '42 tCO₂e/M€',
          average: '56 tCO₂e/M€',
          position: 'top25' as const,
          trend: 'up' as const,
        },
        {
          indicator: 'Émissions totales / employé',
          value: '8.1 tCO₂e/employé',
          average: '7.3 tCO₂e/employé',
          position: 'median' as const,
          trend: 'stable' as const,
        },
        {
          indicator: 'Ratio Scope 1+2 / Scope 3',
          value: '1:4.1',
          average: '1:3.2',
          position: 'bottom33' as const,
          trend: 'down' as const,
        },
      ] as BenchmarkData[];
    },
  });

  const getPositionColor = (position: BenchmarkData['position']) => {
    switch (position) {
      case 'top25':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'median':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'bottom33':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getPositionLabel = (position: BenchmarkData['position']) => {
    switch (position) {
      case 'top25':
        return 'Top 25%';
      case 'median':
        return 'Médiane';
      case 'bottom33':
        return 'Bottom 33%';
    }
  };

  const getTrendIcon = (trend: BenchmarkData['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <WidgetContainer
      id={id}
      title="Benchmarks sectoriels"
      isFullscreen={isFullscreen}
      onFullscreen={onFullscreen}
      onRemove={onRemove}
      onSettings={onSettings}
    >
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {benchmarks?.map((benchmark, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{benchmark.indicator}</span>
                {getTrendIcon(benchmark.trend)}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-primary">{benchmark.value}</span>
                <span className="text-muted-foreground">Moyenne: {benchmark.average}</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={getPositionColor(benchmark.position)}
                >
                  {getPositionLabel(benchmark.position)}
                </Badge>
              </div>

              <Progress
                value={
                  benchmark.position === 'top25' ? 85 :
                  benchmark.position === 'median' ? 50 : 25
                }
                className="h-1"
              />
            </div>
          ))}
        </div>
      )}
    </WidgetContainer>
  );
}
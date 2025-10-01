'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Settings, X, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface WidgetContainerProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  isFullscreen?: boolean;
  onFullscreen?: (id: string) => void;
  onRemove?: (id: string) => void;
  onSettings?: (id: string) => void;
  actions?: React.ReactNode;
}

export function WidgetContainer({
  id,
  title,
  children,
  className,
  isFullscreen = false,
  onFullscreen,
  onRemove,
  onSettings,
  actions,
}: WidgetContainerProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative transition-all duration-200 hover:shadow-lg',
        isDragging && 'opacity-50 shadow-xl z-50',
        isFullscreen && 'fixed inset-4 z-50 rounded-none',
        className
      )}
      {...attributes}
    >
      {/* Header du widget */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <h3 className="font-semibold text-sm truncate">{title}</h3>
        </div>

        <div className="flex items-center gap-1">
          {actions}

          {onSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSettings(id)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Settings className="h-3 w-3" />
            </Button>
          )}

          {onFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFullscreen(id)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isFullscreen ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Minimize2 className={cn(
              'h-3 w-3 transition-transform',
              isMinimized && 'rotate-180'
            )} />
          </Button>

          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(id)}
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Contenu du widget */}
      <div className={cn(
        'px-4 pb-4 transition-all duration-200',
        isMinimized && 'h-0 overflow-hidden opacity-0',
        !isMinimized && 'opacity-100'
      )}>
        {children}
      </div>
    </Card>
  );
}
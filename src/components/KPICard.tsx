import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: number;
  unit?: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  icon?: React.ReactNode;
}

export function KPICard({ title, value, delta, unit, status = 'neutral', icon }: KPICardProps) {
  const statusColors = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  const bgColors = {
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    danger: 'bg-destructive/10',
    neutral: 'bg-muted',
  };

  const DeltaIcon = delta && delta > 0 ? ArrowUp : delta && delta < 0 ? ArrowDown : Minus;

  return (
    <Card className="rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className={cn('p-2 rounded-lg', bgColors[status])}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-foreground">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </div>
          {unit && <div className="text-sm text-muted-foreground">{unit}</div>}
        </div>
        {delta !== undefined && (
          <div className={cn('flex items-center gap-1 mt-2 text-sm', statusColors[status])}>
            <DeltaIcon className="h-4 w-4" />
            <span className="font-medium">{Math.abs(delta).toFixed(1)}%</span>
            <span className="text-muted-foreground">vs período anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import type { DateRange, Channel } from '@/lib/types';

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '180d', label: 'Últimos 180 días' },
];

const channelOptions: { value: Channel; label: string }[] = [
  { value: 'all', label: 'Todos los canales' },
  { value: 'retail', label: 'Retail' },
  { value: 'ecommerce', label: 'E-commerce' },
];

export function FilterBar() {
  const { filters, updateFilters, resetFilters } = useAppStore();

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-2xl shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <Select
          value={filters.dateRange}
          onValueChange={(value: DateRange) => updateFilters({ dateRange: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Select
        value={filters.channel}
        onValueChange={(value: Channel) => updateFilters({ channel: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {channelOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={resetFilters}
        className="ml-auto"
      >
        <X className="h-4 w-4 mr-2" />
        Reset filtros
      </Button>
    </div>
  );
}

export interface Supplier {
  supplier_id: string;
  name: string;
  country: string;
  region: string;
  city: string;
  lat?: number;
  lon?: number;
  distance_km?: number;
  category: string;
  certifications: string[];
  is_active: boolean;
  lead_time_days: number;
  lead_time_sigma: number;
  unit_cost: number;
  moq: number;
  capacity_units_month: number;
  quality_score_1_5: number;
  service_score_1_5: number;
  sustainability_score_1_5: number;
  otif_pct: number;
  risk_score_1_5: number;
  payment_terms_days: number;
  contact_email: string;
  contact_phone?: string;
  contact_website?: string;
  contact_responsible?: string;
  contact_address?: string;
  notes?: string;
}

export interface Order {
  order_id: string;
  supplier_id: string;
  sku: string;
  category: string;
  order_date: string;
  promise_date: string;
  delivery_date: string | null;
  qty_ordered: number;
  qty_received: number;
  unit_price: number;
  incoterm: string;
  site: string;
  description?: string;
  currency?: string;
  min_score?: number;
  status?: 'Pendiente' | 'En Proceso' | 'Entregado' | 'Cancelado';
}

export interface ScoringModel {
  model_id: string;
  name: string;
  weights: Record<string, number>;
  active_kpis: string[];
  created_at: string;
}

export interface ClientSite {
  site_id: string;
  name: string;
  lat: number;
  lon: number;
  region: string;
  city: string;
}

export type DateRange = '7d' | '30d' | '90d' | '180d' | 'custom';
export type Channel = 'all' | 'retail' | 'ecommerce';

export interface Filters {
  dateRange: DateRange;
  customStartDate?: string;
  customEndDate?: string;
  category?: string;
  channel: Channel;
  region?: string;
  country?: string;
  supplier_id?: string;
}

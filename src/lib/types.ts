export interface Supplier {
  supplier_id: string;
  name: string;
  country: string;
  category: string;
  certifications: string[];
  is_active: boolean;
  payment_terms_days: number;
  contact_email: string;
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
}

export interface InventoryRecord {
  site: string;
  sku: string;
  date: string;
  on_hand: number;
  safety_stock: number;
  daily_demand: number;
}

export interface Payment {
  invoice_id: string;
  supplier_id: string;
  invoice_date: string;
  due_date: string;
  paid_date: string | null;
  amount: number;
  payment_method: string;
}

export interface ConsumerEvent {
  event_id: string;
  store: string;
  category: string;
  date: string;
  stockout_flag: boolean;
  substitution_flag: boolean;
  decision_time_sec: number;
  unit_price_visible_flag: boolean;
  label_read_time_sec: number;
  label_clarity_1_5: number;
}

export type DateRange = '7d' | '30d' | '90d' | '180d' | 'custom';
export type Channel = 'all' | 'retail' | 'ecommerce';

export interface Filters {
  dateRange: DateRange;
  customStartDate?: string;
  customEndDate?: string;
  category?: string;
  channel: Channel;
  site?: string;
  supplier_id?: string;
}

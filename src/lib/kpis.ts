import type { Order, Supplier } from './types';

export function calculateOTIF(orders: Order[]): number {
  const deliveredOrders = orders.filter(o => o.delivery_date !== null);
  if (deliveredOrders.length === 0) return 0;
  
  const otifOrders = deliveredOrders.filter(o => {
    const onTime = o.delivery_date! <= o.promise_date;
    const inFull = o.qty_received >= o.qty_ordered;
    return onTime && inFull;
  });
  
  return (otifOrders.length / deliveredOrders.length) * 100;
}

export function calculateFillRate(orders: Order[]): number {
  const deliveredOrders = orders.filter(o => o.delivery_date !== null);
  if (deliveredOrders.length === 0) return 0;
  
  const totalOrdered = deliveredOrders.reduce((sum, o) => sum + o.qty_ordered, 0);
  const totalReceived = deliveredOrders.reduce((sum, o) => sum + o.qty_received, 0);
  
  return totalOrdered > 0 ? (totalReceived / totalOrdered) * 100 : 0;
}

export function calculateLeadTime(orders: Order[]): number {
  const deliveredOrders = orders.filter(o => o.delivery_date !== null);
  if (deliveredOrders.length === 0) return 0;
  
  const leadTimes = deliveredOrders.map(o => {
    const orderDate = new Date(o.order_date);
    const deliveryDate = new Date(o.delivery_date!);
    return (deliveryDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
  });
  
  return leadTimes.reduce((sum, lt) => sum + lt, 0) / leadTimes.length;
}

export function calculateLeadTimeVariability(orders: Order[]): number {
  const deliveredOrders = orders.filter(o => o.delivery_date !== null);
  if (deliveredOrders.length === 0) return 0;
  
  const leadTimes = deliveredOrders.map(o => {
    const orderDate = new Date(o.order_date);
    const deliveryDate = new Date(o.delivery_date!);
    return (deliveryDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
  });
  
  const avg = leadTimes.reduce((sum, lt) => sum + lt, 0) / leadTimes.length;
  const variance = leadTimes.reduce((sum, lt) => sum + Math.pow(lt - avg, 2), 0) / leadTimes.length;
  
  return Math.sqrt(variance);
}

export function calculateAvgQuality(suppliers: Supplier[]): number {
  if (suppliers.length === 0) return 0;
  const activeSuppliers = suppliers.filter(s => s.is_active);
  if (activeSuppliers.length === 0) return 0;
  return activeSuppliers.reduce((sum, s) => sum + s.quality_score_1_5, 0) / activeSuppliers.length;
}

export function calculateAvgService(suppliers: Supplier[]): number {
  if (suppliers.length === 0) return 0;
  const activeSuppliers = suppliers.filter(s => s.is_active);
  if (activeSuppliers.length === 0) return 0;
  return activeSuppliers.reduce((sum, s) => sum + s.service_score_1_5, 0) / activeSuppliers.length;
}

export function calculateAvgSustainability(suppliers: Supplier[]): number {
  if (suppliers.length === 0) return 0;
  const activeSuppliers = suppliers.filter(s => s.is_active);
  if (activeSuppliers.length === 0) return 0;
  return activeSuppliers.reduce((sum, s) => sum + s.sustainability_score_1_5, 0) / activeSuppliers.length;
}

export function calculateCertificationRate(suppliers: Supplier[]): number {
  if (suppliers.length === 0) return 0;
  const activeSuppliers = suppliers.filter(s => s.is_active);
  if (activeSuppliers.length === 0) return 0;
  const withCerts = activeSuppliers.filter(s => s.certifications.length > 0);
  return (withCerts.length / activeSuppliers.length) * 100;
}

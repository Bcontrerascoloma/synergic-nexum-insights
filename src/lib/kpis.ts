import type { Order, Payment, ConsumerEvent, InventoryRecord } from './types';

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

export function calculateDSO(payments: Payment[]): number {
  if (payments.length === 0) return 0;
  
  const now = new Date();
  const dsos = payments.map(p => {
    const invoiceDate = new Date(p.invoice_date);
    const endDate = p.paid_date ? new Date(p.paid_date) : now;
    return (endDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24);
  });
  
  return dsos.reduce((sum, dso) => sum + dso, 0) / dsos.length;
}

export function calculatePaymentPercentage(payments: Payment[], maxDays: number): number {
  const paidPayments = payments.filter(p => p.paid_date !== null);
  if (paidPayments.length === 0) return 0;
  
  const withinDays = paidPayments.filter(p => {
    const invoiceDate = new Date(p.invoice_date);
    const paidDate = new Date(p.paid_date!);
    const daysDiff = (paidDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= maxDays;
  });
  
  return (withinDays.length / paidPayments.length) * 100;
}

export function calculateStockoutRate(events: ConsumerEvent[]): number {
  if (events.length === 0) return 0;
  const stockouts = events.filter(e => e.stockout_flag);
  return (stockouts.length / events.length) * 100;
}

export function calculateSubstitutionRate(events: ConsumerEvent[]): number {
  if (events.length === 0) return 0;
  const substitutions = events.filter(e => e.substitution_flag);
  return (substitutions.length / events.length) * 100;
}

export function calculateMedianDecisionTime(events: ConsumerEvent[]): number {
  if (events.length === 0) return 0;
  const times = events.map(e => e.decision_time_sec).sort((a, b) => a - b);
  const mid = Math.floor(times.length / 2);
  return times.length % 2 === 0 ? (times[mid - 1] + times[mid]) / 2 : times[mid];
}

export function calculateInventoryHealth(inventory: InventoryRecord[]): number {
  if (inventory.length === 0) return 0;
  const healthy = inventory.filter(i => i.on_hand >= i.safety_stock);
  return (healthy.length / inventory.length) * 100;
}

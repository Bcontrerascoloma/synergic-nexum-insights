import { faker } from '@faker-js/faker';
import type { Supplier, Order, InventoryRecord, Payment, ConsumerEvent } from './types';

const categories = ['Higiene', 'Alimentos', 'Bebidas', 'Cuidado Personal', 'Limpieza'];
const sites = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'San Miguel de Tucumán', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan'];
const incoterms = ['EXW', 'FOB', 'CIF', 'DDP'];
const paymentMethods = ['Transferencia', 'Cheque', 'Efectivo', 'Crédito'];

export function generateSuppliers(count: number = 20): Supplier[] {
  return Array.from({ length: count }, (_, i) => ({
    supplier_id: `SUP-${String(i + 1).padStart(4, '0')}`,
    name: faker.company.name(),
    country: faker.location.country(),
    category: faker.helpers.arrayElement(categories),
    certifications: faker.helpers.arrayElements(['ISO 9001', 'ISO 14001', 'HACCP', 'BRC', 'FSSC 22000'], { min: 0, max: 3 }),
    is_active: faker.datatype.boolean({ probability: 0.9 }),
    payment_terms_days: faker.helpers.arrayElement([7, 30, 60, 90]),
    contact_email: faker.internet.email(),
  }));
}

export function generateOrders(suppliers: Supplier[], count: number = 1000): Order[] {
  const skus = Array.from({ length: 30 }, (_, i) => `SKU-${String(i + 1).padStart(4, '0')}`);
  const now = new Date();
  
  return Array.from({ length: count }, (_, i) => {
    const supplier = faker.helpers.arrayElement(suppliers);
    const orderDate = faker.date.between({ 
      from: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000), 
      to: now 
    });
    const promiseDate = new Date(orderDate.getTime() + faker.number.int({ min: 7, max: 30 }) * 24 * 60 * 60 * 1000);
    const deliveryDate = faker.datatype.boolean({ probability: 0.85 }) 
      ? new Date(promiseDate.getTime() + faker.number.int({ min: -5, max: 10 }) * 24 * 60 * 60 * 1000)
      : null;
    
    const qtyOrdered = faker.number.int({ min: 100, max: 1000 });
    const qtyReceived = deliveryDate 
      ? Math.floor(qtyOrdered * faker.number.float({ min: 0.85, max: 1.0 }))
      : 0;
    
    return {
      order_id: `ORD-${String(i + 1).padStart(6, '0')}`,
      supplier_id: supplier.supplier_id,
      sku: faker.helpers.arrayElement(skus),
      category: supplier.category,
      order_date: orderDate.toISOString().split('T')[0],
      promise_date: promiseDate.toISOString().split('T')[0],
      delivery_date: deliveryDate ? deliveryDate.toISOString().split('T')[0] : null,
      qty_ordered: qtyOrdered,
      qty_received: qtyReceived,
      unit_price: faker.number.float({ min: 10, max: 500, multipleOf: 0.01 }),
      incoterm: faker.helpers.arrayElement(incoterms),
      site: faker.helpers.arrayElement(sites),
    };
  });
}

export function generateInventory(count: number = 300): InventoryRecord[] {
  const skus = Array.from({ length: 30 }, (_, i) => `SKU-${String(i + 1).padStart(4, '0')}`);
  const now = new Date();
  
  return Array.from({ length: count }, () => {
    const dailyDemand = faker.number.int({ min: 10, max: 100 });
    const safetyStock = dailyDemand * faker.number.int({ min: 5, max: 14 });
    
    return {
      site: faker.helpers.arrayElement(sites),
      sku: faker.helpers.arrayElement(skus),
      date: faker.date.between({ 
        from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), 
        to: now 
      }).toISOString().split('T')[0],
      on_hand: faker.number.int({ min: 0, max: safetyStock * 3 }),
      safety_stock: safetyStock,
      daily_demand: dailyDemand,
    };
  });
}

export function generatePayments(suppliers: Supplier[], count: number = 200): Payment[] {
  const now = new Date();
  
  return Array.from({ length: count }, (_, i) => {
    const supplier = faker.helpers.arrayElement(suppliers);
    const invoiceDate = faker.date.between({ 
      from: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000), 
      to: now 
    });
    const dueDate = new Date(invoiceDate.getTime() + supplier.payment_terms_days * 24 * 60 * 60 * 1000);
    const paid = faker.datatype.boolean({ probability: 0.75 });
    const paidDate = paid 
      ? new Date(dueDate.getTime() + faker.number.int({ min: -7, max: 30 }) * 24 * 60 * 60 * 1000)
      : null;
    
    return {
      invoice_id: `INV-${String(i + 1).padStart(6, '0')}`,
      supplier_id: supplier.supplier_id,
      invoice_date: invoiceDate.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      paid_date: paidDate ? paidDate.toISOString().split('T')[0] : null,
      amount: faker.number.float({ min: 1000, max: 50000, multipleOf: 0.01 }),
      payment_method: faker.helpers.arrayElement(paymentMethods),
    };
  });
}

export function generateConsumerEvents(count: number = 2000): ConsumerEvent[] {
  const now = new Date();
  
  return Array.from({ length: count }, (_, i) => ({
    event_id: `EVT-${String(i + 1).padStart(6, '0')}`,
    store: faker.helpers.arrayElement(sites),
    category: faker.helpers.arrayElement(categories),
    date: faker.date.between({ 
      from: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), 
      to: now 
    }).toISOString().split('T')[0],
    stockout_flag: faker.datatype.boolean({ probability: 0.12 }),
    substitution_flag: faker.datatype.boolean({ probability: 0.20 }),
    decision_time_sec: faker.number.int({ min: 5, max: 180 }),
    unit_price_visible_flag: faker.datatype.boolean({ probability: 0.85 }),
    label_read_time_sec: faker.number.int({ min: 3, max: 45 }),
    label_clarity_1_5: faker.number.int({ min: 1, max: 5 }),
  }));
}

export function loadDemoData() {
  const suppliers = generateSuppliers(20);
  const orders = generateOrders(suppliers, 1000);
  const inventory = generateInventory(300);
  const payments = generatePayments(suppliers, 200);
  const consumerEvents = generateConsumerEvents(2000);
  
  return {
    suppliers,
    orders,
    inventory,
    payments,
    consumerEvents,
  };
}

import { faker } from '@faker-js/faker';
import type { Supplier, Order, ClientSite } from './types';
import { calculateDistance } from './scoring';

const categories = ['Químico', 'Envase', 'Logística', 'Materias Primas', 'Componentes'];
const regions = ['Los Lagos', 'RM', 'Valparaíso', 'Biobío', 'Maule', 'La Araucanía'];
const cities = ['Santiago', 'Valparaíso', 'Concepción', 'Puerto Montt', 'Temuco', 'Talca'];
const certifications = ['ISO 9001', 'ISO 14001', 'RSPO', 'FSC', 'HACCP', 'BRC'];
const incoterms = ['EXW', 'FOB', 'CIF', 'DDP'];

const clientBaseLat = -33.4489; // Santiago, Chile
const clientBaseLon = -70.6693;

export function generateSuppliers(count: number = 20): Supplier[] {
  return Array.from({ length: count }, (_, i) => {
    const lat = faker.location.latitude({ min: -45, max: -18 });
    const lon = faker.location.longitude({ min: -75, max: -66 });
    const distance_km = calculateDistance(clientBaseLat, clientBaseLon, lat, lon);
    
    return {
      supplier_id: `SUP-${String(i + 1).padStart(4, '0')}`,
      name: faker.company.name(),
      country: 'Chile',
      region: faker.helpers.arrayElement(regions),
      city: faker.helpers.arrayElement(cities),
      lat,
      lon,
      distance_km: Math.round(distance_km),
      category: faker.helpers.arrayElement(categories),
      certifications: faker.helpers.arrayElements(certifications, { min: 0, max: 3 }),
      is_active: faker.datatype.boolean({ probability: 0.9 }),
      lead_time_days: faker.number.int({ min: 7, max: 45 }),
      lead_time_sigma: faker.number.float({ min: 1, max: 8, multipleOf: 0.1 }),
      unit_cost: faker.number.float({ min: 50, max: 500, multipleOf: 0.01 }),
      moq: faker.number.int({ min: 100, max: 5000 }),
      capacity_units_month: faker.number.int({ min: 5000, max: 50000 }),
      quality_score_1_5: faker.number.float({ min: 2, max: 5, multipleOf: 0.1 }),
      service_score_1_5: faker.number.float({ min: 2, max: 5, multipleOf: 0.1 }),
      sustainability_score_1_5: faker.number.float({ min: 1, max: 5, multipleOf: 0.1 }),
      otif_pct: faker.number.float({ min: 70, max: 99, multipleOf: 0.1 }),
      risk_score_1_5: faker.number.float({ min: 1, max: 4, multipleOf: 0.1 }),
      payment_terms_days: faker.helpers.arrayElement([7, 30, 60, 90]),
      early_payment_discount_pct: faker.number.float({ min: 0, max: 5, multipleOf: 0.5 }),
      tax_compliance_score_1_5: faker.number.float({ min: 2.5, max: 5, multipleOf: 0.1 }),
      cash_flow_impact_days: faker.number.int({ min: 14, max: 120 }),
      contact_email: faker.internet.email(),
      contact_phone: faker.phone.number(),
      contact_website: faker.internet.url(),
      contact_responsible: faker.person.fullName(),
      contact_address: faker.location.streetAddress({ useFullAddress: true }),
      notes: faker.datatype.boolean({ probability: 0.3 }) ? faker.lorem.sentence() : undefined,
    };
  });
}

export function generateOrders(suppliers: Supplier[], count: number = 1000): Order[] {
  const skus = Array.from({ length: 30 }, (_, i) => `SKU-${String(i + 1).padStart(4, '0')}`);
  const sites = ['Planta Santiago', 'Planta Valparaíso', 'Centro Distribución Sur'];
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
      description: faker.commerce.productDescription(),
      currency: 'USD',
      status: deliveryDate ? 'Entregado' : 'Pendiente',
    };
  });
}

export function generateClientSites(count: number = 3): ClientSite[] {
  return Array.from({ length: count }, (_, i) => ({
    site_id: `SITE-${String(i + 1).padStart(3, '0')}`,
    name: faker.helpers.arrayElement(['Planta Santiago', 'Planta Valparaíso', 'Centro Distribución Sur']),
    lat: clientBaseLat + faker.number.float({ min: -1, max: 1, multipleOf: 0.01 }),
    lon: clientBaseLon + faker.number.float({ min: -1, max: 1, multipleOf: 0.01 }),
    region: faker.helpers.arrayElement(regions),
    city: faker.helpers.arrayElement(cities),
  }));
}

export function loadDemoData() {
  const suppliers = generateSuppliers(20);
  const orders = generateOrders(suppliers, 1000);
  const clientSites = generateClientSites(3);
  
  return {
    suppliers,
    orders,
    clientSites,
  };
}

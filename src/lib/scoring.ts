import type { Supplier } from './types';

export interface NormalizedScore {
  supplier_id: string;
  scores: Record<string, number>;
  total_score: number;
  rank: number;
}

export const KPI_DEFINITIONS = {
  unit_cost: { label: 'Costo Unitario', type: 'cost' as const },
  lead_time_days: { label: 'Lead Time', type: 'cost' as const },
  lead_time_sigma: { label: 'Variabilidad LT', type: 'cost' as const },
  distance_km: { label: 'Distancia', type: 'cost' as const },
  quality_score_1_5: { label: 'Calidad', type: 'benefit' as const },
  service_score_1_5: { label: 'Servicio', type: 'benefit' as const },
  sustainability_score_1_5: { label: 'Sostenibilidad', type: 'benefit' as const },
  otif_pct: { label: 'OTIF %', type: 'benefit' as const },
  capacity_units_month: { label: 'Capacidad', type: 'benefit' as const },
  moq: { label: 'MOQ', type: 'cost' as const },
  risk_score_1_5: { label: 'Riesgo', type: 'cost' as const },
};

export type KPIKey = keyof typeof KPI_DEFINITIONS;

/**
 * Normalizes a value to [0,1] range based on min/max and criterion type
 */
export function normalizeValue(
  value: number,
  min: number,
  max: number,
  type: 'benefit' | 'cost'
): number {
  if (max === min) {
    return type === 'benefit' ? 1 : 0.5;
  }
  
  if (type === 'benefit') {
    return (value - min) / (max - min);
  } else {
    return (max - value) / (max - min);
  }
}

/**
 * Calculates Haversine distance between two coordinates in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates normalized scores for all suppliers based on active KPIs and weights
 */
export function calculateSupplierScores(
  suppliers: Supplier[],
  activeKpis: KPIKey[],
  weights: Record<string, number>
): NormalizedScore[] {
  if (suppliers.length === 0 || activeKpis.length === 0) {
    return [];
  }

  // Calculate min/max for each active KPI
  const ranges: Record<string, { min: number; max: number }> = {};
  
  activeKpis.forEach((kpi) => {
    const values = suppliers
      .map((s) => s[kpi] as number)
      .filter((v) => v !== undefined && v !== null && !isNaN(v));
    
    if (values.length > 0) {
      ranges[kpi] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }
  });

  // Normalize weights so they sum to 1
  const totalWeight = activeKpis.reduce((sum, kpi) => sum + (weights[kpi] || 0), 0);
  const normalizedWeights: Record<string, number> = {};
  
  if (totalWeight > 0) {
    activeKpis.forEach((kpi) => {
      normalizedWeights[kpi] = (weights[kpi] || 0) / totalWeight;
    });
  }

  // Calculate scores for each supplier
  const scores: NormalizedScore[] = suppliers.map((supplier) => {
    const kpiScores: Record<string, number> = {};
    let totalScore = 0;

    activeKpis.forEach((kpi) => {
      const value = supplier[kpi] as number;
      const range = ranges[kpi];
      const def = KPI_DEFINITIONS[kpi];

      if (value !== undefined && value !== null && !isNaN(value) && range) {
        const normalized = normalizeValue(value, range.min, range.max, def.type);
        kpiScores[kpi] = normalized;
        totalScore += normalized * normalizedWeights[kpi];
      } else {
        kpiScores[kpi] = 0;
      }
    });

    return {
      supplier_id: supplier.supplier_id,
      scores: kpiScores,
      total_score: totalScore,
      rank: 0,
    };
  });

  // Sort by total score (descending) and assign ranks
  scores.sort((a, b) => b.total_score - a.total_score);
  scores.forEach((score, index) => {
    score.rank = index + 1;
  });

  return scores;
}

/**
 * Gets default weights (equal for all KPIs)
 */
export function getDefaultWeights(kpis: KPIKey[]): Record<string, number> {
  const weight = kpis.length > 0 ? 100 / kpis.length : 0;
  const weights: Record<string, number> = {};
  kpis.forEach((kpi) => {
    weights[kpi] = weight;
  });
  return weights;
}

/**
 * Gets preset weight configurations
 */
export function getPresetWeights(preset: string): { activeKpis: KPIKey[]; weights: Record<string, number> } {
  const presets: Record<string, { activeKpis: KPIKey[]; weights: Record<string, number> }> = {
    cost: {
      activeKpis: ['unit_cost', 'lead_time_days', 'moq', 'distance_km'],
      weights: { unit_cost: 40, lead_time_days: 25, moq: 20, distance_km: 15 },
    },
    proximity: {
      activeKpis: ['distance_km', 'lead_time_days', 'service_score_1_5', 'quality_score_1_5'],
      weights: { distance_km: 40, lead_time_days: 30, service_score_1_5: 15, quality_score_1_5: 15 },
    },
    quality_service: {
      activeKpis: ['quality_score_1_5', 'service_score_1_5', 'otif_pct', 'sustainability_score_1_5'],
      weights: { quality_score_1_5: 35, service_score_1_5: 30, otif_pct: 25, sustainability_score_1_5: 10 },
    },
    balanced: {
      activeKpis: ['unit_cost', 'quality_score_1_5', 'service_score_1_5', 'lead_time_days', 'otif_pct', 'sustainability_score_1_5'],
      weights: { unit_cost: 20, quality_score_1_5: 20, service_score_1_5: 20, lead_time_days: 15, otif_pct: 15, sustainability_score_1_5: 10 },
    },
  };

  return presets[preset] || presets.balanced;
}

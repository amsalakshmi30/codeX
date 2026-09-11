export type SeverityLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Not Applicable';

export interface ScanResult {
  id: string;
  is_leaf: boolean;
  plant: string | null;
  status: 'Healthy' | 'Diseased' | 'No Leaf';
  disease: string | null;
  severity: SeverityLevel;
  confidence: number;
  affected_percent: number | null;
  top_class?: string;
  all_scores?: Record<string, number>;
  recommendations: string[];
  urgency?: string;
  organic_option?: string;
  imageUrl?: string;
  timestamp: string;
  scanMode: 'single' | 'three-zone';
}

export interface ZoneItemResult {
  zone: string;
  expected_plant: string;
  is_leaf: boolean;
  status: 'Healthy' | 'Diseased' | 'No Leaf';
  disease: string | null;
  severity: SeverityLevel;
  confidence: number;
  affected_percent?: number | null;
  recommendations?: string[];
  urgency?: string;
  cropped_url?: string;
}

export interface ThreeZoneResult {
  preset: string;
  zones: ZoneItemResult[];
  summary: string;
  timestamp: string;
  imageUrl?: string;
}

export interface CropStat {
  name: string;
  tamilName?: string;
  healthyCount: number;
  diseasedCount: number;
  commonDiseases: string[];
  riskLevel: 'Low' | 'Moderate' | 'High';
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

import {
  LayoutDashboard,
  ScanLine,
  Grid3X3,
  BarChart3,
  History,
  Sprout
} from 'lucide-react';
import { NavItem, ScanResult, CropStat } from './types';

export const navigationItems: NavItem[] = [
  { label: 'Farm Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Single Leaf Scanner', path: '/scanner/single', icon: ScanLine, badge: 'AI Live' },
  { label: '3-Zone Box Scanner', path: '/scanner/three-zone', icon: Grid3X3, badge: 'Hardware' },
  { label: 'Crop Health Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Diagnosis History', path: '/history', icon: History },
];

export const supportedCrops: CropStat[] = [
  {
    name: 'Ladies Finger (Okra)',
    tamilName: 'வெண்டை (Okra)',
    healthyCount: 142,
    diseasedCount: 48,
    commonDiseases: ['Yellow Vein Mosaic Virus'],
    riskLevel: 'Moderate'
  },
  {
    name: 'Tomato',
    tamilName: 'தக்காளி (Tomato)',
    healthyCount: 230,
    diseasedCount: 82,
    commonDiseases: ['Early Blight', 'Late Blight'],
    riskLevel: 'High'
  },
  {
    name: 'Potato',
    tamilName: 'உருளைக்கிழங்கு (Potato)',
    healthyCount: 95,
    diseasedCount: 51,
    commonDiseases: ['Late Blight'],
    riskLevel: 'High'
  },
  {
    name: 'Bell Pepper (Capsicum)',
    tamilName: 'குடைமிளகாய் (Capsicum)',
    healthyCount: 110,
    diseasedCount: 24,
    commonDiseases: ['Bacterial Leaf Spot'],
    riskLevel: 'Low'
  },
  {
    name: 'Grape',
    tamilName: 'திராட்சை (Grape)',
    healthyCount: 168,
    diseasedCount: 39,
    commonDiseases: ['Black Rot'],
    riskLevel: 'Moderate'
  },
  {
    name: 'Corn (Maize)',
    tamilName: 'மக்காச்சோளம் (Corn)',
    healthyCount: 185,
    diseasedCount: 31,
    commonDiseases: ['Common Rust', 'Leaf Blight'],
    riskLevel: 'Low'
  }
];

export const initialScanHistory: ScanResult[] = [
  {
    id: 'scan-01',
    is_leaf: true,
    plant: 'Ladies Finger (Okra)',
    status: 'Diseased',
    disease: 'Yellow Vein Mosaic Virus',
    severity: 'High',
    confidence: 94.8,
    affected_percent: 39.4,
    recommendations: [
      'Install yellow sticky traps (15-20 traps/acre) to trap whitefly vectors.',
      'Spray Neem seed extract or Imidacloprid (0.3 ml/L).',
      'Uproot and burn heavily infected plants.'
    ],
    urgency: 'High',
    organic_option: 'Neem oil spray (5ml/L) + yellow sticky traps',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80',
    timestamp: '10 mins ago',
    scanMode: 'single'
  },
  {
    id: 'scan-02',
    is_leaf: true,
    plant: 'Tomato',
    status: 'Healthy',
    disease: null,
    severity: 'None',
    confidence: 97.2,
    affected_percent: null,
    recommendations: [
      'Crop foliage in optimal health.',
      'Maintain standard drip irrigation frequency.'
    ],
    urgency: 'Optimal',
    organic_option: 'Panchagavya tonic foliar spray',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=400&q=80',
    timestamp: '45 mins ago',
    scanMode: 'single'
  },
  {
    id: 'scan-03',
    is_leaf: true,
    plant: 'Tomato',
    status: 'Diseased',
    disease: 'Early Blight',
    severity: 'Medium',
    confidence: 91.5,
    affected_percent: 22.8,
    recommendations: [
      'Prune affected lower leaves touching soil.',
      'Spray Mancozeb 75 WP (2g/L) fungicide.',
      'Avoid overhead watering.'
    ],
    urgency: 'Medium',
    organic_option: 'Trichoderma viride bio-fungicide',
    imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&w=400&q=80',
    timestamp: '2 hours ago',
    scanMode: 'single'
  },
  {
    id: 'scan-04',
    is_leaf: true,
    plant: 'Grape',
    status: 'Diseased',
    disease: 'Black Rot',
    severity: 'Low',
    confidence: 88.9,
    affected_percent: 8.4,
    recommendations: [
      'Prune mummified fruit clusters and infected shoots.',
      'Apply protective Myclobutanil fungicide spray.'
    ],
    urgency: 'Medium',
    organic_option: 'Bordeaux mixture (1%)',
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80',
    timestamp: '5 hours ago',
    scanMode: 'three-zone'
  }
];

export type LocationType = 'Warehouse' | 'Supplier' | 'Distribution Center' | 'Delivery Truck' | 'Factory';
export type StatusLevel = 'Green' | 'Yellow' | 'Red';

export interface LocationMarker {
  id: string;
  name: string;
  type: LocationType;
  lat: number;
  lng: number;
  status: StatusLevel;
  shipmentId?: string;
  eta?: string;
  riskLevel: string;
  origin?: string;
  destination?: string;
  timelineStatus?: 'Packed' | 'Dispatched' | 'In Transit' | 'Delivered';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  demandForecast: number;
  restockRecommendation: number;
  status: StatusLevel;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  reliabilityScore: number;
  successRate: number;
  riskLevel: StatusLevel;
}

export interface Alert {
  id: string;
  severity: StatusLevel;
  title: string;
  location: string;
  timestamp: string;
  action: string;
  status: 'Active' | 'Resolved' | 'Dismissed';
}

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  password?: string;
  industry?: string;
  headquarters?: string;
  department?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

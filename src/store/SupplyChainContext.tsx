import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LocationMarker, Product, Supplier, Alert, UserProfile, ToastMessage } from '../types';

interface SupplyChainContextType {
  locations: LocationMarker[];
  addLocation: (loc: LocationMarker) => void;
  updateLocation: (loc: LocationMarker) => void;
  deleteLocation: (id: string) => void;
  
  products: Product[];
  addProduct: (prod: Product) => void;
  restockProduct: (id: string, qty: number) => void;
  
  suppliers: Supplier[];
  updateSupplier: (sup: Supplier) => void;

  alerts: Alert[];
  resolveAlert: (id: string) => void;
  dismissAlert: (id: string) => void;

  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  register: (profile: UserProfile) => boolean;

  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const initialLocations: LocationMarker[] = [
  { id: '1', name: 'Central Warehouse A', type: 'Warehouse', lat: 40.7128, lng: -74.0060, status: 'Green', riskLevel: 'Low', origin: 'New York, USA', destination: 'Chicago, USA', timelineStatus: 'Delivered' },
  { id: '2', name: 'Supplier Factory Beta', type: 'Factory', lat: 34.0522, lng: -118.2437, status: 'Yellow', riskLevel: 'Medium', origin: 'Los Angeles, USA', destination: 'Seattle, USA', timelineStatus: 'Packed' },
  { id: '3', name: 'Dist. Center Europe', type: 'Distribution Center', lat: 51.5074, lng: -0.1278, status: 'Red', riskLevel: 'High', shipmentId: 'SHP-9921', eta: 'Delayed', origin: 'London, UK', destination: 'Berlin, DE', timelineStatus: 'In Transit' },
  { id: '4', name: 'Truck 402', type: 'Delivery Truck', lat: 41.8781, lng: -87.6298, status: 'Green', riskLevel: 'Low', shipmentId: 'SHP-1044', eta: '2 Hours', origin: 'Chicago, USA', destination: 'Detroit, USA', timelineStatus: 'In Transit' },
  { id: '5', name: 'Shanghai Port Hub', type: 'Distribution Center', lat: 31.2304, lng: 121.4737, status: 'Green', riskLevel: 'Low', origin: 'Shanghai, CN', destination: 'Tokyo, JP', timelineStatus: 'Dispatched' },
  { id: '6', name: 'Mumbai Tech Factory', type: 'Factory', lat: 19.0760, lng: 72.8777, status: 'Yellow', riskLevel: 'Medium', origin: 'Mumbai, IN', destination: 'Dubai, UAE', timelineStatus: 'Packed' },
  { id: '7', name: 'Dubai Logistics Center', type: 'Warehouse', lat: 25.2048, lng: 55.2708, status: 'Green', riskLevel: 'Low', origin: 'Dubai, UAE', destination: 'London, UK', timelineStatus: 'In Transit' },
  { id: '8', name: 'Truck 809', type: 'Delivery Truck', lat: 48.8566, lng: 2.3522, status: 'Red', riskLevel: 'High', shipmentId: 'SHP-5512', eta: 'Delayed', origin: 'Paris, FR', destination: 'Madrid, ES', timelineStatus: 'In Transit' },
  { id: '9', name: 'Shenzhen Electronics', type: 'Factory', lat: 22.5431, lng: 114.0579, status: 'Green', riskLevel: 'Low', origin: 'Shenzhen, CN', destination: 'San Francisco, USA', timelineStatus: 'Packed' },
  { id: '10', name: 'Frankfurt Hub', type: 'Distribution Center', lat: 50.1109, lng: 8.6821, status: 'Green', riskLevel: 'Low', origin: 'Frankfurt, DE', destination: 'Rome, IT', timelineStatus: 'Dispatched' },
];

const initialProducts: Product[] = [
  { id: 'PRD-001', name: 'Microchips X1', category: 'Electronics', price: 12.50, stock: 12000, demandForecast: 15000, restockRecommendation: 5000, status: 'Yellow' },
  { id: 'PRD-002', name: 'Lithium Batteries', category: 'Energy', price: 45.00, stock: 450, demandForecast: 2000, restockRecommendation: 2000, status: 'Red' },
  { id: 'PRD-003', name: 'Steel Casings', category: 'Materials', price: 8.75, stock: 85000, demandForecast: 60000, restockRecommendation: 0, status: 'Green' },
];

const initialSuppliers: Supplier[] = [
  { id: 'SUP-1', name: 'Alpha Tech', location: 'Shenzhen, CN', reliabilityScore: 98, successRate: 99.2, riskLevel: 'Green' },
  { id: 'SUP-2', name: 'Beta Components', location: 'Los Angeles, US', reliabilityScore: 75, successRate: 82.5, riskLevel: 'Yellow' },
  { id: 'SUP-3', name: 'Delta Logistics', location: 'London, UK', reliabilityScore: 45, successRate: 60.1, riskLevel: 'Red' },
];

const initialAlerts: Alert[] = [
  { id: 'ALT-1', severity: 'Red', title: 'Supplier Disruption', location: 'London, UK', timestamp: '10 mins ago', action: 'Reroute to Alpha Tech', status: 'Active' },
  { id: 'ALT-2', severity: 'Yellow', title: 'Inventory Shortage Predicted', location: 'Central Warehouse A', timestamp: '1 hour ago', action: 'Restock Lithium Batteries', status: 'Active' },
  { id: 'ALT-3', severity: 'Red', title: 'Delayed Shipment SHP-9921', location: 'Dist. Center Europe', timestamp: '2 hours ago', action: 'Notify Customer', status: 'Active' },
];

const initialUserProfile: UserProfile = {
  name: 'John Doe',
  email: 'admin@supplychain.com',
  company: 'Global Logistics Corp',
  role: 'Logistics Manager',
  phone: '+1 (555) 123-4567',
  password: 'password123',
  industry: 'Logistics',
  headquarters: 'New York, USA',
  department: 'Supply Chain'
};

const SupplyChainContext = createContext<SupplyChainContextType | undefined>(undefined);

export const SupplyChainProvider = ({ children }: { children: ReactNode }) => {
  const [locations, setLocations] = useState<LocationMarker[]>(initialLocations);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : [initialUserProfile];
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('currentUser');
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addLocation = (loc: LocationMarker) => {
    setLocations([...locations, loc]);
    addToast('Location Added to Map', 'success');
  };
  
  const updateLocation = (loc: LocationMarker) => {
    setLocations(locations.map(l => l.id === loc.id ? loc : l));
    addToast('Location Updated', 'success');
  };
  
  const deleteLocation = (id: string) => {
    setLocations(locations.filter(l => l.id !== id));
    addToast('Location Removed', 'info');
  };

  const addProduct = (prod: Product) => {
    setProducts([...products, prod]);
    addToast('Product Added to Inventory', 'success');
  };

  const restockProduct = (id: string, qty: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: p.stock + qty, status: (p.stock + qty) >= p.demandForecast ? 'Green' : 'Yellow' } : p));
    addToast('Restock Order Placed', 'success');
  };

  const updateSupplier = (sup: Supplier) => {
    setSuppliers(suppliers.map(s => s.id === sup.id ? sup : s));
    addToast('Supplier Updated', 'success');
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
    addToast('Alert Resolved', 'success');
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'Dismissed' } : a));
    addToast('Alert Dismissed', 'info');
  };

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('currentUser', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [userProfile]);

  const login = (email: string, password?: string) => {
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setUserProfile(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserProfile(null);
    setIsAuthenticated(false);
    addToast('Logged out successfully', 'info');
  };

  const register = (profile: UserProfile) => {
    if (registeredUsers.some(u => u.email === profile.email)) {
      return false; // Email already exists
    }
    setRegisteredUsers([...registeredUsers, profile]);
    return true;
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...profile };
      setUserProfile(updatedProfile);
      setRegisteredUsers(registeredUsers.map(u => u.email === updatedProfile.email ? updatedProfile : u));
      addToast('Profile Updated Successfully', 'success');
    }
  };

  return (
    <SupplyChainContext.Provider value={{ 
      locations, addLocation, updateLocation, deleteLocation, 
      products, addProduct, restockProduct, 
      suppliers, updateSupplier,
      alerts, resolveAlert, dismissAlert,
      userProfile, updateUserProfile,
      isAuthenticated, login, logout, register,
      toasts, addToast, removeToast,
      isDarkMode, toggleDarkMode
    }}>
      {children}
    </SupplyChainContext.Provider>
  );
};

export const useSupplyChain = () => {
  const context = useContext(SupplyChainContext);
  if (!context) throw new Error('useSupplyChain must be used within a SupplyChainProvider');
  return context;
};

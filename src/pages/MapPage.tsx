import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSupplyChain } from '../store/SupplyChainContext';
import { Search, Navigation, Package, Truck, Factory, Building2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { LocationMarker } from '../types';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerColor = (type: string) => {
  switch (type) {
    case 'Warehouse': return '#3b82f6'; // blue
    case 'Factory': return '#a855f7'; // purple
    case 'Delivery Truck': return '#22c55e'; // green
    case 'Distribution Center': return '#f97316'; // orange
    default: return '#64748b';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Green': return '#10b981';
    case 'Yellow': return '#f59e0b';
    case 'Red': return '#ef4444';
    default: return '#3b82f6';
  }
};

const createCustomIcon = (type: string, status: string, isHighlighted: boolean) => {
  const color = getMarkerColor(type);
  const statusColor = getStatusColor(status);
  const glow = isHighlighted ? `box-shadow: 0 0 15px 5px ${color}80;` : 'box-shadow: 0 4px 6px rgba(0,0,0,0.3);';
  const scale = isHighlighted ? 'transform: scale(1.2);' : '';
  
  let iconHtml = '';
  if (type === 'Warehouse') iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
  else if (type === 'Factory') iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>`;
  else if (type === 'Delivery Truck') iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`;
  else if (type === 'Distribution Center') iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;

  return new L.DivIcon({
    className: 'custom-icon',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; ${glow} ${scale} transition: all 0.3s ease; position: relative;">
        ${iconHtml}
        <div style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; border-radius: 50%; background-color: ${statusColor}; border: 2px solid white;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function MapPage() {
  const { locations, isDarkMode } = useSupplyChain();
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedMarkerId, setHighlightedMarkerId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([30, 0]);
  const [mapZoom, setMapZoom] = useState<number>(3);

  const filteredLocations = locations.filter(loc => {
    const matchesType = filterType === 'All' || loc.type === filterType;
    return matchesType;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setHighlightedMarkerId(null);
      setMapCenter([30, 0]);
      setMapZoom(3);
      return;
    }
    
    const found = locations.find(loc => 
      loc.shipmentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (found) {
      setHighlightedMarkerId(found.id);
      setMapCenter([found.lat, found.lng]);
      setMapZoom(8);
    }
  };

  const stats = {
    total: locations.filter(l => l.shipmentId).length,
    onTime: locations.filter(l => l.shipmentId && l.status === 'Green').length,
    delayRisk: locations.filter(l => l.shipmentId && l.status === 'Yellow').length,
    disrupted: locations.filter(l => l.shipmentId && l.status === 'Red').length,
  };

  const getTimelineStep = (status?: string) => {
    switch(status) {
      case 'Packed': return 1;
      case 'Dispatched': return 2;
      case 'In Transit': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
        <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          {['All', 'Warehouse', 'Factory', 'Delivery Truck', 'Distribution Center'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === type 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {type === 'Delivery Truck' ? 'Trucks' : type === 'Distribution Center' ? 'Distribution' : type + 's'}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tracking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </form>
      </div>

      <div className="flex-1 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden relative z-0">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} zoomControl={true}>
          <MapController center={mapCenter} zoom={mapZoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={isDarkMode 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
          />
          
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
          >
            {filteredLocations.map((loc) => (
              <Marker 
                key={loc.id} 
                position={[loc.lat, loc.lng]} 
                icon={createCustomIcon(loc.type, loc.status, highlightedMarkerId === loc.id)}
                eventHandlers={{
                  click: () => {
                    setHighlightedMarkerId(loc.id);
                  }
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[240px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-slate-900 text-base">{loc.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        loc.status === 'Green' ? 'bg-emerald-100 text-emerald-700' :
                        loc.status === 'Yellow' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {loc.status === 'Green' ? 'On Time' : loc.status === 'Yellow' ? 'Delay Risk' : 'Disrupted'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      {loc.shipmentId && (
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">Tracking ID</span>
                          <span className="font-mono font-medium text-slate-900">{loc.shipmentId}</span>
                        </div>
                      )}
                      {loc.origin && loc.destination && (
                        <div className="flex items-center justify-between text-xs pt-1">
                          <div className="flex flex-col">
                            <span className="text-slate-400">Origin</span>
                            <span className="font-medium text-slate-900">{loc.origin}</span>
                          </div>
                          <Navigation className="w-3 h-3 text-slate-300 mx-2" />
                          <div className="flex flex-col text-right">
                            <span className="text-slate-400">Destination</span>
                            <span className="font-medium text-slate-900">{loc.destination}</span>
                          </div>
                        </div>
                      )}
                      {loc.eta && (
                        <div className="flex items-center text-xs pt-1 text-slate-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>ETA: <strong className="text-slate-900">{loc.eta}</strong></span>
                        </div>
                      )}
                    </div>

                    {loc.timelineStatus && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between relative">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
                          <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 transition-all duration-500"
                            style={{ width: `${(getTimelineStep(loc.timelineStatus) - 1) * 33.33}%` }}
                          ></div>
                          
                          {['Packed', 'Dispatched', 'In Transit', 'Delivered'].map((step, idx) => {
                            const stepNum = idx + 1;
                            const currentStep = getTimelineStep(loc.timelineStatus);
                            const isCompleted = stepNum <= currentStep;
                            const isCurrent = stepNum === currentStep;
                            
                            return (
                              <div key={step} className="relative z-10 flex flex-col items-center group">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                                  isCompleted ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-200'
                                } ${isCurrent ? 'ring-2 ring-blue-200 ring-offset-1' : ''}`}>
                                  {isCompleted && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                </div>
                                <span className="absolute top-5 text-[9px] font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 rounded shadow-sm">
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-center mt-2 text-xs font-medium text-blue-600">
                          {loc.timelineStatus}
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Shipment Summary Overlay */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 z-[1000] w-[90%] max-w-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Tracked</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">shipments</span></p>
              </div>
            </div>
            
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">On Time</span>
                </div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.onTime} <span className="text-xs font-medium text-emerald-600/70 dark:text-emerald-400/70">({Math.round((stats.onTime/stats.total)*100 || 0)}%)</span>
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Delay Risk</span>
                </div>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {stats.delayRisk} <span className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70">({Math.round((stats.delayRisk/stats.total)*100 || 0)}%)</span>
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Disrupted</span>
                </div>
                <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                  {stats.disrupted} <span className="text-xs font-medium text-rose-600/70 dark:text-rose-400/70">({Math.round((stats.disrupted/stats.total)*100 || 0)}%)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

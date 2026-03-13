import { Package, TrendingUp, AlertTriangle, Truck, Clock, ChevronRight } from 'lucide-react';
import { useSupplyChain } from '../store/SupplyChainContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const demandData = [
  { name: 'Jan', actual: 4000, predicted: 4400 },
  { name: 'Feb', actual: 3000, predicted: 3200 },
  { name: 'Mar', actual: 2000, predicted: 2400 },
  { name: 'Apr', actual: 2780, predicted: 2900 },
  { name: 'May', actual: 1890, predicted: 2100 },
  { name: 'Jun', actual: 2390, predicted: 2500 },
  { name: 'Jul', actual: 3490, predicted: 3800 },
];

const supplierData = [
  { name: 'Alpha Tech', reliability: 98, delay: 2 },
  { name: 'Beta Comp', reliability: 75, delay: 25 },
  { name: 'Delta Log', reliability: 45, delay: 55 },
];

export default function Dashboard() {
  const { products, suppliers, alerts, locations } = useSupplyChain();
  const navigate = useNavigate();
  
  const totalInventory = products.reduce((acc, p) => acc + p.stock, 0);
  const activeShipments = locations.filter(l => l.type === 'Delivery Truck').length;
  const highRiskSuppliers = suppliers.filter(s => s.riskLevel === 'Red').length;
  const delayedShipments = alerts.filter(a => a.title.includes('Delayed')).length;
  const activeAlerts = alerts.filter(a => a.status === 'Active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Control Tower Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Inventory</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalInventory.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Predicted Demand</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">+12.5%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">High Risk Suppliers</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{highRiskSuppliers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-4 transition-colors">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Shipments</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeShipments}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Demand Forecasting (AI Prediction)</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" />
                  <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="Actual Demand" />
                  <Area type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="AI Forecast" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Supplier Reliability Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={supplierData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="reliability" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Reliability Score (%)" />
                  <Bar dataKey="delay" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Delay Risk (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights & Alerts */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-indigo-500/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-300" />
              </div>
              <h2 className="text-lg font-semibold">AI Insights</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                <p className="text-sm font-medium text-indigo-200 mb-1">Demand Spike Expected</p>
                <p className="text-sm text-slate-300">Region South is predicted to see a 25% increase in demand for Microchips X1 next week.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                <p className="text-sm font-medium text-rose-300 mb-1">Supplier Risk Alert</p>
                <p className="text-sm text-slate-300">Supplier Delta Logistics risk increasing due to consecutive late shipments.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                <p className="text-sm font-medium text-amber-300 mb-1">Inventory Shortage</p>
                <p className="text-sm text-slate-300">Lithium Batteries predicted to run out in 5 days at current consumption rate.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                <p className="text-sm font-medium text-emerald-300 mb-1">Optimization Suggestion</p>
                <p className="text-sm text-slate-300">Reroute delayed shipments via Alpha Tech to save 12 hours transit time.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Alerts</h2>
              <span className="text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-full">{activeAlerts.length} Active</span>
            </div>
            <div className="space-y-4">
              {activeAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-start space-x-3 pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    alert.severity === 'Red' ? 'bg-rose-500' :
                    alert.severity === 'Yellow' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{alert.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{alert.location} • {alert.timestamp}</p>
                  </div>
                </div>
              ))}
              {activeAlerts.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No active alerts.</p>
              )}
            </div>
            <button 
              onClick={() => navigate('/alerts')}
              className="w-full mt-4 py-2 flex items-center justify-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

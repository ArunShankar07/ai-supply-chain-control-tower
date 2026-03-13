import { useState } from 'react';
import { useSupplyChain } from '../store/SupplyChainContext';
import { AlertTriangle, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { Alert } from '../types';

export default function Alerts() {
  const { alerts, resolveAlert, dismissAlert } = useSupplyChain();
  const [activeTab, setActiveTab] = useState<'Active' | 'Dismissed'>('Active');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const filteredAlerts = alerts.filter(a => a.status === activeTab);

  const handleExecute = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const confirmExecute = () => {
    if (selectedAlert) {
      resolveAlert(selectedAlert.id);
      setSelectedAlert(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Alerts & Disruptions</h1>
        <div className="flex items-center space-x-2 text-sm">
          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400 font-medium rounded-full">
            {alerts.filter(a => a.severity === 'Red' && a.status === 'Active').length} Critical
          </span>
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-medium rounded-full">
            {alerts.filter(a => a.severity === 'Yellow' && a.status === 'Active').length} Warnings
          </span>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('Active')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'Active' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Active Alerts
        </button>
        <button
          onClick={() => setActiveTab('Dismissed')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'Dismissed' ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Dismissed
        </button>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No {activeTab.toLowerCase()} alerts</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Everything is running smoothly.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border-l-4 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all hover:shadow-md ${
                alert.severity === 'Red' ? 'border-l-rose-500 border-y-slate-100 dark:border-y-slate-800 border-r-slate-100 dark:border-r-slate-800' :
                alert.severity === 'Yellow' ? 'border-l-amber-500 border-y-slate-100 dark:border-y-slate-800 border-r-slate-100 dark:border-r-slate-800' : 'border-l-emerald-500 border-y-slate-100 dark:border-y-slate-800 border-r-slate-100 dark:border-r-slate-800'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  alert.severity === 'Red' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                  alert.severity === 'Yellow' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {alert.severity === 'Red' ? <XCircle className="w-5 h-5" /> :
                   alert.severity === 'Yellow' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{alert.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      alert.severity === 'Red' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400' :
                      alert.severity === 'Yellow' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {alert.severity === 'Red' ? 'Critical' : alert.severity === 'Yellow' ? 'Warning' : 'Info'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 inline-block">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                      <span className="text-slate-400 dark:text-slate-500">Suggested Action:</span>
                      <span className="text-blue-600 dark:text-blue-400">{alert.action}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              {activeTab === 'Active' && (
                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => handleExecute(alert)}
                    className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-500/30"
                  >
                    Execute Action
                  </button>
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Execute Action Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Execute Suggested Action</h3>
              <button onClick={() => setSelectedAlert(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">Action to be executed:</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{selectedAlert.action}</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                This will automatically trigger the necessary workflows in the system to resolve the alert: <strong className="text-slate-900 dark:text-white">{selectedAlert.title}</strong>.
              </p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExecute}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-500/30"
              >
                Confirm & Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

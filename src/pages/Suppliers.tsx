import React, { useState, FormEvent } from 'react';
import { useSupplyChain } from '../store/SupplyChainContext';
import { Users, AlertTriangle, TrendingDown, ShieldCheck, Activity, Edit2, X, Save, MapPin, User, Mail, Phone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Supplier, StatusLevel } from '../types';

const performanceData = [
  { month: 'Jan', 'Alpha Tech': 99, 'Beta Components': 85, 'Delta Logistics': 70 },
  { month: 'Feb', 'Alpha Tech': 98, 'Beta Components': 82, 'Delta Logistics': 65 },
  { month: 'Mar', 'Alpha Tech': 99, 'Beta Components': 80, 'Delta Logistics': 60 },
  { month: 'Apr', 'Alpha Tech': 97, 'Beta Components': 78, 'Delta Logistics': 55 },
  { month: 'May', 'Alpha Tech': 99, 'Beta Components': 75, 'Delta Logistics': 50 },
  { month: 'Jun', 'Alpha Tech': 98, 'Beta Components': 72, 'Delta Logistics': 45 },
];

const alternativeSuppliers = [
  { name: 'Omega Logistics', location: 'Frankfurt, DE', reliabilityScore: 96, avgDeliveryTime: '2.4 days' },
  { name: 'Nova Supply Co', location: 'Rotterdam, NL', reliabilityScore: 94, avgDeliveryTime: '3.1 days' },
  { name: 'Global Freight Solutions', location: 'London, UK', reliabilityScore: 91, avgDeliveryTime: '3.5 days' },
];

const contactDetails = {
  person: 'Sarah Jenkins',
  email: 's.jenkins@deltalogistics.com',
  phone: '+44 20 7123 4567'
};

export default function Suppliers() {
  const { suppliers, updateSupplier, addToast } = useSupplyChain();
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({});
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [riskStatus, setRiskStatus] = useState<'HIGH PRIORITY' | 'UNDER REVIEW'>('HIGH PRIORITY');
  const [mitigationStatus, setMitigationStatus] = useState('');

  const handleEditClick = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier({ ...editingSupplier, ...formData } as Supplier);
      setEditingSupplier(null);
    }
  };

  const handleSelectAlternative = (supplierName: string) => {
    addToast('Supplier successfully selected as backup partner.', 'success');
    setRiskStatus('UNDER REVIEW');
    setMitigationStatus('Mitigation in progress');
    setIsReviewModalOpen(false);
  };

  const handleContactAction = (action: string) => {
    addToast('Supplier contacted successfully', 'success');
    setRiskStatus('UNDER REVIEW');
    setIsContactModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Supplier Monitoring</h1>
      </div>

      {/* AI Risk Prediction Insights */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-start transition-colors">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${
          riskStatus === 'HIGH PRIORITY' 
            ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400'
            : 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-900/50 text-amber-600 dark:text-amber-400'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
            <span>AI Risk Prediction</span>
            <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${
              riskStatus === 'HIGH PRIORITY'
                ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-400'
                : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400'
            }`}>
              {riskStatus}
            </span>
            {mitigationStatus && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                {mitigationStatus}
              </span>
            )}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Supplier <strong className="text-slate-900 dark:text-white">Delta Logistics</strong> risk is increasing rapidly due to a 25% drop in delivery success rate over the last 3 months. 
            AI models predict a high probability of severe disruption in the next 14 days.
          </p>
          <div className="mt-4 flex items-center space-x-3">
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-rose-500/30"
            >
              Review Alternative Suppliers
            </button>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              Contact Delta Logistics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Supplier Directory</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Users className="w-4 h-4" />
              <span>{suppliers.length} Active Suppliers</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Reliability</th>
                  <th className="p-4">Success Rate</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-medium text-slate-900 dark:text-slate-200 flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        supplier.riskLevel === 'Green' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                        supplier.riskLevel === 'Yellow' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                      }`}>
                        {supplier.riskLevel === 'Green' ? <ShieldCheck className="w-4 h-4" /> :
                         supplier.riskLevel === 'Yellow' ? <Activity className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <span>{supplier.name}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{supplier.location}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{supplier.reliabilityScore}/100</span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              supplier.reliabilityScore > 80 ? 'bg-emerald-500' :
                              supplier.reliabilityScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${supplier.reliabilityScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-mono text-xs">{supplier.successRate}%</td>
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          supplier.riskLevel === 'Green' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                          supplier.riskLevel === 'Yellow' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            supplier.riskLevel === 'Green' ? 'bg-emerald-500' :
                            supplier.riskLevel === 'Yellow' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></div>
                          {supplier.riskLevel === 'Green' ? 'Reliable' : supplier.riskLevel === 'Yellow' ? 'Medium Risk' : 'High Risk'}
                        </span>
                        {supplier.name === 'Delta Logistics' && mitigationStatus && (
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Mitigation Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleEditClick(supplier)}
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-colors">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Delivery Success Trends</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                  labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Alpha Tech" stroke="#10b981" strokeWidth={2} dot={{r: 3, strokeWidth: 2}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="Beta Components" stroke="#f59e0b" strokeWidth={2} dot={{r: 3, strokeWidth: 2}} activeDot={{r: 5}} />
                <Line type="monotone" dataKey="Delta Logistics" stroke="#ef4444" strokeWidth={2} dot={{r: 3, strokeWidth: 2}} activeDot={{r: 5}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Supplier</h3>
              <button onClick={() => setEditingSupplier(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Supplier Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reliability Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={formData.reliabilityScore || 0}
                      onChange={(e) => setFormData({ ...formData, reliabilityScore: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Success Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                      value={formData.successRate || 0}
                      onChange={(e) => setFormData({ ...formData, successRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Risk Level</label>
                  <select
                    value={formData.riskLevel || 'Green'}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as StatusLevel })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Green">Green (Reliable)</option>
                    <option value="Yellow">Yellow (Medium Risk)</option>
                    <option value="Red">Red (High Risk)</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingSupplier(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2 shadow-sm shadow-blue-500/30"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alternative Suppliers Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Alternative Supplier Recommendations</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {alternativeSuppliers.map((supplier) => (
                <div key={supplier.name} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{supplier.name}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> {supplier.location}</span>
                      <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Score: {supplier.reliabilityScore}</span>
                      <span className="flex items-center"><Activity className="w-3.5 h-3.5 mr-1" /> Avg Delivery: {supplier.avgDeliveryTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectAlternative(supplier.name)}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium rounded-lg transition-colors text-sm"
                  >
                    Select Supplier
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Supplier Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Delta Logistics</h3>
              <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <User className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">{contactDetails.person}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span>{contactDetails.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span>{contactDetails.phone}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleContactAction('Send Email')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-500/30"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>
                <button
                  onClick={() => handleContactAction('Schedule Call')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Schedule Call</span>
                </button>
                <button
                  onClick={() => handleContactAction('Send Warning Notice')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-medium rounded-xl transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Send Warning Notice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

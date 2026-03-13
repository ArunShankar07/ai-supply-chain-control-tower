import React, { useState, FormEvent } from 'react';
import { useSupplyChain } from '../store/SupplyChainContext';
import { Package, TrendingUp, AlertCircle, Plus, History, Edit3, X } from 'lucide-react';
import { Product } from '../types';

export default function Inventory() {
  const { products, restockProduct, addProduct, suppliers, addToast } = useSupplyChain();
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState<number>(0);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
    demandForecast: 0,
    restockRecommendation: 0,
    status: 'Green'
  });

  const handleRestockClick = (product: Product) => {
    setSelectedProduct(product);
    setRestockQty(product.restockRecommendation || 100);
    setRestockModalOpen(true);
  };

  const confirmRestock = () => {
    if (selectedProduct && restockQty > 0) {
      restockProduct(selectedProduct.id, restockQty);
      setRestockModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    const id = `PRD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const status = newProduct.stock! >= newProduct.demandForecast! ? 'Green' : newProduct.stock! > 0 ? 'Yellow' : 'Red';
    
    addProduct({
      ...newProduct,
      id,
      status,
      restockRecommendation: Math.max(0, newProduct.demandForecast! - newProduct.stock!)
    } as Product);
    
    setAddProductModalOpen(false);
    setNewProduct({
      name: '',
      category: 'Electronics',
      price: 0,
      stock: 0,
      demandForecast: 0,
      restockRecommendation: 0,
      status: 'Green'
    });
  };

  const handleEditProduct = (product: Product) => {
    addToast(`Editing product: ${product.name}`, 'info');
  };

  const handleViewHistory = (product: Product) => {
    addToast(`Viewing history for: ${product.name}`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory Management</h1>
        <button
          onClick={() => setAddProductModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="w-5 h-5 text-blue-200" />
          </div>
          <h2 className="text-lg font-semibold">AI Inventory Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-100">Restock Recommended</p>
              <p className="text-sm text-slate-300 mt-1">Lithium Batteries stock is critically low. Recommend restocking 2,000 units immediately to meet upcoming demand.</p>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-100">Overstock Warning</p>
              <p className="text-sm text-slate-300 mt-1">Steel Casings inventory exceeds 3-month forecast. Consider reducing future orders by 15%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-4">Product ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price/Unit</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Demand Forecast</th>
                <th className="p-4">Status</th>
                <th className="p-4">AI Recommendation</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono text-slate-500 dark:text-slate-400 text-xs">{product.id}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-slate-200 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <Package className="w-4 h-4" />
                    </div>
                    <span>{product.name}</span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{product.category}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">${product.price.toFixed(2)}</td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-200">{product.stock.toLocaleString()}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{product.demandForecast.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'Green' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                      product.status === 'Yellow' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        product.status === 'Green' ? 'bg-emerald-500' :
                        product.status === 'Yellow' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></div>
                      {product.status === 'Green' ? 'Sufficient' : product.status === 'Yellow' ? 'Low Stock' : 'Critical'}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.restockRecommendation > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-medium text-xs bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-900/50">
                        + {product.restockRecommendation.toLocaleString()} units
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs italic">Optimal</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleRestockClick(product)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-xs font-medium transition-colors border border-blue-100 dark:border-blue-900/50"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Restock</span>
                    </button>
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleViewHistory(product)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <History className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {addProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Product</h3>
              <button onClick={() => setAddProductModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Energy">Energy</option>
                      <option value="Materials">Materials</option>
                      <option value="Consumables">Consumables</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price per Unit ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Initial Stock</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Demand Forecast</label>
                    <input
                      type="number"
                      required
                      value={newProduct.demandForecast}
                      onChange={(e) => setNewProduct({ ...newProduct, demandForecast: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Warehouse Location</label>
                  <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
                    <option>Central Warehouse A</option>
                    <option>Dist. Center Europe</option>
                    <option>Regional Hub West</option>
                  </select>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddProductModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-500/30"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Restock Product</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedProduct.name} ({selectedProduct.id})</p>
              </div>
              <button onClick={() => setRestockModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Stock:</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedProduct.stock.toLocaleString()} units</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quantity to Restock</label>
                <input
                  type="number"
                  value={restockQty}
                  onChange={(e) => setRestockQty(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                />
                {selectedProduct.restockRecommendation > 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    AI recommends {selectedProduct.restockRecommendation.toLocaleString()} units
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Supplier</label>
                <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Destination Warehouse</label>
                  <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
                    <option>Central Warehouse A</option>
                    <option>Dist. Center Europe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Est. Delivery Date</label>
                  <input
                    type="date"
                    defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setRestockModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestock}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-500/30"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Drug, AppSettings } from '../types';

interface InventoryProps {
  inventory: Drug[];
  onAddDrug: (drug: Drug) => void;
  onUpdateDrug: (drug: Drug) => void;
  onDeleteDrug: (id: string) => void;
  settings: AppSettings;
}

const Inventory: React.FC<InventoryProps> = ({ inventory, onAddDrug, onUpdateDrug, onDeleteDrug, settings }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDrug, setNewDrug] = useState<Partial<Drug>>({
    name: '', genericName: '', quantity: 0, price: 0, category: '', batchNumber: '', expiryDate: ''
  });

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    setEditingId(null);
    setNewDrug({ name: '', genericName: '', quantity: 0, price: 0, category: '', batchNumber: '', expiryDate: '' });
    setShowModal(true);
  };

  const handleEditClick = (drug: Drug) => {
    setEditingId(drug.id);
    setNewDrug({ ...drug });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDrug.name && newDrug.price) {
        const drugData: Drug = {
            id: editingId || Date.now().toString(),
            name: newDrug.name!,
            genericName: newDrug.genericName || '',
            quantity: Number(newDrug.quantity) || 0,
            price: Number(newDrug.price) || 0,
            category: newDrug.category || 'General',
            batchNumber: newDrug.batchNumber || 'N/A',
            expiryDate: newDrug.expiryDate || new Date().toISOString().split('T')[0],
            description: newDrug.description || ''
        };

        if (editingId) {
            onUpdateDrug(drugData);
        } else {
            onAddDrug(drugData);
        }
        
        setShowModal(false);
        setNewDrug({ name: '', genericName: '', quantity: 0, price: 0, category: '', batchNumber: '', expiryDate: '' });
        setEditingId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gidiDark">Inventory Management</h1>
        <button 
            onClick={handleAddClick}
            className="bg-gidiBlue text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
            <i className="fa-solid fa-plus"></i> Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <i className="fa-solid fa-search absolute left-4 top-3.5 text-gray-400"></i>
        <input
            type="text"
            placeholder="Search by brand or generic name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Product Name</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Batch / Expiry</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Price</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Stock</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredInventory.map((item) => {
                        const isLowStock = item.quantity < 20;
                        const expiryDate = new Date(item.expiryDate);
                        const today = new Date();
                        const thresholdDate = new Date();
                        thresholdDate.setDate(today.getDate() + settings.expiryAlertThresholdDays);

                        const isExpired = expiryDate < today;
                        const isNearingExpiry = expiryDate >= today && expiryDate <= thresholdDate;
                        
                        return (
                            <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gidiDark">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.genericName}</p>
                                    {isNearingExpiry && <span className="text-[10px] text-amber-600 font-bold">Expiring Soon</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 border border-gray-200">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs text-gray-600 font-mono">{item.batchNumber}</p>
                                    <p className={`text-xs font-medium ${isExpired ? 'text-red-500' : isNearingExpiry ? 'text-amber-500' : 'text-gray-500'}`}>
                                        Exp: {item.expiryDate}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gidiDark">
                                    {settings.currencySymbol} {item.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                        isLowStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                        {item.quantity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center flex justify-center gap-2">
                                    <button 
                                        onClick={() => handleEditClick(item)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gidiBlue hover:text-white transition-colors flex items-center justify-center"
                                        title="Edit Product"
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button 
                                        onClick={() => onDeleteDrug(item.id)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                                        title="Delete Product"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    {filteredInventory.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-12 text-gray-400">
                                No products found matching your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Add/Edit Drug Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gidiDark">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                        <i className="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Trade Name</label>
                            <input required type="text" className="w-full p-2 border rounded-lg" 
                                value={newDrug.name} onChange={e => setNewDrug({...newDrug, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Generic Name</label>
                            <input type="text" className="w-full p-2 border rounded-lg" 
                                value={newDrug.genericName} onChange={e => setNewDrug({...newDrug, genericName: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Price ({settings.currencySymbol})</label>
                            <input required type="number" min="0" step="0.01" className="w-full p-2 border rounded-lg" 
                                value={newDrug.price} onChange={e => setNewDrug({...newDrug, price: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Quantity</label>
                            <input required type="number" min="0" className="w-full p-2 border rounded-lg" 
                                value={newDrug.quantity} onChange={e => setNewDrug({...newDrug, quantity: Number(e.target.value)})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Batch No.</label>
                            <input type="text" className="w-full p-2 border rounded-lg" 
                                value={newDrug.batchNumber} onChange={e => setNewDrug({...newDrug, batchNumber: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Expiry Date</label>
                            <input required type="date" className="w-full p-2 border rounded-lg" 
                                value={newDrug.expiryDate} onChange={e => setNewDrug({...newDrug, expiryDate: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                         <select className="w-full p-2 border rounded-lg" value={newDrug.category} onChange={e => setNewDrug({...newDrug, category: e.target.value})}>
                            <option value="">Select Category</option>
                            <option value="Pain Relief">Pain Relief</option>
                            <option value="Antibiotics">Antibiotics</option>
                            <option value="Antimalarial">Antimalarial</option>
                            <option value="Supplements">Supplements</option>
                            <option value="First Aid">First Aid</option>
                            <option value="Skincare">Skincare</option>
                            <option value="General">General</option>
                         </select>
                    </div>
                    
                    <button type="submit" className="w-full bg-gidiBlue text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-4">
                        {editingId ? 'Update Product' : 'Save Product'}
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto fade-in h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gidiDark">System Settings</h1>
        <p className="text-gray-500">Configure your pharmacy details and alerts.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Identity Section */}
          <div>
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gidiDark mb-1">Pharmacy Identity</h2>
                <p className="text-sm text-gray-400">These details will appear on your printed invoices and receipts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
                <input
                    type="text"
                    required
                    value={formData.pharmacyName}
                    onChange={e => setFormData({ ...formData, pharmacyName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
                />
                </div>
                <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
                <input
                    type="text"
                    value={formData.currencySymbol}
                    onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={e => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none"
                />
                </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div>
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gidiDark mb-1">Alerts & Notifications</h2>
                <p className="text-sm text-gray-400">Configure how GiDi warns you about expiring inventory.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Alert Threshold (Days)</label>
                    <p className="text-xs text-gray-400 mb-2">Notify when drugs expire within this many days.</p>
                    <div className="relative">
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={formData.expiryAlertThresholdDays}
                            onChange={e => setFormData({ ...formData, expiryAlertThresholdDays: Number(e.target.value) })}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue outline-none pr-12"
                        />
                        <span className="absolute right-4 top-3.5 text-gray-400 text-sm">Days</span>
                    </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                    <input 
                        type="checkbox" 
                        id="emailAlerts"
                        checked={formData.enableExpiryEmailAlerts}
                        onChange={e => setFormData({ ...formData, enableExpiryEmailAlerts: e.target.checked })}
                        className="mt-1 w-4 h-4 text-gidiBlue rounded focus:ring-gidiBlue border-gray-300"
                    />
                    <label htmlFor="emailAlerts" className="flex-1 cursor-pointer">
                        <span className="block text-sm font-bold text-gidiDark">Enable Email Alerts</span>
                        <span className="block text-xs text-gray-500 mt-1">
                            Automatically send an email report to {formData.email || 'your email'} when items are nearing expiry.
                        </span>
                    </label>
                </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t">
            {isSaved && (
              <span className="text-green-600 font-medium flex items-center gap-2 animate-fade-in">
                <i className="fa-solid fa-check-circle"></i> Settings Saved
              </span>
            )}
            <button
              type="submit"
              className="bg-gidiBlue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
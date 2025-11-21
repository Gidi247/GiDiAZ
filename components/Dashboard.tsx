import React from 'react';
import { Drug, Sale, AppSettings } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  inventory: Drug[];
  sales: Sale[];
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, sales, settings }) => {
  // Calculations
  const today = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(today.getDate() + settings.expiryAlertThresholdDays);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProducts = inventory.length;
  const lowStockCount = inventory.filter(d => d.quantity < 20 && d.quantity > 0).length;
  
  const expiredDrugs = inventory.filter(d => new Date(d.expiryDate) < today);
  const expiringSoonDrugs = inventory.filter(d => {
    const exp = new Date(d.expiryDate);
    return exp >= today && exp <= thresholdDate;
  });

  const expiredCount = expiredDrugs.length;
  const expiringSoonCount = expiringSoonDrugs.length;

  // Prepare chart data (Sales by day - mock logic for demo)
  const chartData = sales.slice(-7).map((sale, idx) => ({
      name: `Tx-${idx}`,
      amount: sale.totalAmount
  }));
  
  // Placeholder for empty chart data if no sales
  const displayData = chartData.length > 0 ? chartData : [
      { name: 'Mon', amount: 120 },
      { name: 'Tue', amount: 300 },
      { name: 'Wed', amount: 250 },
      { name: 'Thu', amount: 450 },
      { name: 'Fri', amount: 380 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gidiDark">Dashboard</h1>
        <p className="text-gray-500">Welcome back to GiDi Ecosystem.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gidiDark mt-1">{settings.currencySymbol} {totalRevenue.toFixed(2)}</h3>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg text-gidiBlue">
                    <i className="fa-solid fa-wallet"></i>
                </div>
            </div>
            <div className="text-xs text-gidiSuccess font-medium mt-2">
                <i className="fa-solid fa-arrow-trend-up mr-1"></i> +12.5% this week
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Total Products</p>
                    <h3 className="text-2xl font-bold text-gidiDark mt-1">{totalProducts}</h3>
                </div>
                <div className="bg-teal-50 p-2 rounded-lg text-gidiTeal">
                    <i className="fa-solid fa-cubes"></i>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Across all categories</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Low Stock Alerts</p>
                    <h3 className="text-2xl font-bold text-gidiDark mt-1">{lowStockCount}</h3>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg text-gidiWarning">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
            </div>
            <p className="text-xs text-gidiWarning mt-2">Requires attention</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">Expiring Soon</p>
                    <h3 className="text-2xl font-bold text-gidiDark mt-1">{expiringSoonCount + expiredCount}</h3>
                </div>
                <div className="bg-red-50 p-2 rounded-lg text-gidiError">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
            </div>
            <p className="text-xs text-gidiError mt-2">{expiredCount} already expired</p>
        </div>
      </div>

      {/* Alerts Section */}
      {(expiredCount > 0 || expiringSoonCount > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {expiredCount > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4 text-gidiError">
                        <i className="fa-solid fa-circle-exclamation text-xl"></i>
                        <h3 className="font-bold text-lg">Expired Products Detected</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">The following items have passed their expiry date and should be removed from shelves immediately.</p>
                    <div className="bg-white rounded-xl overflow-hidden border border-red-100 shadow-sm">
                        {expiredDrugs.map(drug => (
                            <div key={drug.id} className="p-3 flex justify-between items-center border-b border-red-50 last:border-0 hover:bg-red-50/50">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{drug.name}</p>
                                    <p className="text-xs text-gray-500">Batch: {drug.batchNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-red-600">{drug.expiryDate}</p>
                                    <p className="text-[10px] text-gray-400">Expired</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             )}

             {expiringSoonCount > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4 text-gidiWarning">
                        <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                        <h3 className="font-bold text-lg">Expiring Soon ({settings.expiryAlertThresholdDays} days)</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">These items are nearing their expiry date. Consider running promotions or returning to suppliers.</p>
                    <div className="bg-white rounded-xl overflow-hidden border border-amber-100 shadow-sm">
                        {expiringSoonDrugs.map(drug => (
                            <div key={drug.id} className="p-3 flex justify-between items-center border-b border-amber-50 last:border-0 hover:bg-amber-50/50">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{drug.name}</p>
                                    <p className="text-xs text-gray-500">Batch: {drug.batchNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-amber-600">{drug.expiryDate}</p>
                                    <p className="text-[10px] text-gray-400">Expires Soon</p>
                                </div>
                            </div>
                        ))}
                    </div>
                     {settings.enableExpiryEmailAlerts && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-amber-700">
                             <i className="fa-solid fa-envelope"></i>
                             <span>Email alert sent to {settings.email}</span>
                        </div>
                    )}
                </div>
             )}
        </div>
      )}

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-gidiDark mb-6">Sales Analytics</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#F1F5F9'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="amount" fill="#0057FF" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-gidiDark mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {sales.slice().reverse().slice(0, 4).map((sale) => (
                    <div key={sale.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-gidiBlue flex items-center justify-center">
                            <i className="fa-solid fa-receipt"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gidiDark">New Sale</p>
                            <p className="text-xs text-gray-500">{sale.items.length} items • {sale.paymentMethod}</p>
                        </div>
                        <span className="font-bold text-sm text-gidiDark">{settings.currencySymbol}{sale.totalAmount.toFixed(2)}</span>
                    </div>
                ))}
                {sales.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No recent transactions.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
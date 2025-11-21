import React from 'react';
import { Drug, Sale } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  inventory: Drug[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, sales }) => {
  // Calculations
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProducts = inventory.length;
  const lowStockCount = inventory.filter(d => d.quantity < 50 && d.quantity > 0).length;
  const expiredCount = inventory.filter(d => new Date(d.expiryDate) < new Date()).length;

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
                    <h3 className="text-2xl font-bold text-gidiDark mt-1">{CURRENCY_SYMBOL} {totalRevenue.toFixed(2)}</h3>
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
                    <p className="text-gray-500 text-sm font-medium">Expired</p>
                    <h3 className="text-2xl font-bold text-gidiDark mt-1">{expiredCount}</h3>
                </div>
                <div className="bg-red-50 p-2 rounded-lg text-gidiError">
                    <i className="fa-solid fa-ban"></i>
                </div>
            </div>
            <p className="text-xs text-gidiError mt-2">Remove from shelf</p>
        </div>
      </div>

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
                        <span className="font-bold text-sm text-gidiDark">{CURRENCY_SYMBOL}{sale.totalAmount.toFixed(2)}</span>
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

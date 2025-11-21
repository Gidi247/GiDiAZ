import React from 'react';
import { Sale, Drug } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnalyticsProps {
  sales: Sale[];
  inventory: Drug[];
  currencySymbol: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ sales, inventory, currencySymbol }) => {
  // Aggregate sales by day
  const salesByDate = sales.reduce((acc, sale) => {
    const date = new Date(sale.timestamp).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = { name: date, revenue: 0, count: 0 };
    }
    acc[date].revenue += sale.totalAmount;
    acc[date].count += 1;
    return acc;
  }, {} as Record<string, { name: string, revenue: number, count: number }>);

  const salesData = Object.values(salesByDate).slice(-7); // Last 7 days with data

  // Top selling products
  const productSales = sales.flatMap(sale => sale.items).reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = { name: item.name, quantity: 0 };
    }
    acc[item.name].quantity += item.cartQuantity;
    return acc;
  }, {} as Record<string, { name: string, quantity: number }>);

  const topProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  // Payment Methods
  const paymentMethods = sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const paymentData = Object.keys(paymentMethods).map(key => ({ name: key, value: paymentMethods[key] }));

  return (
    <div className="p-6 max-w-7xl mx-auto fade-in space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gidiDark">Business Analytics</h1>
        <p className="text-gray-500">Deep dive into your pharmacy's performance.</p>
      </header>

      {sales.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <i className="fa-solid fa-chart-simple text-3xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-600">No Data Available</h3>
          <p className="text-gray-400">Process some sales to see analytics.</p>
        </div>
      ) : (
        <>
          {/* Main Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gidiDark mb-6">Revenue Trend (Last 7 Active Days)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${currencySymbol}${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => [`${currencySymbol}${val.toFixed(2)}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#0057FF" strokeWidth={3} dot={{ r: 4, fill: '#0057FF' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gidiDark mb-6">Top Selling Products</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#334155' }} interval={0} />
                    <Tooltip cursor={{fill: '#F8FAFC'}} />
                    <Bar dataKey="quantity" fill="#00C896" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gidiDark mb-6">Payment Methods</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paymentData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="name" stroke="#64748B" />
                     <YAxis allowDecimals={false} stroke="#64748B" />
                     <Tooltip cursor={{fill: '#F8FAFC'}} />
                     <Bar dataKey="value" fill="#FF3D57" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
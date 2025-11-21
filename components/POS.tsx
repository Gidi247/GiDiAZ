import React, { useState } from 'react';
import { Drug, CartItem, Sale, AppSettings } from '../types';

interface POSProps {
  inventory: Drug[];
  onProcessSale: (sale: Sale) => void;
  settings: AppSettings;
}

const POS: React.FC<POSProps> = ({ inventory, onProcessSale, settings }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MOMO' | 'CARD'>('CASH');
  const [customerName, setCustomerName] = useState('');
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.quantity > 0
  );

  const addToCart = (drug: Drug) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === drug.id);
      if (existing) {
        if (existing.cartQuantity >= drug.quantity) return prev;
        return prev.map(item => 
          item.id === drug.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prev, { ...drug, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.cartQuantity + delta;
        if (newQty > 0 && newQty <= item.quantity) {
          return { ...item, cartQuantity: newQty };
        }
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const sale: Sale = {
      id: Date.now().toString(),
      items: [...cart],
      totalAmount: total,
      timestamp: Date.now(),
      paymentMethod,
      customerName: customerName || 'Walk-in Customer'
    };

    onProcessSale(sale);
    setLastSale(sale);
    setCart([]);
    setCustomerName('');
    setShowReceiptModal(true);
  };

  const handlePrintReceipt = () => {
    if (!lastSale) return;
    
    const printWindow = window.open('', '', 'width=350,height=600');
    if (!printWindow) return;

    const date = new Date(lastSale.timestamp).toLocaleString();
    
    const htmlContent = `
      <html>
        <head>
          <title>Receipt - ${settings.pharmacyName}</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; text-align: center; }
            .header { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .header h1 { font-size: 16px; margin: 0; font-weight: bold; }
            .header p { margin: 2px 0; font-size: 10px; }
            .info { text-align: left; margin-bottom: 10px; font-size: 10px; }
            table { width: 100%; text-align: left; margin-bottom: 10px; }
            th { border-bottom: 1px solid #000; }
            td { padding: 4px 0; }
            .totals { border-top: 1px dashed #000; padding-top: 10px; text-align: right; }
            .totals div { margin-bottom: 2px; }
            .footer { margin-top: 20px; font-size: 10px; border-top: 1px solid #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${settings.pharmacyName}</h1>
            <p>${settings.address}</p>
            <p>${settings.phoneNumber}</p>
          </div>
          <div class="info">
            <p>Date: ${date}</p>
            <p>Receipt #: ${lastSale.id.slice(-6)}</p>
            <p>Customer: ${lastSale.customerName}</p>
            <p>Pay Method: ${lastSale.paymentMethod}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th style="text-align:right">Amt</th>
              </tr>
            </thead>
            <tbody>
              ${lastSale.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.cartQuantity}</td>
                  <td style="text-align:right">${settings.currencySymbol}${(item.price * item.cartQuantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div>Subtotal: ${settings.currencySymbol}${(lastSale.totalAmount - (lastSale.totalAmount * settings.taxRate / (100 + settings.taxRate))).toFixed(2)}</div>
            <div>Tax (${settings.taxRate}%): ${settings.currencySymbol}${(lastSale.totalAmount * settings.taxRate / (100 + settings.taxRate)).toFixed(2)}</div>
            <div style="font-weight:bold; font-size:14px">Total: ${settings.currencySymbol}${lastSale.totalAmount.toFixed(2)}</div>
          </div>
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>Powered by GiDi Healthcare</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    setShowReceiptModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Left Side: Product Selection */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gidiDark mb-1">Point of Sale</h1>
            <p className="text-gray-500 text-sm">Select items to add to the cart.</p>
        </div>
        
        <div className="mb-6 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400"></i>
            <input
                type="text"
                placeholder="Scan barcode or search product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gidiBlue focus:border-transparent shadow-sm outline-none"
                autoFocus
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-20">
            {filteredInventory.map(drug => (
                <div 
                    key={drug.id} 
                    onClick={() => addToCart(drug)}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gidiBlue cursor-pointer transition-all group"
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold bg-blue-50 text-gidiBlue px-2 py-1 rounded-md">{drug.category}</span>
                        <span className="text-xs text-gray-400">{drug.quantity} in stock</span>
                    </div>
                    <h3 className="font-semibold text-gidiDark truncate">{drug.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 truncate">{drug.genericName}</p>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="font-bold text-lg text-gidiDark">{settings.currencySymbol}{drug.price.toFixed(2)}</span>
                        <button className="w-8 h-8 rounded-full bg-gray-100 text-gidiBlue flex items-center justify-center group-hover:bg-gidiBlue group-hover:text-white transition-colors">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Right Side: Cart & Checkout */}
      <div className="w-96 bg-white shadow-2xl z-10 flex flex-col h-full border-l border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg text-gidiDark">Current Order</h2>
                <span className="bg-blue-100 text-gidiBlue text-xs font-bold px-2 py-1 rounded">{cart.length} Items</span>
            </div>
            <input 
                type="text" 
                placeholder="Customer Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 text-sm border rounded-lg bg-white"
            />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <i className="fa-solid fa-cart-shopping text-4xl mb-2 opacity-20"></i>
                    <p>Cart is empty</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gidiDark truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">{settings.currencySymbol}{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">-</button>
                            <span className="text-sm font-bold w-4 text-center">{item.cartQuantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 ml-1">
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>
                ))
            )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{settings.currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-sm text-gray-500">
                    <span>Tax ({settings.taxRate}%)</span>
                    <span>{settings.currencySymbol}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gidiDark">
                    <span>Total</span>
                    <span>{settings.currencySymbol}{total.toFixed(2)}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
                {['CASH', 'MOMO', 'CARD'].map(method => (
                    <button 
                        key={method}
                        onClick={() => setPaymentMethod(method as any)}
                        className={`py-2 rounded-lg text-xs font-bold border ${
                            paymentMethod === method 
                            ? 'bg-gidiDark text-white border-gidiDark' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {method}
                    </button>
                ))}
            </div>

            <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-4 rounded-xl bg-gidiSuccess text-white font-bold text-lg shadow-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
            >
                <i className="fa-solid fa-check"></i> Complete Sale
            </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gidiSuccess text-3xl">
                    <i className="fa-solid fa-check"></i>
                </div>
                <h2 className="text-2xl font-bold text-gidiDark mb-2">Sale Successful!</h2>
                <p className="text-gray-500 mb-6">Transaction recorded.</p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handlePrintReceipt}
                        className="w-full py-3 bg-gidiBlue text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-print"></i> Print Receipt
                    </button>
                    <button 
                        onClick={() => setShowReceiptModal(false)}
                        className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        New Sale
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default POS;
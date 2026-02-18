
import React from 'react';
import { Item, Warehouse, Transaction, ItemStatus, UserRole } from '../types';
import { BarChart3, FileDown, TrendingUp, AlertCircle, PieChart } from 'lucide-react';

interface Props {
  items: Item[];
  warehouses: Warehouse[];
  transactions: Transaction[];
  role: UserRole;
  // Added canExport to fix type error in App.tsx
  canExport: boolean;
}

const Reports: React.FC<Props> = ({ items, warehouses, transactions, role, canExport }) => {
  const agingStock = items.filter(i => i.status === ItemStatus.OLD_USED);
  const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.trueUnitCost), 0);
  const agingValue = agingStock.reduce((sum, i) => sum + (i.quantity * i.trueUnitCost), 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Operational Analytics</h2>
          <p className="text-slate-500">Automated monthly summaries and forecasting (PHP)</p>
        </div>
        {/* Only show export button if user has permission */}
        {canExport && (
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all">
            <FileDown className="w-4 h-4" /> Export for Audit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2 font-black text-[10px] uppercase tracking-widest">
              <TrendingUp className="w-3 h-3" /> Consumption Velocity
            </div>
            <h4 className="text-3xl font-black text-slate-900">4.2%</h4>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">Average monthly stock turnover rate across all hubs.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-500 mb-2 font-black text-[10px] uppercase tracking-widest">
              <AlertCircle className="w-3 h-3" /> Aging Liability (PHP)
            </div>
            <h4 className="text-3xl font-black text-slate-900">₱{agingValue.toLocaleString()}</h4>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">Value of stock flagged as Old/Used (40% discount provisioned).</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 mb-2 font-black text-[10px] uppercase tracking-widest">
              <PieChart className="w-3 h-3" /> Asset Distribution
            </div>
            <h4 className="text-3xl font-black text-slate-900">{warehouses.length}</h4>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">Active warehouses managing unique prefix-based inventory.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Aging Stock Breakdown (PHP)</h3>
          <span className="bg-slate-50 px-3 py-1 rounded-full text-xs font-bold text-slate-500">{agingStock.length} Items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Item Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Barcode</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Potential Value</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Report Loss (40%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {agingStock.map(i => (
                <tr key={i.id} className="text-sm">
                  <td className="px-6 py-4 font-bold text-slate-700">{i.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{i.barcode}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-600">{i.quantity}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">₱{(i.quantity * i.trueUnitCost).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-rose-500">-₱{(i.quantity * i.trueUnitCost * 0.4).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-indigo-600 p-8 rounded-3xl shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 p-4">
          <BarChart3 className="w-64 h-64 -mr-20 -mt-20" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-black mb-4">Gemini Forecast Engine</h3>
          <p className="text-indigo-100 font-medium leading-relaxed mb-6">
            Based on current stock levels and your 4.2% consumption velocity, you are likely to run out of "Reinforcement Steel" in Hub WHA within 14 days. Re-order is recommended.
          </p>
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
            Optimize Re-order Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;

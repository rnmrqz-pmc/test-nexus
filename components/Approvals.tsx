
import React from 'react';
import { Transaction, Item, UserRole, Warehouse } from '../types';
import { CheckCircle2, XCircle, Clock, ArrowRightLeft, User, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface ApprovalsProps {
  transactions: Transaction[];
  items: Item[];
  warehouses: Warehouse[];
  onApprove: (txId: string) => void;
  role: UserRole;
}

const Approvals: React.FC<ApprovalsProps> = ({ transactions, items, warehouses, onApprove, role }) => {
  const pendingTxs = transactions.filter(t => t.status === 'PENDING');
  const pastTxs = transactions.filter(t => t.status !== 'PENDING');

  const getItemName = (id: string) => items.find(i => i.id === id)?.name || 'Unknown Item';
  const getWarehouseName = (id?: string) => warehouses.find(w => w.id === id)?.name || 'Unknown Hub';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900">Gatekeeper Workflow</h2>
        <p className="text-slate-500">Stock updates require administrative approval</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4" /> Pending Requests ({pendingTxs.length})
          </h3>
          {pendingTxs.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <p className="text-slate-400">All requests have been processed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingTxs.map(tx => {
                const isTransfer = tx.type === 'TRANSFER';
                return (
                  <div key={tx.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-tighter mb-2 inline-block ${isTransfer ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                          {tx.type.replace('_', ' ')}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">{getItemName(tx.itemId)}</h4>
                        
                        {isTransfer ? (
                          <div className="flex items-center gap-2 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                             <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-400 uppercase">From Hub</span>
                               <span className="text-[10px] font-bold text-slate-700 truncate">{getWarehouseName(tx.warehouseId)}</span>
                             </div>
                             <ArrowRight className="w-3 h-3 text-slate-300 mx-1" />
                             <div className="flex flex-col">
                               <span className="text-[8px] font-black text-slate-400 uppercase">Target Hub</span>
                               <span className="text-[10px] font-bold text-indigo-600 truncate">{getWarehouseName(tx.targetWarehouseId)}</span>
                             </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold mt-1 uppercase">
                            <MapPin className="w-3 h-3" /> Location: {getWarehouseName(tx.warehouseId)}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-3">
                          <User className="w-3 h-3" /> {tx.staffName}
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <Calendar className="w-3 h-3" /> {new Date(tx.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl border font-black text-xl ml-4 ${isTransfer ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                        {tx.quantity}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onApprove(tx.id)}
                        className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {isTransfer ? 'Confirm Relocation' : 'Approve & Deduct'}
                      </button>
                      <button className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                        <XCircle className="w-5 h-5 text-slate-300" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">History Log</h3>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Process</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Qty</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pastTxs.map(tx => (
                  <tr key={tx.id} className="text-sm">
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-400 uppercase">{tx.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{getItemName(tx.itemId)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        {tx.type.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-slate-900">{tx.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${tx.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Approvals;


import React from 'react';
import { Transaction, Item, UserRole } from '../types';
import { CheckCircle2, XCircle, Clock, ArrowRightLeft, User, Calendar } from 'lucide-react';

interface ApprovalsProps {
  transactions: Transaction[];
  items: Item[];
  onApprove: (txId: string) => void;
  role: UserRole;
}

const Approvals: React.FC<ApprovalsProps> = ({ transactions, items, onApprove, role }) => {
  const pendingTxs = transactions.filter(t => t.status === 'PENDING');
  const pastTxs = transactions.filter(t => t.status !== 'PENDING');

  const getItemName = (id: string) => items.find(i => i.id === id)?.name || 'Unknown Item';

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
              {pendingTxs.map(tx => (
                <div key={tx.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-tighter mb-2 inline-block">
                        {tx.type.replace('_', ' ')}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{getItemName(tx.itemId)}</h4>
                      <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                        <User className="w-3 h-3" /> {tx.staffName}
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <Calendar className="w-3 h-3" /> {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                      <span className="text-indigo-600 font-black text-lg">-{tx.quantity}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => onApprove(tx.id)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Deduct
                    </button>
                    <button className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                      <XCircle className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">History</h3>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Qty</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pastTxs.map(tx => (
                  <tr key={tx.id} className="text-sm">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{tx.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{getItemName(tx.itemId)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        {tx.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{tx.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${tx.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
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

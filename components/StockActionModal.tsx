
import React, { useState } from 'react';
import { Item } from '../types';
import { X, ArrowUpCircle, ArrowDownCircle, AlertCircle, Package, ChevronLeft, Calculator } from 'lucide-react';

interface StockActionModalProps {
  item: Item;
  type: 'IN' | 'OUT';
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

const StockActionModal: React.FC<StockActionModalProps> = ({ item, type, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const isInbound = type === 'IN';
  
  const validateAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }
    if (!isInbound && quantity > item.quantity) {
      setError(`Cannot stock out more than available inventory (${item.quantity}).`);
      return;
    }
    onConfirm(quantity);
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col md:items-center md:justify-center">
      <div className="hidden md:block absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex-1 md:flex-initial w-full md:max-w-md bg-white md:rounded-[2rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in duration-300">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 text-slate-400">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className={`p-2 rounded-xl text-white ${isInbound ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {isInbound ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">{isInbound ? 'Stock Inbound' : 'Stock Outbound'}</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inventory adjustment</p>
              </div>
            </div>
            <button onClick={onClose} className="hidden md:block p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex items-start gap-3">
             <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600">
                <Package className="w-4 h-4" />
             </div>
             <div>
                <p className="text-xs font-black text-slate-900 leading-tight">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.barcode}</p>
                <div className="flex items-center gap-2 mt-1.5">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Current Stock:</span>
                   <span className="text-[10px] font-black text-slate-900">{item.quantity} Units</span>
                </div>
             </div>
          </div>

          <form onSubmit={validateAndConfirm} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adjustment Quantity</label>
              <div className="relative">
                <input 
                  autoFocus
                  required
                  type="number" 
                  min="1"
                  className={`w-full bg-slate-50 border ${error ? 'border-rose-300' : 'border-slate-200'} rounded-2xl px-5 py-4 text-xl font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all`}
                  value={quantity}
                  onChange={e => {
                    setQuantity(parseInt(e.target.value) || 0);
                    setError(null);
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">
                  Units
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-rose-500 mt-2 px-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold">{error}</p>
                </div>
              )}
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Adjustment Value</span>
                  </div>
                  <span className="text-sm font-black text-indigo-600">
                    ₱{(quantity * item.trueUnitCost).toLocaleString()}
                  </span>
               </div>
               <p className="text-[9px] text-indigo-500/70 font-bold mt-1 uppercase tracking-tight">
                 Based on current landed unit cost of ₱{item.trueUnitCost.toFixed(2)}
               </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className={`flex-[2] py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all text-white ${isInbound ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'}`}
              >
                {isInbound ? 'Add to Inventory' : 'Confirm Stock Out'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockActionModal;

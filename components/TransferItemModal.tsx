
import React, { useState } from 'react';
import { Item, Warehouse } from '../types';
import { X, ArrowRightLeft, AlertCircle, Package, MapPin, ChevronLeft, ArrowRight } from 'lucide-react';

interface TransferItemModalProps {
  item: Item;
  warehouses: Warehouse[];
  onClose: () => void;
  onConfirm: (targetWarehouseId: string, quantity: number) => void;
}

const TransferItemModal: React.FC<TransferItemModalProps> = ({ item, warehouses, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [targetWhId, setTargetWhId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const currentWarehouse = warehouses.find(w => w.id === item.warehouseId);
  const otherWarehouses = warehouses.filter(w => w.id !== item.warehouseId);

  const validateAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetWhId) {
      setError("Please select a destination warehouse.");
      return;
    }
    if (quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }
    if (quantity > item.quantity) {
      setError(`Cannot transfer more than available stock (${item.quantity}).`);
      return;
    }
    onConfirm(targetWhId, quantity);
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
              <div className="p-2 rounded-xl text-white bg-indigo-600 shadow-lg shadow-indigo-200">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Inter-Hub Transfer</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Relocate Inventory Assets</p>
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
                <div className="flex items-center gap-1.5 mt-1.5">
                   <MapPin className="w-3 h-3 text-slate-400" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">From: {currentWarehouse?.name}</span>
                </div>
             </div>
          </div>

          <form onSubmit={validateAndConfirm} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Warehouse</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  value={targetWhId}
                  onChange={e => {
                    setTargetWhId(e.target.value);
                    setError(null);
                  }}
                >
                  <option value="" disabled>Select Target Location</option>
                  {otherWarehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.prefix})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transfer Quantity</label>
                <div className="relative">
                  <input 
                    required
                    type="number" 
                    min="1"
                    className={`w-full bg-slate-50 border ${error ? 'border-rose-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-lg font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all`}
                    value={quantity}
                    onChange={e => {
                      setQuantity(parseInt(e.target.value) || 0);
                      setError(null);
                    }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] uppercase">
                    / {item.quantity} available
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-rose-500 px-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold">{error}</p>
                </div>
              )}
            </div>

            <div className="bg-indigo-50 p-5 rounded-[2rem] border border-indigo-100 relative overflow-hidden">
               <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Transfer Summary</span>
                    <span className="text-sm font-black text-indigo-900">{quantity} units move to new hub</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-400" />
               </div>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
              >
                Request Transfer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferItemModal;

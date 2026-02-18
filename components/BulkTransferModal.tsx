
import React, { useState } from 'react';
import { Item, Warehouse } from '../types';
import { X, ArrowRightLeft, MapPin, Box, ChevronLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface BulkTransferModalProps {
  selectedItems: Item[];
  warehouses: Warehouse[];
  onClose: () => void;
  onConfirm: (targetWarehouseId: string) => void;
}

const BulkTransferModal: React.FC<BulkTransferModalProps> = ({ selectedItems, warehouses, onClose, onConfirm }) => {
  const [targetWhId, setTargetWhId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetWhId) {
      setError("Please select a destination hub.");
      return;
    }
    onConfirm(targetWhId);
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col md:items-center md:justify-center">
      <div className="hidden md:block absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex-1 md:flex-initial w-full md:max-w-lg bg-white md:rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-6 md:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 text-slate-400">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="p-2 rounded-xl text-white bg-indigo-600 shadow-lg shadow-indigo-200">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Bulk Hub Relocation</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Move {selectedItems.length} Assets</p>
              </div>
            </div>
            <button onClick={onClose} className="hidden md:block p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleConfirm} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Warehouse</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  value={targetWhId}
                  onChange={e => {
                    setTargetWhId(e.target.value);
                    setError(null);
                  }}
                >
                  <option value="" disabled>Select Target Location</option>
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.prefix})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manifest Summary</label>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <Box className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight">{item.name}</p>
                            <p className="text-[10px] font-mono text-slate-400">Current Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-300" />
                      </div>
                    ))}
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

            <div className="bg-indigo-900 p-6 rounded-[2.5rem] text-white relative overflow-hidden">
               <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Action Impact</span>
                    <span className="text-sm font-black">Transfer full stock for {selectedItems.length} items</span>
                  </div>
                  <button 
                    type="submit"
                    className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all"
                  >
                    Initiate Bulk Transfer
                  </button>
               </div>
            </div>

            <div className="md:hidden pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="w-full py-4 text-slate-400 font-bold text-sm"
              >
                Cancel Process
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkTransferModal;

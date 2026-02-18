
import React from 'react';
import { Item, Warehouse } from '../types';
import { X, Printer, Download, ChevronLeft, Info } from 'lucide-react';

interface BarcodeLabelModalProps {
  items: Item[];
  warehouses: Warehouse[];
  onClose: () => void;
}

const BarcodeLabelModal: React.FC<BarcodeLabelModalProps> = ({ items, warehouses, onClose }) => {
  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || 'N/A';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col md:items-center md:justify-center">
      <div className="hidden md:block absolute inset-0 bg-slate-900/80 backdrop-blur-sm no-print" onClick={onClose} />
      
      <div className="flex-1 md:flex-initial w-full md:max-w-4xl bg-white md:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Hidden on print */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 no-print">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="md:hidden p-2 -ml-2 text-slate-400">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="p-2 rounded-xl text-white bg-slate-900 shadow-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Label Manifest</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Generate {items.length} scannable stickers</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print Stickers
            </button>
            <button onClick={onClose} className="hidden md:block p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Info Box - Hidden on print */}
        <div className="px-6 md:px-8 py-4 bg-slate-50 border-b border-slate-100 no-print">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-indigo-500 mt-0.5" />
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Formatted for <b>4" x 2"</b> thermal labels. Ensure "Background Graphics" is enabled in print settings for optimal visual scanning.
            </p>
          </div>
        </div>

        {/* Labels Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-slate-200/50 print:bg-white print:p-0 print-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border-2 border-slate-900 p-4 md:p-6 rounded-lg flex flex-col justify-between h-[180px] w-full print:h-[2in] print:w-[4in] print:border-black print:rounded-none shadow-sm print:shadow-none"
              >
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-black">Nexus Pro Registry</p>
                    <h3 className="text-sm font-black text-slate-900 truncate print:text-black">{item.name}</h3>
                    <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase print:text-black">Hub: {getWarehouseName(item.warehouseId)}</p>
                  </div>
                  <div className="bg-slate-900 text-white px-2 py-1 rounded text-[8px] font-black print:bg-black print:text-white">
                    {item.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center my-2">
                  <div className="barcode-font text-slate-900 print:text-black text-center leading-none">
                    {item.barcode}
                  </div>
                  <div className="text-[10px] font-mono font-black tracking-[0.3em] text-slate-400 mt-1 print:text-black">
                    {item.barcode}
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-slate-100 pt-2 print:border-black">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest print:text-black">Generated: {new Date().toLocaleDateString()}</span>
                   <span className="text-[10px] font-black text-slate-900 print:text-black">PH-SKU-{item.id.replace('it-', '')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Spacer */}
        <div className="h-20 md:hidden no-print" />
      </div>
    </div>
  );
};

export default BarcodeLabelModal;

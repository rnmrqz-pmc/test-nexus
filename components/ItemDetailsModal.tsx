
import React from 'react';
import { Item, Warehouse, Category, ItemStatus } from '../types';
// Added Info icon to the import list
import { X, Box, MapPin, Layers, Calendar, DollarSign, Package, Truck, ShieldAlert, ReceiptText, TrendingUp, ChevronLeft, Info } from 'lucide-react';

interface ItemDetailsModalProps {
  item: Item;
  onClose: () => void;
  warehouse?: Warehouse;
  category?: Category;
  allCategories: Category[];
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose, warehouse, category, allCategories }) => {
  const getFullCategoryPath = (catId?: string) => {
    if (!catId) return 'N/A';
    const cat = allCategories.find(c => c.id === catId);
    if (!cat) return 'N/A';
    const parent = allCategories.find(p => p.id === cat.parentId);
    return parent ? `${parent.name} › ${cat.name}` : cat.name;
  };

  const statusColors = {
    [ItemStatus.RAW]: 'bg-slate-100 text-slate-700',
    [ItemStatus.FINISHED]: 'bg-indigo-100 text-indigo-700',
    [ItemStatus.GOOD_AS_NEW]: 'bg-emerald-100 text-emerald-700',
    [ItemStatus.OLD_USED]: 'bg-amber-100 text-amber-700 ring-1 ring-amber-500/20',
  };

  const costItems = [
    { label: 'Base Cost', value: item.baseCost, icon: Package, color: 'text-slate-600' },
    { label: 'Freight', value: item.freight, icon: Truck, color: 'text-indigo-600' },
    { label: 'Duties', value: item.duties, icon: ShieldAlert, color: 'text-rose-600' },
    { label: 'Taxes', value: item.taxes, icon: ReceiptText, color: 'text-emerald-600' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex flex-col md:items-center md:justify-center">
      <div className="hidden md:block absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="flex-1 md:flex-initial w-full md:max-w-2xl bg-white md:rounded-[2.5rem] shadow-2xl relative overflow-y-auto animate-in slide-in-from-bottom-full md:fade-in md:zoom-in duration-300">
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-slate-50 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center justify-between mb-2">
             <button onClick={onClose} className="md:hidden p-2 -ml-4 text-slate-400">
                <ChevronLeft className="w-6 h-6" />
              </button>
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Box className="w-6 h-6" />
            </div>
            <button onClick={onClose} className="hidden md:block p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{item.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              {item.barcode}
            </span>
            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusColors[item.status]}`}>
              {item.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-10">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{warehouse?.name || 'Unknown Hub'}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Category</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{getFullCategoryPath(item.categoryId)}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Package className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Stock Level</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{item.quantity} Units</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Last Entry</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{new Date(item.lastUpdated).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Landed Cost breakdown */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
              <DollarSign className="w-3 h-3" /> Financial Valuation
            </h3>
            
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <TrendingUp className="w-48 h-48" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1">True Unit Cost (Landed)</p>
                  <h4 className="text-5xl font-black">₱{item.trueUnitCost.toFixed(2)}</h4>
                  <p className="text-slate-400 text-xs mt-3 max-w-[200px] font-medium">Calculated total acquisition cost per individual unit.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 md:pl-8">
                  {costItems.map((cost) => (
                    <div key={cost.label}>
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                        <cost.icon className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-wider">{cost.label}</span>
                      </div>
                      <p className="text-sm font-bold">₱{cost.value.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
             <div className="flex gap-4">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shrink-0 h-fit">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-amber-900 uppercase tracking-wider">Audit Note</h5>
                  <p className="text-xs text-amber-700 leading-relaxed mt-1 font-medium">
                    This item is valued using the <b>Landed Cost</b> methodology. All duties and freight costs are capitalized and amortized across the current inventory quantity of {item.quantity}.
                  </p>
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 md:p-10 bg-slate-50/50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="w-full md:w-auto bg-white border border-slate-200 text-slate-900 px-8 py-3.5 rounded-2xl font-black text-sm shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;

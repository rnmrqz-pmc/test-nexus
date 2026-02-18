
import React, { useState } from 'react';
import { Item, Warehouse, Category, ItemStatus } from '../types';
import { X, Calculator, Plus, Package, Truck, ShieldAlert, ReceiptText, ChevronLeft } from 'lucide-react';

interface AddItemModalProps {
  onClose: () => void;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  warehouses: Warehouse[];
  categories: Category[];
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, setItems, warehouses, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    warehouseId: warehouses[0]?.id || '',
    categoryId: categories[0]?.id || '',
    quantity: 1,
    baseCost: 0,
    freight: 0,
    duties: 0,
    taxes: 0,
    status: ItemStatus.RAW
  });

  const trueUnitCost = (formData.baseCost + formData.freight + formData.duties + formData.taxes) / (formData.quantity || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wh = warehouses.find(w => w.id === formData.warehouseId);
    const cat = categories.find(c => c.id === formData.categoryId);
    const id = `it-${Date.now()}`;
    const newItem: Item = {
      id,
      name: formData.name,
      warehouseId: formData.warehouseId,
      categoryId: formData.categoryId,
      status: formData.status,
      barcode: `${wh?.prefix || 'WH'}-${cat?.code || 'GEN'}-${id}`,
      quantity: formData.quantity,
      baseCost: formData.baseCost,
      freight: formData.freight,
      duties: formData.duties,
      taxes: formData.taxes,
      trueUnitCost: trueUnitCost,
      lastUpdated: new Date().toISOString()
    };
    setItems(prev => [newItem, ...prev]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:items-center md:justify-center">
      <div className="hidden md:block absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex-1 md:flex-initial w-full md:max-w-2xl bg-white md:rounded-[2rem] shadow-2xl relative overflow-y-auto animate-in slide-in-from-bottom-full md:slide-in-from-bottom-4 duration-300">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 text-slate-400">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="bg-indigo-600 p-2 rounded-xl text-white hidden md:block">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-900">Add Stock</h2>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-widest">Entry Valuation</p>
              </div>
            </div>
            <button onClick={onClose} className="hidden md:block p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Details</label>
                <input required type="text" placeholder="Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                <input required type="number" min="1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Warehouse</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold" value={formData.warehouseId} onChange={e => setFormData({...formData, warehouseId: e.target.value})}>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                  {categories.map(c => {
                    const parent = categories.find(p => p.id === c.parentId);
                    return (
                      <option key={c.id} value={c.id}>
                        {parent ? `${parent.name} › ${c.name}` : c.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Landed Cost (PHP)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <CostField label="Base" icon={<Package />} value={formData.baseCost} onChange={v => setFormData({...formData, baseCost: v})} />
                <CostField label="Freight" icon={<Truck />} value={formData.freight} onChange={v => setFormData({...formData, freight: v})} />
                <CostField label="Duties" icon={<ShieldAlert />} value={formData.duties} onChange={v => setFormData({...formData, duties: v})} />
                <CostField label="Taxes" icon={<ReceiptText />} value={formData.taxes} onChange={v => setFormData({...formData, taxes: v})} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-indigo-900 rounded-3xl text-white gap-4">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Unit Price</p>
                <p className="text-4xl font-black">₱{trueUnitCost.toFixed(2)}</p>
              </div>
              <button type="submit" className="w-full md:w-auto bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">
                Register Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CostField = ({ label, icon, value, onChange }: { label: string, icon: React.ReactNode, value: number, onChange: (v: number) => void }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5 text-slate-400">
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-3 h-3' })}
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </div>
    <div className="relative">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">₱</span>
      <input type="number" className="w-full bg-white border border-slate-200 rounded-xl pl-5 pr-2 py-3 text-xs focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-900" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} />
    </div>
  </div>
);

export default AddItemModal;

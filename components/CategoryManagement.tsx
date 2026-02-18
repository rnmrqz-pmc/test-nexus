
import React, { useState } from 'react';
import { Category, UserRole } from '../types';
import { Plus, Trash2, Edit3, ChevronRight, Tags, Info, ArrowRight, Save, X } from 'lucide-react';

interface CategoryManagementProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  role: UserRole;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, setCategories, role }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', code: '', parentId: '' });

  const mainCategories = categories.filter(c => !c.parentId);

  const handleAdd = () => {
    if (!newCat.name || !newCat.code) return;
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: newCat.name,
      code: newCat.code.toUpperCase(),
      parentId: newCat.parentId || undefined
    };
    setCategories(prev => [...prev, cat]);
    setNewCat({ name: '', code: '', parentId: '' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category? Sub-categories and items might be affected.')) {
      setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Taxonomy Architect</h2>
          <p className="text-slate-500">Manage nested categorization and barcode mapping</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
              <input 
                type="text" 
                placeholder="e.g. Mechanical" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold"
                value={newCat.name}
                onChange={e => setNewCat({...newCat, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Barcode Code (3 chars)</label>
              <input 
                type="text" 
                maxLength={3}
                placeholder="MEC" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold"
                value={newCat.code}
                onChange={e => setNewCat({...newCat, code: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Category</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-900 font-bold"
                value={newCat.parentId}
                onChange={e => setNewCat({...newCat, parentId: e.target.value})}
              >
                <option value="">(None - Set as Main)</option>
                {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleAdd}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Taxonomy Node
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {mainCategories.map(main => (
          <div key={main.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
            <div className="p-5 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Tags className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{main.name}</h3>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                    Code: {main.code}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(main.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="p-4 bg-white space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sub-categories</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {categories.filter(c => c.parentId === main.id).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-slate-300" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">{sub.name}</p>
                        <p className="text-[9px] font-mono text-slate-400 uppercase">{sub.code}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button 
                  onClick={() => { setIsAdding(true); setNewCat({...newCat, parentId: main.id}); }}
                  className="flex items-center justify-center p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all group/btn"
                >
                  <Plus className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Sub</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 flex items-start gap-4">
        <Info className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">System Guidance</h4>
          <p className="text-xs text-amber-700 leading-relaxed mt-1">
            Category codes are used to generate unique SKUs. For example, a "Commercial" sub-category under "Construction" with code <span className="font-mono font-bold">COM</span> will produce stickers like <span className="font-mono bg-amber-100 px-1 rounded">WHA-COM-XXXX</span>. Ensure codes are distinct within their tiers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;


import React, { useState } from 'react';
import { Item, Category, Warehouse, ItemStatus, UserRole, Permission } from '../types';
import { Search, Filter, Plus, Minus, Info, Tag, Layers, ChevronRight, Box, Trash2, FileDown, Eye, Edit3, ArrowRightLeft } from 'lucide-react';
import AddItemModal from './AddItemModal';
import ItemDetailsModal from './ItemDetailsModal';
import EditItemModal from './EditItemModal';
import StockActionModal from './StockActionModal';
import TransferItemModal from './TransferItemModal';

interface InventoryProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  categories: Category[];
  warehouses: Warehouse[];
  onStockOut: (item: Item, qty: number) => void;
  onTransfer: (item: Item, targetWhId: string, qty: number) => void;
  role: UserRole;
  permissions: Permission[];
}

const Inventory: React.FC<InventoryProps> = ({ items, setItems, categories, warehouses, onStockOut, onTransfer, role, permissions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItemForView, setSelectedItemForView] = useState<Item | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
  const [itemToTransfer, setItemToTransfer] = useState<Item | null>(null);
  
  // New state for quantitative adjustments
  const [adjustmentState, setAdjustmentState] = useState<{
    item: Item | null,
    type: 'IN' | 'OUT' | null
  }>({ item: null, type: null });

  const canAction = (action: 'update' | 'delete' | 'export') => 
    permissions.some(p => p.moduleId === 'inventory' && p.actions.includes(action));

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return 'N/A';
    const parent = categories.find(p => p.id === cat.parentId);
    return parent ? `${parent.name} / ${cat.name}` : cat.name;
  };

  const getWarehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || 'N/A';

  const statusColors = {
    [ItemStatus.RAW]: 'bg-slate-100 text-slate-700',
    [ItemStatus.FINISHED]: 'bg-indigo-100 text-indigo-700',
    [ItemStatus.GOOD_AS_NEW]: 'bg-emerald-100 text-emerald-700',
    [ItemStatus.OLD_USED]: 'bg-amber-100 text-amber-700 ring-1 ring-amber-500/20',
  };

  const deleteItem = (id: string) => {
    if (confirm('Permanently delete SKU?')) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setItemToEdit(null);
  };

  const handleAdjustStock = (qty: number) => {
    if (!adjustmentState.item || !adjustmentState.type) return;

    if (adjustmentState.type === 'OUT') {
      onStockOut(adjustmentState.item, qty);
    } else {
      setItems(prev => prev.map(i => 
        i.id === adjustmentState.item?.id 
          ? { ...i, quantity: i.quantity + qty, lastUpdated: new Date().toISOString() } 
          : i
      ));
    }
    setAdjustmentState({ item: null, type: null });
  };

  const handleConfirmTransfer = (targetWhId: string, qty: number) => {
    if (itemToTransfer) {
      onTransfer(itemToTransfer, targetWhId, qty);
      setItemToTransfer(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">Inventory</h2>
          <p className="text-xs md:text-sm text-slate-500">Live tracking and stock management</p>
        </div>
        <div className="flex gap-2">
          {canAction('export') && (
            <button className="hidden md:flex bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 items-center gap-2">
              <FileDown className="w-4 h-4" /> Export CSV
            </button>
          )}
          {canAction('update') && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 text-white p-2.5 md:px-5 md:py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5 md:w-4 md:h-4" /> 
              <span className="hidden md:inline">Add New SKU</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or barcode..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'}`}
          >
            All
          </button>
          {categories.filter(c => !c.parentId).map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Item</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{item.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.barcode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[item.status]}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{getCategoryName(item.categoryId)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{getWarehouseName(item.warehouseId)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{item.quantity} units</span>
                      <span className="text-[10px] text-slate-400 font-medium">₱{(item.quantity * item.trueUnitCost).toLocaleString()} total</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedItemForView(item)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canAction('update') && (
                        <>
                          <button 
                            onClick={() => setItemToEdit(item)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit SKU"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setItemToTransfer(item)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Transfer Hub"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setAdjustmentState({ item, type: 'IN' })}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Stock In"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setAdjustmentState({ item, type: 'OUT' })}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Stock Out"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {canAction('delete') && (
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete SKU"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3 items-start">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 border border-slate-100" onClick={() => setSelectedItemForView(item)}>
                  <Box className="w-5 h-5" />
                </div>
                <div onClick={() => setSelectedItemForView(item)}>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100">
                      {item.barcode}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${statusColors[item.status]}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-900">{item.quantity}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Units</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter truncate">{getCategoryName(item.categoryId)}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedItemForView(item)}
                  className="bg-slate-50 text-slate-400 p-2 rounded-xl active:bg-slate-100"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {canAction('update') && (
                  <>
                    <button 
                      onClick={() => setItemToEdit(item)}
                      className="bg-slate-50 text-slate-400 p-2 rounded-xl active:bg-slate-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setItemToTransfer(item)}
                      className="bg-slate-50 text-slate-400 p-2 rounded-xl active:bg-slate-100"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setAdjustmentState({ item, type: 'IN' })}
                      className="bg-emerald-50 text-emerald-600 p-2 rounded-xl active:bg-emerald-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setAdjustmentState({ item, type: 'OUT' })}
                      className="bg-rose-50 text-rose-500 p-2 rounded-xl active:bg-rose-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </>
                )}
                {canAction('delete') && (
                   <button 
                    onClick={() => deleteItem(item.id)}
                    className="bg-rose-50 text-rose-500 p-2 rounded-xl active:bg-rose-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <AddItemModal 
          onClose={() => setIsAddModalOpen(false)}
          setItems={setItems}
          warehouses={warehouses}
          categories={categories}
        />
      )}

      {selectedItemForView && (
        <ItemDetailsModal
          item={selectedItemForView}
          onClose={() => setSelectedItemForView(null)}
          warehouse={warehouses.find(w => w.id === selectedItemForView.warehouseId)}
          category={categories.find(c => c.id === selectedItemForView.categoryId)}
          allCategories={categories}
        />
      )}

      {itemToEdit && (
        <EditItemModal
          item={itemToEdit}
          onClose={() => setItemToEdit(null)}
          onSave={handleUpdateItem}
          warehouses={warehouses}
          categories={categories}
        />
      )}

      {itemToTransfer && (
        <TransferItemModal
          item={itemToTransfer}
          warehouses={warehouses}
          onClose={() => setItemToTransfer(null)}
          onConfirm={handleConfirmTransfer}
        />
      )}

      {adjustmentState.item && (
        <StockActionModal
          item={adjustmentState.item}
          type={adjustmentState.type!}
          onClose={() => setAdjustmentState({ item: null, type: null })}
          onConfirm={handleAdjustStock}
        />
      )}
    </div>
  );
};

export default Inventory;

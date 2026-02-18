
import React, { useMemo } from 'react';
import { Item, Warehouse, Transaction, ItemStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Package, AlertTriangle, ArrowUpRight, DollarSign, Warehouse as WarehouseIcon } from 'lucide-react';

interface DashboardProps {
  items: Item[];
  warehouses: Warehouse[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ items, warehouses, transactions }) => {
  const totalValue = useMemo(() => items.reduce((sum, item) => sum + (item.trueUnitCost * item.quantity), 0), [items]);
  const oldStockValue = useMemo(() => items.filter(i => i.status === ItemStatus.OLD_USED).reduce((sum, item) => sum + (item.trueUnitCost * item.quantity), 0), [items]);

  const warehouseStats = useMemo(() => warehouses.map(wh => {
    const whItems = items.filter(i => i.warehouseId === wh.id);
    return { name: wh.name.split(' ')[0], value: whItems.reduce((sum, i) => sum + (i.trueUnitCost * i.quantity), 0) };
  }), [warehouses, items]);

  const statusStats = useMemo(() => [
    { name: 'Raw', value: items.filter(i => i.status === ItemStatus.RAW).length },
    { name: 'Finished', value: items.filter(i => i.status === ItemStatus.FINISHED).length },
    { name: 'Good', value: items.filter(i => i.status === ItemStatus.GOOD_AS_NEW).length },
    { name: 'Old', value: items.filter(i => i.status === ItemStatus.OLD_USED).length },
  ], [items]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">Analytics</h2>
          <p className="text-xs md:text-sm text-slate-500">Live operational metrics</p>
        </div>
        <button className="bg-white p-2 md:px-4 md:py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm">
          <TrendingUp className="w-4 h-4 inline md:mr-2" /> <span className="hidden md:inline">Growth</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Value" value={`₱${(totalValue/1000).toFixed(1)}k`} trend="+12%" icon={<DollarSign />} color="indigo" />
        <StatCard title="Aging" value={`₱${(oldStockValue/1000).toFixed(1)}k`} trend="-2%" icon={<AlertTriangle />} color="rose" />
        <StatCard title="Stock" value={items.length.toString()} trend="+8" icon={<Package />} color="emerald" />
        <StatCard title="Alerts" value={transactions.filter(t => t.status === 'PENDING').length.toString()} trend="Action" icon={<TrendingUp />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <WarehouseIcon className="w-4 h-4 text-indigo-500" /> Hub Distribution
          </h3>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={warehouseStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Package className="w-4 h-4 text-indigo-500" /> Health
          </h3>
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusStats} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {statusStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-xl font-black text-slate-800">{items.length}</span>
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">SKUs</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {statusStats.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} />
                <span className="text-[10px] font-bold text-slate-600">{s.name}</span>
                <span className="text-[10px] font-black text-slate-900 ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, icon, color }: any) => {
  const colors: any = { indigo: 'bg-indigo-50 text-indigo-600', rose: 'bg-rose-50 text-rose-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600' };
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div className={`w-8 h-8 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        {React.cloneElement(icon, { className: 'w-4 h-4' })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-lg md:text-xl font-black text-slate-900">{value}</span>
        <span className="text-[8px] font-black text-emerald-500">{trend}</span>
      </div>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { Warehouse, Category, Item, ItemStatus } from './types';

export const initialWarehouses: Warehouse[] = [
  { id: 'wh-1', name: 'Main North Hub', prefix: 'WHA' },
  { id: 'wh-2', name: 'South Logistics', prefix: 'WHB' },
  { id: 'wh-3', name: 'Central Distribution', prefix: 'WHC' },
];

export const initialCategories: Category[] = [
  // Main Categories
  { id: 'cat-construction', name: 'Construction', code: 'CON' },
  { id: 'cat-hotel', name: 'Hotel', code: 'HTL' },
  { id: 'cat-utility', name: 'Utility', code: 'UTL' },
  
  // Construction Sub-categories
  { id: 'cat-res', name: 'Residential', code: 'RES', parentId: 'cat-construction' },
  { id: 'cat-com', name: 'Commercial', code: 'COM', parentId: 'cat-construction' },
  { id: 'cat-ele', name: 'Electrical', code: 'ELE', parentId: 'cat-construction' },
  
  // Hotel Sub-categories
  { id: 'cat-btq', name: 'Boutique', code: 'BTQ', parentId: 'cat-hotel' },
  { id: 'cat-rst', name: 'Resorts', code: 'RST', parentId: 'cat-hotel' },
  { id: 'cat-ghs', name: 'Guest House', code: 'GHS', parentId: 'cat-hotel' },
  { id: 'cat-spa', name: 'Spa & Wellness', code: 'SPA', parentId: 'cat-hotel' },
  
  // Utility Sub-categories
  { id: 'cat-sad', name: 'Supply & Distribution', code: 'SAD', parentId: 'cat-utility' },
  { id: 'cat-wmr', name: 'Waste Management & Recycling', code: 'WMR', parentId: 'cat-utility' },
  { id: 'cat-tel', name: 'Telecommunications', code: 'TEL', parentId: 'cat-utility' },
];

export const initialItems: Item[] = [
  {
    id: 'it-1',
    name: 'Reinforcement Steel 12mm',
    warehouseId: 'wh-1',
    categoryId: 'cat-com',
    status: ItemStatus.RAW,
    barcode: 'WHA-COM-it-1',
    quantity: 450,
    baseCost: 120,
    freight: 15,
    duties: 10,
    taxes: 5,
    trueUnitCost: 150,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'it-2',
    name: 'Vintage Hotel Sheets (Set)',
    warehouseId: 'wh-2',
    categoryId: 'cat-ghs',
    status: ItemStatus.OLD_USED,
    barcode: 'WHB-GHS-it-2',
    quantity: 85,
    baseCost: 40,
    freight: 2,
    duties: 0,
    taxes: 8,
    trueUnitCost: 50,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'it-3',
    name: 'High-Speed Fiber Optic Coil',
    warehouseId: 'wh-3',
    categoryId: 'cat-tel',
    status: ItemStatus.FINISHED,
    barcode: 'WHC-TEL-it-3',
    quantity: 20,
    baseCost: 200,
    freight: 40,
    duties: 20,
    taxes: 30,
    trueUnitCost: 290,
    lastUpdated: new Date().toISOString(),
  },
];

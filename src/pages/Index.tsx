
import React from 'react';
import Navbar from '@/components/Navbar';
import MenuSection from '@/components/MenuSection';
import OrderPanel from '@/components/OrderPanel';
import BillSummary from '@/components/BillSummary';
import TableSelection from '@/components/TableSelection';
import { OrderProvider } from '@/context/OrderContext';

const Index = () => {
  return (
    <OrderProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 container mx-auto py-6 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <h1 className="text-2xl font-bold text-restaurant-primary">Restaurant Dashboard</h1>
            <TableSelection />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MenuSection />
            </div>
            
            <div className="space-y-6">
              <OrderPanel />
              <BillSummary />
            </div>
          </div>
        </div>
      </div>
    </OrderProvider>
  );
};

export default Index;

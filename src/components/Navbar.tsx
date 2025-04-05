
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Receipt, Clock, Settings, Menu as MenuIcon } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';

const Navbar: React.FC = () => {
  const { activeOrder, orders } = useOrder();
  
  return (
    <div className="flex justify-between items-center bg-restaurant-primary text-white px-6 py-3">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-semibold">Dine & Bill</span>
      </div>
      
      <div className="hidden md:flex space-x-6">
        <Button variant="ghost" className="text-white hover:bg-restaurant-primary/80">
          <Home size={18} className="mr-2" />
          Dashboard
        </Button>
        <Button variant="ghost" className="text-white hover:bg-restaurant-primary/80">
          <Receipt size={18} className="mr-2" />
          Orders {orders.length > 0 && <span className="ml-1 bg-restaurant-accent rounded-full px-2 text-xs">{orders.length}</span>}
        </Button>
        <Button variant="ghost" className="text-white hover:bg-restaurant-primary/80">
          <Clock size={18} className="mr-2" />
          History
        </Button>
        <Button variant="ghost" className="text-white hover:bg-restaurant-primary/80">
          <Settings size={18} className="mr-2" />
          Settings
        </Button>
      </div>
      
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="text-white">
          <MenuIcon />
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        {activeOrder && (
          <div className="bg-restaurant-accent px-3 py-1 rounded-full text-sm">
            Table {activeOrder.tableNumber} - Active
          </div>
        )}
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-restaurant-primary font-bold">
          S
        </div>
      </div>
    </div>
  );
};

export default Navbar;

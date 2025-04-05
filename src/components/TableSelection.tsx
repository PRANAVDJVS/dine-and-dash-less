
import React from 'react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/context/OrderContext';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TableSelection: React.FC = () => {
  const { tables, createOrder, activeOrder } = useOrder();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="bg-restaurant-accent hover:bg-restaurant-accent/90 text-white"
          disabled={!!activeOrder}
        >
          {activeOrder ? `Table ${activeOrder.tableNumber} Selected` : "Select Table"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Table</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 pt-4">
          {tables.map((table) => (
            <Button
              key={table.number}
              onClick={() => {
                createOrder(table.number);
              }}
              disabled={table.status === 'occupied'}
              variant={table.status === 'available' ? 'outline' : 'secondary'}
              className={`h-24 ${
                table.status === 'available' 
                  ? 'hover:bg-restaurant-accent hover:text-white border-restaurant-accent text-restaurant-accent' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold">Table {table.number}</span>
                <span className="text-xs mt-1">
                  {table.status === 'available' ? 'Available' : 'Occupied'}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableSelection;

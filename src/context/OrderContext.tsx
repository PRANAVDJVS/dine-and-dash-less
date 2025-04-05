
import React, { createContext, useContext, useState } from "react";
import { MenuItem } from "../data/menuData";
import { toast } from "sonner";

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableNumber: number | null;
  items: OrderItem[];
  status: 'active' | 'completed' | 'canceled';
  createdAt: Date;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

interface OrderContextType {
  activeOrder: Order | null;
  orders: Order[];
  createOrder: (tableNumber: number) => void;
  addToOrder: (menuItem: MenuItem, quantity?: number, notes?: string) => void;
  removeFromOrder: (orderItemId: string) => void;
  updateQuantity: (orderItemId: string, quantity: number) => void;
  updateNotes: (orderItemId: string, notes: string) => void;
  calculateBill: (tipPercentage?: number) => void;
  completeOrder: () => void;
  cancelOrder: () => void;
  tables: { number: number; status: 'available' | 'occupied' }[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const TAX_RATE = 0.0825; // 8.25% tax rate

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState([
    { number: 1, status: 'available' as const },
    { number: 2, status: 'available' as const },
    { number: 3, status: 'available' as const },
    { number: 4, status: 'available' as const },
    { number: 5, status: 'available' as const },
    { number: 6, status: 'available' as const },
  ]);

  const createOrder = (tableNumber: number) => {
    // Check if table is available
    const tableIndex = tables.findIndex(t => t.number === tableNumber);
    if (tableIndex === -1 || tables[tableIndex].status !== 'available') {
      toast.error('This table is not available');
      return;
    }

    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableNumber,
      items: [],
      status: 'active',
      createdAt: new Date(),
      subtotal: 0,
      tax: 0,
      tip: 0,
      total: 0
    };

    // Update table status
    const updatedTables = [...tables];
    updatedTables[tableIndex] = { ...updatedTables[tableIndex], status: 'occupied' as const };
    setTables(updatedTables);

    // Set as active order
    setActiveOrder(newOrder);
    toast.success(`Created new order for Table ${tableNumber}`);
  };

  const addToOrder = (menuItem: MenuItem, quantity = 1, notes = '') => {
    if (!activeOrder) {
      toast.error('No active order. Please create an order first.');
      return;
    }

    // Check if item already exists in order
    const existingItemIndex = activeOrder.items.findIndex(
      item => item.menuItem.id === menuItem.id && item.notes === notes
    );

    let updatedItems = [...activeOrder.items];

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      updatedItems.push({
        id: `item-${Date.now()}`,
        menuItem,
        quantity,
        notes
      });
    }

    // Update order with new items
    const updatedOrder = {
      ...activeOrder,
      items: updatedItems,
    };

    // Recalculate bill
    calculateBillForOrder(updatedOrder);
    setActiveOrder(updatedOrder);
    toast.success(`Added ${menuItem.name} to order`);
  };

  const removeFromOrder = (orderItemId: string) => {
    if (!activeOrder) return;

    const updatedItems = activeOrder.items.filter(item => item.id !== orderItemId);
    const updatedOrder = {
      ...activeOrder,
      items: updatedItems,
    };

    // Recalculate bill
    calculateBillForOrder(updatedOrder);
    setActiveOrder(updatedOrder);
    toast.info('Item removed from order');
  };

  const updateQuantity = (orderItemId: string, quantity: number) => {
    if (!activeOrder) return;

    const updatedItems = activeOrder.items.map(item => {
      if (item.id === orderItemId) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });

    const updatedOrder = {
      ...activeOrder,
      items: updatedItems,
    };

    // Recalculate bill
    calculateBillForOrder(updatedOrder);
    setActiveOrder(updatedOrder);
  };

  const updateNotes = (orderItemId: string, notes: string) => {
    if (!activeOrder) return;

    const updatedItems = activeOrder.items.map(item => {
      if (item.id === orderItemId) {
        return { ...item, notes };
      }
      return item;
    });

    const updatedOrder = {
      ...activeOrder,
      items: updatedItems,
    };

    setActiveOrder(updatedOrder);
  };

  const calculateBillForOrder = (order: Order, tipPercentage = 0) => {
    const subtotal = order.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
    
    const tax = subtotal * TAX_RATE;
    const tip = subtotal * (tipPercentage / 100);
    const total = subtotal + tax + tip;

    // Update order with calculated values
    order.subtotal = parseFloat(subtotal.toFixed(2));
    order.tax = parseFloat(tax.toFixed(2));
    order.tip = parseFloat(tip.toFixed(2));
    order.total = parseFloat(total.toFixed(2));

    return order;
  };

  const calculateBill = (tipPercentage = 0) => {
    if (!activeOrder) return;

    const updatedOrder = calculateBillForOrder({ ...activeOrder }, tipPercentage);
    setActiveOrder(updatedOrder);
  };

  const completeOrder = () => {
    if (!activeOrder) return;

    // Mark order as completed
    const completedOrder = { ...activeOrder, status: 'completed' as const };
    
    // Add to order history
    setOrders([...orders, completedOrder]);
    
    // Free up the table
    if (activeOrder.tableNumber) {
      const tableIndex = tables.findIndex(t => t.number === activeOrder.tableNumber);
      if (tableIndex > -1) {
        const updatedTables = [...tables];
        updatedTables[tableIndex] = { ...updatedTables[tableIndex], status: 'available' as const };
        setTables(updatedTables);
      }
    }
    
    // Clear active order
    setActiveOrder(null);
    toast.success('Order completed successfully!');
  };

  const cancelOrder = () => {
    if (!activeOrder) return;

    // Free up the table
    if (activeOrder.tableNumber) {
      const tableIndex = tables.findIndex(t => t.number === activeOrder.tableNumber);
      if (tableIndex > -1) {
        const updatedTables = [...tables];
        updatedTables[tableIndex] = { ...updatedTables[tableIndex], status: 'available' as const };
        setTables(updatedTables);
      }
    }
    
    // Add cancelled order to history
    const cancelledOrder = { ...activeOrder, status: 'canceled' as const };
    setOrders([...orders, cancelledOrder]);
    
    // Clear active order
    setActiveOrder(null);
    toast.info('Order has been cancelled');
  };

  return (
    <OrderContext.Provider
      value={{
        activeOrder,
        orders,
        createOrder,
        addToOrder,
        removeFromOrder,
        updateQuantity,
        updateNotes,
        calculateBill,
        completeOrder,
        cancelOrder,
        tables,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};


import React from 'react';
import { useOrder } from '@/context/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, Edit2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const OrderPanel: React.FC = () => {
  const { activeOrder, updateQuantity, removeFromOrder, updateNotes } = useOrder();
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
  const [editNotes, setEditNotes] = React.useState('');

  const handleSaveNotes = () => {
    if (selectedItemId) {
      updateNotes(selectedItemId, editNotes);
      setSelectedItemId(null);
      setEditNotes('');
    }
  };

  if (!activeOrder) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Current Order</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <p className="text-gray-500">No active order</p>
          <p className="text-gray-500 text-sm mt-2">Select a table to start a new order</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex justify-between items-center">
            <span>Table {activeOrder.tableNumber}</span>
            <span className="text-sm text-gray-500">
              {new Date(activeOrder.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', minute: '2-digit' 
              })}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeOrder.items.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No items added yet</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {activeOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-start border-b pb-3">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.menuItem.name}</span>
                      <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost" 
                            size="icon"
                            className="h-6 w-6 ml-2"
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setEditNotes(item.notes || '');
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Special Instructions</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="notes">Notes for {item.menuItem.name}</Label>
                              <Input
                                id="notes"
                                placeholder="E.g., No onions, extra sauce, etc."
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                              />
                            </div>
                            <Button 
                              onClick={handleSaveNotes}
                              className="w-full bg-restaurant-accent hover:bg-restaurant-accent/90"
                            >
                              Save Notes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto text-restaurant-danger"
                        onClick={() => removeFromOrder(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderPanel;

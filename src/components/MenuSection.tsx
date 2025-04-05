
import React, { useState } from 'react';
import { menuCategories } from '@/data/menuData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrder } from '@/context/OrderContext';

const MenuSection: React.FC = () => {
  const { addToOrder, activeOrder } = useOrder();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleAddToOrder = () => {
    if (selectedItem) {
      addToOrder(selectedItem, quantity, notes);
      setSelectedItem(null);
      setQuantity(1);
      setNotes('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs defaultValue={menuCategories[0].id} className="w-full">
        <TabsList className="w-full h-auto flex overflow-x-auto">
          {menuCategories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex-1 py-3"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {menuCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full mt-4 bg-restaurant-accent hover:bg-restaurant-accent/90"
                            disabled={!activeOrder}
                            onClick={() => setSelectedItem(item)}
                          >
                            <Plus size={18} className="mr-2" /> Add to Order
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add {selectedItem?.name} to Order</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="quantity">Quantity</Label>
                              <div className="flex items-center">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                  -
                                </Button>
                                <Input
                                  id="quantity"
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                  min="1"
                                  className="w-16 text-center mx-2"
                                />
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setQuantity(quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notes">Special Instructions</Label>
                              <Input
                                id="notes"
                                placeholder="E.g., No onions, extra sauce, etc."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                              />
                            </div>
                            <Button 
                              onClick={handleAddToOrder}
                              className="w-full bg-restaurant-accent hover:bg-restaurant-accent/90"
                            >
                              Add to Order
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MenuSection;

import React, { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Printer, CreditCard, DollarSign, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const BillSummary: React.FC = () => {
  const { activeOrder, calculateBill, completeOrder, cancelOrder } = useOrder();
  const [tipPercentage, setTipPercentage] = useState(15);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  
  const handleTipChange = (value: string) => {
    const percentage = parseInt(value);
    setTipPercentage(percentage);
    calculateBill(percentage);
  };

  const handlePayment = () => {
    toast.success(`Payment processed via ${paymentMethod}`);
    completeOrder();
    setShowReceipt(false);
  };

  if (!activeOrder) {
    return null;
  }

  const hasItems = activeOrder.items.length > 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Bill Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>${activeOrder.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (8.25%):</span>
            <span>${activeOrder.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tip:</span>
            <span>${activeOrder.tip.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold text-lg">${activeOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Tip Amount:</p>
          <RadioGroup 
            defaultValue="15" 
            className="flex space-x-2" 
            onValueChange={handleTipChange}
            disabled={!hasItems}
          >
            <div>
              <RadioGroupItem value="0" id="tip-0" className="peer sr-only" />
              <Label
                htmlFor="tip-0"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-restaurant-accent [&:has([data-state=checked])]:border-restaurant-accent"
              >
                <span>0%</span>
                <span className="text-xs">${(activeOrder.subtotal * 0).toFixed(2)}</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="10" id="tip-10" className="peer sr-only" />
              <Label
                htmlFor="tip-10"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-restaurant-accent [&:has([data-state=checked])]:border-restaurant-accent"
              >
                <span>10%</span>
                <span className="text-xs">${(activeOrder.subtotal * 0.1).toFixed(2)}</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="15" id="tip-15" className="peer sr-only" />
              <Label
                htmlFor="tip-15"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-restaurant-accent [&:has([data-state=checked])]:border-restaurant-accent"
              >
                <span>15%</span>
                <span className="text-xs">${(activeOrder.subtotal * 0.15).toFixed(2)}</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="20" id="tip-20" className="peer sr-only" />
              <Label
                htmlFor="tip-20"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-restaurant-accent [&:has([data-state=checked])]:border-restaurant-accent"
              >
                <span>20%</span>
                <span className="text-xs">${(activeOrder.subtotal * 0.2).toFixed(2)}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-restaurant-success hover:bg-restaurant-success/90"
              disabled={!hasItems}
            >
              <Check size={18} className="mr-2" /> Complete Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment</DialogTitle>
              <DialogDescription>
                Complete the order by selecting a payment method.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-center">Order Summary</h3>
                  <div className="mt-4 space-y-2">
                    {activeOrder.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${activeOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${activeOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tip ({tipPercentage}%):</span>
                    <span>${activeOrder.tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span>${activeOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Payment Method</h4>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    className={paymentMethod === "card" ? "bg-restaurant-accent hover:bg-restaurant-accent/90" : ""}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard size={18} className="mr-2" /> Card
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    className={paymentMethod === "cash" ? "bg-restaurant-accent hover:bg-restaurant-accent/90" : ""}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <DollarSign size={18} className="mr-2" /> Cash
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                onClick={() => setShowReceipt(false)}
              >
                <X size={18} className="mr-2" /> Cancel
              </Button>
              <Button 
                className="mt-2 sm:mt-0 bg-restaurant-success hover:bg-restaurant-success/90"
                onClick={handlePayment}
              >
                Process Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="flex w-full space-x-2">
          <Button 
            variant="outline"
            className="flex-1"
            disabled={!hasItems}
            onClick={() => {
              toast.success('Receipt printed');
            }}
          >
            <Printer size={18} className="mr-2" /> Print
          </Button>
          <Button 
            variant="outline"
            className="flex-1 text-restaurant-danger hover:text-restaurant-danger"
            disabled={!hasItems}
            onClick={() => cancelOrder()}
          >
            <X size={18} className="mr-2" /> Cancel Order
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BillSummary;

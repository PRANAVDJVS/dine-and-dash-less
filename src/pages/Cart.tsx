
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionDiv } from "@/components/ui/MotionDiv";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { cn } from "@/lib/utils";

export default function Cart() {
  const { user } = useAuth();
  const { cartItems, totalItems, totalAmount, removeFromCart, updateQuantity, clearCart, loading } = useCart();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(cartItemId, newQuantity);
    } else {
      removeFromCart(cartItemId);
    }
  };
  
  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart(cartItemId);
  };
  
  const handleClearCart = () => {
    clearCart();
  };
  
  // We're converting from database price to display price for consistency
  const getDisplayPrice = (price: number) => {
    // If price is already in rupees (>100), use it, otherwise convert from dollars
    return price > 100 ? price : price * 82;
  };
  
  // Calculate taxes and total with properly converted prices
  const subtotal = totalAmount;
  const deliveryFee = 40;
  const taxes = subtotal * 0.05;
  const orderTotal = subtotal + deliveryFee + taxes;
  
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <Container>
          <MotionDiv animation="fade-in" className="mb-12 mt-12">
            <h1 className="text-4xl md:text-5xl font-medium text-center mb-3">
              Your Cart
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Review your selected items before checkout
            </p>
          </MotionDiv>
          
          {loading ? (
            <div className="text-center py-16">
              <h3 className="text-lg mb-2">Loading your cart...</h3>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-8">
                  Add some delicious items from our menu to get started
                </p>
                <Button asChild>
                  <Link to="/menu">Browse Menu</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <div className="lg:col-span-2">
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-medium">Cart Items ({totalItems})</h2>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-sm"
                      onClick={handleClearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map((item) => {
                      // Get the proper display price for each item
                      const itemDisplayPrice = item.menu_item ? getDisplayPrice(item.menu_item.price) : 0;
                      
                      return (
                        <div key={item.id} className="p-4 flex items-start gap-4">
                          <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                            <AnimatedImage
                              src={item.menu_item?.image || ""}
                              alt={item.menu_item?.name || ""}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <h3 className="font-medium">{item.menu_item?.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.menu_item?.description?.substring(0, 80)}
                              {(item.menu_item?.description?.length || 0) > 80 ? "..." : ""}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className={cn(
                                    "p-1 rounded-full border",
                                    "hover:bg-muted transition-colors"
                                  )}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className={cn(
                                    "p-1 rounded-full border",
                                    "hover:bg-muted transition-colors"
                                  )}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="font-medium">
                                  ₹{(itemDisplayPrice * item.quantity).toFixed(0)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white border rounded-lg overflow-hidden sticky top-24">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-medium">Order Summary</h2>
                  </div>
                  
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{subtotal.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span>₹{deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>₹{taxes.toFixed(0)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{orderTotal.toFixed(0)}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full">Proceed to Checkout</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}

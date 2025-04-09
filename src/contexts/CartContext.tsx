
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CartItem, MenuItem } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (menuItem: MenuItem, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  // Ensure we're using the menu_item price directly (which is the original price)
  const totalAmount = cartItems.reduce(
    (total, item) => total + (item.menu_item?.price || 0) * item.quantity, 
    0
  );

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          menu_item:menu_items(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setCartItems(data as CartItem[]);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (menuItem: MenuItem, quantity: number) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to cart',
        variant: 'destructive',
      });
      return;
    }
    
    let validatedMenuItem = {...menuItem};
    
    if (typeof menuItem.id !== 'string' || !menuItem.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.warn("Invalid menu item ID format, generating new UUID:", menuItem.id);
      validatedMenuItem = {
        ...menuItem,
        id: uuidv4()
      };
    }

    const priceToStore = validatedMenuItem.price;

    setLoading(true);
    try {
      const existingItem = cartItems.find(item => item.menu_item_id === validatedMenuItem.id);
      
      if (existingItem) {
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
          
        if (error) throw error;
        
        setCartItems(prevItems => 
          prevItems.map(item => 
            item.id === existingItem.id 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        const { data, error } = await supabase
          .from('cart')
          .insert({
            user_id: user.id,
            menu_item_id: validatedMenuItem.id,
            quantity,
          })
          .select(`*, menu_item:menu_items(*)`);
          
        if (error) throw error;
        
        if (data && data[0]) {
          setCartItems(prevItems => [...prevItems, data[0] as CartItem]);
        }
      }
      
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${validatedMenuItem.name} added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user) return;
    
    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('id', cartItemId);
        
      if (error) throw error;
      
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('id', cartItemId);
        
      if (error) throw error;
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      
      toast({
        title: 'Item removed',
        description: 'Item removed from your cart',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setCartItems([]);
      
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { SearchBar } from "./MenuTable/SearchBar";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the allowed order status values
type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";

// Define the order type with the correct status type
interface OrderType {
  id: string;
  user_id: string;
  user_email?: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string | null;
  contact_number: string | null;
  created_at: string;
  updated_at: string;
  items: {
    id: string;
    order_id: string;
    menu_item_id: string;
    quantity: number;
    price: number;
    created_at: string;
    menu_item: {
      name: string;
      price: number;
    };
  }[];
}

// Change to default export to match the import in Dashboard.tsx
const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  
  // Add this state to force refresh when tab is selected
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Effect to detect tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Increment refresh trigger to force a refetch
        setRefreshTrigger(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // This will detect if the component is mounted when already visible
    if (document.visibilityState === 'visible') {
      fetchOrders();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Add this effect to refetch when tab is returned to
  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Fetch all orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;

      // Fetch order items for each order with menu item details
      const ordersWithItems = await Promise.all(
        (orderData || []).map(async (order) => {
          const { data: itemsData } = await supabase
            .from('order_items')
            .select(`
              *,
              menu_item:menu_items(name, price)
            `)
            .eq('order_id', order.id);

          // Get user details for each order
          const { data: userData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('id', order.user_id)
            .single();

          // Get user email
          const { data: userAuthData } = await supabase.auth.admin.getUserById(order.user_id);
          
          return {
            ...order,
            user_email: userAuthData?.user?.email || 'Unknown',
            user_name: userData?.full_name || 'Unknown',
            items: itemsData || [],
          };
        })
      );

      // Convert to the correct OrderType with proper status typing
      const typedOrders: OrderType[] = ordersWithItems.map(order => ({
        ...order,
        status: order.status as OrderStatus,
        items: order.items || []
      }));

      setOrders(typedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update the order in local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast({
        title: 'Status updated',
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    return (
      order.id.toLowerCase().includes(query) ||
      (order.user_email && order.user_email.toLowerCase().includes(query)) ||
      (order.contact_number && order.contact_number.toLowerCase().includes(query)) ||
      order.status.toLowerCase().includes(query)
    );
  });

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search orders..."
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? "Try changing your search query" : "No orders have been placed yet"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg border overflow-hidden">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Order #{order.id.substring(0, 8)}...</h3>
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm mt-1">
                    {order.user_email || 'Unknown user'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">₹{order.total_amount}</div>
                    <div className="text-sm text-muted-foreground">
                      {(order.items || []).reduce((sum, item) => sum + item.quantity, 0)} items
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "pending")}
                      >
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                      >
                        Preparing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "ready")}
                      >
                        Ready
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                      >
                        Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                      >
                        Cancelled
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleOrderExpanded(order.id)}
                  >
                    {expandedOrders[order.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {expandedOrders[order.id] && (
                <div className="bg-gray-50 p-4 border-t">
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">Delivery Address</div>
                    <div className="text-sm">
                      {order.delivery_address || 'Not provided'}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">Contact</div>
                    <div className="text-sm">
                      {order.contact_number || 'Not provided'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Order Items</div>
                    <div className="space-y-2">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border">
                          <div className="flex-1">
                            <div className="font-medium">{item.menu_item?.name || 'Unknown item'}</div>
                            <div className="text-sm text-muted-foreground">
                              ₹{item.price} x {item.quantity}
                            </div>
                          </div>
                          <div className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;

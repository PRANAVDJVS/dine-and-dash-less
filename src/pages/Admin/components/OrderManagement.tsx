
import { useState, useEffect } from "react";
import { 
  Loader2, 
  Search, 
  Clock, 
  ChevronDown,
  List,
  CalendarDays,
  IndianRupee
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";

type Order = {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  delivery_address: string | null;
  contact_number: string | null;
  created_at: string;
  updated_at: string;
  user_details: {
    full_name: string;
    email: string;
  } | null;
  items: {
    id: string;
    quantity: number;
    price: number;
    menu_item: {
      id: string;
      name: string;
      description: string | null;
    }
  }[];
};

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

const orderStatusLabels: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-50 text-yellow-800 border-yellow-200" },
  confirmed: { label: "Confirmed", color: "bg-blue-50 text-blue-800 border-blue-200" },
  preparing: { label: "Preparing", color: "bg-purple-50 text-purple-800 border-purple-200" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-50 text-orange-800 border-orange-200" },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-800 border-green-200" },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-800 border-red-200" },
};

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        // First, get all orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (ordersError) throw ordersError;
        
        // For each order, get the user details and order items
        const ordersWithDetails = await Promise.all(
          (ordersData || []).map(async (order) => {
            // Get user details
            const { data: userData, error: userError } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", order.user_id)
              .single();
            
            // Get order items
            const { data: orderItems, error: itemsError } = await supabase
              .from("order_items")
              .select(`
                id,
                quantity,
                price,
                menu_item:menu_item_id (id, name, description)
              `)
              .eq("order_id", order.id);
            
            // Get user email from auth.users table (using RPC for security)
            const { data: userData2, error: userError2 } = await supabase
              .rpc('get_user_email', { user_id: order.user_id });

            return {
              ...order,
              user_details: userData ? {
                full_name: userData.full_name || "Unknown",
                email: userData2 || "No email"
              } : null,
              items: orderItems || [],
            };
          })
        );
        
        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOrders();
  }, [toast]);

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = (
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_details?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_details?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.delivery_address && order.delivery_address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Open order details dialog
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };
  
  // Open update status dialog
  const handleUpdateStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status as OrderStatus);
    setIsUpdateStatusOpen(true);
  };
  
  // Update order status
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", selectedOrder.id);
      
      if (error) throw error;
      
      // Update local state
      setOrders(orders.map((order) => {
        if (order.id === selectedOrder.id) {
          return { ...order, status: newStatus, updated_at: new Date().toISOString() };
        }
        return order;
      }));
      
      setIsUpdateStatusOpen(false);
      toast({
        title: "Status updated",
        description: `Order #${selectedOrder.id.substring(0, 8)} status changed to ${orderStatusLabels[newStatus].label}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = orderStatusLabels[status as OrderStatus] || { 
      label: status, 
      color: "bg-gray-100 text-gray-800 border-gray-200" 
    };
    
    return (
      <Badge variant="outline" className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium">Order Management</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {Object.entries(orderStatusLabels).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div>
                      {order.user_details?.full_name || "Unknown"}
                      {order.user_details?.email && (
                        <p className="text-xs text-muted-foreground">{order.user_details.email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {formatDate(order.created_at)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {parseFloat(order.total_amount.toString()).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatusClick(order)}
                      >
                        Update Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={(open) => !open && setIsOrderDetailsOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order ID: #{selectedOrder?.id.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p className="font-medium">{selectedOrder.user_details?.full_name || "Unknown"}</p>
                  {selectedOrder.user_details?.email && (
                    <p className="text-sm">{selectedOrder.user_details.email}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                  <p className="font-medium">{selectedOrder.contact_number || "Not provided"}</p>
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Delivery Address</h3>
                  <p className="font-medium">{selectedOrder.delivery_address || "Not provided"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <div className="flex items-center gap-1 font-medium">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(selectedOrder.created_at)}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.menu_item.name}
                              {item.menu_item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {item.menu_item.description}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center">
                                <IndianRupee className="h-3 w-3" />
                                {parseFloat(item.price.toString()).toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              <div className="flex items-center justify-end">
                                <IndianRupee className="h-3 w-3" />
                                {(item.quantity * parseFloat(item.price.toString())).toFixed(2)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                          <TableCell className="text-right font-bold whitespace-nowrap">
                            <div className="flex items-center justify-end">
                              <IndianRupee className="h-4 w-4" />
                              {parseFloat(selectedOrder.total_amount.toString()).toFixed(2)}
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter>
                <Button onClick={() => handleUpdateStatusClick(selectedOrder)} className="ml-auto">
                  Update Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={(open) => !open && setIsUpdateStatusOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order #{selectedOrder?.id.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">New Status</label>
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(orderStatusLabels).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

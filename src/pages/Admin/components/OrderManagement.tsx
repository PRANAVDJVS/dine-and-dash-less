
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, Search, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";

type OrderStatus = "pending" | "preparing" | "delivered" | "cancelled";

interface OrderItemType {
  id: string;
  menu_item?: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface OrderType {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string | null;
  contact_number: string | null;
  created_at: string;
  items: OrderItemType[];
  user_email?: string;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Get order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          // Get order items
          const { data: itemsData, error: itemsError } = await supabase
            .from("order_items")
            .select("*, menu_item:menu_items(name, price)")
            .eq("order_id", order.id);

          if (itemsError) throw itemsError;

          // Get user email
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            order.user_id
          );

          let userEmail = "Unknown";
          if (!userError && userData?.user) {
            userEmail = userData.user.email || "No email";
          }

          return {
            ...order,
            items: itemsData || [],
            user_email: userEmail,
          };
        })
      );

      setOrders(ordersWithItems);
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
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
        )
      );

      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.user_email?.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower) ||
      order.delivery_address?.toLowerCase().includes(searchLower) ||
      order.contact_number?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium">Order Management</h1>
        <Button onClick={fetchOrders}>Refresh Orders</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.user_email}</div>
                      {order.contact_number && (
                        <div className="text-xs text-muted-foreground">
                          {order.contact_number}
                        </div>
                      )}
                      {order.delivery_address && (
                        <div className="text-xs text-muted-foreground mt-1 max-w-48 truncate">
                          {order.delivery_address}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm flex justify-between">
                          <span>
                            {item.quantity} x {item.menu_item?.name || "Unknown Item"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {order.total_amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(order.created_at), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${
                          order.status === "pending"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "preparing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                    >
                      {order.status === "pending"
                        ? "Pending"
                        : order.status === "preparing"
                        ? "Preparing"
                        : order.status === "delivered"
                        ? "Delivered"
                        : "Cancelled"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

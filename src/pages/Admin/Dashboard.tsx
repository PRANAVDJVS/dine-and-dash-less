
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Utensils, 
  ClipboardList,
  Settings,
  LogOut,
  Plus,
  Search,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MenuManagement } from "./components/MenuManagement";
import { OrderManagement } from "./components/OrderManagement";
import { AccessDenied } from "./components/AccessDenied";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type AdminTab = "dashboard" | "menu" | "orders" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) throw error;
        
        setIsAdmin(data);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminStatus();
  }, [user]);

  // If not logged in, redirect to auth page
  useEffect(() => {
    if (!user && !isLoading) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access the admin dashboard",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, isLoading, navigate, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen">
          <Container>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-medium">Loading dashboard...</h2>
                <p className="text-muted-foreground mt-2">Verifying admin access</p>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        <Container>
          <div className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-2">
                <Card className="sticky top-24">
                  <CardContent className="p-4">
                    <h2 className="font-medium text-xl mb-6">Admin Panel</h2>
                    
                    <nav className="space-y-1">
                      <Button
                        variant={activeTab === "dashboard" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("dashboard")}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      
                      <Button
                        variant={activeTab === "menu" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("menu")}
                      >
                        <Utensils className="mr-2 h-4 w-4" />
                        Menu Items
                      </Button>
                      
                      <Button
                        variant={activeTab === "orders" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("orders")}
                      >
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Orders
                      </Button>
                      
                      <Button
                        variant={activeTab === "settings" ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Main content */}
              <div className="lg:col-span-10">
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    <h1 className="text-3xl font-medium">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                      Welcome to the Flavours of India admin dashboard. Use the sidebar navigation to manage your restaurant.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card 
                        className="bg-primary/10 hover:bg-primary/15 transition-all cursor-pointer"
                        onClick={() => setActiveTab("menu")}
                      >
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-lg">Menu Management</h3>
                            <p className="text-sm text-muted-foreground">Add, edit, or remove menu items</p>
                          </div>
                          <Utensils className="h-8 w-8 text-primary" />
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className="bg-primary/10 hover:bg-primary/15 transition-all cursor-pointer"
                        onClick={() => setActiveTab("orders")}
                      >
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-lg">Order Management</h3>
                            <p className="text-sm text-muted-foreground">View and manage customer orders</p>
                          </div>
                          <ClipboardList className="h-8 w-8 text-primary" />
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className="bg-primary/10 hover:bg-primary/15 transition-all cursor-pointer"
                        onClick={() => setActiveTab("settings")}
                      >
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-lg">Settings</h3>
                            <p className="text-sm text-muted-foreground">Configure restaurant settings</p>
                          </div>
                          <Settings className="h-8 w-8 text-primary" />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === "menu" && (
                  <MenuManagement />
                )}

                {activeTab === "orders" && (
                  <OrderManagement />
                )}

                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <h1 className="text-3xl font-medium">Settings</h1>
                    <p className="text-muted-foreground">
                      Configure your restaurant settings here.
                    </p>
                    <Card>
                      <CardContent className="p-6">
                        <p>Settings feature is coming soon...</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

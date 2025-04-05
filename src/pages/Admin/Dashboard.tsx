
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuManagement } from "./components/MenuManagement";
import { OrderManagement } from "./components/OrderManagement";
import { AccessDenied } from "./components/AccessDenied";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

type AdminStatus = "loading" | "admin" | "denied";

const AdminDashboard = () => {
  const [adminStatus, setAdminStatus] = useState<AdminStatus>("loading");

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setAdminStatus("denied");
          return;
        }
        
        // Check if user is admin
        const { data, error } = await supabase.rpc('is_admin');
        
        if (error) throw error;
        
        if (data) {
          setAdminStatus("admin");
        } else {
          setAdminStatus("denied");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setAdminStatus("denied");
      }
    };
    
    checkAdminStatus();
  }, []);
  
  if (adminStatus === "loading") {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen">
          <Container>
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }
  
  if (adminStatus === "denied") {
    return <AccessDenied />;
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <Container className="py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your restaurant's menu and orders.
            </p>
          </div>
          
          <Tabs defaultValue="menu" className="space-y-4">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="menu">Menu Management</TabsTrigger>
              <TabsTrigger value="orders">Order Management</TabsTrigger>
            </TabsList>
            <TabsContent value="menu" className="space-y-4">
              <MenuManagement />
            </TabsContent>
            <TabsContent value="orders" className="space-y-4">
              <OrderManagement />
            </TabsContent>
          </Tabs>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;

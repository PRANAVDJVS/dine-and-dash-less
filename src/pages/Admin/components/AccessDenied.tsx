
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  const navigate = useNavigate();
  
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <Container>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="p-6 rounded-full bg-destructive/10 mb-6">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-4xl font-medium mb-4">Access Denied</h1>
            <p className="text-xl text-muted-foreground max-w-lg mb-8">
              You don't have permission to access this page. Only administrators can access the dashboard.
            </p>
            <Button onClick={() => navigate("/")} size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

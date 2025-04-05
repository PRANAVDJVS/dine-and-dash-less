
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Profile from "@/pages/Profile";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/Admin/Dashboard";
import PrivacyPolicy from "@/pages/Legal/PrivacyPolicy";
import TermsOfService from "@/pages/Legal/TermsOfService";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

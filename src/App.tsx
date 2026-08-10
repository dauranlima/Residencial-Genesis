import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import CondoMarket from "./pages/CondoMarket";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Admin from "./pages/Admin";
import Avisos from "./pages/Avisos";
import Apartamentos from "./pages/Apartamentos";
import FichaCadastral from "./pages/FichaCadastral";
import FichaFiador from "./pages/FichaFiador";
import Garagem from "./pages/Garagem";
import Galeria from "./pages/Galeria";
import Solicitacoes from "./pages/Solicitacoes";
import Vistoria from "./pages/Vistoria";
import Regimento from "./pages/Regimento";
import OutrosImoveis from "./pages/OutrosImoveis";
import Localizacao from "./pages/Localizacao";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/vizigo" element={<CondoMarket />} />
            <Route path="/localizacao" element={<Localizacao />} />
            <Route path="/adm-login" element={<SuperAdminLogin />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/avisos" element={<Avisos />} />
            <Route path="/apartamentos" element={<Apartamentos />} />
            <Route path="/ficha-cadastral" element={<FichaCadastral />} />
            <Route path="/ficha-fiador" element={<FichaFiador />} />
            <Route path="/garagem" element={<Garagem />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/solicitacoes" element={<Solicitacoes />} />
            <Route path="/vistoria" element={<Vistoria />} />
            <Route path="/regimento" element={<Regimento />} />
            <Route path="/outros-imoveis" element={<OutrosImoveis />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/vizigo" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

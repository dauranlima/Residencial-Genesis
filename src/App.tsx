import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Apartamentos from "./pages/Apartamentos";
import Galeria from "./pages/Galeria";
import Localizacao from "./pages/Localizacao";
import OutrosImoveis from "./pages/OutrosImoveis";
import Solicitacoes from "./pages/Solicitacoes";
import Vistoria from "./pages/Vistoria";
import FichaCadastral from "./pages/FichaCadastral";
import FichaFiador from "./pages/FichaFiador";
import Regimento from "./pages/Regimento";
import Garagem from "./pages/Garagem";
import CondoMarket from "./pages/CondoMarket";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/" element={<Index />} />
            <Route path="/apartamentos" element={<Apartamentos />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/localizacao" element={<Localizacao />} />
            <Route path="/outros-imoveis" element={<OutrosImoveis />} />
            <Route path="/solicitacoes" element={<Solicitacoes />} />
            <Route path="/vistoria" element={<Vistoria />} />
            <Route path="/ficha-cadastral" element={<FichaCadastral />} />
            <Route path="/ficha-fiador" element={<FichaFiador />} />
            <Route path="/regimento" element={<Regimento />} />
            <Route path="/garagem" element={<Garagem />} />
            <Route path="/condo-market" element={<CondoMarket />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

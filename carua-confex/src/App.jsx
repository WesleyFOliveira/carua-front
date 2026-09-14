import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound.jsx";
import Index from "./pages/Index.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import DashboardHome from "./pages/dashboard/DashboardHome.jsx";
import Lotes from "./pages/confeccao/Lotes.jsx";
import Parceiros from "./pages/confeccao/Parceiros.jsx";
import Alertas from "./pages/dashboard/Alertas.jsx";
import Equipe from "./pages/dashboard/Equipe.jsx";
import Financeiro from "./pages/dashboard/Financeiro.jsx";
import Perfil from "./pages/dashboard/Perfil.jsx";
import Pedidos from "./pages/dashboard/Pedidos.jsx";
import Materiais from "./pages/dashboard/Materiais.jsx";
import Relatorios from "./pages/dashboard/Relatorios.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import Toaster from "./components/ui/Toaster.jsx";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastro/*" element={<Cadastro/>} />
          <Route path="/login" element={<Login />} />

          <Route path="/confeccao" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="lotes" element={<Lotes />} />
            <Route path="parceiros" element={<Parceiros />} />
            <Route path="equipe" element={<Equipe />} />
            <Route path="materiais" element={<Materiais />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="alertas" element={<Alertas />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
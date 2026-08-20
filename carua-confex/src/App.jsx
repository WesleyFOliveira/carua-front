import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound.jsx";
import Index from "./pages/Index.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Cadastro from "./pages/Cadastro.jsx";

import Toaster from "./components/ui/Toaster.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cadastro/*" element={<Cadastro/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

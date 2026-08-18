import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("Erro 404: URL não encontrada", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted via-background to-muted px-6">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border bg-background/80 p-10 text-center shadow-xl backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="text-7xl font-extrabold tracking-tight text-primary">
              404
            </h1>

            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary" />
          </div>

          <h2 className="mb-4 text-2xl font-bold">404 - Não Encontrado</h2>

          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            A página que você está procurando não existe.
          </p>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
          >
            Retornar para a página inicial
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

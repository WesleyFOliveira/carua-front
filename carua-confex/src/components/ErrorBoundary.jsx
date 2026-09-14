import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Erro capturado pelo ErrorBoundary:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Algo deu errado</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Não conseguimos carregar esta página. Tente atualizar; se o problema continuar, avise o suporte.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90"
          >
            Atualizar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
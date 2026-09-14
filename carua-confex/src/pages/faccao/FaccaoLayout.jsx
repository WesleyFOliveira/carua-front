import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, PackageCheck, History, UserCircle2, ArrowLeft, Menu } from "lucide-react";
import { Logo } from "../../components/site/Logo";
import { Badge } from "../../components/ui/Badge";
import { UserMenu } from "../../components/dashboard/UserMenu";
import { getMeusLotes } from "../../services/meuslotesservice";
import { getMeuPerfilFaccao } from "../../services/faccaoperfilservice";

const ITEMS = [
  { to: "/faccao", label: "Visão geral", icon: LayoutDashboard, end: true },
  { to: "/faccao/lotes", label: "Lotes recebidos", icon: PackageCheck },
  { to: "/faccao/historico", label: "Histórico", icon: History },
  { to: "/faccao/perfil", label: "Meu perfil", icon: UserCircle2 },
];

const FaccaoSidebar = ({ collapsed, mobileOpen, onNavigate, perfil, lotesAtivos }) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform lg:translate-x-0 lg:static ${
        collapsed ? "lg:w-16" : "lg:w-64"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-3">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <Logo className="h-7 w-7 shrink-0" inverted />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="truncate font-display text-sm font-bold text-sidebar-foreground">
                Caruá Confex
              </span>
              <span className="text-[10px] uppercase tracking-wider text-accent">Facção</span>
            </div>
          )}
        </Link>
      </div>

      {!collapsed && perfil && (
        <div className="mx-2 mb-1 mt-2 rounded-xl bg-sidebar-accent/40 p-2.5">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">{perfil.nome}</p>
          <p className="truncate text-[11px] text-sidebar-foreground/70">
            {perfil.cidade} · Cap. {perfil.capacidadeMes}/mês
          </p>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {!collapsed && "Produção"}
        </p>
        {ITEMS.map((it) => {
          const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
          const badge = it.to === "/faccao/lotes" ? lotesAtivos : 0;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-surface"
              }`}
            >
              <it.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="flex flex-1 items-center justify-between">
                  <span className="truncate">{it.label}</span>
                  {badge > 0 && (
                    <Badge className="ml-2 h-5 bg-accent px-1.5 text-[10px] text-accent-foreground hover:bg-accent">
                      {badge}
                    </Badge>
                  )}
                </span>
              )}
            </NavLink>
          );
        })}

        <p className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {!collapsed && "Comunidade"}
        </p>
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-surface"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Voltar ao site</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

const FaccaoLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [perfil, setPerfil] = useState(null);
  const [lotesAtivos, setLotesAtivos] = useState(0);

  useEffect(() => {
    let ativo = true;

    Promise.all([getMeuPerfilFaccao(), getMeusLotes()])
      .then(([dadosPerfil, listaLotes]) => {
        if (!ativo) return;
        setPerfil(dadosPerfil);
        setLotesAtivos(listaLotes.filter((l) => l.status !== "entregue").length);
      })
      .catch(() => {
        // O layout segue funcional mesmo se perfil/lotes falharem aqui — cada
        // página interna (FaccaoHome, FaccaoHistorico etc.) já trata seu próprio
        // carregamento e erro de dados.
      });

    return () => {
      ativo = false;
    };
  }, []);

  const primeiroNome = perfil?.responsavel?.split(" ")[0] ?? "";
  const iniciais = perfil?.responsavel
    ? perfil.responsavel
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <FaccaoSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        perfil={perfil}
        lotesAtivos={lotesAtivos}
      />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 hover:bg-surface lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden rounded-lg p-2 hover:bg-surface lg:block"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            {perfil && (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">Olá, {primeiroNome} 👋</span>
                <UserMenu
                  nome={perfil.responsavel}
                  papel={`${perfil.nome} · ${perfil.cidade}`}
                  perfilHref="/faccao/perfil"
                  iniciais={iniciais}
                />
              </>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FaccaoLayout;
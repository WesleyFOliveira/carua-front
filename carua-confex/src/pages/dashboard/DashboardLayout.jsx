import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Boxes, Wallet, ArrowLeft,
  BarChart3, Bell, Handshake, PackageOpen, Menu, Users,
} from "lucide-react";
import { Logo } from "../../components/site/Logo";
import { UserMenu } from "../../components/dashboard/UserMenu";

const ITEMS = [
  { to: "/confeccao", label: "Visão geral", icon: LayoutDashboard, end: true },
  { to: "/confeccao/pedidos", label: "Ordens de produção", icon: ClipboardList },
  { to: "/confeccao/lotes", label: "Lotes distribuídos", icon: PackageOpen },
  { to: "/confeccao/parceiros", label: "Parceiros produtivos", icon: Handshake },
  { to: "/confeccao/equipe", label: "Equipe da facção", icon: Users },
  { to: "/confeccao/materiais", label: "Materiais", icon: Boxes },
  { to: "/confeccao/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/confeccao/relatorios", label: "Relatórios", icon: BarChart3 },
];

const AppSidebar = ({ collapsed, mobileOpen, onNavigate }) => {
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
              <span className="text-[10px] uppercase tracking-wider text-accent">Confecção</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {!collapsed && "Coordenação da cadeia"}
        </p>
        {ITEMS.map((it) => {
          const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
          return (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-surface"
              }`}
            >
              <it.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{it.label}</span>}
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

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
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
            <span className="hidden text-sm text-muted-foreground sm:inline">Olá, Dona Maria 👋</span>
            <UserMenu nome="Dona Maria" papel="Confecção Sertão · Caruaru" perfilHref="/confeccao/perfil" iniciais="M" />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
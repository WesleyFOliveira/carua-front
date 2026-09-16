import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ImagePlus, UserCircle2, Inbox, CalendarDays, ArrowLeft, Menu,
} from "lucide-react";
import { Logo } from "../../components/site/Logo";
import { Badge } from "../../components/ui/Badge";
import { UserMenu } from "../../components/dashboard/UserMenu";
import { getMeuPerfil, getMinhasConexoes } from "../../services/profissionaisservice";

const ProSidebar = ({ collapsed, mobileOpen, onNavigate, novosPedidos }) => {
  const { pathname } = useLocation();

  const items = [
    { to: "/pro", label: "Visão geral", icon: LayoutDashboard, end: true, badge: 0 },
    { to: "/pro/pedidos", label: "Pedidos de conexão", icon: Inbox, badge: novosPedidos },
    { to: "/pro/portfolio", label: "Portfólio", icon: ImagePlus, badge: 0 },
    { to: "/pro/perfil", label: "Meu perfil", icon: UserCircle2, badge: 0 },
    { to: "/pro/agenda", label: "Agenda", icon: CalendarDays, badge: 0 },
  ];

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
              <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
                Profissional
              </span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {!collapsed && "Minha área"}
        </p>
        {items.map((it) => {
          const active = it.end ? pathname === it.to : pathname.startsWith(it.to);
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
                <span className="flex flex-1 items-center justify-between truncate">
                  {it.label}
                  {it.badge > 0 && (
                    <Badge className="ml-2 h-5 bg-accent px-1.5 text-[10px] text-accent-foreground">
                      {it.badge}
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

const ProLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [me, setMe] = useState(null);
  const [novosPedidos, setNovosPedidos] = useState(0);

  useEffect(() => {
    let ativo = true;

    Promise.all([getMeuPerfil(), getMinhasConexoes()])
      .then(([meData, conexoes]) => {
        if (!ativo) return;
        setMe(meData);
        setNovosPedidos(conexoes.filter((c) => c.status === "negociando").length);
      })
      .catch(() => {
        // Falha aqui não deve travar o layout inteiro — cada página filha trata seus próprios erros.
        // O cabeçalho só fica sem nome/foto, degradando graciosamente.
      });

    return () => {
      ativo = false;
    };
  }, []);

  const primeiroNome = me?.nome ? me.nome.split(" ")[0] : "";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <ProSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        novosPedidos={novosPedidos}
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
            {me && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Olá, {primeiroNome} 👋
              </span>
            )}
            <UserMenu
              nome={me?.nome ?? "Profissional"}
              papel={me ? `${me.especialidade} · ${me.cidade}` : ""}
              perfilHref="/pro/perfil"
              iniciais={primeiroNome ? primeiroNome[0] : "?"}
              avatarUrl={me?.foto}
            />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProLayout;
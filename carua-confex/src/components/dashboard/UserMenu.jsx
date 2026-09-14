import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export function UserMenu({ nome, papel, perfilHref = "/confeccao/perfil", iniciais }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickFora(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickFora);
    return () => document.removeEventListener("mousedown", onClickFora);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-warm font-display text-sm font-bold text-primary-foreground"
      >
        {iniciais}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-warm">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold">{nome}</p>
            <p className="truncate text-xs text-muted-foreground">{papel}</p>
          </div>
          <div className="my-1 border-t border-border" />
          <Link
            to={perfilHref}
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-surface"
          >
            Meu perfil
          </Link>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            Sair
          </Link>
        </div>
      )}
    </div>
  );
}
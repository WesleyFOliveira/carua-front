export const SiteFooter = () => (
  <footer className="border-t border-border bg-foreground text-background">
    <div className="container grid gap-10 py-14 md:grid-cols-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-bold">Caruá Confex</span>
        </div>
        <p className="text-sm text-background/70">
          Gestão produtiva têxtil feita para o jeito de quem está no chão da fábrica.
        </p>
      </div>
      <div>
        <h4 className="mb-3 font-display font-semibold">Produto</h4>
        <ul className="space-y-2 text-sm text-background/70">
          <li><a href="/#solucao" className="hover:text-accent">Solução</a></li>
          <li><a href="/#beneficios" className="hover:text-accent">Benefícios</a></li>
          <li><a href="/confeccao" className="hover:text-accent">Sistema</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 font-display font-semibold">Comunidade</h4>
        <ul className="space-y-2 text-sm text-background/70">
          <li><a href="/marketplace" className="hover:text-accent">Profissionais</a></li>
          <li><a href="#" className="hover:text-accent">Casos de uso</a></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 font-display font-semibold">Contato</h4>
        <p className="text-sm text-background/70">contato@caruaconfex.com.br</p>
        <p className="text-sm text-background/70">Caruaru — Pernambuco</p>
      </div>
    </div>
    <div className="border-t border-background/10">
      <div className="container py-5 text-center text-xs text-background/60">
        © 2026 Caruá Confex — Feito com tradição no agreste.
      </div>
    </div>
  </footer>
);
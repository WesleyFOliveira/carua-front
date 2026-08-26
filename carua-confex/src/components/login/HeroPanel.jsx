import { Link } from "react-router-dom";
import { Sparkles, Shield, Zap } from "lucide-react";
import { Logo } from "../site/Logo";
import heroImg from "../../assets/img-hero.webp";

const FEATURES = [
  { icon: Zap, text: "Controle de produção em tempo real" },
  { icon: Shield, text: "Dados seguros e organizados" },
  { icon: Sparkles, text: "Simples como deve ser" },
];

export function HeroPanel() {
  return (
    <div className="relative hidden w-[52%] overflow-hidden lg:block">
      <img
        src={heroImg}
        alt="Produção têxtil"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Overlay escuro forte para contraste */}
      <div className="absolute inset-0 bg-[hsl(20,43%,8%)]/85" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(20,43%,6%)] via-[hsl(20,43%,8%)/0.6] to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(17,78%,18%)/0.5]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo className="h-9 w-9" inverted />
          <span className="font-display text-xl font-bold text-white">Caruá Confex</span>
        </Link>

        <div className="max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-white drop-shadow-lg">
              Sua produção,<br />
              <span className="text-orange-300">sob controle.</span>
            </h1>
            <p className="text-base leading-relaxed text-white/90 drop-shadow">
              Gerencie pedidos, equipe e materiais em um único lugar.
              Feito para quem faz acontecer no têxtil nordestino.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-md">
            {FEATURES.map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-400/20">
                  <item.icon className="h-4 w-4 text-orange-300" />
                </div>
                <span className="text-sm font-medium text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-md w-fit">
          <div className="flex -space-x-2">
            {["M", "J", "C"].map((l, i) => (
              <div
                key={l}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-xs font-bold text-white"
                style={{ zIndex: 3 - i }}
              >
                {l}
              </div>
            ))}
          </div>
          <p className="text-xs text-white/85">+200 confecções já organizam sua produção aqui</p>
        </div>
      </div>
    </div>
  );
}
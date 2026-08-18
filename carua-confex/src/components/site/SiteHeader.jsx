import { useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const SiteHeader = () => {
    const { pathname } = useLocation();
    const onLanding = pathname === "/"

    const links = [
    { 
        to: "/#solucao", 
        label: "Solução" 
    },
    { 
        to: "/#beneficios", 
        label: "Benefícios" 
    },
    { 
        to: "/#como-funciona", 
        label: "Como funciona" 
    },
    { 
        to: "/marketplace", 
        label: "Profissionais" 
    },
  ];

  return (
    <header className="">
        <div>
            <Link>
                <span> 
                    Caruá <span>Confex</span>
                </span>
            </Link>
            
            <nav>
                {links.map((link) => (
                    <a
                        href={link.to.startsWith("/#") && !onLanding ? `/${link.to.replace("/", "")}` : link.to}
                    >
                        {link.label}
                    </a>
                ))}
            </nav>
        </div>
    </header>
  )
}
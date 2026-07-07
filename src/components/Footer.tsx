import { useState, useEffect } from "react";
import { PhoneCall, MapPin, Mail, MessageSquare, ArrowUp, Instagram, Facebook, Play } from "lucide-react";
import { appStore } from "../lib/appStore";

interface FooterProps {
  onNavigateToSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export default function Footer({ onNavigateToSection, onOpenAdmin }: FooterProps) {
  const [contact, setContact] = useState(appStore.getContactData());
  const [logo, setLogo] = useState(appStore.getLogo());
  const [siteName, setSiteName] = useState(appStore.getSiteName());

  useEffect(() => {
    const handleUpdate = () => {
      setContact(appStore.getContactData());
      setLogo(appStore.getLogo());
      setSiteName(appStore.getSiteName());
    };
    return appStore.subscribe(handleUpdate);
  }, []);
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent("Olá! Gostaria de falar com um projetista sobre móveis planejados sob medida para minha residência.");
    return `https://wa.me/${contact.phone}?text=${text}`;
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-gold-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleScrollToTop}>
              <img
                src={logo}
                alt={siteName}
                className="w-14 h-14 rounded-xl border border-gold-500/30 shadow-lg group-hover:scale-105 transition-all duration-300 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-wider text-white group-hover:text-gold-500 transition-colors">
                  {siteName.split(" ")[0]}
                </span>
                {siteName.split(" ").slice(1).length > 0 && (
                  <span className="text-[9px] font-mono tracking-widest text-gold-500 font-medium">
                    {siteName.split(" ").slice(1).join(" ").toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <p className="font-sans text-xs text-white/50 leading-relaxed font-light">
              Marcenaria sob medida de alto padrão. Unimos design, tecnologia e sofisticação para criar lares verdadeiramente extraordinários.
            </p>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gold-500 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              {["inicio", "portfolio", "consultor-ia", "depoimentos", "contato"].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => onNavigateToSection(id)}
                    className="font-sans text-xs text-white/60 hover:text-white transition-colors capitalize cursor-pointer text-left"
                  >
                    {id === "consultor-ia" ? "Planejamento IA" : id === "portfolio" ? "Nossos Projetos" : id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Ambientes Col */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gold-500 mb-4">
              Nossos Ambientes
            </h4>
            <ul className="space-y-2.5">
              {["Cozinhas Planejadas", "Salas de Estar & TV", "Dormitórios & Closets", "Home Office Inteligente", "Áreas Gourmet de Luxo"].map((item, idx) => (
                <li key={idx} className="font-sans text-xs text-white/60">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Summary Col */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gold-500 mb-4">
              Showroom SP
            </h4>
            <p className="font-sans text-xs text-white/60 leading-relaxed font-light mb-3">
              {contact.address}
            </p>
            <p className="font-mono text-xs text-gold-500 font-bold">
              Seg a Sex: 09h às 19h<br />
              Sábado: 09h às 14h
            </p>
          </div>
        </div>

        {/* Lower copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-sans text-xs text-white/40 font-light">
            ©2026 desenvolvido por <a href="https://www.jqstechit.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 font-bold transition-colors">Jqstechit</a>
          </p>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={onOpenAdmin}
              className="text-xs font-bold uppercase tracking-wider text-white/50 hover:text-gold-500 transition-all cursor-pointer"
              title="Acesso Administrativo"
            >
              Área Restrita
            </button>
            <button
              onClick={handleScrollToTop}
              className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white transition-all cursor-pointer"
              aria-label="Voltar para o topo"
            >
              <span>Voltar ao Topo</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP BUTTON (Requested: Icone WhatsApp) */}
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
        aria-label="Falar conosco no WhatsApp"
      >
        {/* Animated outer waves representing ping */}
        <span className="absolute -inset-1 rounded-full bg-emerald-600/30 animate-ping group-hover:bg-emerald-500/40 pointer-events-none" />
        <span className="absolute -inset-2 rounded-full bg-emerald-600/10 animate-pulse pointer-events-none" />
        
        <MessageSquare className="w-7 h-7 relative z-10" />
        
        {/* Hover Tooltip */}
        <span className="absolute right-16 bg-slate-900 text-white font-sans font-bold text-[11px] tracking-wider uppercase py-2 px-4 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl shrink-0 whitespace-nowrap">
          Falar no WhatsApp
        </span>
      </a>
    </footer>
  );
}

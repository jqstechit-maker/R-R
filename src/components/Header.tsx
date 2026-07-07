import { useState, useEffect } from "react";
import { Menu, X, Phone, Sparkles, Key } from "lucide-react";
import { appStore } from "../lib/appStore";

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
}

export default function Header({ onNavigate, activeSection, onOpenAdmin }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contact, setContact] = useState(appStore.getContactData());
  const [logo, setLogo] = useState(appStore.getLogo());
  const [siteName, setSiteName] = useState(appStore.getSiteName());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleUpdate = () => {
      setContact(appStore.getContactData());
      setLogo(appStore.getLogo());
      setSiteName(appStore.getSiteName());
    };
    const unsubscribe = appStore.subscribe(handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const navItems = [
    { id: "inicio", label: "Início" },
    { id: "portfolio", label: "Projetos" },
    { id: "consultor-ia", label: "Planejamento IA", icon: Sparkles },
    { id: "depoimentos", label: "Clientes" },
    { id: "contato", label: "Contato" }
  ];

  const handleItemClick = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  };

  const whatsAppLink = `https://wa.me/${contact.phone}?text=${encodeURIComponent("Olá, gostaria de solicitar um orçamento para meus móveis planejados!")}`;

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md py-3 shadow-lg border-b border-gold-500/10"
          : "bg-gradient-to-b from-slate-900/90 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => handleItemClick("inicio")} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative font-sans text-sm font-medium tracking-wide transition-colors duration-200 py-1 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "text-gold-500"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 animate-pulse text-gold-500" />}
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenAdmin}
              className="text-white/60 hover:text-gold-500 hover:scale-105 transition-all p-2 rounded-full cursor-pointer"
              title="Área do Administrador"
            >
              <Key className="w-4 h-4" />
            </button>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-900 font-sans font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-500/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Orçamento Grátis</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onOpenAdmin}
              className="text-white/60 hover:text-gold-500 p-1"
              title="Área do Administrador"
            >
              <Key className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gold-500 transition-colors p-1"
              aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed top-[72px] left-0 w-full bg-slate-900/98 backdrop-blur-lg border-b border-gold-500/10 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[350px] py-6 opacity-100" : "max-h-0 py-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left font-sans text-base font-semibold py-2 flex items-center gap-2 ${
                  isActive ? "text-gold-500 pl-2 border-l-2 border-gold-500" : "text-white/80"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-gold-500" />}
                {item.label}
              </button>
            );
          })}
          <div className="pt-4 border-t border-white/10">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-gold-500 hover:bg-gold-600 text-slate-900 font-sans font-bold text-sm uppercase py-3 px-4 rounded-lg transition-all w-full"
            >
              <Phone className="w-4 h-4" />
              <span>Orçamento pelo WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

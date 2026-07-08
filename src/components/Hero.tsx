import { useState, useEffect } from "react";
import { ArrowRight, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { appStore } from "../lib/appStore";
import kitchenGourmet from "../assets/images/kitchen_gourmet_1782653909715.jpg";

interface HeroProps {
  onNavigateToSection: (sectionId: string) => void;
}

export default function Hero({ onNavigateToSection }: HeroProps) {
  const [siteName, setSiteName] = useState(appStore.getSiteName());
  const [heroTitle1, setHeroTitle1] = useState(appStore.getHeroTitle1());
  const [heroTitle2, setHeroTitle2] = useState(appStore.getHeroTitle2());
  const [heroDescription, setHeroDescription] = useState(appStore.getHeroDescription());
  const [highlights, setHighlights] = useState(appStore.getHeroHighlights());
  const [projects, setProjects] = useState(appStore.getProjects());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setSiteName(appStore.getSiteName());
      setHeroTitle1(appStore.getHeroTitle1());
      setHeroTitle2(appStore.getHeroTitle2());
      setHeroDescription(appStore.getHeroDescription());
      setHighlights(appStore.getHeroHighlights());
      setProjects(appStore.getProjects());
    };
    return appStore.subscribe(handleUpdate);
  }, []);

  const slides = projects.length > 0 ? projects : [
    { id: "default_slide", image: kitchenGourmet, title: "Cozinha Gourmet Integrada" }
  ];

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4000); // Cycles every 4 seconds (perfectly within the requested 3-5 seconds)

    return () => clearInterval(interval);
  }, [slides.length, currentSlideIndex]);

  const formatText = (text: string) => {
    const siteNameCurrent = appStore.getSiteName();
    const resolvedText = text.replace(/\{siteName\}/g, siteNameCurrent);
    const parts = resolvedText.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-gold-500 font-semibold">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <section
      id="inicio"
      className="relative pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-36 bg-slate-900 overflow-hidden"
    >
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#2d2d2d,transparent)] opacity-40" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />

      {/* Decorative vertical lines representing wood grain / architectural blueprints */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none hidden lg:block">
        <div className="max-w-7xl mx-auto h-full px-8 flex justify-between">
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white" />
          <div className="w-[1px] h-full bg-white" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6 animate-fade-in text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/20 px-3.5 py-1.5 rounded-full self-center lg:self-start">
              <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
              <span className="text-xs font-mono font-medium tracking-wider text-gold-500 uppercase">
                Marcenaria de Luxo Sob Medida
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {formatText(heroTitle1)}<br />
              {formatText(heroTitle2)}
            </h1>

            <p className="font-sans text-base sm:text-lg text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              {formatText(heroDescription)}
            </p>

            {/* List of high-end trust factors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-md mx-auto lg:mx-0">
              {highlights.map((text, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-gold-500 shrink-0" />
                  <span className="text-sm text-white/80 font-medium">{text}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
              <button
                onClick={() => onNavigateToSection("consultor-ia")}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-900 font-sans font-bold text-sm uppercase tracking-wider py-4 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-gold-500/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Planejar meu Espaço com IA</span>
              </button>

              <button
                onClick={() => onNavigateToSection("portfolio")}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-white/10 hover:border-gold-500/50 text-white font-sans font-semibold text-sm uppercase tracking-wider py-4 px-8 rounded-full transition-all duration-300 cursor-pointer"
              >
                <span>Ver Portfólio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Graphical Image Showcase Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Visual background framing */}
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-gold-500/20 to-transparent blur-lg" />
            
            <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-slate-900 max-w-md lg:max-w-none w-full h-[320px] sm:h-[400px]">
              {/* Slideshow image list with cross-fade */}
              {slides.map((slide, index) => (
                <img
                  key={slide.id || index}
                  src={slide.image}
                  alt={slide.title || `Projeto ${siteName}`}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1000ms] ease-in-out ${
                    index === currentSlideIndex 
                      ? "opacity-100 scale-100 pointer-events-auto" 
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  referrerPolicy="no-referrer"
                />
              ))}
              
              {/* Overlay shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 z-20 pointer-events-none" />

              {/* Navigation dots for manually choosing slides */}
              {slides.length > 1 && (
                <div className="absolute top-4 right-4 z-30 flex space-x-1.5 bg-slate-950/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentSlideIndex ? "bg-gold-500 w-4" : "bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Visualizar slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}


            </div>

            {/* Decorative brass ring frame */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-gold-500/60 pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-gold-500/60 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

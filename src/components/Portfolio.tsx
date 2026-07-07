import React, { useState, useEffect } from "react";
import { Project } from "../types";
import { ExternalLink, Check, Heart, HelpCircle, ArrowRight } from "lucide-react";
import { appStore } from "../lib/appStore";

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({});
  
  const [projects, setProjects] = useState<Project[]>(appStore.getProjects());
  const [contact, setContact] = useState(appStore.getContactData());

  useEffect(() => {
    const handleUpdate = () => {
      setProjects(appStore.getProjects());
      setContact(appStore.getContactData());
    };
    return appStore.subscribe(handleUpdate);
  }, []);

  const categories = ["Todos", "Cozinhas", "Salas & Painéis", "Dormitórios", "Corporativo"];

  const filteredProjects = selectedCategory === "Todos"
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const toggleLike = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const getWhatsAppLink = (projectTitle: string) => {
    const text = encodeURIComponent(`Olá, vi o projeto "${projectTitle}" no portfólio do site de vocês e gostaria de solicitar uma simulação de orçamento baseada nele!`);
    return `https://wa.me/${contact.phone}?text=${text}`;
  };

  const getGeneralWhatsAppLink = () => {
    const text = encodeURIComponent("Olá, estava olhando o seu portfólio e gostaria de fazer uma consulta para meu imóvel!");
    return `https://wa.me/${contact.phone}?text=${text}`;
  };

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-gold-600 bg-gold-50 px-3 py-1.5 rounded uppercase">
            Nossos Trabalhos Recentes
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Projetos Executados com Precisão
          </h2>
          <p className="font-sans text-base text-slate-700/80 mt-4 leading-relaxed font-light">
            Navegue pela nossa galeria de criações autorais. Cada ambiente foi projetado atendendo rigidamente às especificações de espaço, gosto e orçamento de nossos clientes exclusivos.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border transition-all duration-300 cursor-pointer ${
                  selectedCategory === category
                    ? "bg-slate-900 border-slate-900 text-gold-500 shadow-md"
                    : "bg-transparent border-slate-200 text-slate-700 hover:border-gold-500/50 hover:text-slate-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-gold-500/20 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
            >
              <div className="relative h-64 sm:h-80 overflow-hidden shrink-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] font-mono bg-slate-900/90 text-gold-500 px-2.5 py-1.5 rounded-md font-bold tracking-wider uppercase border border-gold-500/20">
                    {project.category}
                  </span>
                </div>

                {/* Like button */}
                <button
                  onClick={(e) => toggleLike(project.id, e)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-sm cursor-pointer"
                  aria-label="Curtir projeto"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      likedProjects[project.id] ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>

                {/* View Details Floating Indicator */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-semibold flex items-center gap-1">
                    Ver Detalhes do Projeto <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-gold-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-sans text-sm text-slate-700/80 mt-3 font-light leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Features Badges */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.features.slice(0, 3).map((feat, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-sans bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded border border-slate-200/50"
                    >
                      {feat}
                    </span>
                  ))}
                  {project.features.length > 3 && (
                    <span className="text-[10px] font-mono text-slate-400 self-center">
                      +{project.features.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Elegant design callout */}
        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-gold-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Gostou de algum dos nossos acabamentos?
              </h3>
              <p className="font-sans text-sm sm:text-base text-white/70 mt-3 leading-relaxed font-light">
                Todos os nossos projetos são modulares e 100% editáveis. Podemos mesclar acabamentos de salas com detalhes de cozinhas para formular o design ideal para o seu espaço.
              </p>
            </div>
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-900 font-sans font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg shadow-gold-500/20 flex items-center space-x-2"
            >
              <span>Falar com Projetista</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full border border-slate-100 shadow-2xl flex flex-col md:flex-row"
          >
            {/* Image side */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-mono bg-slate-900 text-gold-500 px-3 py-1.5 rounded uppercase tracking-wider border border-gold-500/20 font-bold">
                  {selectedProject.category}
                </span>
              </div>
            </div>

            {/* Content side */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                    {selectedProject.title}
                  </h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer font-sans text-xs"
                    aria-label="Fechar modal"
                  >
                    ✕
                  </button>
                </div>

                <p className="font-sans text-sm text-slate-700/80 mt-4 leading-relaxed font-light">
                  {selectedProject.description}
                </p>

                <div className="mt-6">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gold-600 mb-3">
                    Especificações Premium:
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feat, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-gold-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <a
                  href={getWhatsAppLink(selectedProject.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-900 font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-300 text-center flex items-center justify-center space-x-2"
                >
                  <span>Pedir Orçamento Parecido</span>
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all text-center cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

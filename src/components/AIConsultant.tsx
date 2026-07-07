import React, { useState, useEffect } from "react";
import { AIConsultantInput, AIConsultantOutput } from "../types";
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, HelpCircle, PhoneCall, Home, Layout, Brush } from "lucide-react";
import { appStore } from "../lib/appStore";

export default function AIConsultant() {
  const [contact, setContact] = useState(appStore.getContactData());
  const [siteName, setSiteName] = useState(appStore.getSiteName());
  
  useEffect(() => {
    const handleUpdate = () => {
      setContact(appStore.getContactData());
      setSiteName(appStore.getSiteName());
    };
    return appStore.subscribe(handleUpdate);
  }, []);

  const [input, setInput] = useState<AIConsultantInput>({
    spaceType: "Cozinha",
    description: "",
    style: "Moderno & Minimalista",
    estimatedBudget: "Alto Padrão"
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [output, setOutput] = useState<AIConsultantOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  // States for dynamic AI 3D Image Concept generation
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const loadingSteps = [
    "Analisando dimensões e circulação do espaço...",
    "Projetando disposição ergonômica dos armários...",
    "Harmonizando paleta de cores e acabamentos em madeira...",
    "Selecionando ferragens e recursos inteligentes...",
    "Formatando seu planejamento técnico de interiores..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const spaceTypes = [
    "Cozinha",
    "Sala de Estar / Jantar",
    "Dormitório Casal / Solteiro",
    "Closet",
    "Home Office / Escritório",
    "Banheiro / Lavabo"
  ];

  const styles = [
    "Moderno & Minimalista (Tons cinzas/pretos com madeira natural)",
    "Clássico Provençal (Molduras nas portas, tons claros e aconchegantes)",
    "Industrial / Urbano (Tons escuros, perfis metálicos, vidro reflecta)",
    "Escandinavo / Orgânico (Madeira clara, branco absoluto, super iluminado)"
  ];

  const budgets = [
    "Premium (Ferragens Blum, acabamentos ultra-resistentes, portas em vidro)",
    "Intermediário (Excelente custo-benefício, ferragens amortecidas, puxador cava)",
    "Econômico (Marcenaria essencial funcional, acabamentos padrões duráveis)"
  ];

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.description.trim()) {
      setError("Por favor, descreva brevemente seu ambiente para que o planejador possa projetar.");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);
    setGeneratedImage(null);
    setImageError(null);

    try {
      const res = await fetch("/api/consultar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
      });

      if (!res.ok) {
        throw new Error("Erro na resposta do servidor.");
      }

      const data = await res.json();
      setOutput(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível conectar com o planejador de Inteligência Artificial no momento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate3DConcept = async () => {
    setImageLoading(true);
    setImageError(null);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/gerar-conceito-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceType: input.spaceType,
          style: input.style,
          description: input.description
        })
      });

      if (!res.ok) {
        throw new Error("Erro ao gerar imagem.");
      }

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        throw new Error("Resposta inválida do servidor.");
      }
    } catch (err) {
      console.error(err);
      setImageError("Não foi possível renderizar o conceito 3D visual neste momento. Por favor, tente novamente.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleReset = () => {
    setInput({
      spaceType: "Cozinha",
      description: "",
      style: "Moderno & Minimalista",
      estimatedBudget: "Alto Padrão"
    });
    setOutput(null);
    setError(null);
    setGeneratedImage(null);
    setImageError(null);
  };

  const handleSendToWhatsApp = () => {
    if (!output) return;
    
    let text = `*PLANEJAMENTO DE AMBIENTE ${siteName.toUpperCase()}*\n\n`;
    text += `*Ambiente:* ${input.spaceType}\n`;
    text += `*Estilo:* ${input.style}\n`;
    text += `*Padrão:* ${input.estimatedBudget}\n`;
    text += `*Descrição do Espaço:* ${input.description}\n\n`;
    text += `--- RECOMENDAÇÕES DA IA ---\n`;
    text += `*Layout Sugerido:* ${output.layoutText}\n\n`;
    text += `*Cores & Materiais:* ${output.colorMaterials}\n\n`;
    text += `*Recursos Recomentados:*\n`;
    output.keyFeatures.forEach(f => text += `• ${f}\n`);
    text += `\n*Dica ${siteName.split(" ")[0]}:* ${output.advice}\n\n`;
    text += `*Gostaria de agendar um atendimento para desenhar o meu projeto 3D oficial!*`;

    window.open(`https://wa.me/${contact.phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="consultor-ia" className="py-20 md:py-28 bg-slate-50 border-y border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-gold-600 bg-gold-50 px-3 py-1.5 rounded uppercase">
            Inovação Exclusiva {siteName.split(" ")[0]}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Consultor de Ambientes Inteligente
          </h2>
          <p className="font-sans text-base text-slate-700/80 mt-4 leading-relaxed font-light">
            Nossa Inteligência Artificial projeta o escopo preliminar do seu móvel sob medida instantaneamente. Descreva o ambiente e receba soluções ergonômicas de design de interiores.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Container Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden min-h-[480px] flex flex-col">
            
            {/* Form Mode */}
            {!loading && !output && (
              <form onSubmit={handleConsult} className="p-8 sm:p-10 space-y-6 flex-grow flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Space Type */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Tipo de Ambiente
                      </label>
                      <select
                        value={input.spaceType}
                        onChange={(e) => setInput({ ...input, spaceType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl p-3 focus:outline-none focus:border-gold-500 transition-colors"
                      >
                        {spaceTypes.map((t, idx) => (
                          <option key={idx} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Design Style */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Estilo Decorativo Almejado
                      </label>
                      <select
                        value={input.style}
                        onChange={(e) => setInput({ ...input, style: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl p-3 focus:outline-none focus:border-gold-500 transition-colors"
                      >
                        {styles.map((s, idx) => (
                          <option key={idx} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Budget Standard */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Padrão de Acabamentos e Ferragens
                    </label>
                    <select
                      value={input.estimatedBudget}
                      onChange={(e) => setInput({ ...input, estimatedBudget: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl p-3 focus:outline-none focus:border-gold-500 transition-colors"
                    >
                      {budgets.map((b, idx) => (
                        <option key={idx} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description Box */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                        Descreva as dimensões e necessidades do espaço
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">Recomendado</span>
                    </div>
                    <textarea
                      value={input.description}
                      onChange={(e) => setInput({ ...input, description: e.target.value })}
                      rows={4}
                      placeholder="Exemplo: Cozinha em formato L de 3m x 2.4m, preciso integrar a geladeira side-by-side, micro-ondas e forno elétrico em uma torre quente e quero uma bancada para refeições rápidas de duas pessoas."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-light leading-relaxed rounded-xl p-4 focus:outline-none focus:border-gold-500 transition-colors placeholder:text-slate-400"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl">
                      {error}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="hidden sm:flex items-center space-x-2 text-slate-400 text-xs font-light">
                    <Sparkles className="w-4 h-4 text-gold-500" />
                    <span>Processado em servidor seguro por Gemini AI</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-gold-500 font-sans font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Gerar Planejamento de Marcenaria</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Loading Mode */}
            {loading && (
              <div className="p-10 flex-grow flex flex-col items-center justify-center space-y-6 text-center animate-pulse">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                  <Sparkles className="w-8 h-8 text-gold-500 absolute inset-0 m-auto animate-ping" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    Sua marcenaria inteligente está sendo desenhada...
                  </h3>
                  <p className="font-sans text-sm text-slate-500 font-light min-h-[40px]">
                    {loadingSteps[loadingStep]}
                  </p>
                </div>
                <div className="w-48 bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-gold-500 h-full transition-all duration-1000" 
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Results Mode */}
            {!loading && output && (
              <div className="p-8 sm:p-10 flex-grow flex flex-col justify-between">
                <div className="space-y-8">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-1 rounded">
                        Simulação Concluída
                      </span>
                      <h3 className="font-display text-2xl font-bold text-slate-900 mt-2">
                        Diretrizes de Layout para {input.spaceType}
                      </h3>
                    </div>
                    <button
                      onClick={handleReset}
                      className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 py-2 px-4 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Novo Planejamento</span>
                    </button>
                  </div>

                  {/* Grid of details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left details */}
                    <div className="space-y-6">
                      <div className="flex items-start space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-600 shrink-0">
                          <Layout className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wide">
                            Layout e Ergonomia Recomendados
                          </h4>
                          <p className="font-sans text-sm text-slate-700/80 mt-2 leading-relaxed font-light">
                            {output.layoutText}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-600 shrink-0">
                          <Brush className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display text-sm font-bold text-slate-900 uppercase tracking-wide">
                            Paleta de Cores e Matérias-Primas
                          </h4>
                          <p className="font-sans text-sm text-slate-700/80 mt-2 leading-relaxed font-light">
                            {output.colorMaterials}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right details */}
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <h4 className="font-display text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
                          Recursos e Integrações Inteligentes
                        </h4>
                        <ul className="space-y-3">
                          {output.keyFeatures.map((feat, idx) => (
                            <li key={idx} className="flex items-start space-x-2.5">
                              <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                              <span className="text-sm text-slate-700 font-medium">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Advice card */}
                      <div className="border border-gold-500/20 bg-gold-500/[0.02] p-5 rounded-2xl">
                        <span className="text-[10px] font-mono font-bold text-gold-600 uppercase tracking-widest">
                          Dica do Arquiteto {siteName.split(" ")[0]}
                        </span>
                        <p className="font-sans text-sm text-slate-800/95 italic mt-1 leading-relaxed font-light">
                          "{output.advice}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI 3D Concept Section */}
                  <div className="border-t border-slate-100 pt-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-gold-500 animate-pulse" />
                          Conceito Visual 3D Inédito por IA
                        </h4>
                        <p className="font-sans text-xs text-slate-500 font-light">
                          Gere uma representação 3D conceitual fotorrealista exclusiva de acordo com as especificações escolhidas.
                        </p>
                      </div>

                      {!generatedImage && !imageLoading && (
                        <button
                          onClick={handleGenerate3DConcept}
                          className="bg-gold-500 hover:bg-gold-600 text-slate-900 font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-gold-500/10 shrink-0 self-start sm:self-auto"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Renderizar Conceito 3D</span>
                        </button>
                      )}
                    </div>

                    {/* Image Render States */}
                    {imageLoading && (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
                        <div className="w-12 h-12 border-4 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
                        <div className="space-y-1">
                          <p className="font-display text-sm font-bold text-slate-900">Renderizando seu conceito virtual sob medida...</p>
                          <p className="font-sans text-xs text-slate-400 font-light">Isso pode levar alguns segundos usando inteligência artificial generativa. Por favor, aguarde.</p>
                        </div>
                      </div>
                    )}

                    {imageError && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-xl">
                        {imageError}
                      </div>
                    )}

                    {generatedImage && (
                      <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg bg-slate-900 group">
                          <img
                            src={generatedImage}
                            alt={`Conceito 3D para ${input.spaceType}`}
                            referrerPolicy="no-referrer"
                            className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <p className="text-white text-xs font-mono">
                              *Representação artística conceitual 3D gerada por Inteligência Artificial para {input.spaceType} ({input.style})
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-light text-slate-500">
                          <p className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Renderização conceitual 3D finalizada com sucesso!
                          </p>
                          <button
                            onClick={handleGenerate3DConcept}
                            className="text-gold-600 hover:text-gold-700 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Renderizar Novamente
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 text-center sm:text-left font-light max-w-md">
                    *Esta recomendação é conceitual e automatizada. Agende um atendimento com nosso projetista físico para elaborar o projeto executivo oficial em CAD 3D gratuito.
                  </p>
                  <button
                    onClick={handleSendToWhatsApp}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Enviar Planejamento para WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}

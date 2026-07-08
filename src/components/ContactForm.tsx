import React, { useState, useEffect } from "react";
import { ContactFormData } from "../types";
import { Mail, Phone, MapPin, Send, MessageSquare, Check, Instagram, Facebook, Play, Linkedin } from "lucide-react";
import { appStore } from "../lib/appStore";

export default function ContactForm() {
  const [contact, setContact] = useState(appStore.getContactData());
  const [siteName, setSiteName] = useState(appStore.getSiteName());
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    interest: "Cozinha",
    message: ""
  });

  useEffect(() => {
    const handleUpdate = () => {
      setContact(appStore.getContactData());
      setSiteName(appStore.getSiteName());
    };
    return appStore.subscribe(handleUpdate);
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const interests = [
    "Cozinha",
    "Sala / Painéis",
    "Dormitório",
    "Closet",
    "Banheiro / Lavabo",
    "Todo o Imóvel / Apartamento Inteiro"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Por favor, preencha os campos obrigatórios: Nome, E-mail e Celular.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error("Erro ao submeter os dados.");
      }

      const data = await res.json();
      setSuccess(data.message || "Contato enviado com sucesso! Retornaremos em breve.");
      
      // Clear form except interest
      setFormData({
        name: "",
        email: "",
        phone: "",
        interest: "Cozinha",
        message: ""
      });
    } catch (err) {
      console.error(err);
      setError("Não foi possível registrar o contato pelo formulário. Por favor, tente enviar sua mensagem via WhatsApp direto.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppDirectLink = () => {
    const text = encodeURIComponent(`Olá, tentei contato via formulário do site ${siteName} e gostaria de falar diretamente com um atendente comercial.`);
    return `https://wa.me/${contact.phone}?text=${text}`;
  };

  return (
    <section id="contato" className="py-20 md:py-28 bg-slate-900 text-white relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,#2d2d2d,transparent)] opacity-40 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Left Column: Info & Socials */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-gold-500 uppercase">
                Fale Conosco
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Vamos Planejar seu Sonho?
              </h2>
              <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed font-light">
                Agende uma visita ao nosso showroom ou nos envie as plantas baixas do seu imóvel para receber um projeto 3D preliminar sem qualquer compromisso de compra.
              </p>
            </div>

            {/* Info details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold uppercase tracking-wide text-white">ENDEREÇO</h4>
                  <p className="text-sm text-white/70 mt-1 font-light">
                    {contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold uppercase tracking-wide text-white">Telefone e WhatsApp</h4>
                  <p className="text-sm text-white/70 mt-1 font-light">
                    {contact.formattedPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold uppercase tracking-wide text-white">E-mail Comercial</h4>
                  <p className="text-sm text-white/70 mt-1 font-light">
                    {contact.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Integration */}
            {(contact.instagramVisible !== false || contact.facebookVisible !== false || contact.youtubeVisible !== false || contact.linkedinVisible === true) && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-500">
                  Siga-nos nas Redes Sociais
                </h4>
                <div className="flex items-center space-x-3">
                  {contact.instagramVisible !== false && (
                    <a
                      href={contact.instagramUrl || "https://instagram.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-slate-800 border border-white/10 hover:border-gold-500 flex items-center justify-center text-white hover:text-gold-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      aria-label="Instagram da R&R"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {contact.facebookVisible !== false && (
                    <a
                      href={contact.facebookUrl || "https://facebook.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-slate-800 border border-white/10 hover:border-gold-500 flex items-center justify-center text-white hover:text-gold-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      aria-label="Facebook da R&R"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {contact.youtubeVisible !== false && (
                    <a
                      href={contact.youtubeUrl || "https://youtube.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-slate-800 border border-white/10 hover:border-gold-500 flex items-center justify-center text-white hover:text-gold-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      aria-label="Youtube da R&R"
                    >
                      <Play className="w-5 h-5" />
                    </a>
                  )}
                  {contact.linkedinVisible === true && (
                    <a
                      href={contact.linkedinUrl || "https://linkedin.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-slate-800 border border-white/10 hover:border-gold-500 flex items-center justify-center text-white hover:text-gold-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      aria-label="LinkedIn da R&R"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  <a
                    href={getWhatsAppDirectLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-emerald-600 border border-emerald-500/30 hover:border-emerald-400 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    aria-label="WhatsApp Direto"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7">
            <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 p-8 sm:p-10 rounded-3xl shadow-xl min-h-[460px] flex flex-col justify-center">
              
              {!success && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Mariana Silva"
                        className="w-full bg-slate-900/80 border border-white/10 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                        E-mail de Contato *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Ex: mariana@email.com"
                        className="w-full bg-slate-900/80 border border-white/10 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                        WhatsApp / Celular *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Ex: (11) 99999-9999"
                        className="w-full bg-slate-900/80 border border-white/10 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-gold-500 transition-colors"
                      />
                    </div>

                    {/* Area of Interest */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                        Ambiente de Interesse
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full bg-slate-900/80 border border-white/10 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-gold-500 transition-colors"
                      >
                        {interests.map((item, idx) => (
                          <option key={idx} value={item} className="bg-slate-900">{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Fale um pouco sobre seu projeto (Opcional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      placeholder="Gostaria de agendar uma visita para discutir a planta da minha nova cozinha gourmet."
                      className="w-full bg-slate-900/80 border border-white/10 text-white text-sm rounded-xl p-3 focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400 font-medium">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-900 font-sans font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-gold-500/10 disabled:opacity-55"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Mensagem Integrada</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {success && (
                <div className="text-center space-y-6 py-6 animate-fade-in">
                  <div className="w-16 h-16 bg-gold-500/15 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto text-gold-500">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-bold text-white">
                      Mensagem Registrada!
                    </h3>
                    <p className="font-sans text-sm text-white/70 max-w-md mx-auto font-light leading-relaxed">
                      {success}
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={getWhatsAppDirectLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Falar direto no WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setSuccess(null)}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer"
                    >
                      Voltar ao Formulário
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

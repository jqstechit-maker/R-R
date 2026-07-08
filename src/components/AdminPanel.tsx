import React, { useState, useEffect } from "react";
import { appStore, ContactData, COLOR_PRESETS, applyHighlightColors } from "../lib/appStore";
import { Project, Testimonial, ColorPalette } from "../types";
import { 
  Lock, Settings, Save, Phone, MapPin, Mail, 
  Trash2, Plus, Edit2, X, Check, Image as ImageIcon,
  LogOut, Star, FileText, Compass, AlertCircle, Palette, Sparkles
} from "lucide-react";

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Tabs for the admin panel
  const [activeTab, setActiveTab] = useState<"contato" | "identidade" | "projetos" | "comentarios" | "hero">("contato");

  // Hero section customization states
  const [heroTitle1, setHeroTitle1] = useState(appStore.getHeroTitle1());
  const [heroTitle2, setHeroTitle2] = useState(appStore.getHeroTitle2());
  const [heroDescription, setHeroDescription] = useState(appStore.getHeroDescription());
  const [heroHighlightsText, setHeroHighlightsText] = useState(appStore.getHeroHighlights().join("\n"));
  const [heroSuccess, setHeroSuccess] = useState(false);

  // State for data
  const [contactData, setContactData] = useState<ContactData>(appStore.getContactData());
  const [projects, setProjects] = useState<Project[]>(appStore.getProjects());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(appStore.getTestimonials());

  // Project Form State
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectFormId, setProjectFormId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState<Project["category"]>("Cozinhas");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectFeatures, setProjectFeatures] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectImageError, setProjectImageError] = useState("");

  // Testimonial Form State
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [testimonialFormId, setTestimonialFormId] = useState<string | null>(null);
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialRole, setTestimonialRole] = useState("");
  const [testimonialComment, setTestimonialComment] = useState("");
  const [testimonialRating, setTestimonialRating] = useState(5);

  // Success state indicators
  const [contactSuccess, setContactSuccess] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [testimonialSuccess, setTestimonialSuccess] = useState(false);

  // Logo customization state
  const [logo, setLogo] = useState(appStore.getLogo());
  const [logoSuccess, setLogoSuccess] = useState(false);
  const [logoError, setLogoError] = useState("");

  // Site name customization state
  const [siteName, setSiteName] = useState(appStore.getSiteName());
  const [siteNameInput, setSiteNameInput] = useState(appStore.getSiteName());
  const [siteNameSuccess, setSiteNameSuccess] = useState(false);
  const [siteNameError, setSiteNameError] = useState("");

  // Highlights color customization state
  const [currentPalette, setCurrentPalette] = useState<ColorPalette["colors"]>(appStore.getPalette());
  const [paletteSuccess, setPaletteSuccess] = useState(false);
  const [customColor, setCustomColor] = useState(appStore.getPalette()[500]);

  // Color shade generation helper
  const hexToRgb = (hex: string) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 212, g: 175, b: 55 }; // Default to gold
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
    const hexVal = (val: number) => clamp(val).toString(16).padStart(2, "0");
    return `#${hexVal(r)}${hexVal(g)}${hexVal(b)}`;
  };

  const generatePaletteFromColor = (hexColor: string): ColorPalette["colors"] => {
    const rgb = hexToRgb(hexColor);
    return {
      50: rgbToHex(rgb.r + (255 - rgb.r) * 0.93, rgb.g + (255 - rgb.g) * 0.93, rgb.b + (255 - rgb.b) * 0.93),
      100: rgbToHex(rgb.r + (255 - rgb.r) * 0.8, rgb.g + (255 - rgb.g) * 0.8, rgb.b + (255 - rgb.b) * 0.8),
      500: hexColor,
      600: rgbToHex(rgb.r * 0.8, rgb.g * 0.8, rgb.b * 0.8),
      700: rgbToHex(rgb.r * 0.6, rgb.g * 0.6, rgb.b * 0.6)
    };
  };

  // Check login on load
  useEffect(() => {
    const logged = localStorage.getItem("rr_admin_logged") === "true";
    if (logged) {
      setIsAuthenticated(true);
    }
  }, []);

  // Sync data whenever store updates
  useEffect(() => {
    const handleStoreChange = () => {
      setContactData(appStore.getContactData());
      setProjects(appStore.getProjects());
      setTestimonials(appStore.getTestimonials());
      setLogo(appStore.getLogo());
      setSiteName(appStore.getSiteName());
      setSiteNameInput(appStore.getSiteName());
      const palette = appStore.getPalette();
      setCurrentPalette(palette);
      setCustomColor(palette[500]);
      setHeroTitle1(appStore.getHeroTitle1());
      setHeroTitle2(appStore.getHeroTitle2());
      setHeroDescription(appStore.getHeroDescription());
      setHeroHighlightsText(appStore.getHeroHighlights().join("\n"));
    };
    return appStore.subscribe(handleStoreChange);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated admin credentials as requested
    const validUsernames = ["admin", "jqstechit@gmail.com"];
    const validPasswords = ["jqstech"];

    if (validUsernames.includes(username.toLowerCase().trim()) && validPasswords.includes(password)) {
      setIsAuthenticated(true);
      localStorage.setItem("rr_admin_logged", "true");
      setLoginError("");
    } else {
      setLoginError("Credenciais inválidas. Use 'admin' e senha 'jqstech' para entrar.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("rr_admin_logged");
    setUsername("");
    setPassword("");
  };

  // 1. SAVE CONTACT INFO
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.saveContactData(contactData);
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 3000);
  };

  // 1b. HANDLE COMPANY LOGO UPLOAD & RESET
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setLogoError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setLogoError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Create canvas to scale logo to max 400px width/height for beautiful balance of resolution & performance
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Export compressed PNG/JPEG
        const compressedBase64 = canvas.toDataURL("image/png");
        appStore.saveLogo(compressedBase64);
        setLogoSuccess(true);
        setTimeout(() => setLogoSuccess(false), 3000);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    if (confirm("Deseja realmente restaurar a logo padrão do site?")) {
      localStorage.removeItem("rr_logo");
      appStore.notifyUpdate();
      setLogoSuccess(true);
      setTimeout(() => setLogoSuccess(false), 3000);
    }
  };

  // 1c. HANDLE SITE NAME SAVE & RESET
  const handleSaveSiteName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteNameInput.trim()) {
      setSiteNameError("O nome do site não pode ser vazio.");
      return;
    }
    setSiteNameError("");
    appStore.saveSiteName(siteNameInput.trim());
    setSiteNameSuccess(true);
    setTimeout(() => setSiteNameSuccess(false), 3000);
  };

  const handleResetSiteName = () => {
    if (confirm("Deseja realmente restaurar o nome do site para o padrão?")) {
      localStorage.removeItem("rr_site_name");
      appStore.notifyUpdate();
      setSiteNameInput("R&R Móveis Planejados");
      setSiteNameSuccess(true);
      setTimeout(() => setSiteNameSuccess(false), 3000);
    }
  };

  // 1d. HANDLE PALETTE SAVE & RESET & CUSTOM SELECTION
  const handleSelectPresetPalette = (colors: ColorPalette["colors"]) => {
    appStore.savePalette(colors);
    setPaletteSuccess(true);
    setTimeout(() => setPaletteSuccess(false), 3000);
  };

  const handleCustomColorChange = (colorHex: string) => {
    setCustomColor(colorHex);
    const generated = generatePaletteFromColor(colorHex);
    appStore.savePalette(generated);
  };

  const handleResetPalette = () => {
    if (confirm("Deseja realmente restaurar as cores de destaque padrão?")) {
      localStorage.removeItem("rr_palette");
      appStore.notifyUpdate();
      // Apply the first default preset
      applyHighlightColors(COLOR_PRESETS[0].colors);
      setPaletteSuccess(true);
      setTimeout(() => setPaletteSuccess(false), 3000);
    }
  };

  // Hero custom section save & reset
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.saveHeroTitle1(heroTitle1.trim());
    appStore.saveHeroTitle2(heroTitle2.trim());
    appStore.saveHeroDescription(heroDescription.trim());
    
    const highlightsArr = heroHighlightsText
      .split("\n")
      .map(item => item.trim())
      .filter(Boolean);
    appStore.saveHeroHighlights(highlightsArr);

    setHeroSuccess(true);
    setTimeout(() => setHeroSuccess(false), 3000);
  };

  const handleResetHero = () => {
    if (confirm("Deseja realmente restaurar os textos iniciais do site para o padrão?")) {
      localStorage.removeItem("rr_hero_title1");
      localStorage.removeItem("rr_hero_title2");
      localStorage.removeItem("rr_hero_description");
      localStorage.removeItem("rr_hero_highlights");
      appStore.notifyUpdate();
      setHeroSuccess(true);
      setTimeout(() => setHeroSuccess(false), 3000);
    }
  };

  // Compress and handle image uploads beautifully to keep base64 sizes small
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProjectImageError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setProjectImageError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Create canvas to scale image to max 900px width/height for superb balance between quality and storage limits
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Export compressed JPEG
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        setProjectImage(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  // 2. PROJECT MANAGEMENT
  const handleOpenNewProjectForm = () => {
    setIsEditingProject(true);
    setProjectFormId(null);
    setProjectTitle("");
    setProjectCategory("Cozinhas");
    setProjectDescription("");
    setProjectFeatures("");
    setProjectImage("");
    setProjectImageError("");
  };

  const handleEditProject = (proj: Project) => {
    setIsEditingProject(true);
    setProjectFormId(proj.id);
    setProjectTitle(proj.title);
    setProjectCategory(proj.category);
    setProjectDescription(proj.description);
    setProjectFeatures(proj.features.join(", "));
    setProjectImage(proj.image);
    setProjectImageError("");
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectDescription || !projectImage) {
      setProjectImageError("Título, descrição e imagem são obrigatórios.");
      return;
    }

    const featuresList = projectFeatures
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const updatedProjects = [...projects];

    if (projectFormId) {
      // Edit mode
      const idx = updatedProjects.findIndex((p) => p.id === projectFormId);
      if (idx !== -1) {
        updatedProjects[idx] = {
          ...updatedProjects[idx],
          title: projectTitle,
          category: projectCategory,
          description: projectDescription,
          features: featuresList,
          image: projectImage
        };
      }
    } else {
      // Create mode
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        title: projectTitle,
        category: projectCategory,
        description: projectDescription,
        features: featuresList,
        image: projectImage
      };
      updatedProjects.unshift(newProject);
    }

    appStore.saveProjects(updatedProjects);
    setIsEditingProject(false);
    setProjectSuccess(true);
    setTimeout(() => setProjectSuccess(false), 3000);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Deseja realmente remover este projeto? Esta ação é permanente.")) {
      const updated = projects.filter((p) => p.id !== id);
      appStore.saveProjects(updated);
    }
  };

  // 3. TESTIMONIAL MANAGEMENT
  const handleOpenNewTestimonialForm = () => {
    setIsEditingTestimonial(true);
    setTestimonialFormId(null);
    setTestimonialName("");
    setTestimonialRole("");
    setTestimonialComment("");
    setTestimonialRating(5);
  };

  const handleEditTestimonial = (test: Testimonial) => {
    setIsEditingTestimonial(true);
    setTestimonialFormId(test.id);
    setTestimonialName(test.name);
    setTestimonialRole(test.role);
    setTestimonialComment(test.comment);
    setTestimonialRating(test.rating);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialName || !testimonialComment) {
      return;
    }

    const updatedTestimonials = [...testimonials];

    if (testimonialFormId) {
      const idx = updatedTestimonials.findIndex((t) => t.id === testimonialFormId);
      if (idx !== -1) {
        updatedTestimonials[idx] = {
          ...updatedTestimonials[idx],
          name: testimonialName,
          role: testimonialRole || "Cliente",
          comment: testimonialComment,
          rating: testimonialRating
        };
      }
    } else {
      const newTest: Testimonial = {
        id: `test_${Date.now()}`,
        name: testimonialName,
        role: testimonialRole || "Cliente",
        comment: testimonialComment,
        rating: testimonialRating
      };
      updatedTestimonials.unshift(newTest);
    }

    appStore.saveTestimonials(updatedTestimonials);
    setIsEditingTestimonial(false);
    setTestimonialSuccess(true);
    setTimeout(() => setTestimonialSuccess(false), 3000);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm("Deseja realmente remover este comentário?")) {
      const updated = testimonials.filter((t) => t.id !== id);
      appStore.saveTestimonials(updated);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-gold-600 to-gold-500 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Painel Administrativo</h3>
              <p className="text-[10px] font-mono tracking-wider text-gold-500 uppercase">{siteName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer font-sans text-xs"
          >
            ✕
          </button>
        </div>

        {/* NOT AUTHENTICATED STATE */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto w-full py-16 flex flex-col justify-center">
            <div className="text-center space-y-3 mb-8">
              <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 rounded-full flex items-center justify-center mx-auto text-gold-500">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-display text-xl font-bold text-white">Acesso Restrito</h4>
              <p className="font-sans text-xs text-slate-400">Insira suas credenciais de administrador da R&R para continuar.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Usuário / Email</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Senha</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {loginError}
                </p>
              )}

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-gold-500/10 cursor-pointer mt-2"
              >
                Entrar no Painel
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-[10px] font-sans text-slate-500">
                Site Desenvolvido por <a href="https://www.jqstechit.com.br" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline font-bold">Jqstech-iT</a>
              </p>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED MAIN DASHBOARD */
          <div className="flex flex-col md:flex-row flex-grow">
            
            {/* Sidebar Tabs */}
            <div className="md:w-60 bg-slate-950 border-r border-slate-800 p-4 space-y-1.5 flex flex-col justify-between shrink-0">
              <div className="space-y-1.5">
                <button
                  onClick={() => { setActiveTab("contato"); setIsEditingProject(false); setIsEditingTestimonial(false); }}
                  className={`w-full text-left font-sans text-xs font-bold uppercase tracking-wider p-3 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                    activeTab === "contato" 
                      ? "bg-slate-900 text-gold-500 border-l-2 border-gold-500" 
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Dados de Contato</span>
                </button>

                <button
                  onClick={() => { setActiveTab("identidade"); setIsEditingProject(false); setIsEditingTestimonial(false); }}
                  className={`w-full text-left font-sans text-xs font-bold uppercase tracking-wider p-3 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                    activeTab === "identidade" 
                      ? "bg-slate-900 text-gold-500 border-l-2 border-gold-500" 
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>Logo & Nome do Site</span>
                </button>

                <button
                  onClick={() => { setActiveTab("hero"); setIsEditingProject(false); setIsEditingTestimonial(false); }}
                  className={`w-full text-left font-sans text-xs font-bold uppercase tracking-wider p-3 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                    activeTab === "hero" 
                      ? "bg-slate-900 text-gold-500 border-l-2 border-gold-500" 
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Texto Inicial (Hero)</span>
                </button>

                <button
                  onClick={() => { setActiveTab("projetos"); setIsEditingProject(false); setIsEditingTestimonial(false); }}
                  className={`w-full text-left font-sans text-xs font-bold uppercase tracking-wider p-3 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                    activeTab === "projetos" 
                      ? "bg-slate-900 text-gold-500 border-l-2 border-gold-500" 
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Projetos (Fotos)</span>
                </button>

                <button
                  onClick={() => { setActiveTab("comentarios"); setIsEditingProject(false); setIsEditingTestimonial(false); }}
                  className={`w-full text-left font-sans text-xs font-bold uppercase tracking-wider p-3 rounded-xl flex items-center space-x-2.5 transition-all cursor-pointer ${
                    activeTab === "comentarios" 
                      ? "bg-slate-900 text-gold-500 border-l-2 border-gold-500" 
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Comentários</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left font-sans text-xs font-bold uppercase tracking-wider p-3 rounded-xl flex items-center space-x-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Desconectar</span>
                </button>
              </div>
            </div>

            {/* Content View */}
            <div className="flex-grow p-6 md:p-8 max-h-[600px] overflow-y-auto">
              
              {/* TAB 1: DADOS DE CONTATO */}
              {activeTab === "contato" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display text-lg font-bold text-white">Configurações de Contato</h4>
                    <p className="font-sans text-xs text-slate-400">Edite os números de telefone, email de suporte comercial e o endereço do Showroom.</p>
                  </div>

                  <form onSubmit={handleSaveContact} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Telefone Comercial (WhatsApp)</label>
                        <input 
                          type="text" 
                          value={contactData.phone}
                          onChange={(e) => setContactData({ ...contactData, phone: e.target.value.replace(/\D/g, "") })}
                          placeholder="Ex: 5511999999999"
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm font-mono"
                          required
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">Apenas números, incluindo código do país. Ex: 5511999999999</span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Telefone Formatado (Exibição)</label>
                        <input 
                          type="text" 
                          value={contactData.formattedPhone}
                          onChange={(e) => setContactData({ ...contactData, formattedPhone: e.target.value })}
                          placeholder="Ex: +55 (11) 99999-9999"
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                          required
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">Como o telefone aparecerá escrito no site.</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">E-mail Comercial</label>
                      <input 
                        type="email" 
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        placeholder="contato@rrmoveisplanejados.com.br"
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Endereço Showroom (Completo)</label>
                      <textarea 
                        value={contactData.address}
                        onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                        rows={2}
                        placeholder="Rua, Número, Bairro, Cidade - Estado"
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Endereço Showroom (Curto - Footer)</label>
                      <input 
                        type="text" 
                        value={contactData.addressShort}
                        onChange={(e) => setContactData({ ...contactData, addressShort: e.target.value })}
                        placeholder="Rua, Número - Bairro, Cidade - Estado"
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                        required
                      />
                    </div>

                    {/* REDES SOCIAIS SUB-SECTION */}
                    <div className="pt-6 border-t border-slate-800 space-y-4">
                      <div>
                        <h5 className="font-display text-sm font-bold text-white mb-1">Redes Sociais</h5>
                        <p className="font-sans text-[11px] text-slate-400">Insira os links e selecione quais redes sociais serão exibidas no site.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Instagram */}
                        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Instagram</label>
                            <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={contactData.instagramVisible !== false}
                                onChange={(e) => setContactData({ ...contactData, instagramVisible: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-800 text-gold-500 focus:ring-gold-500 focus:ring-opacity-25 bg-slate-950 cursor-pointer"
                              />
                              <span className="text-[10px] font-sans font-medium text-slate-300">Exibir</span>
                            </label>
                          </div>
                          <input 
                            type="url"
                            value={contactData.instagramUrl || ""}
                            onChange={(e) => setContactData({ ...contactData, instagramUrl: e.target.value })}
                            placeholder="https://instagram.com/seu_perfil"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none focus:border-gold-500 text-xs disabled:opacity-50"
                            disabled={contactData.instagramVisible === false}
                          />
                        </div>

                        {/* Facebook */}
                        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Facebook</label>
                            <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={contactData.facebookVisible !== false}
                                onChange={(e) => setContactData({ ...contactData, facebookVisible: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-800 text-gold-500 focus:ring-gold-500 focus:ring-opacity-25 bg-slate-950 cursor-pointer"
                              />
                              <span className="text-[10px] font-sans font-medium text-slate-300">Exibir</span>
                            </label>
                          </div>
                          <input 
                            type="url"
                            value={contactData.facebookUrl || ""}
                            onChange={(e) => setContactData({ ...contactData, facebookUrl: e.target.value })}
                            placeholder="https://facebook.com/sua_pagina"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none focus:border-gold-500 text-xs disabled:opacity-50"
                            disabled={contactData.facebookVisible === false}
                          />
                        </div>

                        {/* Youtube */}
                        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Youtube</label>
                            <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={contactData.youtubeVisible !== false}
                                onChange={(e) => setContactData({ ...contactData, youtubeVisible: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-800 text-gold-500 focus:ring-gold-500 focus:ring-opacity-25 bg-slate-950 cursor-pointer"
                              />
                              <span className="text-[10px] font-sans font-medium text-slate-300">Exibir</span>
                            </label>
                          </div>
                          <input 
                            type="url"
                            value={contactData.youtubeUrl || ""}
                            onChange={(e) => setContactData({ ...contactData, youtubeUrl: e.target.value })}
                            placeholder="https://youtube.com/seu_canal"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none focus:border-gold-500 text-xs disabled:opacity-50"
                            disabled={contactData.youtubeVisible === false}
                          />
                        </div>

                        {/* LinkedIn */}
                        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">LinkedIn</label>
                            <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={contactData.linkedinVisible === true}
                                onChange={(e) => setContactData({ ...contactData, linkedinVisible: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-800 text-gold-500 focus:ring-gold-500 focus:ring-opacity-25 bg-slate-950 cursor-pointer"
                              />
                              <span className="text-[10px] font-sans font-medium text-slate-300">Exibir</span>
                            </label>
                          </div>
                          <input 
                            type="url"
                            value={contactData.linkedinUrl || ""}
                            onChange={(e) => setContactData({ ...contactData, linkedinUrl: e.target.value })}
                            placeholder="https://linkedin.com/in/seu_perfil"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 focus:outline-none focus:border-gold-500 text-xs disabled:opacity-50"
                            disabled={contactData.linkedinVisible !== true}
                          />
                        </div>
                      </div>
                    </div>

                    {contactSuccess && (
                      <p className="text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-1.5 animate-fade-in">
                        <Check className="w-4 h-4" /> Dados de contato salvos com sucesso e atualizados em todo o site!
                      </p>
                    )}

                    <button 
                      type="submit"
                      className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-gold-500/10"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Informações</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 1.5: IDENTIDADE VISUAL */}
              {activeTab === "identidade" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display text-lg font-bold text-white mb-1">Identidade Visual do Site</h4>
                    <p className="font-sans text-xs text-slate-400">Personalize o logotipo e o nome oficial que aparecem em todo o site (cabeçalho, rodapé, textos e mensagens).</p>
                  </div>

                  {/* SITE NAME CUSTOMIZATION CARD */}
                  <form onSubmit={handleSaveSiteName} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                      <Settings className="w-5 h-5 text-gold-500" />
                      <div>
                        <h5 className="font-display text-sm font-bold text-white">Nome do Site / Empresa</h5>
                        <p className="text-[10px] text-slate-400">Insira o nome de sua preferência para ser exibido como marca principal.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        Nome de Exibição
                      </label>
                      <input 
                        type="text"
                        value={siteNameInput}
                        onChange={(e) => setSiteNameInput(e.target.value)}
                        placeholder="Ex: R&R Móveis Planejados"
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                        required
                      />
                    </div>

                    {siteNameError && (
                      <p className="text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {siteNameError}
                      </p>
                    )}

                    {siteNameSuccess && (
                      <p className="text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Nome do site atualizado e sincronizado com sucesso!
                      </p>
                    )}

                    <div className="flex items-center space-x-3 pt-2">
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-gold-500/10"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Nome</span>
                      </button>

                      {localStorage.getItem("rr_site_name") && (
                        <button
                          type="button"
                          onClick={handleResetSiteName}
                          className="text-xs text-red-400 hover:text-red-300 font-sans font-bold uppercase tracking-wider py-2 px-3 rounded-lg hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          Restaurar Padrão
                        </button>
                      )}
                    </div>
                  </form>

                  {/* LOGO CUSTOMIZATION CARD */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                      <ImageIcon className="w-5 h-5 text-gold-500" />
                      <div>
                        <h5 className="font-display text-sm font-bold text-white">Logotipo da Empresa</h5>
                        <p className="text-[10px] text-slate-400">Envie um arquivo de imagem para substituir o logotipo do cabeçalho e rodapé do site.</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative group shrink-0">
                        <img
                          src={logo}
                          alt="Logo Atual"
                          className="w-20 h-20 rounded-xl border border-gold-500/30 shadow-lg object-cover bg-slate-900"
                        />
                        <span className="absolute -bottom-2 -right-2 bg-gold-500 text-slate-950 text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-md shadow">
                          Atual
                        </span>
                      </div>

                      <div className="flex-grow w-full space-y-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Selecionar Nova Imagem para a Logo
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            id="logo-upload-input"
                            className="hidden"
                          />
                          <label
                            htmlFor="logo-upload-input"
                            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-850 text-white font-sans font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer border border-slate-700 hover:border-gold-500/50"
                          >
                            <ImageIcon className="w-4 h-4 text-gold-500" />
                            <span>Escolher Imagem</span>
                          </label>

                          {localStorage.getItem("rr_logo") && (
                            <button
                              type="button"
                              onClick={handleResetLogo}
                              className="text-xs text-red-400 hover:text-red-300 font-sans font-bold uppercase tracking-wider py-2 px-3 rounded-lg hover:bg-red-950/20 transition-all cursor-pointer"
                            >
                              Restaurar Padrão
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Recomendado: Imagem quadrada ou retangular, formato JPG, PNG ou WEBP.
                        </p>
                        {logoError && (
                          <p className="text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/30 p-2.5 rounded-lg flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {logoError}
                          </p>
                        )}
                        {logoSuccess && (
                          <p className="text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-1.5">
                            <Check className="w-4 h-4" /> Logotipo atualizado com sucesso em todo o site!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* COLOR CUSTOMIZATION CARD */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5">
                    <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                      <Palette className="w-5 h-5 text-gold-500" />
                      <div>
                        <h5 className="font-display text-sm font-bold text-white">Cores de Destaque</h5>
                        <p className="text-[10px] text-slate-400">Personalize a cor principal de destaque aplicada em botões, bordas, ícones e links do site.</p>
                      </div>
                    </div>

                    {/* Presets Grid */}
                    <div className="space-y-3">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        Paletas Exclusivas Recomendadas
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {COLOR_PRESETS.map((preset) => {
                          const isSelected = currentPalette[500].toLowerCase() === preset.colors[500].toLowerCase();
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSelectPresetPalette(preset.colors)}
                              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left w-full cursor-pointer bg-slate-900/50 hover:bg-slate-900 ${
                                isSelected 
                                  ? "border-gold-500 shadow-md shadow-gold-500/5" 
                                  : "border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {/* Color previews */}
                                <div className="flex -space-x-1">
                                  <span className="w-3.5 h-3.5 rounded-full border border-slate-950" style={{ backgroundColor: preset.colors[500] }} />
                                  <span className="w-3.5 h-3.5 rounded-full border border-slate-950" style={{ backgroundColor: preset.colors[600] }} />
                                  <span className="w-3.5 h-3.5 rounded-full border border-slate-950" style={{ backgroundColor: preset.colors[100] }} />
                                </div>
                                <span className="font-sans text-xs font-semibold text-white">
                                  {preset.name}
                                </span>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-gold-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Color Selector */}
                    <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          Usar uma Cor Personalizada
                        </label>
                        <p className="text-[10px] text-slate-500">Defina uma cor sob medida e nosso sistema criará todas as tonalidades harmônicas.</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-2 px-3 space-x-2">
                          <input
                            type="color"
                            value={customColor}
                            onChange={(e) => handleCustomColorChange(e.target.value)}
                            className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent shrink-0"
                          />
                          <span className="font-mono text-xs uppercase text-slate-300 font-bold">
                            {customColor}
                          </span>
                        </div>

                        {localStorage.getItem("rr_palette") && (
                          <button
                            type="button"
                            onClick={handleResetPalette}
                            className="text-xs text-red-400 hover:text-red-300 font-sans font-bold uppercase tracking-wider py-2 px-3 rounded-lg hover:bg-red-950/20 transition-all cursor-pointer"
                          >
                            Restaurar Padrão
                          </button>
                        )}
                      </div>
                    </div>

                    {paletteSuccess && (
                      <p className="text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-1.5 animate-fade-in">
                        <Check className="w-4 h-4" /> Paleta de cores de destaque atualizada com sucesso em todo o site!
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1.6: TEXTO INICIAL (HERO) */}
              {activeTab === "hero" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h4 className="font-display text-lg font-bold text-white mb-1">Textos da Tela Inicial (Hero)</h4>
                    <p className="font-sans text-xs text-slate-400">Personalize a mensagem de impacto, descrição e tópicos de destaque que aparecem no topo do site.</p>
                  </div>

                  <form onSubmit={handleSaveHero} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
                      <Sparkles className="w-5 h-5 text-gold-500" />
                      <div>
                        <h5 className="font-display text-sm font-bold text-white">Mensagem de Boas-vindas</h5>
                        <p className="text-[10px] text-slate-400">Dica: Use **texto** para deixar trechos em dourado e negrito.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Título Linha 1</label>
                        <input 
                          type="text"
                          value={heroTitle1}
                          onChange={(e) => setHeroTitle1(e.target.value)}
                          placeholder="Ex: Design que **Inspira**,"
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Título Linha 2</label>
                        <input 
                          type="text"
                          value={heroTitle2}
                          onChange={(e) => setHeroTitle2(e.target.value)}
                          placeholder="Ex: Marcenaria que **Dura**."
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Descrição / Parágrafo de Apresentação</label>
                      <textarea 
                        rows={4}
                        value={heroDescription}
                        onChange={(e) => setHeroDescription(e.target.value)}
                        placeholder="Insira o texto descritivo sobre a empresa..."
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm leading-relaxed"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Tópicos de Destaque (Um por linha)</label>
                      <textarea 
                        rows={4}
                        value={heroHighlightsText}
                        onChange={(e) => setHeroHighlightsText(e.target.value)}
                        placeholder="MDF de Alto Padrão de Dupla Face&#10;Móveis com qualidade comprovada&#10;Ferragens Importadas com Amortecimento&#10;Consultoria Exclusiva de Design e 3D"
                        className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm leading-relaxed"
                        required
                      />
                      <p className="text-[10px] text-slate-500 font-light">Digite um fator de qualidade por linha (geralmente até 4 itens).</p>
                    </div>

                    {heroSuccess && (
                      <p className="text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-1.5 animate-fade-in">
                        <Check className="w-4 h-4" /> Textos e destaques da tela inicial atualizados com sucesso!
                      </p>
                    )}

                    <div className="flex items-center space-x-3 pt-2">
                      <button 
                        type="submit"
                        className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-gold-500/10"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar Textos</span>
                      </button>

                      {(localStorage.getItem("rr_hero_title1") || localStorage.getItem("rr_hero_title2") || localStorage.getItem("rr_hero_description") || localStorage.getItem("rr_hero_highlights")) && (
                        <button
                          type="button"
                          onClick={handleResetHero}
                          className="text-xs text-red-400 hover:text-red-300 font-sans font-bold uppercase tracking-wider py-2 px-3 rounded-lg hover:bg-red-950/20 transition-all cursor-pointer border border-red-950/35"
                        >
                          Restaurar Padrões
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: PROJETOS COM UPLOAD DE IMAGEM */}
              {activeTab === "projetos" && (
                <div className="space-y-6">
                  {!isEditingProject ? (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-display text-lg font-bold text-white">Galeria de Projetos</h4>
                          <p className="font-sans text-xs text-slate-400">Adicione novas fotos, altere detalhes ou remova projetos existentes na página de projetos.</p>
                        </div>
                        <button
                          onClick={handleOpenNewProjectForm}
                          className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Adicionar Novo Projeto</span>
                        </button>
                      </div>

                      {projectSuccess && (
                        <p className="text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-1.5">
                          <Check className="w-4 h-4" /> Lista de projetos salva com sucesso!
                        </p>
                      )}

                      {/* Projects List Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {projects.map((proj) => (
                          <div key={proj.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex gap-4 hover:border-gold-500/20 transition-all">
                            <img 
                              src={proj.image} 
                              alt={proj.title}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                            />
                            <div className="flex-grow flex flex-col justify-between min-w-0">
                              <div>
                                <h5 className="font-display text-sm font-bold text-white truncate">{proj.title}</h5>
                                <span className="text-[9px] font-mono bg-slate-900 text-gold-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider mt-1 inline-block">
                                  {proj.category}
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 mt-3">
                                <button
                                  onClick={() => handleEditProject(proj)}
                                  className="text-slate-400 hover:text-gold-500 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(proj.id)}
                                  className="text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Excluir
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* EDITING / ADDING FORM FOR PROJECT */
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h5 className="font-display text-base font-bold text-white">
                          {projectFormId ? "Editar Projeto" : "Novo Projeto Autoral"}
                        </h5>
                        <button
                          onClick={() => setIsEditingProject(false)}
                          className="text-slate-400 hover:text-white text-xs font-bold"
                        >
                          Voltar para Lista
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Título do Projeto *</label>
                            <input 
                              type="text" 
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                              placeholder="Ex: Armários Cozinha Luxo Brooklin"
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Categoria *</label>
                            <select 
                              value={projectCategory}
                              onChange={(e) => setProjectCategory(e.target.value as Project["category"])}
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                            >
                              <option value="Cozinhas">Cozinhas</option>
                              <option value="Salas & Painéis">Salas & Painéis</option>
                              <option value="Dormitórios">Dormitórios</option>
                              <option value="Corporativo">Corporativo</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Descrição Detalhada *</label>
                          <textarea 
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            rows={3}
                            placeholder="Descreva o material utilizado, design, acabamento, detalhes inteligentes do móvel..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Destaques / Especificações Técnicas (Separados por vírgula)</label>
                          <input 
                            type="text" 
                            value={projectFeatures}
                            onChange={(e) => setProjectFeatures(e.target.value)}
                            placeholder="MDF Grafite, Amortecimento Blum, LED Embutido, Ripados em Carvalho"
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                          />
                        </div>

                        {/* Foto Selector (drag/upload) */}
                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Imagem / Foto do Projeto *</label>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            <div className="border border-dashed border-slate-800 hover:border-gold-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-950">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <div className="space-y-2">
                                <ImageIcon className="w-8 h-8 text-slate-500 mx-auto" />
                                <span className="block text-xs font-semibold text-slate-300">Escolher Foto Local</span>
                                <span className="block text-[10px] text-slate-500">Arraste ou clique para enviar JPG/PNG</span>
                              </div>
                            </div>

                            {projectImage ? (
                              <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video h-32 bg-slate-950 flex items-center justify-center">
                                <img 
                                  src={projectImage} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setProjectImage("")}
                                  className="absolute top-2 right-2 bg-slate-900/80 p-1 rounded-full text-slate-400 hover:text-white"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="border border-slate-800 rounded-2xl h-32 flex items-center justify-center text-xs text-slate-600 font-mono">
                                Nenhuma foto selecionada
                              </div>
                            )}
                          </div>

                          {projectImageError && (
                            <p className="text-xs text-red-400 mt-2 font-medium bg-red-950/10 p-2 rounded">{projectImageError}</p>
                          )}
                        </div>

                        <div className="pt-4 flex items-center space-x-3">
                          <button 
                            type="submit"
                            className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-gold-500/10"
                          >
                            <span>Salvar Projeto</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setIsEditingProject(false)}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: COMENTÁRIOS / DEPOIMENTOS */}
              {activeTab === "comentarios" && (
                <div className="space-y-6">
                  {!isEditingTestimonial ? (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h4 className="font-display text-lg font-bold text-white">Depoimentos dos Clientes</h4>
                          <p className="font-sans text-xs text-slate-400">Adicione depoimentos reais com foto da letra inicial, cargo/local e nota de satisfação.</p>
                        </div>
                        <button
                          onClick={handleOpenNewTestimonialForm}
                          className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Novo Depoimento</span>
                        </button>
                      </div>

                      {testimonialSuccess && (
                        <p className="text-xs text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-1.5">
                          <Check className="w-4 h-4" /> Comentários atualizados com sucesso!
                        </p>
                      )}

                      {/* Testimonials List Grid */}
                      <div className="space-y-3">
                        {testimonials.map((test) => (
                          <div key={test.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-9 h-9 rounded-full bg-slate-900 text-gold-500 flex items-center justify-center font-bold border border-gold-500/20">
                                {test.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-display text-sm font-bold text-white">{test.name}</h5>
                                <p className="text-xs text-slate-500">{test.role}</p>
                                <p className="text-xs text-slate-300 mt-1.5 line-clamp-2">"{test.comment}"</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 shrink-0 justify-end">
                              <div className="flex text-gold-500">
                                {Array.from({ length: test.rating }).map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditTestimonial(test)}
                                  className="text-slate-400 hover:text-gold-500 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteTestimonial(test.id)}
                                  className="text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Excluir
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* EDITING / ADDING FORM FOR TESTIMONIAL */
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h5 className="font-display text-base font-bold text-white">
                          {testimonialFormId ? "Editar Comentário" : "Novo Comentário de Cliente"}
                        </h5>
                        <button
                          onClick={() => setIsEditingTestimonial(false)}
                          className="text-slate-400 hover:text-white text-xs font-bold"
                        >
                          Voltar para Lista
                        </button>
                      </div>

                      <form onSubmit={handleSaveTestimonial} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Nome do Cliente *</label>
                            <input 
                              type="text" 
                              value={testimonialName}
                              onChange={(e) => setTestimonialName(e.target.value)}
                              placeholder="Ex: Mariana Santos"
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Localização / Função</label>
                            <input 
                              type="text" 
                              value={testimonialRole}
                              onChange={(e) => setTestimonialRole(e.target.value)}
                              placeholder="Ex: Apartamento no Brooklin, SP"
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Classificação de Estrelas</label>
                          <select
                            value={testimonialRating}
                            onChange={(e) => setTestimonialRating(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm font-semibold text-gold-500"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Estrelas)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Estrelas)</option>
                            <option value={3}>⭐⭐⭐ (3 Estrelas)</option>
                            <option value={2}>⭐⭐ (2 Estrelas)</option>
                            <option value={1}>⭐ (1 Estrela)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Depoimento / Comentário *</label>
                          <textarea 
                            value={testimonialComment}
                            onChange={(e) => setTestimonialComment(e.target.value)}
                            rows={3}
                            placeholder="Adorei o atendimento e o móvel ficou impecável..."
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 focus:outline-none focus:border-gold-500 text-sm"
                            required
                          />
                        </div>

                        <div className="pt-4 flex items-center space-x-3">
                          <button 
                            type="submit"
                            className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-gold-500/10"
                          >
                            <span>Salvar Comentário</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setIsEditingTestimonial(false)}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

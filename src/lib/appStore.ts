import { Project, Testimonial, ColorPalette } from "../types";

// Default assets imported for initial projects
import defaultLogo from "../assets/images/logo_rr_padrao_1782671643702.jpg";
import kitchenGourmet from "../assets/images/kitchen_gourmet_1782653909715.jpg";
import kitchenCompact from "../assets/images/kitchen_compact_1782653922195.jpg";
import kitchenIsland from "../assets/images/kitchen_island_1782653934437.jpg";
import livingRipado from "../assets/images/living_ripado_1782653946779.jpg";

export interface ContactData {
  phone: string;          // Pure digits for links: e.g. "5511999999999"
  formattedPhone: string; // Display format: "+55 (11) 99999-9999"
  email: string;
  address: string;        // Full address
  addressShort: string;   // Short address
  instagramUrl?: string;
  instagramVisible?: boolean;
  facebookUrl?: string;
  facebookVisible?: boolean;
  youtubeUrl?: string;
  youtubeVisible?: boolean;
  linkedinUrl?: string;
  linkedinVisible?: boolean;
}

const DEFAULT_CONTACT_DATA: ContactData = {
  phone: "5519983435328",
  formattedPhone: "+55 (19) 98343-5328",
  email: "contato@rrmoveisplanejado.com.br",
  address: "R. Jacques Coelho da Silva 125 - Jardim Nova Alvorada, Monte Mor - SP, 13197-360",
  addressShort: "R. Jacques Coelho da Silva - Jardim Nova Alvorada, Monte Mor - SP, 13197-360",
  instagramUrl: "https://www.instagram.com/rr.moveisplanejados_",
  instagramVisible: true,
  facebookUrl: "https://facebook.com",
  facebookVisible: false,
  youtubeUrl: "https://youtube.com",
  youtubeVisible: false,
  linkedinUrl: "https://linkedin.com",
  linkedinVisible: false
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "cozinha_gourmet",
    title: "Cozinha Gourmet Integrada",
    description: "Ampla cozinha planejada combinando MDF Grafite Microtextura com nichos em amadeirado Freijó quente. Inclui ilha central de quartzo com detalhes de iluminação embutida sob medida.",
    image: kitchenGourmet,
    category: "Cozinhas",
    features: ["MDF Grafite Fosco", "Amadeirado Freijó", "Nicho em fita de LED 3000K", "Ferragens de amortecimento Blum"]
  },
  {
    id: "cozinha_compacta",
    title: "Cozinha Funcional Compacta",
    description: "Marcenaria inteligente projetada para otimizar apartamentos. Portas superiores em Off-White com basculantes a pistão e gaveteiros inferiores com puxadores cava integrados.",
    image: kitchenCompact,
    category: "Cozinhas",
    features: ["MDF Off-White", "Gaveteiros ocultos", "Pistões de gás invertidos", "Divisor de talheres sob medida"]
  },
  {
    id: "cozinha_ilha",
    title: "Cozinha Moderna com Ilha e Jantar",
    description: "Design contemporâneo com torre quente integrada, portas com moldura de alumínio e vidro reflecta bronze, e uma espetacular ilha central acoplada a uma mesa de madeira natural para refeições.",
    image: kitchenIsland,
    category: "Cozinhas",
    features: ["Vidro Reflecta Bronze", "Mesa integrada", "Corrediças telescópicas invisíveis", "Puxadores perfil alumínio bronze"]
  },
  {
    id: "sala_ripado",
    title: "Sala de Estar e Jantar com Painel Ripado",
    description: "Painel ripado vertical inteiriço de madeira Carvalho que incorpora perfeitamente uma porta invisível com fecho magnético de toque (sistema 'mão amiga') dando acesso aos dormitórios.",
    image: livingRipado,
    category: "Salas & Painéis",
    features: ["Painel Ripado de Carvalho", "Porta oculta embutida", "Módulo flutuante lacado", "Passa-cabos embutido invisível"]
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Mariana Santos",
    role: "Apartamento em Santana, SP",
    comment: "A marcenaria da minha cozinha gourmet ficou simplesmente impecável. Os nichos em LED dão um charme espetacular à noite e o sistema soft-close das portas evita batidas. O pós-venda deles é excelente!",
    rating: 5
  },
  {
    id: "t2",
    name: "Carlos & Roberto",
    role: "Casa Residencial em Alphaville, SP",
    comment: "O painel ripado de carvalho com a porta oculta ficou divino. É a sensação das visitas na sala de estar, ninguém consegue ver a passagem para os quartos! A precisão milimétrica deles na instalação é fantástica.",
    rating: 5
  },
  {
    id: "t3",
    name: "Amanda Silveira",
    role: "Arquiteta de Interiores",
    comment: "Como arquiteta, exijo o máximo de perfeição técnica. A R&R executou a cozinha em ilha perfeitamente sob os meus desenhos, com alinhamento impecável e ferragens Blum importadas. Empresa de altíssima confiança.",
    rating: 5
  }
];

// Helper functions for storage keys
const KEYS = {
  CONTACT: "rr_contact_data",
  PROJECTS: "rr_projects",
  TESTIMONIALS: "rr_testimonials",
  LOGO: "rr_logo",
  SITE_NAME: "rr_site_name",
  PALETTE: "rr_palette",
  HERO_TITLE1: "rr_hero_title1",
  HERO_TITLE2: "rr_hero_title2",
  HERO_DESCRIPTION: "rr_hero_description",
  HERO_HIGHLIGHTS: "rr_hero_highlights"
};

export const COLOR_PRESETS: ColorPalette[] = [
  {
    id: "gold",
    name: "Dourado Imperial (Padrão)",
    colors: {
      50: "#fbf7ee",
      100: "#f4ebcc",
      500: "#d4af37",
      600: "#b8860b",
      700: "#916805",
    },
  },
  {
    id: "blue",
    name: "Azul Marinho Real",
    colors: {
      50: "#f0f4f8",
      100: "#d9e2ec",
      500: "#1b4965",
      600: "#14384f",
      700: "#0d2536",
    },
  },
  {
    id: "emerald",
    name: "Verde Esmeralda",
    colors: {
      50: "#f1f7f4",
      100: "#dae8e1",
      500: "#137547",
      600: "#0d5c36",
      700: "#083e24",
    },
  },
  {
    id: "bronze",
    name: "Bronze Sofisticado",
    colors: {
      50: "#faf5f0",
      100: "#f3e5d8",
      500: "#a7794e",
      600: "#8f6139",
      700: "#6e4827",
    },
  },
  {
    id: "dark",
    name: "Preto & Grafite Moderno",
    colors: {
      50: "#f6f6f6",
      100: "#e9e9e9",
      500: "#2d2d2d",
      600: "#1a1a1a",
      700: "#0f0f0f",
    },
  },
  {
    id: "terracotta",
    name: "Vermelho Terracota",
    colors: {
      50: "#fbf5f3",
      100: "#f6e5e1",
      500: "#b2533e",
      600: "#923e2b",
      700: "#6a2b1d",
    },
  }
];

export function applyHighlightColors(colors: ColorPalette["colors"]) {
  if (typeof window === "undefined") return;
  let styleEl = document.getElementById("dynamic-highlight-colors");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "dynamic-highlight-colors";
    document.head.appendChild(styleEl);
  }
  styleEl.innerHTML = `
    :root {
      --color-gold-50: ${colors[50]} !important;
      --color-gold-100: ${colors[100]} !important;
      --color-gold-500: ${colors[500]} !important;
      --color-gold-600: ${colors[600]} !important;
      --color-gold-700: ${colors[700]} !important;
    }
  `;
}

export const appStore = {
  getPalette(): ColorPalette["colors"] {
    const data = localStorage.getItem(KEYS.PALETTE);
    if (!data) return COLOR_PRESETS[0].colors;
    try {
      return JSON.parse(data);
    } catch {
      return COLOR_PRESETS[0].colors;
    }
  },

  savePalette(colors: ColorPalette["colors"]) {
    localStorage.setItem(KEYS.PALETTE, JSON.stringify(colors));
    applyHighlightColors(colors);
    this.notifyUpdate();
  },

  getSiteName(): string {
    return localStorage.getItem(KEYS.SITE_NAME) || "R&R Móveis Planejados";
  },

  saveSiteName(name: string) {
    localStorage.setItem(KEYS.SITE_NAME, name);
    this.notifyUpdate();
  },

  getLogo(): string {
    const logo = localStorage.getItem(KEYS.LOGO);
    return logo || defaultLogo;
  },

  saveLogo(logoBase64: string) {
    localStorage.setItem(KEYS.LOGO, logoBase64);
    this.notifyUpdate();
  },

  getContactData(): ContactData {
    const data = localStorage.getItem(KEYS.CONTACT);
    if (!data) return DEFAULT_CONTACT_DATA;
    try {
      const parsed = JSON.parse(data);
      // Migration check: if local storage has old default email or phone, clear and return new defaults
      if (parsed.email === "contato@rrmoveisplanejados.com.br" || parsed.phone === "5511999999999") {
        localStorage.removeItem(KEYS.CONTACT);
        return DEFAULT_CONTACT_DATA;
      }
      return { ...DEFAULT_CONTACT_DATA, ...parsed };
    } catch {
      return DEFAULT_CONTACT_DATA;
    }
  },

  saveContactData(data: ContactData) {
    localStorage.setItem(KEYS.CONTACT, JSON.stringify(data));
    this.notifyUpdate();
  },

  getProjects(): Project[] {
    const data = localStorage.getItem(KEYS.PROJECTS);
    if (!data) return DEFAULT_PROJECTS;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_PROJECTS;
    }
  },

  saveProjects(projects: Project[]) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
    this.notifyUpdate();
  },

  getTestimonials(): Testimonial[] {
    const data = localStorage.getItem(KEYS.TESTIMONIALS);
    if (!data) return DEFAULT_TESTIMONIALS;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  },

  saveTestimonials(testimonials: Testimonial[]) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    this.notifyUpdate();
  },

  getHeroTitle1(): string {
    return localStorage.getItem(KEYS.HERO_TITLE1) || "Design que Inspira,";
  },

  saveHeroTitle1(val: string) {
    localStorage.setItem(KEYS.HERO_TITLE1, val);
    this.notifyUpdate();
  },

  getHeroTitle2(): string {
    return localStorage.getItem(KEYS.HERO_TITLE2) || "Marcenaria que Dura.";
  },

  saveHeroTitle2(val: string) {
    localStorage.setItem(KEYS.HERO_TITLE2, val);
    this.notifyUpdate();
  },

  getHeroDescription(): string {
    const siteName = this.getSiteName();
    return localStorage.getItem(KEYS.HERO_DESCRIPTION) || `Transforme a sua residência com a assinatura de luxo da **${siteName}**. Desenvolvemos ambientes que equilibram harmoniosamente sofisticação estética, ergonomia e precisão técnica.`;
  },

  saveHeroDescription(val: string) {
    localStorage.setItem(KEYS.HERO_DESCRIPTION, val);
    this.notifyUpdate();
  },

  getHeroHighlights(): string[] {
    const data = localStorage.getItem(KEYS.HERO_HIGHLIGHTS);
    if (!data) {
      return [
        "MDF de Alto Padrão de Dupla Face",
        "Móveis com qualidade comprovada",
        "Ferragens Importadas com Amortecimento",
        "Consultoria Exclusiva de Design e 3D"
      ];
    }
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.includes("Garantia de 5 Anos de Fábrica")) {
        const index = parsed.indexOf("Garantia de 5 Anos de Fábrica");
        parsed[index] = "Móveis com qualidade comprovada";
        localStorage.setItem(KEYS.HERO_HIGHLIGHTS, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      return [
        "MDF de Alto Padrão de Dupla Face",
        "Móveis com qualidade comprovada",
        "Ferragens Importadas com Amortecimento",
        "Consultoria Exclusiva de Design e 3D"
      ];
    }
  },

  saveHeroHighlights(val: string[]) {
    localStorage.setItem(KEYS.HERO_HIGHLIGHTS, JSON.stringify(val));
    this.notifyUpdate();
  },

  // Notify components about any data updates
  notifyUpdate() {
    window.dispatchEvent(new Event("rr-store-updated"));
  },

  subscribe(callback: () => void) {
    window.addEventListener("rr-store-updated", callback);
    return () => {
      window.removeEventListener("rr-store-updated", callback);
    };
  }
};

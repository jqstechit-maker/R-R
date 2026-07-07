export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "Cozinhas" | "Salas & Painéis" | "Dormitórios" | "Corporativo";
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

export interface AIConsultantInput {
  spaceType: string;
  description: string;
  style: string;
  estimatedBudget: string;
}

export interface AIConsultantOutput {
  layoutText: string;
  colorMaterials: string;
  keyFeatures: string[];
  advice: string;
  recommendedProjects: string[];
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    50: string;
    100: string;
    500: string;
    600: string;
    700: string;
  };
}

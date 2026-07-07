import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI Consultant will use fallback suggestions.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Contact messages stored in memory (simulated database)
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  createdAt: string;
}

const contactMessages: ContactMessage[] = [];

// API: Handle contact form submissions
app.post("/api/contato", (req, res) => {
  const { name, email, phone, interest, message } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Nome, e-mail e telefone são obrigatórios." });
  }

  const newMessage: ContactMessage = {
    id: `msg_${Date.now()}`,
    name,
    email,
    phone,
    interest: interest || "Geral",
    message: message || "",
    createdAt: new Date().toISOString()
  };

  contactMessages.push(newMessage);
  console.log("Novo contato recebido:", newMessage);

  return res.json({
    success: true,
    message: "Mensagem recebida com sucesso! Em breve nossa equipe entrará em contato por WhatsApp ou telefone.",
    data: newMessage
  });
});

// API: Interior Design AI Consultant powered by Gemini
app.post("/api/consultar", async (req, res) => {
  const { spaceType, description, style, estimatedBudget } = req.body;

  if (!spaceType || !description) {
    return res.status(400).json({ error: "Tipo de ambiente e descrição do espaço são obrigatórios." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return high-quality pre-designed suggestions if API key is missing
    return res.json({
      layoutText: `Para um(a) ${spaceType} com as características informadas ("${description}"), sugerimos uma disposição inteligente em 'L' ou com ilha central multifuncional. Isso permite otimizar cada centímetro livre, garantindo excelente circulação de no mínimo 90cm entre as bancadas e as áreas de passagem.`,
      colorMaterials: `Sugerimos uma paleta de cores moderna: MDF grafite fosco nos armários inferiores e amadeirado Freijó nos aéreos para trazer aconchego. Bancadas em quartzo cinza ou preto absoluto dão o toque sofisticado.`,
      keyFeatures: [
        "Portas de armários com sistema de amortecimento soft-close.",
        "Iluminação em fita de LED embutida sob os móveis aéreos.",
        "Divisores de talheres de madeira sob medida nas gavetas.",
        "Nicho integrado para micro-ondas ou forno de embutir."
      ],
      advice: "Dica R&R: Painéis ripados podem ocultar fiações e até portas de passagens de forma super elegante!",
      recommendedProjects: ["cozinha_gourmet", "cozinha_ilha"]
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Você é um arquiteto e designer de interiores sênior especializado em móveis planejados de alto padrão da empresa "R&R Móveis Planejados". 
Gere recomendações extremamente profissionais, luxuosas e personalizadas de móveis planejados sob medida para o seguinte projeto:
- Tipo de Ambiente: ${spaceType}
- Descrição do Espaço (dimensões, formato, necessidades): ${description}
- Estilo Desejado: ${style || "Moderno & Atemporal"}
- Expectativa de Orçamento/Padrão: ${estimatedBudget || "Não especificado"}

Forneça a resposta em formato JSON estrito, utilizando o seguinte esquema JSON exato:
{
  "layoutText": "Recomendação detalhada sobre a melhor disposição dos móveis (ex: layout em L, paralelo, ilha, painel ripado) e circulação.",
  "colorMaterials": "Sugestão de acabamentos, cores (ex: tons de cinza carbon, preto fosco, laccato) e tipos de madeira (ex: carvalho, freijó, nogueira) que combinem com a descrição.",
  "keyFeatures": ["Recurso inteligente 1", "Recurso inteligente 2", "Recurso inteligente 3", "Recurso inteligente 4"],
  "advice": "Um conselho ou dica de ouro exclusiva de arquiteto para valorizar o ambiente.",
  "recommendedProjects": ["Lista de IDs de projetos recomendados, escolha entre: 'cozinha_gourmet' (cozinhas cinzas/madeira de alto padrão), 'cozinha_compacta' (cozinhas funcionais de apartamentos compactos), 'cozinha_ilha' (cozinhas grandes com ilha central integrada), 'sala_ripado' (salas de estar ou jantar com painel ripado e portas ocultas). Retorne de 1 a 2 IDs mais adequados."]
}

A resposta deve ser em português do Brasil, inspiradora, demonstrando profunda autoridade em marcenaria e design sob medida, sem floreios exagerados ou Larping tecnológico. Retorne APENAS o JSON.`;

    const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let response = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Tentando consultar o modelo Gemini: ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                layoutText: { type: Type.STRING },
                colorMaterials: { type: Type.STRING },
                keyFeatures: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                advice: { type: Type.STRING },
                recommendedProjects: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["layoutText", "colorMaterials", "keyFeatures", "advice", "recommendedProjects"]
            }
          }
        });
        if (response) {
          break;
        }
      } catch (err) {
        console.warn(`Erro no modelo ${modelName}:`, err);
        lastError = err;
      }
    }

    if (!response) {
      console.error("Todos os modelos do Gemini falharam ou estão indisponíveis no momento. Retornando sugestão de fallback qualificada.", lastError);
      return res.json({
        layoutText: `Para um(a) ${spaceType} com as características informadas ("${description}"), sugerimos uma disposição inteligente e sob medida que otimize as áreas de circulação. Isso permite aproveitar cada centímetro de forma ergonômica, garantindo excelente usabilidade e sofisticação para o seu estilo preferido (${style || "Moderno"}).`,
        colorMaterials: `Sugerimos uma combinação de acabamentos premium: frentes texturizadas nos armários e detalhes amadeirados quentes para trazer aconchego. Bancadas de pedras tecnológicas ou tons neutros dão o toque de elegância definitivo.`,
        keyFeatures: [
          "Sistemas de amortecimento premium nas portas e gavetas.",
          "Soluções de iluminação linear em LED embutida sob armários.",
          "Divisores internos sob medida organizadores.",
          "Aproveitamento inteligente de cantos e vãos."
        ],
        advice: "Dica do arquiteto: Invista em ferragens de alta durabilidade para garantir a longevidade e o conforto no toque diário dos seus móveis planejados.",
        recommendedProjects: ["cozinha_gourmet", "sala_ripado"]
      });
    }

    const dataText = response.text ? response.text.trim() : "{}";
    const parsedData = JSON.parse(dataText);
    return res.json(parsedData);
  } catch (error) {
    console.error("Erro na consulta do Gemini:", error);
    return res.status(500).json({ error: "Erro ao gerar as recomendações. Por favor, tente novamente." });
  }
});

// API: Generate a 3D visual concept using Gemini Image model (gemini-2.5-flash-image)
app.post("/api/gerar-conceito-3d", async (req, res) => {
  const { spaceType, style, description } = req.body;

  // Curated Fallback URLs for ultimate high-availability and zero failures
  const fallbackUrls: Record<string, string[]> = {
    "Cozinha": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1200&q=80"
    ],
    "Sala de Estar / Jantar": [
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618219740975-d4197c36b16e?auto=format&fit=crop&w=1200&q=80"
    ],
    "Dormitório Casal / Solteiro": [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80"
    ],
    "Closet": [
      "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80"
    ],
    "Home Office / Escritório": [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    ],
    "Banheiro / Lavabo": [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80"
    ]
  };

  const getFallback = (space: string) => {
    const list = fallbackUrls[space] || [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
    ];
    return list[Math.floor(Math.random() * list.length)];
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Sem chave API do Gemini para geração de imagens. Usando fallback de alta qualidade.");
    return res.json({ imageUrl: getFallback(spaceType || "Cozinha"), fallback: true });
  }

  try {
    const ai = getGeminiClient();

    // Map fields for English prompts (Imagen models yield much better results in English)
    const spaceMap: Record<string, string> = {
      "Cozinha": "high-end luxury modern kitchen with custom wooden cabinetry, kitchen island with quartz countertop, elegant modern barstools",
      "Sala de Estar / Jantar": "luxury cozy living room and dining room, modern entertainment center with wood slats paneling (painel ripado), led lighting, plush sofa",
      "Dormitório Casal / Solteiro": "luxury warm master bedroom, built-in custom wardrobe with frosted glass doors, back-lit wooden headboard, elegant lighting",
      "Closet": "bespoke walk-in closet with dark premium wood, open layout, drawers with glass top, vanity table, luxury dressing room with warm LED strips",
      "Home Office / Escritório": "sleek contemporary home office, custom desk with walnut wood, custom bookshelves with indirect lighting, executive chair",
      "Banheiro / Lavabo": "hotel-style luxury bathroom, custom floating wooden vanity, large mirror with back-lit LED warm light, gold fixtures"
    };

    const styleMap: Record<string, string> = {
      "Moderno & Minimalista (Tons cinzas/pretos com madeira natural)": "Modern minimalist interior design, matte graphite grey cabinets, black metallic trim, warm oak wood accents",
      "Clássico Provençal (Molduras nas portas, tons claros e aconchegantes)": "French Provencal classic style, kitchen shaker cabinets with molding, brass handles, warm cream and beige palette",
      "Industrial / Urbano (Tons escuros, perfis metálicos, vidro reflecta)": "Industrial chic style, exposed steel structures, dark concrete walls, smoked glass doors (vidro reflecta), warm spot lights",
      "Escandinavo / Orgânico (Madeira clara, branco absoluto, super iluminado)": "Scandinavian design, pristine white cabinetry, natural pine wood, super bright, plants, organic materials"
    };

    const englishSpace = spaceMap[spaceType] || "luxury residential interior with bespoke wooden furniture";
    const englishStyle = styleMap[style] || "luxurious contemporary design, elegant finishes";
    
    // Construct rich prompt
    const prompt = `An award-winning professional 3D interior design architectural visualization render of a ${englishSpace}. ${englishStyle}. Bespoke premium cabinetry, impeccable woodwork details, warm linear LED lighting under cabinets, elegant accessories. Photorealistic, cinematic warm ambient lighting, highly detailed textures, cozy and inviting atmosphere. Shot on 35mm lens, f/8, 8k resolution, crisp details, no people, no text.`;

    console.log(`Iniciando geração de imagem para ${spaceType} com prompt: ${prompt}`);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    let base64Image = "";
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (base64Image) {
      return res.json({ imageUrl: `data:image/png;base64,${base64Image}`, fallback: false });
    } else {
      console.warn("Resposta do Gemini Image não continha inlineData. Usando fallback.");
      return res.json({ imageUrl: getFallback(spaceType || "Cozinha"), fallback: true });
    }
  } catch (err) {
    console.error("Erro ao gerar imagem no Gemini Image:", err);
    return res.json({ imageUrl: getFallback(spaceType || "Cozinha"), fallback: true });
  }
});

// Setup Vite Dev Server / Static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

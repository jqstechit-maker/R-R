import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import AIConsultant from "./components/AIConsultant";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import { appStore, applyHighlightColors } from "./lib/appStore";

export default function App() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Apply saved dynamic highlight colors and sync with MySQL backend on initial load
  useEffect(() => {
    applyHighlightColors(appStore.getPalette());
    appStore.initSync();
  }, []);

  // Handle smooth scroll-to-section
  const handleNavigate = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 72; // height of sticky header
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };

  // Scroll spy to highlight active section in Header
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inicio", "portfolio", "consultor-ia", "depoimentos", "contato"];
      const scrollPosition = window.scrollY + 120; // offset for triggers

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F6] selection:bg-gold-500/30 selection:text-slate-900">
      {/* Translucent Navigation Header */}
      <Header onNavigate={handleNavigate} activeSection={activeSection} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Main Single Page Sections */}
      <main className="flex-grow">
        {/* Hero Banner Section */}
        <Hero onNavigateToSection={handleNavigate} />

        {/* Portfolio Gallery Section */}
        <Portfolio />

        {/* AI Interior Designer & Cabinetry Planner Section */}
        <AIConsultant />

        {/* Real Customer Testimonials Section */}
        <Testimonials />

        {/* Dynamic Contact Form and Social Networks Section */}
        <ContactForm />
      </main>

      {/* Professional Footer & Floating WhatsApp Trigger */}
      <Footer onNavigateToSection={handleNavigate} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Administrative Panel Modal */}
      {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
}

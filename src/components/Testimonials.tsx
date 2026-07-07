import { useState, useEffect } from "react";
import { Testimonial } from "../types";
import { Star, MessageSquare, Quote } from "lucide-react";
import { appStore } from "../lib/appStore";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(appStore.getTestimonials());

  useEffect(() => {
    const handleUpdate = () => {
      setTestimonials(appStore.getTestimonials());
    };
    return appStore.subscribe(handleUpdate);
  }, []);

  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-gold-600 bg-gold-50 px-3 py-1.5 rounded uppercase">
            Depoimentos Reais
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
            O que dizem nossos Clientes
          </h2>
          <p className="font-sans text-base text-slate-700/80 mt-4 leading-relaxed font-light">
            A satisfação absoluta é o nosso padrão. Veja como transformamos sonhos residenciais em marcenaria durável e funcional de alto nível.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-slate-50 border border-slate-100 p-8 rounded-3xl relative hover:border-gold-500/20 hover:shadow-xl hover:bg-white transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-6 right-6 text-slate-200 group-hover:text-gold-100 transition-colors">
                <Quote className="w-8 h-8 rotate-180 fill-current" />
              </div>

              <div>
                {/* Rating Stars */}
                <div className="flex space-x-1 mb-6">
                  {Array.from({ length: test.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-gold-500 fill-current" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="font-sans text-sm text-slate-700 leading-relaxed font-light">
                  "{test.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-gold-500 font-display font-bold text-sm border border-gold-500/20">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-900">
                    {test.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {test.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Social Proof Bar */}
        <div className="mt-16 border-t border-slate-100 pt-10 flex flex-wrap items-center justify-around gap-6 opacity-65 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center space-x-2 text-slate-700">
            <span className="font-display font-black text-2xl tracking-wider">100%</span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">MDF de Alta Densidade</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <span className="font-display font-black text-2xl tracking-wider">5 Anos</span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Garantia Integrada</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <span className="font-display font-black text-2xl tracking-wider">+500</span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Lares Transformados</span>
          </div>
        </div>

      </div>
    </section>
  );
}

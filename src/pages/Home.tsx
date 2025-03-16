import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRight, FileText, Users, Building2 } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../translations';

export function Home() {
  const { language } = useLanguageStore();
  const t = translations[language];

  const features = [
    {
      icon: Scale,
      title: t.services.consultation.title,
      description: t.services.consultation.description,
    },
    {
      icon: FileText,
      title: t.services.translation.title,
      description: t.services.translation.description,
    },
    {
      icon: Users,
      title: t.services.support.title,
      description: t.services.support.description,
    }
  ];

  const partners = [
    { name: "SF Law Association", height: "32px" },
    { name: "Asian Law Alliance", height: "28px" },
    { name: "Legal Aid Society", height: "34px" },
    { name: "Community Legal Services", height: "30px" }
  ];

  return (
    <div className="relative bg-[#1a1a1a]">
      {/* Vertical lines pattern overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="vertical-lines" x="0" y="0" width="20" height="100%" patternUnits="userSpaceOnUse">
                  <line x1="10" y1="0" x2="10" y2="100%" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#vertical-lines)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#2a2a2a] rounded-xl">
                <Scale className="h-10 w-10 text-gray-300" />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                Lotus
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {t.hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="group inline-flex items-center px-8 py-4 bg-[#2a2a2a] hover:bg-[#333333] text-lg font-medium rounded-full text-white transition-all duration-300 transform hover:scale-105"
              >
                {t.hero.getStarted}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-4 border-2 border-[#2a2a2a] text-lg font-medium rounded-full text-gray-300 hover:bg-[#2a2a2a] transition-all duration-300"
              >
                {t.hero.ourServices}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-2xl overflow-hidden bg-[#2a2a2a] p-1">
          <div className="rounded-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2940&auto=format&fit=crop"
              alt="Legal AI Dashboard"
              className="w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Partner Logos */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center flex-wrap gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="h-12 w-12 bg-[#2a2a2a] rounded-lg flex items-center justify-center mb-3"
              >
                <Scale className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-gray-400 font-medium text-sm">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t.services.title}
            </h2>
            <p className="text-xl text-gray-300">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 bg-[#2a2a2a] hover:bg-[#333333]"
              >
                <div className="w-14 h-14 bg-[#333333] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#404040] transition-colors">
                  <feature.icon className="h-7 w-7 text-gray-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-3 bg-[#2a2a2a] rounded-xl inline-flex mb-8">
            <Scale className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">{t.cta.title}</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t.cta.description}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-[#2a2a2a] hover:bg-[#333333] text-lg font-medium rounded-full text-white transition-all duration-300"
          >
            {t.cta.contact}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
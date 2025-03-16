import React from 'react';
import { FileText, Scale, Users, Building2, ArrowRight, Phone, Clock } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../translations';

export function Services() {
  const { language } = useLanguageStore();
  const t = translations[language];

  const services = [
    {
      icon: FileText,
      title: t.services.translation.title,
      description: t.services.translation.description,
      features: [
        t.services.features.documentTranslation,
        t.services.features.formAssistance,
        t.services.features.certifiedTranslations
      ]
    },
    {
      icon: Scale,
      title: t.services.consultation.title,
      description: t.services.consultation.description,
      features: [
        t.services.features.immigrationLaw,
        t.services.features.housingRights,
        t.services.features.employmentLaw
      ]
    },
    {
      icon: Users,
      title: t.services.support.title,
      description: t.services.support.description,
      features: [
        t.services.features.workshops,
        t.services.features.advocacy,
        t.services.features.communityEvents
      ]
    },
    {
      icon: Building2,
      title: t.services.housing.title,
      description: t.services.housing.description,
      features: [
        t.services.features.tenantRights,
        t.services.features.leaseReview,
        t.services.features.housingDisputes
      ]
    },
    {
      icon: Phone,
      title: t.services.support247.title,
      description: t.services.support247.description,
      features: [
        t.services.features.emergencySupport,
        t.services.features.phoneConsultation,
        t.services.features.urgentCare
      ]
    },
    {
      icon: Clock,
      title: t.services.consultation.scheduledTitle,
      description: t.services.consultation.scheduledDescription,
      features: [
        t.services.features.expertConsultation,
        t.services.features.personalizedAdvice,
        t.services.features.followupSupport
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.services.pageTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.services.pageDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 bg-[#2a2a2a] hover:bg-[#333333]"
            >
              <div className="w-14 h-14 bg-[#333333] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#404040] transition-colors">
                <service.icon className="h-7 w-7 text-gray-400 group-hover:text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{service.title}</h3>
              <p className="text-gray-300 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <ArrowRight className="h-4 w-4 text-gray-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
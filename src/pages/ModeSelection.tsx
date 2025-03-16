import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, FileText, Sparkles, ArrowRight } from 'lucide-react';

export function ModeSelection() {
  const navigate = useNavigate();

  const modes = [
    {
      id: 'legal',
      Icon: Scale,
      title: 'Legal Expert',
      description: 'Get professional legal advice and interpretation of legal matters',
      color: 'from-indigo-900/80 to-indigo-800/80',
      hoverColor: 'from-indigo-800/80 to-indigo-700/80',
      dotColor: 'bg-indigo-400',
      features: [
        'Legal consultation and advice',
        'Rights and regulations explanation',
        'Legal procedure guidance'
      ]
    },
    {
      id: 'document',
      Icon: FileText,
      title: 'Document Analyzer',
      description: 'Understand and analyze legal documents with expert assistance',
      color: 'from-emerald-900/80 to-emerald-800/80',
      hoverColor: 'from-emerald-800/80 to-emerald-700/80',
      dotColor: 'bg-emerald-400',
      features: [
        'Document interpretation',
        'Form filling assistance',
        'Contract analysis'
      ]
    },
    {
      id: 'creative',
      Icon: Sparkles,
      title: 'Creative Solutions',
      description: 'Explore innovative approaches to legal challenges',
      color: 'from-purple-900/80 to-purple-800/80',
      hoverColor: 'from-purple-800/80 to-purple-700/80',
      dotColor: 'bg-purple-400',
      features: [
        'Alternative dispute resolution',
        'Strategic legal planning',
        'Innovative problem-solving'
      ]
    }
  ];

  const handleModeSelect = (modeId: string) => {
    navigate(`/chat/${modeId}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your AI Assistant
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select the mode that best fits your needs. Each assistant is specialized to provide targeted help for your specific situation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className="bg-[#2a2a2a] rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105"
            >
              <div className={`p-8 bg-gradient-to-br ${mode.color} hover:${mode.hoverColor} transition-colors`}>
                <mode.Icon className="h-12 w-12 text-white/90 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-3">{mode.title}</h2>
                <p className="text-gray-200 mb-6">{mode.description}</p>
              </div>
              
              <div className="p-8">
                <h3 className="text-lg font-semibold text-white mb-4">Features:</h3>
                <ul className="space-y-3 mb-8">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <div className={`w-1.5 h-1.5 rounded-full ${mode.dotColor} mr-3`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleModeSelect(mode.id)}
                  className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r ${mode.color} hover:${mode.hoverColor} 
                    text-white font-medium flex items-center justify-center group transition-all duration-300`}
                >
                  Select {mode.title}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../translations';

export function Resources() {
  const { language } = useLanguageStore();
  const t = translations[language];

  const resources = [
    {
      category: t.resources.categories.legalForms,
      items: [
        { 
          title: t.resources.forms.housingRights, 
          type: 'PDF', 
          size: '2.4 MB' 
        },
        { 
          title: t.resources.forms.immigration, 
          type: 'PDF', 
          size: '3.1 MB' 
        },
        { 
          title: t.resources.forms.employment, 
          type: 'PDF', 
          size: '1.8 MB' 
        }
      ]
    },
    {
      category: t.resources.categories.educational,
      items: [
        { 
          title: t.resources.educational.rightsHandbook, 
          type: 'PDF', 
          size: '4.2 MB' 
        },
        { 
          title: t.resources.educational.legalGlossary, 
          type: 'PDF', 
          size: '1.5 MB' 
        },
        { 
          title: t.resources.educational.directory, 
          type: 'PDF', 
          size: '2.7 MB' 
        }
      ]
    },
    {
      category: t.resources.categories.external,
      items: [
        { 
          title: t.resources.external.lawLibrary, 
          type: 'Link', 
          url: '#' 
        },
        { 
          title: t.resources.external.legalAid, 
          type: 'Link', 
          url: '#' 
        },
        { 
          title: t.resources.external.community, 
          type: 'Link', 
          url: '#' 
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.resources.pageTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.resources.pageDescription}
            </p>
          </div>

          <div className="space-y-12">
            {resources.map((section, idx) => (
              <div key={idx} className="bg-[#2a2a2a] rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {section.category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="group bg-[#333333] p-6 rounded-xl hover:bg-[#404040] transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <FileText className="h-6 w-6 text-gray-400 mr-3" />
                          <div>
                            <h3 className="text-lg font-medium text-white mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {item.type} {item.size && `• ${item.size}`}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-300 transition-colors">
                          {item.type === 'PDF' ? (
                            <Download className="h-5 w-5" />
                          ) : (
                            <ExternalLink className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
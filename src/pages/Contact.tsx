import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../translations';

export function Contact() {
  const { language } = useLanguageStore();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.contact.pageTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t.contact.pageDescription}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-[#2a2a2a] rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {t.contact.infoTitle}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#333333] rounded-xl flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {t.contact.phone.title}
                      </h3>
                      <p className="text-gray-300">+1 (415) 555-0123</p>
                      <p className="text-gray-400 text-sm">
                        {t.contact.phone.hours}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#333333] rounded-xl flex items-center justify-center mr-4">
                      <Mail className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {t.contact.email.title}
                      </h3>
                      <p className="text-gray-300">info@sfchinatownlegalaid.org</p>
                      <p className="text-gray-400 text-sm">
                        {t.contact.email.response}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#333333] rounded-xl flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {t.contact.office.title}
                      </h3>
                      <p className="text-gray-300">123 Grant Avenue</p>
                      <p className="text-gray-300">San Francisco, CA 94108</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#333333] rounded-xl flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {t.contact.hours.title}
                      </h3>
                      <p className="text-gray-300">{t.contact.hours.weekdays}</p>
                      <p className="text-gray-300">{t.contact.hours.saturday}</p>
                      <p className="text-gray-300">{t.contact.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#2a2a2a] rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {t.contact.form.title}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.contact.form.name}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#333333] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder={t.contact.form.namePlaceholder}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.contact.form.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#333333] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder={t.contact.form.emailPlaceholder}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.contact.form.subject}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#333333] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder={t.contact.form.subjectPlaceholder}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#333333] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder={t.contact.form.messagePlaceholder}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {t.contact.form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
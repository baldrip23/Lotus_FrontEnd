import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, Languages, Scale, MessageSquare } from 'lucide-react';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const languages = {
    'en': 'English',
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'zh-HK': '廣東話'
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      lastScrollY = scrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled && !isHovered ? '-translate-y-full' : 'translate-y-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={`transition-all duration-300 rounded-2xl ${
          isHovered ? 'bg-[#f8f8f8] shadow-[0_8px_32px_rgba(0,0,0,0.15)]' : 'bg-transparent'
        }`}>
          <div className="px-4 sm:px-6">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <Scale className={`h-5 w-5 transition-colors duration-300 ${
                    isHovered ? 'text-gray-900' : 'text-gray-200'
                  }`} />
                  <span className={`text-sm transition-colors duration-300 ${
                    isHovered ? 'text-gray-900' : 'text-gray-200'
                  }`}>
                    Lotus | Legal Aid for Chinatown
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-8">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm transition-colors duration-300 ${
                      isHovered ? 'text-gray-600 hover:text-gray-900' : 'text-gray-200 hover:text-white'
                    }`}
                  >
                    <Languages className="w-5 h-5" />
                    <span>{languages[i18n.language as keyof typeof languages]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#f8f8f8] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] py-1 z-50">
                      {Object.entries(languages).map(([code, name]) => (
                        <button
                          key={code}
                          onClick={() => changeLanguage(code)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-1"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/resources"
                  className={`px-3 py-2 text-sm transition-colors duration-300 ${
                    isHovered ? 'text-gray-600 hover:text-gray-900' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {t('nav.resources')}
                </Link>

                <Link
                  to="/contact"
                  className={`px-3 py-2 text-sm transition-colors duration-300 ${
                    isHovered ? 'text-gray-600 hover:text-gray-900' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {t('nav.contact')}
                </Link>

                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isHovered 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className={`p-2 rounded-md transition-colors duration-300 ${
                    isHovered ? 'text-gray-600 hover:text-gray-900' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  <Languages className="h-6 w-6" />
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2 rounded-md transition-colors duration-300 ${
                    isHovered ? 'text-gray-600 hover:text-gray-900' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {(isMenuOpen || isLanguageOpen) && (
            <div className="md:hidden">
              {isLanguageOpen && (
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {Object.entries(languages).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => changeLanguage(code)}
                      className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}

              {isMenuOpen && (
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    to="/resources"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {t('nav.resources')}
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {t('nav.contact')}
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium bg-gray-600 text-white hover:bg-gray-700"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
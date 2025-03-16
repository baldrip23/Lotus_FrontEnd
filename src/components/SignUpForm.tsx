import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SignUpForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  useEffect(() => {
    if (step === 1 && name.length >= 2) {
      setStep(2);
    } else if (step === 2 && isValidEmail(email)) {
      setStep(3);
    }
  }, [name, email, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      navigate('/onboarding');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-[#2a2a2a] rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{t('auth.joinCommunity')}</h2>
            <p className="text-gray-300">{t('auth.createAccount')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`transition-all duration-500 transform ${step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="name">
                {t('auth.whatName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-lg bg-[#333333] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-shadow"
                  placeholder={t('auth.enterFullName')}
                  autoFocus
                />
              </div>
            </div>

            {step >= 2 && (
              <div className="transition-all duration-500 transform translate-y-0 opacity-100">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                  {t('auth.whatEmail')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-lg bg-[#333333] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-shadow"
                    placeholder={t('auth.enterEmail')}
                  />
                </div>
              </div>
            )}

            {step >= 3 && (
              <div className="transition-all duration-500 transform translate-y-0 opacity-100">
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                  {t('auth.createPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 text-lg bg-[#333333] border border-[#404040] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-shadow"
                    placeholder={t('auth.enterPassword')}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  {t('auth.passwordRequirement')}
                </p>
              </div>
            )}

            {step === 3 && (
              <button
                type="submit"
                disabled={loading || !isValidPassword(password)}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    {t('auth.creatingAccount')}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {t('auth.createAccount')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </button>
            )}
          </form>

          <p className="text-center text-gray-300">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-medium text-gray-400 hover:text-gray-300 transition-colors">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
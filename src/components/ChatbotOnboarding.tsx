import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, User, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { saveUserProfile } from '../lib/userStorage';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  isTyping?: boolean;
}

interface Question {
  id: keyof UserProfile;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'email' | 'tel';
  options?: string[];
  required: boolean;
  validation?: (value: string) => boolean;
  processAnswer?: (value: any) => any;
}

interface UserProfile {
  userid: string;
  full_name: string;
  date_of_birth: string;
  age: number;
  current_sf_resident: boolean;
  household_size: number;
  annual_household_income: number;
  monthly_household_income: number;
  has_past_due_rent: boolean;
  cannot_afford_move_in_costs: boolean;
  if_applying_for_back_rent_financial_hardship_within_12_months: boolean;
  qualify_as_individual_or_family: boolean;
  head_of_household_minimum_age_or_emancipated: boolean;
  annual_income_within_established_limits: boolean;
  pass_criminal_background_check: boolean;
  ssn_documentation_provided_or_certified: boolean;
  hud_citizenship_or_immigration_requirement_met: boolean;
  no_meth_production_conviction: boolean;
  not_subject_to_sex_offender_registration: boolean;
  no_outstanding_rent_debt: boolean;
  household_income_below_50_ami: boolean;
  assistance_exception_if_receiving_assistance: boolean;
  non_discrimination_policy: boolean;
  photo_id: boolean;
  proof_of_total_household_income: boolean;
  rental_agreement_or_address_proof: boolean;
  proof_of_rent_amount: boolean;
  tenant_ledger: boolean;
  landlord_contact_info: boolean;
  w9_form: boolean;
  created_at: string;
  updated_at: string;
}

function computeAge(dateString: string): number {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const questions: Question[] = [
  {
    id: 'full_name',
    type: 'text',
    required: true
  },
  {
    id: 'date_of_birth',
    type: 'date',
    required: true,
    processAnswer: (value) => {
      // Ensure the date is formatted as YYYY-MM-DD
      const date = new Date(value);
      return date.toISOString().split('T')[0];
    }
  },
  {
    id: 'current_sf_resident',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'household_size',
    type: 'number',
    required: true,
    validation: (value) => parseInt(value) > 0
  },
  {
    id: 'annual_household_income',
    type: 'number',
    required: true,
    validation: (value) => parseInt(value) >= 0
  },
  {
    id: 'has_past_due_rent',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'cannot_afford_move_in_costs',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'if_applying_for_back_rent_financial_hardship_within_12_months',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'qualify_as_individual_or_family',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'head_of_household_minimum_age_or_emancipated',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'annual_income_within_established_limits',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'pass_criminal_background_check',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'ssn_documentation_provided_or_certified',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'hud_citizenship_or_immigration_requirement_met',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'no_meth_production_conviction',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'not_subject_to_sex_offender_registration',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'no_outstanding_rent_debt',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'household_income_below_50_ami',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'assistance_exception_if_receiving_assistance',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'non_discrimination_policy',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'photo_id',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'proof_of_total_household_income',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'rental_agreement_or_address_proof',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'proof_of_rent_amount',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'tenant_ledger',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'landlord_contact_info',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  },
  {
    id: 'w9_form',
    type: 'select',
    required: true,
    processAnswer: (value) => value === 'Yes'
  }
];

export default function ChatbotOnboarding() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showLanguageSelection, setShowLanguageSelection] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [answers, setAnswers] = useState<Partial<UserProfile>>({});
  const initialized = useRef(false);

  const languages = {
    'en': 'English',
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'zh-HK': '廣東話'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!initialized.current && !showLanguageSelection) {
      initialized.current = true;
      const initialMessage = {
        id: 'initial',
        type: 'bot' as const,
        content: t('onboarding.questions.full_name'),
        isTyping: true
      };
      setMessages([initialMessage]);
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === 'initial' ? { ...msg, isTyping: false } : msg
          )
        );
      }, 1000);
    }
  }, [t, showLanguageSelection]);

  const handleLanguageSelect = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLanguageSelection(false);
  };

  const addMessage = (content: string, type: 'bot' | 'user') => {
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      isTyping: type === 'bot'
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  };

  const handleAnswer = async (answer: any) => {
    const currentQ = questions[currentQuestion];
    
    if (currentQ.validation && !currentQ.validation(answer.toString())) {
      const errorMessageId = addMessage(t('onboarding.invalidInput'), 'bot');
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === errorMessageId ? { ...msg, isTyping: false } : msg
          )
        );
      }, 500);
      return;
    }

    addMessage(answer.toString(), 'user');

    const processedAnswer = currentQ.processAnswer ? currentQ.processAnswer(answer) : answer;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: processedAnswer
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      const nextQuestion = questions[currentQuestion + 1];
      const messageId = addMessage(t(`onboarding.questions.${nextQuestion.id}`), 'bot');
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, isTyping: false } : msg
          )
        );
      }, 1000);
    } else {
      // Calculate derived values and save profile
      const userid = uuidv4();
      const finalAnswers = {
        ...answers,
        [currentQ.id]: processedAnswer,
        userid,
        age: computeAge(answers.date_of_birth!),
        monthly_household_income: Math.round(answers.annual_household_income! / 12),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;

      try {
        // Save profile - this will save to both localStorage and API
        await saveUserProfile(finalAnswers);
        
        const finalMessageId = addMessage(t('onboarding.completion'), 'bot');
        
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === finalMessageId ? { ...msg, isTyping: false } : msg
            )
          );
          setTimeout(() => navigate('/dashboard'), 1500);
        }, 1000);
      } catch (error) {
        console.error('Failed to save user profile:', error);
        const errorMessageId = addMessage(t('onboarding.error.saveFailed'), 'bot');
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === errorMessageId ? { ...msg, isTyping: false } : msg
            )
          );
        }, 500);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleAnswer(inputValue);
      setInputValue('');
    }
  };

  const question = questions[currentQuestion];

  if (showLanguageSelection) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 bg-[#333333] border-b border-[#404040]">
              <div className="flex items-center gap-4">
                <Languages className="h-8 w-8 text-gray-300" />
                <div>
                  <h2 className="text-xl font-bold text-white">Welcome | 欢迎 | 歡迎</h2>
                  <p className="text-sm text-gray-400">Choose your language | 选择语言 | 選擇語言</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4">
              {Object.entries(languages).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageSelect(code)}
                  className="w-full p-4 bg-[#333333] hover:bg-[#404040] rounded-xl text-white transition-colors flex items-center justify-between group"
                >
                  <span className="text-lg">{name}</span>
                  <Send className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden shadow-xl">
          {/* Chat Header */}
          <div className="p-6 bg-[#333333] border-b border-[#404040]">
            <div className="flex items-center gap-4">
              <Bot className="h-8 w-8 text-gray-300" />
              <div>
                <h2 className="text-xl font-bold text-white">{t('onboarding.title')}</h2>
                <p className="text-sm text-gray-400">{t('onboarding.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-gray-600' : 'bg-gray-700'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-5 w-5 text-gray-300" />
                    ) : (
                      <Bot className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gray-600 text-white'
                        : 'bg-[#333333] text-gray-200'
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[#333333] border-t border-[#404040]">
            {question.type === 'select' && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer('Yes')}
                  className="p-4 bg-[#404040] hover:bg-[#505050] rounded-xl text-white transition-colors"
                >
                  {t('onboarding.options.yes')}
                </button>
                <button
                  onClick={() => handleAnswer('No')}
                  className="p-4 bg-[#404040] hover:bg-[#505050] rounded-xl text-white transition-colors"
                >
                  {t('onboarding.options.no')}
                </button>
              </div>
            )}

            {['text', 'email', 'tel', 'number', 'date'].includes(question.type) && (
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type={question.type}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 px-4 py-3 bg-[#404040] border border-[#505050] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder={t('chat.placeholder')}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
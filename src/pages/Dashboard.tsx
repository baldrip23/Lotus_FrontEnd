import React, { useState, useEffect } from 'react';
import { Scale, FileText, Users, Building2, ArrowRight, Phone, Clock, Search, Bot, Calendar, ChevronRight, Send, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getCurrentUserProfile, UserProfile, sendProfileToApi } from '../lib/userStorage';

interface AidProgram {
  id: string;
  name: string;
  description: string;
  status: 'eligible' | 'pending' | 'ineligible' | 'submitted';
  requirements: string[];
  maxAmount: string;
  deadline: string;
  details?: string;
}

export function Dashboard() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<AidProgram | null>(null);
  const [applicationStep, setApplicationStep] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [seleniumProgress, setSeleniumProgress] = useState(0);
  const [seleniumStatus, setSeleniumStatus] = useState('');
  const [aidProgramsState, setAidProgramsState] = useState<AidProgram[]>([
    {
      id: '1',
      name: 'SF Emergency Rental Assistance Program (ERAP)',
      description: 'Financial support for San Francisco tenants affected by COVID-19',
      status: 'pending',
      requirements: [
        'San Francisco resident',
        'Income below 80% AMI',
        'COVID-19 related hardship',
        'Valid rental agreement',
        'Proof of income documentation'
      ],
      maxAmount: 'Up to 18 months of assistance',
      deadline: 'Ongoing',
      details: 'Applications being accepted on a rolling basis. Priority given to households below 50% AMI.'
    },
    {
      id: '2',
      name: 'EDC Rental Assistance',
      description: 'Emergency rental support through Economic Development Corporation',
      status: 'ineligible',
      requirements: [
        'SF resident',
        'Income verification',
        'Proof of hardship'
      ],
      maxAmount: '$7,500',
      deadline: 'Closed - December 31, 2024',
      details: 'Program no longer accepting applications'
    },
    {
      id: '3',
      name: 'Season of Sharing',
      description: 'One-time assistance for housing and critical family needs',
      status: 'ineligible',
      requirements: [
        'Bay Area resident',
        'Demonstrated critical need',
        'Income eligibility'
      ],
      maxAmount: 'Varies',
      deadline: 'Closed - January 15, 2025',
      details: 'Annual program - check back next season'
    },
    {
      id: '4',
      name: 'NSI Housing Stabilization',
      description: 'Neighborhood-focused housing stability program',
      status: 'ineligible',
      requirements: [
        'District residency',
        'Income limits',
        'Housing instability'
      ],
      maxAmount: '$5,000',
      deadline: 'Closed - February 1, 2025',
      details: 'Program funds exhausted for current cycle'
    }
  ]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (profile) {
          setUserProfile(profile);
          // Silently send profile to API without showing status
          await sendProfileToApi(profile).catch(console.error);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  const simulateSeleniumProgress = () => {
    const steps = [
      'Initializing application...',
      'Navigating to SF ERAP portal...',
      'Filling personal information...',
      'Uploading income documentation...',
      'Verifying rental agreement...',
      'Submitting application...',
      'Finalizing submission...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSeleniumStatus(steps[currentStep]);
        setSeleniumProgress(((currentStep + 1) / steps.length) * 100);
        currentStep++;
      } else {
        clearInterval(interval);
        setApplicationStep(2);
      }
    }, 2000);
  };

  const handleApply = (program: AidProgram) => {
    setSelectedProgram(program);
    setIsApplying(true);
    setApplicationStep(0);
  };

  const handleContinue = () => {
    if (applicationStep < 2) {
      setApplicationStep(prev => prev + 1);
      if (applicationStep === 0) {
        simulateSeleniumProgress();
      }
    } else {
      // Update the ERAP program status to submitted
      setAidProgramsState(prevState => 
        prevState.map(program => 
          program.id === '1' ? { ...program, status: 'submitted', details: 'Application submitted successfully' } : program
        )
      );
      setIsApplying(false);
      setSelectedProgram(null);
      setApplicationStep(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'submitted':
        return 'bg-green-500';
      case 'ineligible':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'eligible':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'submitted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'ineligible':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const firstName = userProfile?.full_name?.split(' ')[0] || 'User';

  const quickActions = [
    {
      icon: Bot,
      title: t('dashboard.quickActions.aiAssistant.title'),
      description: t('dashboard.quickActions.aiAssistant.description'),
      link: "/modes",
      luxury: true
    },
    {
      icon: FileText,
      title: t('dashboard.quickActions.documentReview.title'),
      description: t('dashboard.quickActions.documentReview.description'),
      link: "/documents"
    },
    {
      icon: Calendar,
      title: t('dashboard.quickActions.consultation.title'),
      description: t('dashboard.quickActions.consultation.description'),
      link: "/schedule"
    }
  ];

  if (isApplying && selectedProgram) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pt-20">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-[#2a2a2a] rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedProgram.name}</h2>
              <button
                onClick={() => setIsApplying(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Progress Bar */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-gray-400 text-xs">Application Progress</div>
                  <div className="text-gray-400 text-xs">
                    {applicationStep === 1 ? 
                      `${Math.round(seleniumProgress)}%` : 
                      `${Math.round(((applicationStep + 1) / 3) * 100)}%`
                    }
                  </div>
                </div>
                <div className="flex h-2 mb-4 overflow-hidden rounded bg-[#333333]">
                  <div
                    style={{ 
                      width: applicationStep === 1 ? 
                        `${seleniumProgress}%` : 
                        `${((applicationStep + 1) / 3) * 100}%` 
                    }}
                    className="bg-gray-500 transition-all duration-500"
                  ></div>
                </div>
              </div>

              {/* Application Steps */}
              {applicationStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl text-white">Verify Information</h3>
                  <div className="bg-[#333333] p-4 rounded-xl">
                    <p className="text-gray-300 mb-4">Please verify your information before proceeding with the SF ERAP application:</p>
                    <ul className="space-y-2 text-gray-400">
                      <li>• Full Name: {userProfile?.full_name}</li>
                      <li>• Monthly Income: ${userProfile?.monthly_household_income}</li>
                      <li>• Household Size: {userProfile?.household_size}</li>
                      <li>• SF Resident: {userProfile?.current_sf_resident ? 'Yes' : 'No'}</li>
                    </ul>
                  </div>
                </div>
              )}

              {applicationStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl text-white">Automated Application</h3>
                  <div className="bg-[#333333] p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      <p className="text-gray-300">{seleniumStatus}</p>
                    </div>
                    <div className="h-1 bg-[#404040] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${seleniumProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {applicationStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl text-white">Application Complete</h3>
                  <div className="p-4 bg-[#333333] rounded-xl">
                    <p className="text-gray-300">Your SF ERAP application has been submitted successfully. You will receive a confirmation email with your application number and next steps.</p>
                    <div className="mt-4 p-4 bg-[#404040] rounded-lg">
                      <p className="text-sm text-gray-400">Application tracking number: ERAP-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleContinue}
                className="w-full py-3 bg-gray-600 hover:bg-gray-700 rounded-xl text-white transition-colors"
              >
                {applicationStep === 2 ? 'Return to Dashboard' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {firstName}
            </h1>
            <p className="text-gray-400">
              Here's an overview of your legal assistance dashboard
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, appointments, or ask a question..."
              className="w-full pl-12 pr-4 py-3 bg-[#2a2a2a] border border-[#404040] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.link}
              className={`group p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                action.luxury ? 'luxury-button' : 'bg-[#2a2a2a] hover:bg-[#333333]'
              }`}
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#333333] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#404040]">
                  <action.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {action.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Aid Programs Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Aid Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aidProgramsState.map((program) => (
              <div
                key={program.id}
                className="bg-[#2a2a2a] rounded-xl p-6 relative"
              >
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getStatusColor(program.status)}`} />
                <h3 className="text-xl font-semibold text-white mb-2">{program.name}</h3>
                <p className="text-gray-400 mb-4">{program.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-300">
                    <span className="font-medium">Max Amount:</span>
                    <span className="ml-2">{program.maxAmount}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="font-medium">Deadline:</span>
                    <span className="ml-2">{program.deadline}</span>
                  </div>
                  {program.details && (
                    <div className="text-sm text-gray-400 mt-2">
                      {program.details}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleApply(program)}
                  disabled={program.status === 'ineligible' || program.status === 'submitted'}
                  className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
                    program.status === 'eligible'
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : program.status === 'pending'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : program.status === 'submitted'
                      ? 'bg-green-600 cursor-not-allowed text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {program.status === 'eligible' ? (
                    <>
                      <span>Apply Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : program.status === 'pending' ? (
                    <>
                      <span>Continue Application</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : program.status === 'submitted' ? (
                    'Application Submitted'
                  ) : (
                    'Not Eligible'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Documents */}
          <div className="bg-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
              <a href="/documents" className="text-gray-400 hover:text-white flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="space-y-4">
              {['Rental Agreement.pdf', 'Immigration Form I-485.pdf', 'Employment Contract.docx'].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#333333] rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">{doc}</p>
                      <p className="text-sm text-gray-400">March 15, 2025</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-[#2a2a2a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Appointments</h2>
              <a href="/appointments" className="text-gray-400 hover:text-white flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Legal Consultation', date: 'March 20, 2025', time: '10:00 AM', type: 'Virtual' },
                { title: 'Document Review', date: 'March 22, 2025', time: '2:30 PM', type: 'In-person' }
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#333333] rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-white font-medium">{appointment.title}</p>
                      <p className="text-sm text-gray-400">
                        {appointment.date} at {appointment.time} • {appointment.type}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
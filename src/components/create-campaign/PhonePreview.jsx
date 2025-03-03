import React from 'react';
import { Upload, ChevronRight, ChevronLeft, ChevronLeft as SafariBack, ChevronRight as SafariForward, Share2, MoreVertical, Video } from 'lucide-react';
import { Iphone15Pro } from '../ui/iphone';

const themes = {
  midnight: {
    background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
    text: 'text-white',
    subtext: 'text-blue-200',
    border: 'border-blue-900/50',
    input: 'bg-blue-950/50',
    name: 'Midnight Blue'
  },
  sunset: {
    background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    text: 'text-white',
    subtext: 'text-orange-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Sunset Vibes'
  },
  nature: {
    background: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    text: 'text-white',
    subtext: 'emerald-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Nature Fresh'
  }
};

const steps = [
  { id: 'intro', title: 'Welcome' },
  { id: 'contact', title: 'Contact Info' },
  { id: 'location', title: 'Location' },
  { id: 'response', title: 'Your Response' }
];

export function PhonePreview({ 
  selectedTheme, 
  previewImage, 
  formData, 
  surveyQuestions,
  currentStep = 0,
  gradientColors,
  gradientDirection,
  hexText
}) {
  const [previewStep, setPreviewStep] = React.useState('intro');
  const [previewFormData, setPreviewFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: ''
  });

  // Show response screen when on campaign details step (step 3)
  React.useEffect(() => {
    setPreviewStep(currentStep === 3 ? 'response' : 'intro');
  }, [currentStep]);

  const currentStepIndex = steps.findIndex(step => step.id === previewStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  
  const goToNextStep = () => !isLastStep && setPreviewStep(steps[currentStepIndex + 1].id);
  const goToPreviousStep = () => !isFirstStep && setPreviewStep(steps[currentStepIndex - 1].id);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreviewFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Generate custom gradient style for custom theme
  const getCustomGradientStyle = () => {
    if (selectedTheme !== 'custom') return null;
    
    const direction = gradientDirection === 'br' ? '135deg' :
                     gradientDirection === 'r' ? '90deg' :
                     gradientDirection === 'b' ? '180deg' :
                     gradientDirection === 'bl' ? '225deg' :
                     gradientDirection === 'tr' ? '45deg' : '135deg';
    
    return `linear-gradient(${direction}, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`;
  };
  
  // Custom theme object for rendering
  const customTheme = {
    background: '',  // This will be overridden by inline style
    text: `text-[${hexText}]`,
    subtext: `text-[${hexText}]/80`,
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Custom Theme'
  };
  
  // Determine which theme to use
  const themeToUse = selectedTheme === 'custom' ? customTheme : themes[selectedTheme] || themes.sunset;

  return (
    <div className="hidden lg:block sticky top-0 h-[calc(100vh-1.5rem)] w-[500px] xl:block">
      <div className="flex flex-col items-center">
        <div className="scale-[0.8] origin-top xl:scale-[0.85] -mt-24">
          <Iphone15Pro>
            <div 
              className={`h-full ${selectedTheme === 'custom' ? '' : themeToUse.background} transition-colors duration-200`}
              style={selectedTheme === 'custom' ? { background: getCustomGradientStyle() } : {}}
            >
              <div className="flex flex-col h-full">
                {/* Safari URL Bar */}
                <div className="h-[120px] flex items-end px-4 pb-4">
                  <div className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-white/50">
                        <SafariBack className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-white/50">
                        <SafariForward className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 truncate">
                      shoutvideo.io/survey/preview
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-white/50">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-white/50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className={`h-1 ${themeToUse.border} bg-white/10`}>
                  <div
                    className={`h-1 bg-white/20 transition-all duration-500`}
                    style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                  />
                </div>

                <div className="p-6">
                  {/* Welcome Screen */}
                  {previewStep === 'intro' && (
                    <div className="text-center">
                      {previewImage ? (
                        <div className="flex justify-center mb-8">
                          <img 
                            src={previewImage} 
                            alt={formData.title} 
                            className={`w-20 h-20 rounded-full object-cover ${themeToUse.border} border-2`} 
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center mb-8">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${themeToUse.border} border-2`}>
                            <Upload className={`w-8 h-8 ${themeToUse.text} opacity-50`} />
                          </div>
                        </div>
                      )}
                      <h1 className={`text-3xl font-bold tracking-tight ${themeToUse.text} mb-2`}>
                        {formData.title || 'Campaign Title'}
                      </h1>
                      <p className={`mt-4 text-base ${themeToUse.subtext}`}>
                        {formData.description || 'Campaign Description'}
                      </p>
                      <button
                        onClick={goToNextStep}
                        className={`mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                          themeToUse.border} border-2 ${themeToUse.text} hover:bg-white/10`}
                      >
                        Get Started
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Contact Info Screen */}
                  {previewStep === 'contact' && (
                    <div>
                      <h2 className={`text-2xl font-bold ${themeToUse.text}`}>Contact Information</h2>
                      <p className={`mt-2 text-sm ${themeToUse.subtext}`}>
                        Please provide your contact details. This information will be kept private.
                      </p>
                      <div className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className={`block text-sm font-medium ${themeToUse.text}`}>First name</label>
                            <input
                              name="firstName"
                              value={previewFormData.firstName}
                              onChange={handleInputChange}
                              className={`mt-2 block w-full rounded-lg ${themeToUse.border} ${themeToUse.input} text-white placeholder:text-white/50 focus:ring-white/20 px-3 py-2`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${themeToUse.text}`}>Last name</label>
                            <input
                              name="lastName"
                              value={previewFormData.lastName}
                              onChange={handleInputChange}
                              className={`mt-2 block w-full rounded-lg ${themeToUse.border} ${themeToUse.input} text-white placeholder:text-white/50 focus:ring-white/20 px-3 py-2`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${themeToUse.text}`}>Email address</label>
                            <input
                              name="email"
                              type="email"
                              value={previewFormData.email}
                              onChange={handleInputChange}
                              className={`mt-2 block w-full rounded-lg ${themeToUse.border} ${themeToUse.input} text-white placeholder:text-white/50 focus:ring-white/20 px-3 py-2`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location Screen */}
                  {previewStep === 'location' && (
                    <div>
                      <h2 className={`text-2xl font-bold ${themeToUse.text}`}>Location</h2>
                      <p className={`mt-2 text-sm ${themeToUse.subtext}`}>
                        Please provide your zip code to help us understand our community better.
                      </p>
                      <div className="mt-8">
                        <label className={`block text-sm font-medium ${themeToUse.text}`}>Zip code</label>
                        <input
                          name="zipCode"
                          value={previewFormData.zipCode}
                          onChange={handleInputChange}
                          maxLength={5}
                          pattern="[0-9]*"
                          className={`mt-2 block w-full rounded-lg ${themeToUse.border} ${themeToUse.input} text-white placeholder:text-white/50 focus:ring-white/20 px-3 py-2`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Response Screen */}
                  {previewStep === 'response' && (
                    <div>
                      {/* Questions Panel */}
                      <div>
                        <h2 className={`text-2xl font-bold ${themeToUse.text}`}>Questions</h2>
                        <p className={`mt-2 text-sm ${themeToUse.subtext}`}>
                          Choose one or more questions to answer in your video response.
                        </p>
                        <div className="mt-4 space-y-2">
                          {surveyQuestions.map((question, index) => (
                            <div
                              key={index}
                              className={`flex items-start gap-2 rounded-lg border p-3 ${themeToUse.border} hover:bg-white/5 cursor-pointer`}
                            >
                              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium bg-white/10 text-white`}>
                                {index + 1}
                              </div>
                              {typeof question === 'object' ? (
                                <p className={`text-base ${themeToUse.text}`}>
                                  {question.question}
                                </p>
                              ) : (
                                <p className={`text-base ${themeToUse.text}`}>
                                  {question}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                        {/* Video Upload */}
                        <div className="mt-8">
                          <h3 className={`text-lg font-bold ${themeToUse.text}`}>Record Response</h3>
                          <div className="mt-2">
                            <div className={`relative flex items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl ${themeToUse.border}`}>
                              <div className="flex flex-col items-center justify-center p-4 text-center">
                                <div className={`mb-4 rounded-full p-3 ${themeToUse.input}`}>
                                  <Video className={`w-6 h-6 ${themeToUse.text}`} />
                                </div>
                                <p className={`text-base font-medium ${themeToUse.text}`}>
                                  Record a video answering your selected question(s)
                                </p>
                                <div className={`mt-1 text-xs ${themeToUse.subtext}`}>
                                  <p className="font-medium">Maximum video length: 2 minutes</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                {previewStep !== 'intro' && (
                  <div className="mt-auto p-6 flex justify-between">
                    <button
                      onClick={goToPreviousStep}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                        themeToUse.border} border-2 ${themeToUse.text} hover:bg-white/10`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </button>
                    <button
                      onClick={goToNextStep}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                        themeToUse.border} border-2 ${themeToUse.text} hover:bg-white/10`}
                    >
                      {previewStep === 'response' ? 'Upload Video' : 'Continue'}
                      {previewStep !== 'response' && <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Iphone15Pro>
        </div>
      </div>
    </div>
  );
}
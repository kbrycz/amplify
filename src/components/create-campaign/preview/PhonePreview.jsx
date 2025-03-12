import React from 'react';
import { Upload, ChevronRight, ChevronLeft, ChevronLeft as SafariBack, ChevronRight as SafariForward, Share2, MoreVertical, Video } from 'lucide-react';
import { Iphone15Pro } from '../../ui/iphone';
import { getQuestionsForSubcategory, getSubcategoryName, debugCampaignQuestions } from '../../survey/campaignQuestions';
import { themes as sharedThemes } from '../../survey/themes';

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
  hexText,
  themes,
  hasExplainerVideo = false,
  explainerVideo = null
}) {
  const [previewStep, setPreviewStep] = React.useState('intro');
  const [previewFormData, setPreviewFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: ''
  });

  // Use provided themes, or fall back to shared themes
  const availableThemes = themes && Object.keys(themes).length > 0 ? themes : sharedThemes;
  
  // Show response screen when on campaign details step (step 5) or review step (step 6)
  React.useEffect(() => {
    // Reset to intro step when theme changes
    setPreviewStep(currentStep === 5 || currentStep === 6 ? 'response' : 'intro');
  }, [selectedTheme, currentStep]);

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
                     gradientDirection === 'bl' ? '225deg' : '135deg';
                     
    return {
      background: `linear-gradient(${direction}, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`
    };
  };
  
  // Custom theme object for rendering
  const customTheme = {
    background: '',  // This will be overridden by inline style
    text: '',  // Will be set with inline style
    subtext: '', // Will be set with inline style
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Custom Theme'
  };
  
  // Determine which theme to use
  const themeToUse = selectedTheme === 'custom' ? customTheme : availableThemes[selectedTheme] || availableThemes.sunset;

  // Get text style for custom theme
  const getTextStyle = () => {
    if (selectedTheme !== 'custom') return {};
    return { color: hexText };
  };

  // Get subtext style for custom theme
  const getSubtextStyle = () => {
    if (selectedTheme !== 'custom') return {};
    // Create a slightly transparent version of the text color
    return { color: hexText, opacity: 0.8 };
  };

  // Get template questions for the selected subcategory
  const getTemplateQuestions = () => {
    if (currentStep === 2 && formData.category && formData.subcategory) {
      console.log('PhonePreview: Getting template questions for', formData.category, formData.subcategory);
      
      // Use the debug function to check if the subcategory exists
      debugCampaignQuestions(formData.category, formData.subcategory);
      
      const questions = getQuestionsForSubcategory(formData.category, formData.subcategory);
      console.log('PhonePreview: Retrieved questions:', questions);
      return questions;
    }
    return [];
  };

  // Get subcategory name
  const getSelectedSubcategoryName = () => {
    if (currentStep === 2 && formData.category && formData.subcategory) {
      console.log('PhonePreview: Getting subcategory name for', formData.category, formData.subcategory);
      const name = getSubcategoryName(formData.category, formData.subcategory);
      console.log('PhonePreview: Retrieved subcategory name:', name);
      return name;
    }
    return "";
  };

  // Template questions for the selected subcategory
  const templateQuestions = getTemplateQuestions();
  const subcategoryName = getSelectedSubcategoryName();
  
  console.log('PhonePreview: Template questions:', templateQuestions);
  console.log('PhonePreview: Subcategory name:', subcategoryName);

  return (
    <div className="hidden lg:block sticky top-0 h-[calc(100vh-1.5rem)] w-[500px] xl:block">
      <div className="flex flex-col items-center">
        <div className="scale-[0.8] origin-top xl:scale-[0.85] -mt-24">
          <Iphone15Pro>
            <div 
              className={`h-full ${(currentStep === 0 || currentStep === 1 || currentStep === 2) ? 'bg-gray-100 dark:bg-gray-800' : selectedTheme === 'custom' ? '' : themeToUse.background} transition-colors duration-200`}
              style={selectedTheme === 'custom' && !(currentStep === 0 || currentStep === 1 || currentStep === 2) ? { background: getCustomGradientStyle() } : {}}
            >
              <div className="flex flex-col h-full">
                {/* Safari URL Bar */}
                <div className="h-[120px] flex items-end px-4 pb-4">
                  <div className={`w-full ${(currentStep === 0 || currentStep === 1 || currentStep === 2) ? 'bg-gray-200/90 dark:bg-gray-700/90' : 'bg-white/10'} backdrop-blur-lg rounded-xl p-2 flex items-center gap-2`}>
                    <div className="flex items-center gap-1">
                      <button className={`p-1 ${(currentStep === 0 || currentStep === 1 || currentStep === 2) ? 'text-gray-500 dark:text-gray-400' : 'text-white/50'}`}>
                        <SafariBack className="w-4 h-4" />
                      </button>
                      <button className={`p-1 ${(currentStep === 0 || currentStep === 1 || currentStep === 2) ? 'text-gray-500 dark:text-gray-400' : 'text-white/50'}`}>
                        <SafariForward className="w-4 h-4" />
                      </button>
                    </div>
                    <div className={`flex-1 ${(currentStep === 0 || currentStep === 1 || currentStep === 2) ? 'bg-white dark:bg-gray-600' : 'bg-white/10'} rounded-lg px-3 py-1.5 text-sm ${(currentStep === 0 || currentStep === 1 || currentStep === 2) ? 'text-gray-700 dark:text-gray-300' : 'text-white/70'} truncate`}>
                      shoutvideo.io/survey/preview
                    </div>
                    <div className="flex items-center gap-1">
                      <button className={`p-1 ${(currentStep === 0 || currentStep === 1 || currentStep === 2) ? 'text-gray-500 dark:text-gray-400' : 'text-white/50'}`}>
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className={`p-1 ${(currentStep === 0 || currentStep === 1 || currentStep === 2) ? 'text-gray-500 dark:text-gray-400' : 'text-white/50'}`}>
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
                  {/* Template Questions Preview for Subcategory Selection */}
                  {currentStep === 2 && formData.subcategory && (
                    <div className="overflow-y-auto max-h-[500px]">
                      <div className="text-center mb-6">
                        <h1 className={`text-xl font-bold tracking-tight text-gray-800 dark:text-white mb-3`}>
                          Example Questions
                        </h1>
                        <p className={`text-sm text-gray-600 dark:text-gray-300 mb-4`}>
                          {subcategoryName || 'Template Questions'}
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {templateQuestions && templateQuestions.length > 0 ? (
                          templateQuestions.map((question, index) => (
                            <div 
                              key={index} 
                              className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <p className="text-sm text-gray-800 dark:text-white">
                                {question}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-800 dark:text-white">
                              Select a template to see example questions here.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Internal Name or Category Step - Blank Preview */}
                  {(currentStep === 0 || currentStep === 1 || (currentStep === 2 && !formData.subcategory)) && (
                    <div className="text-center flex flex-col items-center justify-center h-[500px] rounded-xl p-8">
                      <div className="max-w-xs">
                        <h1 className={`text-2xl font-bold tracking-tight text-gray-800 dark:text-white mb-3`}>
                          {currentStep === 2 ? "Example Questions" : "Preview"}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-300`}>
                          {currentStep === 2 
                            ? "Select a template from the left to see example questions here" 
                            : "Your campaign will appear here as you build it."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Design Step - Theme Preview with Dummy Text */}
                  {currentStep === 3 && (
                    <div className="text-center">
                      <div className="flex justify-center mb-8">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${themeToUse.border} border-2`}>
                          <Upload className={`w-8 h-8 ${selectedTheme === 'custom' ? '' : themeToUse.text} opacity-50`} 
                            style={selectedTheme === 'custom' ? getTextStyle() : {}}
                          />
                        </div>
                      </div>
                      <h1 className={`text-3xl font-bold tracking-tight ${selectedTheme === 'custom' ? '' : themeToUse.text} mb-2`}
                        style={selectedTheme === 'custom' ? getTextStyle() : {}}
                      >
                        Campaign Title
                      </h1>
                      <p className={`mt-4 text-base ${selectedTheme === 'custom' ? '' : themeToUse.subtext}`}
                        style={selectedTheme === 'custom' ? getSubtextStyle() : {}}
                      >
                        Campaign Description
                      </p>
                      <button
                        className={`mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                          themeToUse.border} border-2 ${selectedTheme === 'custom' ? '' : themeToUse.text} hover:bg-white/10`}
                        style={selectedTheme === 'custom' ? getTextStyle() : {}}
                      >
                        Get Started
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Welcome Screen for other steps */}
                  {currentStep > 3 && previewStep === 'intro' && (
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
                            <Upload className={`w-8 h-8 ${selectedTheme === 'custom' ? '' : themeToUse.text} opacity-50`}
                              style={selectedTheme === 'custom' ? getTextStyle() : {}}
                            />
                          </div>
                        </div>
                      )}
                      <h1 className={`text-3xl font-bold tracking-tight ${selectedTheme === 'custom' ? '' : themeToUse.text} mb-2`}
                        style={selectedTheme === 'custom' ? getTextStyle() : {}}
                      >
                        {formData.title || 'Campaign Title'}
                      </h1>
                      <p className={`mt-4 text-base ${selectedTheme === 'custom' ? '' : themeToUse.subtext}`}
                        style={selectedTheme === 'custom' ? getSubtextStyle() : {}}
                      >
                        {formData.description || 'Campaign Description'}
                      </p>
                      <button
                        onClick={goToNextStep}
                        className={`mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                          themeToUse.border} border-2 ${selectedTheme === 'custom' ? '' : themeToUse.text} hover:bg-white/10`}
                        style={selectedTheme === 'custom' ? getTextStyle() : {}}
                      >
                        Get Started
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Contact Info Screen */}
                  {previewStep === 'contact' && (
                    <div>
                      <h2 className={`text-2xl font-bold ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                        style={selectedTheme === 'custom' ? getTextStyle() : {}}
                      >Contact Information</h2>
                      <p className={`mt-2 text-sm ${selectedTheme === 'custom' ? '' : themeToUse.subtext}`}
                        style={selectedTheme === 'custom' ? getSubtextStyle() : {}}
                      >
                        Please provide your contact details. This information will be kept private.
                      </p>
                      <div className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className={`block text-sm font-medium ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                              style={selectedTheme === 'custom' ? getTextStyle() : {}}
                            >First name</label>
                            <input
                              name="firstName"
                              value={previewFormData.firstName}
                              onChange={handleInputChange}
                              className={`mt-2 block w-full rounded-lg ${themeToUse.border} ${themeToUse.input} ${selectedTheme === 'custom' ? '' : themeToUse.text} placeholder:${selectedTheme === 'custom' ? '' : themeToUse.text}/50 focus:ring-white/20 px-3 py-2`}
                              style={selectedTheme === 'custom' ? getTextStyle() : {}}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                              style={selectedTheme === 'custom' ? getTextStyle() : {}}
                            >Last name</label>
                            <input
                              name="lastName"
                              value={previewFormData.lastName}
                              onChange={handleInputChange}
                              className={`mt-2 block w-full rounded-lg ${themeToUse.border} ${themeToUse.input} ${selectedTheme === 'custom' ? '' : themeToUse.text} placeholder:${selectedTheme === 'custom' ? '' : themeToUse.text}/50 focus:ring-white/20 px-3 py-2`}
                              style={selectedTheme === 'custom' ? getTextStyle() : {}}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                              style={selectedTheme === 'custom' ? getTextStyle() : {}}
                            >Email address</label>
                            <input
                              name="email"
                              type="email"
                              value={previewFormData.email}
                              onChange={handleInputChange}
                              className={`mt-2 block w-full rounded-lg ${themeToUse.border} ${themeToUse.input} ${selectedTheme === 'custom' ? '' : themeToUse.text} placeholder:${selectedTheme === 'custom' ? '' : themeToUse.text}/50 focus:ring-white/20 px-3 py-2`}
                              style={selectedTheme === 'custom' ? getTextStyle() : {}}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location Screen */}
                  {previewStep === 'location' && (
                    <div>
                      <h2 className={`text-2xl font-bold ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                        style={selectedTheme === 'custom' ? getTextStyle() : {}}
                      >Location</h2>
                      <p className={`mt-2 text-sm ${selectedTheme === 'custom' ? '' : themeToUse.subtext}`}
                        style={selectedTheme === 'custom' ? getSubtextStyle() : {}}
                      >
                        Please provide your zip code to help us understand our community better.
                      </p>
                      <div className="mt-8">
                        <label className={`block text-sm font-medium ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                          style={selectedTheme === 'custom' ? getTextStyle() : {}}
                        >Zip code</label>
                        <input
                          name="zipCode"
                          value={previewFormData.zipCode}
                          onChange={handleInputChange}
                          maxLength={5}
                          pattern="[0-9]*"
                          className={`mt-2 block w-full rounded-lg ${themeToUse.border} ${themeToUse.input} ${selectedTheme === 'custom' ? '' : themeToUse.text} placeholder:${selectedTheme === 'custom' ? '' : themeToUse.text}/50 focus:ring-white/20 px-3 py-2`}
                          style={selectedTheme === 'custom' ? getTextStyle() : {}}
                        />
                      </div>
                    </div>
                  )}

                  {/* Response Screen */}
                  {previewStep === 'response' && (
                    <div>
                      {/* Questions Panel */}
                      <div>
                        {/* Explainer Video (if enabled) */}
                        {(currentStep === 5 || currentStep === 6) && hasExplainerVideo && (
                          <div className="mb-6">
                            <div className="rounded-lg overflow-hidden border border-white/20">
                              {explainerVideo ? (
                                <video 
                                  src={explainerVideo} 
                                  controls 
                                  className="w-full h-auto max-h-[150px]"
                                />
                              ) : (
                                <div className="bg-black/20 h-[150px] flex items-center justify-center">
                                  <div className="text-center">
                                    <Video className={`h-8 w-8 mx-auto mb-2 ${selectedTheme === 'custom' ? '' : themeToUse.text} opacity-60`}
                                      style={selectedTheme === 'custom' ? getTextStyle() : {}}
                                    />
                                    <p className={`text-xs ${selectedTheme === 'custom' ? '' : themeToUse.text} opacity-60`}
                                      style={selectedTheme === 'custom' ? getTextStyle() : {}}
                                    >
                                      Explainer Video
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <h2 className={`text-2xl font-bold ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                          style={selectedTheme === 'custom' ? getTextStyle() : {}}
                        >Questions</h2>
                        <p className={`mt-2 text-sm ${selectedTheme === 'custom' ? '' : themeToUse.subtext}`}
                          style={selectedTheme === 'custom' ? getSubtextStyle() : {}}
                        >
                          Choose one or more questions to answer in your video response.
                        </p>
                        <div className="mt-6 space-y-4">
                          {surveyQuestions.map((question, index) => (
                            <div key={index} className={`rounded-lg ${themeToUse.border} border p-4`}>
                              <p className={`text-sm font-medium ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                                style={selectedTheme === 'custom' ? getTextStyle() : {}}
                              >
                                {question.question}
                              </p>
                            </div>
                          ))}
                          {surveyQuestions.length === 0 && (
                            <div className={`rounded-lg ${themeToUse.border} border p-4`}>
                              <p className={`text-sm font-medium ${selectedTheme === 'custom' ? '' : themeToUse.text}`}
                                style={selectedTheme === 'custom' ? getTextStyle() : {}}
                              >
                                Sample question: What's your opinion on this topic?
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-8">
                          {/* Removed the "Record Video Response" button to keep the preview in place */}
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
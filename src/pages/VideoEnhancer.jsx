import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Import shared components from your shared templates folder
import { InternalName } from '../components/shared/templates/InternalName';
import { Captions } from '../components/shared/templates/Captions';
import { Outro } from '../components/shared/templates/Outro';
import { PhonePreview } from '../components/shared/templates/PhonePreview';
// Import your new video upload step component
import VideoUploadStep from '../components/videoEnhancer/VideoUploadStep';
import { TemplateModal } from '../components/videoEnhancer/TemplateModal';
// Import UI components
import { Card, CardContent } from '../components/ui/card';
import { ChevronLeft, ChevronRight, FileText, X, Plus } from 'lucide-react';

const themes = {
  sunset: {
    background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    text: 'text-white',
    subtext: 'text-orange-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Sunset Vibes'
  },
  midnight: {
    background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
    text: 'text-white',
    subtext: 'text-blue-200',
    border: 'border-blue-900/50',
    input: 'bg-blue-950/50',
    name: 'Midnight Blue'
  },
  nature: {
    background: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    text: 'text-white',
    subtext: 'emerald-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Nature Fresh'
  },
  ocean: {
    background: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600',
    text: 'text-white',
    subtext: 'text-cyan-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Ocean Depths'
  }
};

// Define the multi-step flow: step 0 = Name, 1 = Upload Video, 2 = Captions, 3 = Outro.
const steps = [
  { name: 'Name' },
  { name: 'Upload Video' },
  { name: 'Captions' },
  { name: 'Outro' },
];

export default function VideoEnhancer() {
  const navigate = useNavigate();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(0);

  // Basic video info state (name)
  const [formData, setFormData] = useState({ 
    name: '', 
    title: 'This is an example caption' 
  });
  
  // Video upload state (holds file object and local preview URL)
  const [uploadedVideo, setUploadedVideo] = useState(null);
  
  // Shared settings state for captions and outro
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState({ style: 'standard', position: 'bottom' });
  const [selectedOutroTheme, setSelectedOutroTheme] = useState('sunset');
  const [outroLogo, setOutroLogo] = useState(null);
  const [customOutroColor, setCustomOutroColor] = useState('#3B82F6');
  const [outroText, setOutroText] = useState('');
  const [outroTextColor, setOutroTextColor] = useState('#FFFFFF');
  const [showOutro, setShowOutro] = useState(true);
  
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Refs for previewing video vs. outro preview
  const videoRef = useRef(null);

  // Handle screen size changes for responsive design
  useEffect(() => {
    const handleResize = () => {
      setShowPreview(window.innerWidth >= 1024); // lg breakpoint
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name?.trim();
      case 1:
        return !!uploadedVideo;
      case 2:
        return true; // Caption style is pre-selected
      case 3:
        return true; // Outro is optional
      default:
        return false;
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Validate current step
    if (!isStepValid()) {
      setError(currentStep === 0 
        ? "Please enter a name for your video." 
        : "Please upload a video.");
      return;
    }
    setCurrentStep(prev => prev + 1);
    setError(null);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError(null);
    }
  };

  // Final submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // Here you would implement the actual API call to enhance the video
      console.log("Enhancing video with the following settings:", {
        formData,
        uploadedVideo: uploadedVideo?.file?.name,
        selectedTheme,
        selectedCaptionStyle,
        selectedOutroTheme,
        outroLogo: outroLogo ? 'Logo uploaded' : 'No logo',
        customOutroColor,
        outroText,
        outroTextColor,
        showOutro,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success handling
      alert("Video enhancement started! You'll be notified when it's complete.");
      navigate('/app/dashboard'); // Redirect to dashboard or appropriate page
      
    } catch (err) {
      console.error('Error enhancing video:', err);
      setError(err.message || 'Failed to enhance video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle template selection
  const handleSelectTemplate = (templateData) => {
    console.log("Selected template:", templateData);
    
    // Apply template settings to the form
    if (templateData.name) {
      setFormData(prev => ({ ...prev, name: templateData.name }));
    }
    
    // Apply caption settings
    if (templateData.captionType) {
      setSelectedCaptionStyle({
        style: templateData.captionType,
        position: templateData.captionPosition || 'bottom'
      });
    }
    
    // Apply outro settings
    if (templateData.outroTheme) {
      setSelectedOutroTheme(templateData.outroTheme);
    } else if (templateData.outtroBackgroundColors && templateData.outtroBackgroundColors !== 'none') {
      if (Object.keys(themes).includes(templateData.outtroBackgroundColors)) {
        setSelectedOutroTheme(templateData.outtroBackgroundColors);
      } else {
        setSelectedOutroTheme('custom');
        setCustomOutroColor(templateData.outtroBackgroundColors);
      }
    }
    
    if (templateData.outtroFontColor) {
      setOutroTextColor(templateData.outtroFontColor);
    }
    
    // Apply additional data
    if (templateData.additionalData) {
      try {
        const additionalData = JSON.parse(templateData.additionalData);
        if (additionalData.outroText) {
          setOutroText(additionalData.outroText);
        }
      } catch (e) {
        console.error('Error parsing template additional data', e);
      }
    } else if (templateData.outroText) {
      setOutroText(templateData.outroText);
    }
    
    if (templateData.image) {
      setOutroLogo(templateData.image);
    }
    
    // Set outro visibility
    if (templateData.showOutro !== undefined) {
      setShowOutro(templateData.showOutro);
    } else if (templateData.outtroBackgroundColors && templateData.outtroBackgroundColors !== 'none') {
      setShowOutro(true);
    } else {
      setShowOutro(false);
    }
    
    // Apply theme if available
    if (templateData.theme) {
      setSelectedTheme(templateData.theme);
    }
    
    // Set the selected template for UI display
    setSelectedTemplate(templateData);
    
    // Show success message
    setSuccessMessage("Template applied successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Determine what to show in the phone preview
  const getPhonePreviewStep = () => {
    if (currentStep === 3) {
      // Show outro preview on the outro step
      return 2; // This is the step value that shows the outro in PhonePreview
    } else if (uploadedVideo && currentStep === 2) {
      // Show video with captions on the captions step
      return 1; // This is the step value that shows the video in PhonePreview
    } else if (uploadedVideo && currentStep === 1) {
      // Show video without captions on the upload step
      return 0; // This will show the video but without captions
    } else {
      // Default behavior for other steps
      return currentStep;
    }
  };

  // Custom navigation component without draft functionality
  const CustomNavigation = () => {
    const canProceed = isStepValid();
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 w-full">
        <div className="order-2 sm:order-1">
          {!isFirstStep && (
            <button
              type="button"
              onClick={handlePrevious}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
          )}
        </div>
        <div className="order-1 sm:order-2">
          <button
            type="button"
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={isProcessing || !canProceed}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 ${
              (isProcessing || !canProceed) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{isLastStep ? 'Processing...' : 'Next...'}</span>
              </>
            ) : (
              <>
                <span>{isLastStep ? 'Use 1 Credit to Enhance Video' : 'Next'}</span>
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Enhance Video</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create a polished video with captions and outro. Use 1 credit to enhance your video.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {showPreview ? (
                <>
                  <X className="h-4 w-4" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </button>
          </div>
        </div>
        
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-100 rounded-md text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-md text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            {error}
          </div>
        )}
      </div>
      
      <div className="relative max-w-[800px] h-1 bg-gray-200 dark:bg-gray-800 mt-4 mb-6">
        <div
          className="absolute inset-y-0 left-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-[800px,auto]' : ''} gap-6 items-start ${!showPreview ? 'w-full' : ''}`}>
        <Card className="w-full">
          <CardContent className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === steps.length - 1) {
                  handleSubmit(e);
                } else {
                  handleNext(e);
                }
              }}
              className="space-y-8"
            >
              {currentStep === 0 && (
                <>
                  <InternalName formData={formData} handleInputChange={handleInputChange} />
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsTemplateModalOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <FileText className="h-4 w-4" />
                      {selectedTemplate ? 'Change Template' : 'Use Template'}
                    </button>
                    {selectedTemplate ? (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                            selectedTemplate.theme ? themes[selectedTemplate.theme]?.background : 'bg-blue-500'
                          }`}>
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedTemplate.name || 'Unnamed Template'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Template applied with {selectedTemplate.captionType || 'standard'} captions
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Select a template to use its caption and outro settings.
                      </p>
                    )}
                  </div>
                </>
              )}
              {currentStep === 1 && (
                <VideoUploadStep
                  uploadedVideo={uploadedVideo}
                  setUploadedVideo={setUploadedVideo}
                  setError={setError}
                />
              )}
              {currentStep === 2 && (
                <Captions
                  selectedCaptionStyle={selectedCaptionStyle}
                  setSelectedCaptionStyle={setSelectedCaptionStyle}
                />
              )}
              {currentStep === 3 && (
                <Outro
                  selectedOutroTheme={selectedOutroTheme}
                  setSelectedOutroTheme={setSelectedOutroTheme}
                  outroLogo={outroLogo}
                  setOutroLogo={setOutroLogo}
                  customOutroColor={customOutroColor}
                  setCustomOutroColor={setCustomOutroColor}
                  outroText={outroText}
                  setOutroText={setOutroText}
                  outroTextColor={outroTextColor}
                  setOutroTextColor={setOutroTextColor}
                  showOutro={showOutro}
                  setShowOutro={setShowOutro}
                />
              )}
              <CustomNavigation />
            </form>
          </CardContent>
        </Card>
        
        {showPreview && (
          <PhonePreview
            selectedTheme={selectedTheme}
            formData={formData}
            currentStep={getPhonePreviewStep()}
            themes={themes}
            selectedCaptionStyle={currentStep === 2 ? selectedCaptionStyle : { style: 'none' }}
            selectedOutroTheme={selectedOutroTheme}
            outroLogo={outroLogo}
            customOutroColor={customOutroColor}
            outroText={outroText}
            outroTextColor={outroTextColor}
            showOutro={showOutro}
            videoRef={videoRef}
            videoUrl={uploadedVideo ? uploadedVideo.url : undefined}
          />
        )}
      </div>
      
      <TemplateModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
      
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardContent } from '../components/ui/card';
import { useFormCache } from '../hooks/useFormCache';
import { PhonePreview } from '../components/shared/templates/PhonePreview';
import { InternalName } from '../components/shared/templates/InternalName';
import { Captions } from '../components/shared/templates/Captions';
import { Outro } from '../components/shared/templates/Outro';
import { StepNavigation } from '../components/shared/templates/StepNavigation';
import { useToast } from '../components/ui/toast-notification';
import { TemplateModal } from '../components/videoPolisher/TemplateModal';
import { FileText, ArrowLeft } from 'lucide-react';

const themes = {
  sunset: { background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600', text: 'text-white', subtext: 'text-orange-100', border: 'border-white/20', input: 'bg-white/20', name: 'Sunset Vibes' },
  midnight: { background: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900', text: 'text-white', subtext: 'text-blue-200', border: 'border-blue-900/50', input: 'bg-blue-950/50', name: 'Midnight Blue' },
  nature: { background: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600', text: 'text-white', subtext: 'emerald-100', border: 'border-white/20', input: 'bg-white/20', name: 'Nature Fresh' },
  ocean: { background: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600', text: 'text-white', subtext: 'text-cyan-100', border: 'border-white/20', input: 'bg-white/20', name: 'Ocean Depths' }
};

const steps = [
  { name: 'Name Video' },
  { name: 'Captions' },
  { name: 'Outro' }
];

export default function VideoPolisher() {
  const { id, campaignId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPhonePreviewLoading, setIsPhonePreviewLoading] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const initialFormData = {
    name: '',
    title: '',
    description: '',
    category: '',
    businessName: '',
    website: '',
    email: '',
    phone: ''
  };
  const [formData, setFormData, clearFormCache] = useFormCache(initialFormData, 'video-polisher-form');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState({ style: 'standard', position: 'bottom' });
  const [selectedOutroTheme, setSelectedOutroTheme] = useState('sunset');
  const [outroLogo, setOutroLogo] = useState(null);
  const [customOutroColor, setCustomOutroColor] = useState('#3B82F6');
  const [outroText, setOutroText] = useState('');
  const [outroTextColor, setOutroTextColor] = useState('#FFFFFF');
  const [showOutro, setShowOutro] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);

  useEffect(() => {
    if (video?.videoUrl && currentStep === 1) {
      setIsVideoLoading(true);
    }
  }, [video?.videoUrl, currentStep]);

  const fetchVideo = async () => {
    setIsLoading(true);
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/survey/video/${id}`, { headers: { 'Authorization': `Bearer ${idToken}` } });
      if (!response.ok) throw new Error('Failed to fetch video');
      const data = await response.json();
      setVideo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return Boolean(formData.name?.trim());
      case 1:
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(e);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Please enter a video name");
      return;
    }
    setIsProcessing(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be logged in to enhance a video");
      const idToken = await user.getIdToken();
      const payload = {
        videoId: video.id,
        name: formData.name,
        captionType: typeof selectedCaptionStyle === 'object' ? selectedCaptionStyle.style : selectedCaptionStyle,
        captionPosition: typeof selectedCaptionStyle === 'object' ? selectedCaptionStyle.position : 'bottom',
        outtroBackgroundColors: showOutro ? (selectedOutroTheme === 'custom' ? customOutroColor : selectedOutroTheme) : 'none',
        outtroFontColor: showOutro ? outroTextColor : '',
        image: showOutro ? outroLogo : null,
        additionalData: JSON.stringify({ formData, selectedTheme, selectedCaptionStyle, selectedOutroTheme, outroLogo, customOutroColor, outroText, outroTextColor, showOutro })
      };
      const toastId = addToast("Video processing in progress. This may take a few minutes...", "info", 0);
      const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to process video');
      }
      const responseData = await response.json();
      const jobId = responseData.jobId;
      if (jobId) {
        handleVideoProcessingStart(video.id, jobId, toastId);
      }
    } catch (err) {
      setError(err.message || "Failed to process video");
      addToast(err.message || "Failed to process video", "error", 10000);
      setIsProcessing(false);
    }
  };

  const handleVideoProcessingStart = (videoId, jobId, toastId) => {
    const pollInterval = 5000;
    const maxAttempts = 60;
    let attempts = 0;
    const pollStatus = async () => {
      attempts++;
      if (attempts > maxAttempts) {
        addToast("Video processing is taking longer than expected. Please check back later.", "info", 10000, toastId);
        setIsProcessing(false);
        clearInterval(intervalId);
        return;
      }
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch(`${SERVER_URL}/creatomate/creatomate-process/status/job/${jobId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${idToken}`, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
        });
        if (!response.ok) throw new Error('Failed to check status');
        const result = await response.json();
        if (result.status === 'succeeded') {
          clearInterval(intervalId);
          setIsProcessing(false);
          addToast(
            <div className="flex flex-col space-y-3">
              <p className="font-semibold text-base">Success! Your enhanced video is ready.</p>
              <button 
                onClick={() => navigate(campaignId ? `/app/campaigns/${campaignId}/responses` : '/app/campaigns')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium mt-1 w-full text-center"
              >
                Go to Responses
              </button>
            </div>,
            "success",
            15000,
            toastId
          );
        } else if (result.status === 'failed') {
          clearInterval(intervalId);
          setIsProcessing(false);
          addToast(`Video enhancement failed: ${result.error || 'Unknown error'}`, "error", 10000, toastId);
        }
      } catch (error) {
        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          setIsProcessing(false);
          addToast(`Error checking video status: ${error.message}`, "error", 10000, toastId);
        }
      }
    };
    pollStatus();
    const intervalId = setInterval(pollStatus, pollInterval);
  };

  const handleSelectTemplate = (templateData) => {
    setSelectedTemplate(templateData);
    
    // Update form data and settings based on the template
    if (templateData.name) {
      setFormData(prev => ({ ...prev, name: templateData.name }));
    }
    
    // Apply caption settings
    if (templateData.captionType) {
      setSelectedCaptionStyle({
        style: templateData.captionType || 'standard',
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
    
    // Apply font color
    if (templateData.outtroFontColor) {
      setOutroTextColor(templateData.outtroFontColor);
    }
    
    // Apply theme
    if (templateData.theme) {
      setSelectedTheme(templateData.theme);
    }
    
    // Apply outro text
    if (templateData.outroText) {
      setOutroText(templateData.outroText);
    }
    
    // Set outro visibility
    if (templateData.showOutro !== undefined) {
      setShowOutro(templateData.showOutro);
    } else if (templateData.outroTheme || (templateData.outtroBackgroundColors && templateData.outtroBackgroundColors !== 'none')) {
      setShowOutro(true);
    } else {
      setShowOutro(false);
    }
    
    // Apply logo if available
    if (templateData.image) {
      setOutroLogo(templateData.image);
    }
    
    // Apply additional data if available
    if (templateData.additionalData) {
      try {
        const additionalData = JSON.parse(templateData.additionalData);
        
        // Apply any additional settings from additionalData
        if (additionalData.outroText && !templateData.outroText) {
          setOutroText(additionalData.outroText);
        }
        
        if (additionalData.outroLogo && !templateData.image) {
          setOutroLogo(additionalData.outroLogo);
        }
      } catch (e) {
        console.error('Error parsing template additional data', e);
      }
    }
    
    // Show success message
    addToast("Template applied successfully!", "success", 3000);
  };

  const renderContent = () => {
    if (currentStep === 0) {
      return <InternalName formData={formData} handleInputChange={handleInputChange} />;
    } else if (currentStep === 1) {
      return <Captions selectedCaptionStyle={selectedCaptionStyle} setSelectedCaptionStyle={setSelectedCaptionStyle} />;
    } else if (currentStep === 2) {
      return (
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
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/app/campaigns/${campaignId}/responses`)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to responses
      </button>
      
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Enhance Video</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Customize and enhance your video using our AI enhancement tool. Use 1 credit to transform your video.
          </p>
          <div className="relative max-w-[800px] h-1 bg-gray-200 dark:bg-gray-800 mt-4">
            <div className="absolute inset-y-0 left-0 bg-indigo-600 dark:bg-indigo-400 transition-all duration-500" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[800px,auto] gap-6 items-start">
          <Card className="w-full">
            <CardContent>
              <form onSubmit={(e) => {
                if (currentStep !== steps.length - 1) {
                  e.preventDefault();
                  handleNext(e);
                } else {
                  handleSubmit(e);
                }
              }} className="space-y-8">
                {currentStep === 0 && (
                  <>
                    {renderContent()}
                    
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
                              selectedTemplate.theme ? themes[selectedTemplate.theme]?.background : 
                              (selectedTemplate.outroTheme ? themes[selectedTemplate.outroTheme]?.background : 'bg-blue-500')
                            }`}>
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{selectedTemplate.name || 'Unnamed Template'}</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedTemplate.captionType && (
                                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                    {selectedTemplate.captionType} captions {selectedTemplate.captionPosition && `(${selectedTemplate.captionPosition})`}
                                  </span>
                                )}
                                {selectedTemplate.theme && (
                                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                    {themes[selectedTemplate.theme]?.name || selectedTemplate.theme} theme
                                  </span>
                                )}
                                {selectedTemplate.outroTheme && (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    {themes[selectedTemplate.outroTheme]?.name || selectedTemplate.outroTheme} outro
                                  </span>
                                )}
                              </div>
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
                {currentStep !== 0 && renderContent()}
                
                <div className="mt-8">
                  <StepNavigation
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    isSubmitting={isProcessing}
                    formData={formData}
                    selectedCaptionStyle={selectedCaptionStyle}
                    finalButtonText="Use 1 Credit to Enhance Video"
                  />
                </div>
              </form>
            </CardContent>
          </Card>
          {video && (
            <PhonePreview
              selectedTheme={selectedTheme}
              formData={formData}
              currentStep={currentStep}
              themes={themes}
              selectedCaptionStyle={selectedCaptionStyle}
              selectedOutroTheme={selectedOutroTheme}
              outroLogo={outroLogo}
              customOutroColor={customOutroColor}
              outroText={outroText}
              outroTextColor={outroTextColor}
              showOutro={showOutro}
              videoUrl={video.videoUrl} // Use the actual video URL
            />
          )}
        </div>
      </div>
      
      {/* Template Modal */}
      <TemplateModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
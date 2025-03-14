import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
// Use shared template components:
import { PhonePreview } from '../components/shared/templates/PhonePreview';
import { InternalName } from '../components/shared/templates/InternalName';
import { Captions } from '../components/shared/templates/Captions';
import { Outro } from '../components/shared/templates/Outro';
import { StepNavigation } from '../components/shared/templates/StepNavigation';
import TemplateDetailsHeader from '../components/templateDetails/TemplateDetailsHeader';
import { Card, CardContent } from '../components/ui/card';

// Theme configuration – should match your campaign themes
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
    background: 'bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900',
    text: 'text-white',
    subtext: 'text-primary-200',
    border: 'border-primary-900/50',
    input: 'bg-primary-950/50',
    name: 'Midnight primary'
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
    background: 'bg-gradient-to-br from-cyan-500 via-primary-500 to-primary-600',
    text: 'text-white',
    subtext: 'text-cyan-100',
    border: 'border-white/20',
    input: 'bg-white/20',
    name: 'Ocean Depths'
  }
};

// Define the steps for the multi–step flow (Basic Info, Captions, Outro)
const steps = [
  { name: 'Basic Info' },
  { name: 'Captions' },
  { name: 'Outro' }
];

export default function TemplateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: '',
    // Add other template fields here
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  
  // Multi–step form state
  const [currentStep, setCurrentStep] = useState(0);

  // Shared state for template settings
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState({ style: 'standard', position: 'bottom' });
  const [selectedOutroTheme, setSelectedOutroTheme] = useState('sunset');
  const [outroLogo, setOutroLogo] = useState(null);
  const [customOutroColor, setCustomOutroColor] = useState('#3B82F6');
  const [outroText, setOutroText] = useState('');
  const [outroTextColor, setOutroTextColor] = useState('#FFFFFF');
  const [showOutro, setShowOutro] = useState(true);
  
  // Refs for previewing video vs. outro
  const videoRef = useRef(null);
  const outroSectionRef = useRef(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Add a state for video loading
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // Remove the phone preview loading state
  const [isPhonePreviewLoading, setIsPhonePreviewLoading] = useState(false);

  // Handle screen size changes
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

  // Reset video loading state when template changes
  useEffect(() => {
    if (template?.videoUrl) {
      setIsVideoLoading(true);
    }
  }, [template?.videoUrl]);

  // Log template state changes
  useEffect(() => {
    console.log("Template state changed:", template);
  }, [template]);

  // Log caption style changes
  useEffect(() => {
    console.log("Caption style changed:", selectedCaptionStyle);
  }, [selectedCaptionStyle]);

  // Fetch the template details when the component mounts or when ID changes
  useEffect(() => {
    fetchTemplate();
  }, [id]);

  // Autoplay video if preview step is 1
  useEffect(() => {
    if (videoRef.current && currentStep === 1) {
      videoRef.current.play().catch((error) => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, [currentStep]);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/templates/${id}`, {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch template');
      const data = await response.json();
      
      console.log("Raw template data from server:", data);
      
      // Set the template data
      setTemplate(data);
      
      // Set all the individual state values
      setSelectedTheme(data.theme || 'sunset');
      
      // Set caption style and position
      const captionStyleObj = {
        style: data.captionType || 'standard',
        position: data.captionPosition || 'bottom'
      };
      console.log("Setting caption style to:", captionStyleObj);
      setSelectedCaptionStyle(captionStyleObj);
      
      setSelectedOutroTheme(data.outroTheme || 'sunset');
      setOutroLogo(data.image || null);
      setCustomOutroColor(data.outtroBackgroundColors || '#3B82F6');
      setOutroText(data.outroText || '');
      setOutroTextColor(data.outtroFontColor || '#FFFFFF');
      setShowOutro(data.showOutro !== undefined ? data.showOutro : true);
      
      console.log("Loaded template data:", data);
      console.log("Template state after loading:", template);
    } catch (err) {
      console.error('Error fetching template:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    
    // Update the template state with the new value
    setTemplate(prev => {
      const updated = { ...prev, [name]: value };
      console.log("Updated template:", updated);
      return updated;
    });
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
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // When the last step is submitted, update the template
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with template data:", template);
    console.log("Current caption style:", selectedCaptionStyle);
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Map our UI state to the server's expected parameters
      const formData = {
        name: template.name,
        captionType: selectedCaptionStyle.style,
        captionPosition: selectedCaptionStyle.position,
        outtroBackgroundColors: customOutroColor,
        outtroFontColor: outroTextColor,
        image: outroLogo,
        theme: selectedTheme,
        outroTheme: selectedOutroTheme,
        outroText: outroText,
        showOutro: showOutro
      };
      
      console.log("Submitting template update:", formData);
      
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update template');
      }
      
      // Refresh the template data after update
      const updatedTemplate = await response.json();
      console.log("Server response:", updatedTemplate);
      setTemplate(updatedTemplate);
      
      setSuccessMessage('Template updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating template:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const idToken = await auth.currentUser.getIdToken();
      await fetch(`${SERVER_URL}/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });
      navigate('/app/templates');
    } catch (err) {
      console.error('Error deleting template:', err);
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Create a custom StepNavigation component without the save draft button
  const CustomStepNavigation = () => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 w-full">
      <div className="order-2 sm:order-1">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
        )}
      </div>
      <div className="order-1 sm:order-2">
        <button
          type="button"
          onClick={(e) => {
            if (currentStep === steps.length - 1) {
              handleSubmit(e);
            } else {
              handleNext(e);
            }
          }}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
        >
          {isSaving ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{currentStep === steps.length - 1 ? 'Saving...' : 'Next...'}</span>
            </>
          ) : (
            <>
              <span>{currentStep === steps.length - 1 ? 'Save Changes' : 'Next'}</span>
              {currentStep < steps.length - 1 && <ArrowLeft className="h-4 w-4 rotate-180" />}
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading template details..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <TemplateDetailsHeader id={id} templateName={template?.name} navigate={navigate} />
      
      <div className="space-y-4 mt-6">
        <div>
          <div className="relative max-w-[800px] h-1 bg-gray-200 dark:bg-gray-800 mt-4">
            <div
              className="absolute inset-y-0 left-0 bg-primary-600 dark:bg-primary-400 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className={`grid grid-cols-1 ${showPreview ? 'lg:grid-cols-[800px,auto]' : ''} gap-6 items-start`}>
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
                  <InternalName 
                    formData={template} 
                    handleInputChange={handleInputChange} 
                    context="template"
                  />
                )}
                {currentStep === 1 && (
                  <Captions 
                    selectedCaptionStyle={selectedCaptionStyle} 
                    setSelectedCaptionStyle={setSelectedCaptionStyle} 
                  />
                )}
                {currentStep === 2 && (
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
                {successMessage && (
                  <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                  </div>
                )}
                <CustomStepNavigation />
              </form>
            </CardContent>
          </Card>
          
          {showPreview && (
            <PhonePreview
              selectedTheme={selectedTheme}
              formData={template}
              currentStep={currentStep}
              themes={themes}
              selectedCaptionStyle={selectedCaptionStyle}
              selectedOutroTheme={selectedOutroTheme}
              outroLogo={outroLogo}
              customOutroColor={customOutroColor}
              outroText={outroText}
              outroTextColor={outroTextColor}
              showOutro={showOutro}
              videoRef={videoRef}
              videoUrl={template?.videoUrl}
            />
          )}
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Template"
        message={`Are you sure you want to delete "${template?.name}"? This action cannot be undone and will permanently remove this template.`}
        confirmButtonText="Delete Template"
      />
      
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ConfirmationModal } from '../components/ui/confirmation-modal';
import { PhonePreview } from '../components/create-template/PhonePreview';
import TemplateDetailsHeader from '../components/templateDetails/TemplateDetailsHeader';
import TemplateDetailsForm from '../components/templateDetails/TemplateDetailsForm';

export default function TemplateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState({ style: 'standard', position: 'bottom' });
  const [selectedOutroTheme, setSelectedOutroTheme] = useState('sunset');
  const [outroLogo, setOutroLogo] = useState(null);
  const [customOutroColor, setCustomOutroColor] = useState('#3B82F6');
  const [outroText, setOutroText] = useState('');
  const [outroTextColor, setOutroTextColor] = useState('#FFFFFF');
  const [showOutro, setShowOutro] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const videoRef = useRef(null);
  const outroSectionRef = useRef(null);
  const [currentPreviewStep, setCurrentPreviewStep] = useState(1); // 1 for video, 2 for outro
  
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

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  // Play the video when the component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, [videoRef.current]);

  // Add scroll event listener to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!outroSectionRef.current) return;
      
      const outroRect = outroSectionRef.current.getBoundingClientRect();
      const scrollThreshold = window.innerHeight * 0.6; // 60% down the viewport
      
      // If the outro section is in view (top of section is above the threshold)
      if (outroRect.top < scrollThreshold) {
        setCurrentPreviewStep(2); // Show outro preview
      } else {
        setCurrentPreviewStep(1); // Show video preview
      }
    };

    // Initial check
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchTemplate = async () => {
    try {
      setIsLoading(true);
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/templates/${id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }
      const data = await response.json();
      console.log('Template data:', data);
      
      // Ensure we have a valid template object
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid template data received');
      }
      
      setTemplate(data);
      
      // Set all the template properties with fallbacks for missing data
      setSelectedTheme(data.theme || 'sunset');
      
      // Handle caption style with proper fallbacks
      if (data.captionStyle) {
        setSelectedCaptionStyle(typeof data.captionStyle === 'object' 
          ? data.captionStyle 
          : { style: data.captionStyle, position: data.captionPosition || 'bottom' });
      } else {
        setSelectedCaptionStyle({ style: 'standard', position: 'bottom' });
      }
      
      setSelectedOutroTheme(data.outroTheme || 'sunset');
      setOutroLogo(data.outroLogo || null);
      setCustomOutroColor(data.customOutroColor || '#3B82F6');
      setOutroText(data.outroText || '');
      setOutroTextColor(data.outroTextColor || '#FFFFFF');
      setShowOutro(data.showOutro !== undefined ? data.showOutro : true);
      
    } catch (err) {
      console.error('Error fetching template:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      
      const formData = {
        ...template,
        theme: selectedTheme,
        captionStyle: selectedCaptionStyle,
        outroTheme: selectedOutroTheme,
        outroLogo,
        customOutroColor,
        outroText,
        outroTextColor,
        showOutro
      };
      
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
      
      setSuccessMessage('Template updated successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const idToken = await auth.currentUser.getIdToken();
      // Immediately navigate away—don't wait for the response.
      navigate('/app/templates');
      await fetch(`${SERVER_URL}/templates/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error deleting template:', err);
      // Already navigated away—no need to set error state.
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading template details..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <TemplateDetailsHeader
        id={id}
        templateName={template?.name}
        navigate={navigate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[800px,auto] gap-6 items-start">
        <div>
          <TemplateDetailsForm
            template={template}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            isSaving={isSaving}
            isDeleting={isDeleting}
            successMessage={successMessage}
            error={error}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            selectedCaptionStyle={selectedCaptionStyle}
            setSelectedCaptionStyle={setSelectedCaptionStyle}
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
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            outroSectionRef={outroSectionRef}
          />
        </div>
        <PhonePreview
          selectedTheme={selectedTheme}
          formData={template}
          selectedCaptionStyle={selectedCaptionStyle}
          selectedOutroTheme={selectedOutroTheme}
          outroLogo={outroLogo}
          customOutroColor={customOutroColor}
          outroText={outroText}
          outroTextColor={outroTextColor}
          showOutro={showOutro}
          themes={themes}
          videoRef={videoRef}
          currentStep={currentPreviewStep} // Dynamic step based on scroll position
        />
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
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
} 
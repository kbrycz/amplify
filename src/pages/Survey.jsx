import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { SERVER_URL } from '../lib/firebase';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Upload, ChevronRight, ChevronLeft, Video, X, CheckCircle } from 'lucide-react';

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
  { id: 'response', title: 'Your Response' },
  { id: 'success', title: 'Thank You' }
];

export default function Survey() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState('intro');
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const errorTimeoutRef = useRef(null);
  const MAX_VIDEO_DURATION = 120; // 2 minutes in seconds
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: '',
    videoFile: null,
    videoUrl: null,
    currentQuestionIndex: 0
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const apiUrl = `${SERVER_URL}/campaign/campaigns/survey/${id}`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Campaign not found');
      }
      const data = await response.json();
      setCampaign(data);
    } catch (err) {
      console.error('Error fetching campaign:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      // Set new timeout
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    // Cleanup timeout on unmount or when error changes
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a temporary video element to check duration
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        setVideoDuration(duration);

        if (duration > MAX_VIDEO_DURATION) {
          setError(`Video is too long (${Math.round(duration / 60)}:${String(duration % 60).padStart(2, '0')}). Please upload a video shorter than 2 minutes.`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setError(null);
          setFormData(prev => ({
            ...prev,
            videoFile: file,
            videoUrl: URL.createObjectURL(file)
          }));
        }
      };

      video.src = URL.createObjectURL(file);
    }
  };

  const handleRemoveVideo = () => {
    setVideoDuration(null);
    setError(null);
    setFormData(prev => ({
      ...prev,
      videoFile: null,
      videoUrl: null
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.videoFile) {
    setError('Please record or upload a video response before submitting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (videoDuration > MAX_VIDEO_DURATION) {
    setError(`Video must be shorter than 2 minutes. Current length: ${Math.round(videoDuration / 60)}:${String(videoDuration % 60).padStart(2, '0')}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  setIsUploading(true);
  setError('');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const formDataToSend = new FormData();
  formDataToSend.append('campaignId', id);
  formDataToSend.append('firstName', formData.firstName);
  formDataToSend.append('lastName', formData.lastName);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('zipCode', formData.zipCode);
  formDataToSend.append('video', formData.videoFile);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${SERVER_URL}/survey/upload`, true);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded / event.total) * 100);
      setUploadProgress(progress);
    }
  };

  xhr.onload = () => {
    if (xhr.status === 201) {
      setCurrentStep('success');
    } else {
      setError(`Failed to upload video. Server responded with status ${xhr.status}`);
      console.error('Upload failed:', xhr.status, xhr.responseText);
    }
    setIsUploading(false);
    setUploadProgress(0);
  };

  xhr.onerror = () => {
    setError('Failed to upload video due to a network error.');
    console.error('Network error during upload');
    setIsUploading(false);
    setUploadProgress(0);
  };

  xhr.send(formDataToSend);
};

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setError(null);
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setError(null);
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading survey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="rounded-full bg-red-100 p-3 mx-auto w-fit dark:bg-red-900/50">
            <X className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Survey Not Found</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${campaign.theme ? themes[campaign.theme].background : 'bg-gray-50 dark:bg-gray-900'}`}>
      {/* Progress bar */}
      <div className="fixed inset-x-0 top-0">
        <div className={`h-1 ${campaign.theme ? 'bg-white/10' : 'bg-gray-200 dark:bg-gray-800'}`}>
          <div
            className={`h-1 ${campaign.theme ? 'bg-white/20' : 'bg-indigo-600 dark:bg-indigo-400'} transition-all duration-500`}
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={`mx-auto px-4 py-16 sm:px-6 sm:py-24 ${
        currentStep === 'response' 
          ? 'max-w-2xl lg:max-w-5xl' 
          : 'max-w-2xl'
      } lg:px-8`}>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
            <X className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {currentStep === 'intro' && (
          <div className="text-center">
            <h1 className={`mt-4 text-3xl font-bold tracking-tight ${campaign.theme ? themes[campaign.theme].text : 'text-gray-900 dark:text-white'} sm:text-4xl`}>
              {campaign.name}
            </h1>
            <p className={`mt-4 text-base ${campaign.theme ? themes[campaign.theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
              {campaign.description}
            </p>
            <button
              onClick={goToNextStep}
              className={`mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                campaign.theme 
                  ? `${themes[campaign.theme].border} border-2 ${themes[campaign.theme].text} hover:bg-white/10` 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Get Started
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {currentStep === 'contact' && (
          <div>
            <h2 className={`text-2xl font-bold ${campaign.theme ? themes[campaign.theme].text : 'text-gray-900 dark:text-white'}`}>Contact Information</h2>
            <p className={`mt-2 text-sm ${campaign.theme ? themes[campaign.theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
              Please provide your contact details. This information will be kept private.
            </p>
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName" className={campaign.theme ? themes[campaign.theme].text : undefined}>First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={`mt-2 ${campaign.theme ? `${themes[campaign.theme].border} ${themes[campaign.theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className={campaign.theme ? themes[campaign.theme].text : undefined}>Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={`mt-2 ${campaign.theme ? `${themes[campaign.theme].border} ${themes[campaign.theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className={campaign.theme ? themes[campaign.theme].text : undefined}>Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`mt-2 ${campaign.theme ? `${themes[campaign.theme].border} ${themes[campaign.theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 'location' && (
          <div>
            <h2 className={`text-2xl font-bold ${campaign.theme ? themes[campaign.theme].text : 'text-gray-900 dark:text-white'}`}>Location</h2>
            <p className={`mt-2 text-sm ${campaign.theme ? themes[campaign.theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
              Please provide your zip code to help us understand our community better.
            </p>
            <div className="mt-8">
              <Label htmlFor="zipCode" className={campaign.theme ? themes[campaign.theme].text : undefined}>Zip code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                className={`mt-2 ${campaign.theme ? `${themes[campaign.theme].border} ${themes[campaign.theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
                maxLength={5}
                pattern="[0-9]*"
              />
            </div>
          </div>
        )}

        {currentStep === 'response' && (
          <div>
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
              {/* Questions Panel */}
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${campaign.theme ? themes[campaign.theme].text : 'text-gray-900 dark:text-white'}`}>Questions</h2>
                <p className={`mt-2 text-sm ${campaign.theme ? themes[campaign.theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
                  Choose one or more questions to answer in your video response.
                </p>
                <div className="mt-4 space-y-2 md:mt-6 md:space-y-4">
                  {campaign.surveyQuestions.map((question, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 rounded-lg border p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 cursor-pointer md:gap-3 md:p-4 ${
                        campaign.theme ? `${themes[campaign.theme].border} hover:bg-white/5` : 'border-gray-200'
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        campaign.theme 
                          ? 'bg-white/10 text-white' 
                          : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                      }`}>
                        {index + 1}
                      </div>
                      <p className={`text-base ${campaign.theme ? themes[campaign.theme].text : 'text-gray-900 dark:text-white'}`}>
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Recording Panel */}
              <div className="flex-1 lg:flex-none lg:w-[420px]">
                <h2 className={`text-2xl font-bold ${campaign.theme ? themes[campaign.theme].text : 'text-gray-900 dark:text-white'}`}>Record Response</h2>
                <p className={`mt-2 text-sm ${campaign.theme ? themes[campaign.theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
                  Choose one or more questions to answer in your video response.
                </p>
                <div className="mt-4 md:mt-6">
                    <label className={`relative flex items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${
                      campaign.theme 
                        ? `${themes[campaign.theme].border} hover:bg-white/5` 
                        : 'border-gray-300'
                    }`}>
                      {formData.videoUrl ? (
                        <div className="relative w-full h-full p-4">
                          <video
                            src={formData.videoUrl}
                            className="w-full h-full object-cover rounded-lg"
                            controls
                            playsInline
                          />
                          <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="absolute top-2 right-2 p-2 rounded-full bg-gray-900/80 text-white backdrop-blur-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <div className={`mb-4 rounded-full p-3 ${
                            campaign.theme 
                              ? themes[campaign.theme].input
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <Video className={`w-6 h-6 ${campaign.theme ? themes[campaign.theme].text : 'text-gray-500 dark:text-gray-400'}`} />
                          </div>
                          <p className={`text-base font-medium ${campaign.theme ? themes[campaign.theme].text : 'text-gray-900 dark:text-white'}`}>
                            Record a video answering your selected question(s)
                          </p>
                          <div className={`mt-1 text-xs ${campaign.theme ? themes[campaign.theme].subtext : 'text-gray-500 dark:text-gray-400'}`}>
                            <p className="font-medium">Maximum video length: 2 minutes</p>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="video/mp4,video/quicktime,video/x-m4v"
                        capture="user"
                        onChange={handleVideoUpload}
                      />
                    </label>
                    {videoDuration && formData.videoUrl && (
                      <div className={`mt-2 text-sm ${
                        videoDuration > MAX_VIDEO_DURATION
                          ? 'text-red-600 dark:text-red-400'
                          : campaign.theme ? themes[campaign.theme].text : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        Video length: {Math.floor(videoDuration / 60)}:{String(videoDuration % 60).padStart(2, '0')}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'success' && (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className={`mt-4 text-2xl font-bold ${campaign.theme ? themes[campaign.theme].text : 'text-gray-900 dark:text-white'}`}>Thank You!</h2>
            <p className={`mt-2 text-base ${campaign.theme ? themes[campaign.theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
              Your video has been uploaded successfully. We appreciate your participation!
            </p>
            <button
              onClick={() => window.close()}
              className={`mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                campaign.theme 
                  ? `${themes[campaign.theme].border} border-2 ${themes[campaign.theme].text} hover:bg-white/10` 
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Close Window
            </button>
          </div>
        )}

        {/* Navigation buttons */}
        {currentStep !== 'intro' && currentStep !== 'success' && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPreviousStep}
              disabled={isUploading}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                campaign.theme 
                  ? `${themes[campaign.theme].border} border-2 ${themes[campaign.theme].text} hover:bg-white/10` 
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            {currentStep === 'response' ? (
              <button
                onClick={handleSubmit}
                disabled={isUploading}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                  campaign.theme 
                    ? `${themes[campaign.theme].border} border-2 ${themes[campaign.theme].text} hover:bg-white/10` 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading... {uploadProgress}%
                  </span>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Video
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={goToNextStep}
                disabled={isUploading}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                  campaign.theme 
                    ? `${themes[campaign.theme].border} border-2 ${themes[campaign.theme].text} hover:bg-white/10` 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
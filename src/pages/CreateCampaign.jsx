import React, { useState, useRef } from 'react';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Upload, Plus, FileText, ChevronDown, HelpCircle, X, Sparkles } from 'lucide-react';
import { Iphone15Pro } from '../components/ui/iphone';
import { useNavigate } from 'react-router-dom';
import { SuccessModal } from '../components/ui/success-modal';

export default function CreateCampaign() {
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [successModal, setSuccessModal] = useState({ isOpen: false, campaignId: null, campaignName: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    businessName: '',
    website: '',
    email: '',
    phone: ''
  });
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const draftsRef = useRef(null);

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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddQuestion = () => {
    setSurveyQuestions([
      ...surveyQuestions,
      { id: surveyQuestions.length + 1, question: '' }
    ]);
  };

  const handleRemoveQuestion = (id) => {
    setSurveyQuestions(surveyQuestions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id, value) => {
    setSurveyQuestions(
      surveyQuestions.map(q => q.id === id ? { ...q, question: value } : q)
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          surveyQuestions: surveyQuestions.map(q => q.question)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create campaign');
      }

      const campaign = await response.json();
      // Reset form data
      setFormData({
        name: '',
        description: '',
        category: '',
        businessName: '',
        website: '',
        email: '',
        phone: ''
      });
      setSurveyQuestions([]);
      setPreviewImage(null);

      setSuccessModal({
        isOpen: true,
        campaignId: campaign.id,
        campaignName: formData.name
      });
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIGenerate = async () => {
  if (!aiPrompt.trim()) return;

  setIsGenerating(true);
  setAiError('');
  
  try {
    const idToken = await auth.currentUser.getIdToken();
    const response = await fetch(`${SERVER_URL}/campaign/generate-campaign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: aiPrompt }),
    });

    const data = await response.json();

    if (data.status === 'error') {
      setAiError(data.message || 'Failed to generate campaign');
      return;
    }

    setFormData({
      name: data.campaignData.name,
      description: data.campaignData.description,
      category: data.campaignData.category,
      businessName: data.campaignData.businessName,
      website: data.campaignData.website,
      email: data.campaignData.email,
      phone: data.campaignData.phone,
    });

    setSurveyQuestions(
      data.campaignData.surveyQuestions.map((question, index) => ({
        id: index + 1,
        question,
      }))
    );

    setIsAIModalOpen(false);
    setAiPrompt('');
  } catch (error) {
    console.error('Fetch error:', error);
    setAiError('Failed to connect to server. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <div className="p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Campaign</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Set up your campaign details and customize your survey questions.
          </p>
        </div>

        <div className="relative max-w-[800px]" ref={draftsRef}>
          <button
            onClick={() => setIsDraftsOpen(!isDraftsOpen)}
            className="w-full flex items-center gap-2 p-3 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors dark:bg-gray-800/50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <FileText className="w-4 h-4" />
            <span className="font-medium">2 drafts</span>
            <span className="ml-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <span>Click to view</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDraftsOpen ? 'rotate-180' : ''}`} />
            </span>
          </button>

          {isDraftsOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-lg border border-gray-200 shadow-lg z-10 dark:bg-gray-900 dark:border-gray-800">
              <div className="space-y-1">
                <button
                  className="w-full flex items-center gap-3 p-2 text-sm text-left text-gray-700 rounded hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => {
                    console.log('Load Summer Food Drive');
                    setIsDraftsOpen(false);
                  }}
                >
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  Summer Food Drive
                </button>
                <button
                  className="w-full flex items-center gap-3 p-2 text-sm text-left text-gray-700 rounded hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => {
                    console.log('Load Community Cleanup');
                    setIsDraftsOpen(false);
                  }}
                >
                  <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  Community Cleanup
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[800px,auto] gap-4">
          <Card className="w-full">
            <CardHeader>
              <div>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2 text-left transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-800 dark:group-hover:bg-gray-700">
                    <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Try our AI Campaign Creator
                  </span>
                  <div className="ml-auto">
                    <div className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      New
                    </div>
                  </div>
                </button>
              </div>
              
              {/* AI Campaign Creator Modal */}
              {isAIModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 mx-4">
                    <button
                      onClick={() => setIsAIModalOpen(false)}
                      className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    
                    <div className="mb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            AI Campaign Creator
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Describe your campaign and let AI do the work
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ai-prompt">Campaign Description</Label>
                        <textarea
                          id="ai-prompt"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="Example: Create a campaign for a local food bank's summer donation drive targeting young professionals..."
                          className="mt-2 block h-32 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10"
                        />
                      </div>
                      
                      {aiError && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
                          <X className="h-4 w-4" />
                          {aiError}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900/50 dark:bg-indigo-900/10">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                          <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                          </svg>
                        </div>
                        <p className="text-sm text-indigo-700 dark:text-indigo-400">
                          Our AI will generate campaign details, questions, and branding suggestions based on your description.
                        </p>
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsAIModalOpen(false)}
                          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAIGenerate}
                          disabled={!aiPrompt.trim() || isGenerating}
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:bg-indigo-500 disabled:opacity-50"
                        >
                          {isGenerating ? (
                            <>
                              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Generate Campaign
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  {/* Campaign Details */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="flex-1">
                      <Label htmlFor="name">Campaign Name</Label>
                      <Input
                        id="name"
                        name="campaign-title"
                        placeholder="Enter campaign name"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete="off"
                        data-form-type="other"
                        required
                      />
                    </div>
                    <div className="w-[200px]">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        id="theme"
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                      >
                        {Object.entries(themes).map(([key, theme]) => (
                          <option key={key} value={key}>{theme.name}</option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label>Campaign Image</Label>
                    <div className="mt-2">
                      <div className="flex items-center justify-center w-full min-h-[160px]">
                        <label className="relative flex items-center justify-center w-full h-full border-2 border-gray-200 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                          <div className="flex flex-col items-center justify-center p-6">
                            {previewImage ? (
                              <div className="relative w-40 h-40 group">
                                <img
                                  src={previewImage}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Campaign Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your campaign's purpose and goals"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Campaign Category</Label>
                    <Select 
                      id="category" 
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      <option value="political">Political Campaign</option>
                      <option value="social">Social Media Influencer</option>
                      <option value="nonprofit">Non-Profit Organization</option>
                      <option value="business">Business Marketing</option>
                      <option value="education">Educational Institution</option>
                    </Select>
                  </div>
                </div>

                {/* Survey Questions */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Label className="flex items-center gap-1.5">
                      Survey Questions
                      <button
                        type="button"
                        onClick={() => setIsHelpOpen(true)}
                        className="inline-flex items-center justify-center text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12" y2="17" />
                        </svg>
                      </button>
                    </Label>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                      Add Question
                    </button>
                    
                    {isHelpOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
                          <button
                            onClick={() => setIsHelpOpen(false)}
                            className="absolute right-4 top-4 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Creating Effective Survey Questions
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              We recommend making your questions broad and open-ended to let your members speak freely about their experiences. This approach often leads to more authentic and meaningful responses.
                            </p>
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Good Examples:</h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                  <li>• "What inspired you to join our cause?"</li>
                                  <li>• "How has our community impacted your life?"</li>
                                  <li>• "What's your favorite memory with us?"</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Tips:</h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                  <li>• Keep questions simple and clear</li>
                                  <li>• Avoid yes/no questions</li>
                                  <li>• Focus on personal experiences</li>
                                  <li>• Encourage storytelling</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {surveyQuestions.map((q) => (
                      <div key={q.id} className="flex gap-3">
                        <Input
                          value={q.question}
                          onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                          placeholder="Enter your survey question"
                          className="flex-1"
                        />
                        {surveyQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        placeholder="Enter business name"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Business Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="contact@business.com"
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-400">
                    <X className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </div>
                    ) : (
                      'Create Campaign'
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="hidden lg:block sticky top-6 h-[calc(100vh-3rem)] w-[500px] xl:block">
            <div className="flex flex-col items-center">
              <div className="scale-[0.8] origin-top xl:scale-[0.85]">
                <Iphone15Pro>
                  <div className={`h-full ${themes[selectedTheme].background} transition-colors duration-200`}>
                    <div className="flex flex-col h-full">
                      {/* Add padding to avoid camera area */}
                      <div className="h-[120px]" />
                      
                      {/* Logo or Campaign Image */}
                      <div className="flex justify-center mb-8">
                        {previewImage ? (
                          <img src={previewImage} alt="Campaign" className="w-20 h-20 rounded-full object-cover ring-4 ring-white/20" />
                        ) : (
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${themes[selectedTheme].border} border-2`}>
                            <Upload className={`w-8 h-8 ${themes[selectedTheme].text} opacity-50`} />
                          </div>
                        )}
                      </div>
                      
                      {/* Campaign Name */}
                      <div className="text-center mb-4">
                        <h1 className={`text-2xl font-bold ${themes[selectedTheme].text} mb-2`}>
                          {formData.name || 'Campaign Name'}
                        </h1>
                        <p className={`${themes[selectedTheme].subtext} text-sm`}>
                          {formData.businessName || 'Business Name'}
                        </p>
                      </div>
                      
                      {/* Current Question Display */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        <h2 className={`text-3xl font-bold ${themes[selectedTheme].text} mb-6 leading-tight`}>
                          {surveyQuestions[0]?.question || "What inspired you to join our cause?"}
                        </h2>
                        
                        <div className={`w-32 h-32 rounded-full ${themes[selectedTheme].border} border-2 flex items-center justify-center mb-8`}>
                          <div className={`w-28 h-28 rounded-full ${themes[selectedTheme].input} flex items-center justify-center`}>
                            <svg className={`w-12 h-12 ${themes[selectedTheme].text}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="3" fill="currentColor" />
                            </svg>
                          </div>
                        </div>

                        <button 
                          className={`px-8 py-3 rounded-full ${themes[selectedTheme].text} ${themes[selectedTheme].border} border-2 font-medium hover:bg-white/10 transition-colors`}
                        >
                          Begin Recording
                        </button>
                      </div>
                      
                      {/* Progress Indicator */}
                      <div className="mt-auto pt-6 flex justify-center gap-2">
                        {surveyQuestions.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === 0 ? themes[selectedTheme].text : `${themes[selectedTheme].border} bg-white/20`}`}
                          />
                        ))}
                      </div>
                      
                      {/* Footer */}
                      <div className="mt-6 pb-6 text-center">
                        <p className={`text-sm ${themes[selectedTheme].subtext}`}>
                          Question 1 of {surveyQuestions.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </Iphone15Pro>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Amplify. All rights reserved.
      </div>
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ isOpen: false, campaignId: null, campaignName: '' })}
        campaignId={successModal.campaignId}
        campaignName={successModal.campaignName}
      />
    </div>
  );
}
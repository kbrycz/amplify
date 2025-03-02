import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { SurveyQuestions } from '../components/create-campaign/SurveyQuestions';
import { DesignPage } from '../components/create-campaign/steps/DesignPage';
import { PhonePreview } from '../components/create-campaign/PhonePreview';

export default function CampaignSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('sunset');
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/campaign/campaigns/${id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }

      const data = await response.json();
      setCampaign(data);
      setSelectedTheme(data.theme || 'sunset');
      setSurveyQuestions(data.surveyQuestions?.map((q, i) => ({ id: i + 1, question: q })) || []);
      setPreviewImage(data.previewImage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('TODO: Save changes');
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading campaign settings..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/50">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
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
      <button
        onClick={() => navigate(`/app/campaigns/${id}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaign
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Campaign Settings</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure settings for {campaign?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[800px,auto] gap-6 items-start">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Settings</CardTitle>
              <CardDescription>Configure the basic settings for your campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">Campaign Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={campaign?.name}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={campaign?.description}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="status">Campaign Status</Label>
                <Select
                  id="status"
                  name="status"
                  defaultValue={campaign?.status || 'Active'}
                  className="mt-2"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="visibility">Campaign Visibility</Label>
                <Select
                  id="visibility"
                  name="visibility"
                  defaultValue={campaign?.visibility || 'public'}
                  className="mt-2"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="password">Password Protected</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Design Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Design</CardTitle>
              <CardDescription>Customize the look and feel of your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <DesignPage
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
              />
            </CardContent>
          </Card>

          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Configure campaign category and survey questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="category">Campaign Category</Label>
                <Select 
                  id="category" 
                  defaultValue={campaign?.category}
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

              <div>
                <Label htmlFor="subcategory">Category Type</Label>
                <Select 
                  id="subcategory" 
                  defaultValue={campaign?.subcategory}
                  required={campaign?.category === 'political'}
                  disabled={!campaign?.category}
                >
                  <option value="" disabled>Choose a category first</option>
                  {campaign?.category === 'political' && (
                    <>
                      <option value="federal">Federal</option>
                      <option value="state">State</option>
                      <option value="local">Local</option>
                    </>
                  )}
                </Select>
              </div>

              <SurveyQuestions
                surveyQuestions={surveyQuestions}
                handleAddQuestion={handleAddQuestion}
                handleRemoveQuestion={handleRemoveQuestion}
                handleQuestionChange={handleQuestionChange}
                setIsHelpOpen={setIsHelpOpen}
              />
            </CardContent>
          </Card>

          {/* Response Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Response Settings</CardTitle>
              <CardDescription>Configure how responses are collected and managed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="responseLimit">Response Limit</Label>
                <Input
                  id="responseLimit"
                  name="responseLimit"
                  type="number"
                  min="0"
                  defaultValue={campaign?.responseLimit || ''}
                  placeholder="Leave empty for unlimited"
                  className="mt-2"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Set a limit on the number of responses this campaign can receive
                </p>
              </div>

              <div>
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  name="notificationEmail"
                  type="email"
                  defaultValue={campaign?.notificationEmail || ''}
                  placeholder="Enter email for notifications"
                  className="mt-2"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Receive email notifications when new responses are submitted
                </p>
              </div>
            </CardContent>
          </Card>

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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>

        <PhonePreview
          selectedTheme={selectedTheme}
          previewImage={previewImage}
          formData={campaign}
          surveyQuestions={surveyQuestions}
          currentStep={3}
        />
      </div>

      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}
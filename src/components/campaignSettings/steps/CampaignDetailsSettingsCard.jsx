import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Info, Plus, Trash2, HelpCircle } from 'lucide-react';

export const CampaignDetailsSettingsCard = ({
  formData,
  handleInputChange,
  surveyQuestions,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsHelpOpen,
  hasExplainerVideo,
  setHasExplainerVideo,
  explainerVideo,
  setExplainerVideo
}) => {
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExplainerVideo(file);
    }
  };

  const handleRemoveVideo = () => {
    setExplainerVideo(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Campaign Details</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Update the survey questions and explainer video for your campaign.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Survey Questions</Label>
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
            Update the questions that will be asked in your survey. You can add up to 3 questions.
          </p>

          <div className="space-y-4">
            {surveyQuestions.map((question, index) => (
              <div key={question.id} className="relative">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`question-${question.id}`} className="sr-only">
                      Question {index + 1}
                    </Label>
                    <Textarea
                      id={`question-${question.id}`}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                      placeholder={`Enter question ${index + 1}`}
                      className="w-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="mt-2 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {surveyQuestions.length < 3 && (
              <button
                type="button"
                onClick={handleAddQuestion}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Explainer Video</Label>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Add an explainer video to your campaign.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="explainer-video-toggle"
                checked={hasExplainerVideo}
                onCheckedChange={setHasExplainerVideo}
              />
              <Label htmlFor="explainer-video-toggle" className="text-sm">
                {hasExplainerVideo ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </div>

          {hasExplainerVideo && (
            <div className="mt-4">
              {explainerVideo ? (
                <div className="relative">
                  <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-900/30">
                          <svg
                            className="w-5 h-5 text-primary-600 dark:text-primary-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 4v16M17 4v16M3 8h18M3 16h18"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {typeof explainerVideo === 'string'
                              ? 'Video URL'
                              : explainerVideo.name || 'Uploaded Video'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {typeof explainerVideo === 'string'
                              ? explainerVideo
                              : `${(explainerVideo.size / (1024 * 1024)).toFixed(2)} MB`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="video-url">Video URL</Label>
                  <div className="mt-1">
                    <Input
                      id="video-url"
                      type="text"
                      placeholder="Enter a YouTube or Vimeo URL"
                      value={typeof explainerVideo === 'string' ? explainerVideo : ''}
                      onChange={(e) => setExplainerVideo(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
                    <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                      Enter a YouTube or Vimeo URL. The video will be displayed at the top of your
                      survey.
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
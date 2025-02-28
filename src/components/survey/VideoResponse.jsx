import React from 'react';
import { Video, X } from 'lucide-react';

export function VideoResponse({ 
  campaign, 
  currentQuestion, 
  setCurrentQuestion, 
  formData, 
  handleVideoUpload, 
  handleRemoveVideo, 
  videoDuration,
  theme, 
  themes 
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
        {/* Questions Panel */}
        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>Questions</h2>
          <p className={`mt-2 text-sm ${theme ? themes[theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
            Choose one or more questions to answer in your video response.
          </p>
          <div className="mt-4 space-y-2 md:mt-6 md:space-y-4">
            {campaign.surveyQuestions.map((question, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 rounded-lg border p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 cursor-pointer md:gap-3 md:p-4 ${
                  theme ? `${themes[theme].border} hover:bg-white/5` : 'border-gray-200'
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  theme 
                    ? 'bg-white/10 text-white' 
                    : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                }`}>
                  {index + 1}
                </div>
                <p className={`text-base ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>
                  {question}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Video Recording Panel */}
        <div className="flex-1 lg:flex-none lg:w-[420px]">
          <h2 className={`text-2xl font-bold ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>Record Response</h2>
          <p className={`mt-2 text-sm ${theme ? themes[theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
            Choose one or more questions to answer in your video response.
          </p>
          <div className="mt-4 md:mt-6">
            <label className={`relative flex items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${
              theme 
                ? `${themes[theme].border} hover:bg-white/5` 
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
                    theme 
                      ? themes[theme].input
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Video className={`w-6 h-6 ${theme ? themes[theme].text : 'text-gray-500 dark:text-gray-400'}`} />
                  </div>
                  <p className={`text-base font-medium ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>
                    Record a video answering your selected question(s)
                  </p>
                  <div className={`mt-1 text-xs ${theme ? themes[theme].subtext : 'text-gray-500 dark:text-gray-400'}`}>
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
                videoDuration > 120
                  ? 'text-red-600 dark:text-red-400'
                  : theme ? themes[theme].text : 'text-gray-600 dark:text-gray-400'
              }`}>
                Video length: {Math.floor(videoDuration / 60)}:{String(videoDuration % 60).padStart(2, '0')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
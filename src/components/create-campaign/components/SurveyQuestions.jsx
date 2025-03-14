import React from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';

export function SurveyQuestions({
  surveyQuestions,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsHelpOpen,
  aiGeneratedFields,
  className = ''
}) {
  // Maximum number of questions allowed
  const MAX_QUESTIONS = 3;
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center">
        <div>
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
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            At least one question required (maximum {MAX_QUESTIONS})
          </div>
        </div>
        {surveyQuestions.length < MAX_QUESTIONS && (
          <button
            type="button"
            onClick={handleAddQuestion}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        )}
        {surveyQuestions.length >= MAX_QUESTIONS && (
          <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 italic">
            Maximum {MAX_QUESTIONS} questions allowed
          </div>
        )}
      </div>
      <div className="space-y-4">
        {surveyQuestions.map((q, index) => {
          const isAiGenerated = aiGeneratedFields?.[`question_${index}`];
          
          return (
            <div key={q.id} className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                  placeholder="Enter your survey question"
                  className={isAiGenerated ? "border-purple-300 dark:border-purple-500" : ""}
                />
                {isAiGenerated && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-medium">AI</span>
                  </div>
                )}
              </div>
              {surveyQuestions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
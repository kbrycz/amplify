import React from 'react';
import { Plus, X } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export function SurveyQuestions({
  surveyQuestions,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsHelpOpen
}) {
  return (
    <div className="space-y-4">
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
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">At least one question required</div>
        </div>
        <button
          type="button"
          onClick={handleAddQuestion}
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </button>
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
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
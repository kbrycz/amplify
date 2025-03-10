import React from 'react';
import { Label } from '../../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../ui/select';
import { SurveyQuestions } from '../SurveyQuestions';
import { Sparkles } from 'lucide-react';

const categorySubcategories = {
  political: [
    { value: 'federal', label: 'Federal' },
    { value: 'state', label: 'State' },
    { value: 'local', label: 'Local' }
  ],
  business: [
    { value: 'retail', label: 'Retail' },
    { value: 'service', label: 'Service' },
    { value: 'tech', label: 'Technology' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'other', label: 'Other' }
  ],
  nonprofit: [
    { value: 'environment', label: 'Environment' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Healthcare' },
    { value: 'social', label: 'Social Services' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'other', label: 'Other' }
  ],
  education: [
    { value: 'k12', label: 'K-12 School' },
    { value: 'university', label: 'University' },
    { value: 'college', label: 'College' },
    { value: 'vocational', label: 'Vocational School' },
    { value: 'other', label: 'Other' }
  ],
  social: [
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'tech', label: 'Technology' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'other', label: 'Other' }
  ]
};

export function CampaignDetails({
  formData,
  handleInputChange,
  surveyQuestions,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsHelpOpen,
  aiGeneratedFields
}) {
  const subcategories = formData.category ? categorySubcategories[formData.category] : null;

  const handleCategoryChange = (value) => {
    const event = {
      target: {
        id: 'category',
        value: value
      }
    };
    handleInputChange(event);
  };

  const handleSubcategoryChange = (value) => {
    const event = {
      target: {
        id: 'subcategory',
        value: value
      }
    };
    handleInputChange(event);
  };

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="category">Campaign Category *</Label>
        <div className="relative mt-2">
          <Select 
            id="category" 
            value={formData.category} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className={aiGeneratedFields?.category ? "border-purple-300 dark:border-purple-500" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select a category</SelectItem>
              <SelectItem value="political">Political Campaign</SelectItem>
              <SelectItem value="social">Social Media Influencer</SelectItem>
              <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
              <SelectItem value="business">Business Marketing</SelectItem>
              <SelectItem value="education">Educational Institution</SelectItem>
            </SelectContent>
          </Select>
          {aiGeneratedFields?.category && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium">AI</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="subcategory">{formData.category === 'political' ? 'Representative Level' : 'Category Type'}</Label>
        <div className="relative mt-2">
          <Select 
            id="subcategory" 
            value={formData.subcategory}
            onValueChange={handleSubcategoryChange}
            disabled={!formData.category}
          >
            <SelectTrigger className={aiGeneratedFields?.subcategory ? "border-purple-300 dark:border-purple-500" : ""}>
              <SelectValue placeholder={formData.category ? "Select a level" : "Choose a category first"} />
            </SelectTrigger>
            <SelectContent>
              {!subcategories ? (
                <SelectItem value="">Choose a category first</SelectItem>
              ) : (
                <>
                  <SelectItem value="">Select a level</SelectItem>
                  {subcategories.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          {aiGeneratedFields?.subcategory && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium">AI</span>
            </div>
          )}
        </div>
      </div>

      <SurveyQuestions
        surveyQuestions={surveyQuestions}
        handleAddQuestion={handleAddQuestion}
        handleRemoveQuestion={handleRemoveQuestion}
        handleQuestionChange={handleQuestionChange}
        setIsHelpOpen={setIsHelpOpen}
        aiGeneratedFields={aiGeneratedFields}
      />
    </div>
  );
}
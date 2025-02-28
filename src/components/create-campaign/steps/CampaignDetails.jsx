import React from 'react';
import { Label } from '../../ui/label';
import { Select } from '../../ui/select';
import { SurveyQuestions } from '../SurveyQuestions';

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
  setIsHelpOpen
}) {
  const subcategories = formData.category ? categorySubcategories[formData.category] : null;

  return (
    <div className="space-y-8">
      <div>
        <Label htmlFor="category">Campaign Category *</Label>
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

      <div>
        <Label htmlFor="subcategory">{formData.category === 'political' ? 'Representative Level' : 'Category Type'}</Label>
        <Select 
          id="subcategory" 
          value={formData.subcategory}
          onChange={handleInputChange}
          required={formData.category === 'political'}
          disabled={!formData.category}
        >
          <option value="" disabled>
            {formData.category 
              ? 'Select a level' 
              : 'Choose a category first'}
          </option>
          {subcategories?.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>


      <SurveyQuestions
        surveyQuestions={surveyQuestions}
        handleAddQuestion={handleAddQuestion}
        handleRemoveQuestion={handleRemoveQuestion}
        handleQuestionChange={handleQuestionChange}
        setIsHelpOpen={setIsHelpOpen}
      />
    </div>
  );
}
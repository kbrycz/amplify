import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { SurveyQuestions } from '../create-campaign/SurveyQuestions';

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

export default function CampaignDetailsCard({
  campaign,
  surveyQuestions,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsHelpOpen,
}) {
  const subcategories = campaign?.category ? categorySubcategories[campaign.category] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Details</CardTitle>
        <CardDescription>
          Configure campaign category and survey questions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="category">Campaign Category</Label>
          <Select id="category" value={campaign?.category || ""}>
            <SelectTrigger>
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
        </div>
        <div>
          <Label htmlFor="subcategory">Category Type</Label>
          <Select
            id="subcategory"
            value={campaign?.subcategory || ""}
            disabled={!campaign?.category}
          >
            <SelectTrigger>
              <SelectValue placeholder={campaign?.category ? "Select a level" : "Choose a category first"} />
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
  );
}
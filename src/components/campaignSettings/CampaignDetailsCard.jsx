import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { SurveyQuestions } from '../create-campaign/SurveyQuestions';

export default function CampaignDetailsCard({
  campaign,
  surveyQuestions,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  setIsHelpOpen,
}) {
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
          <Select id="category" defaultValue={campaign?.category} required>
            <option value="" disabled>
              Select a category
            </option>
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
            <option value="" disabled>
              Choose a category first
            </option>
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
  );
}
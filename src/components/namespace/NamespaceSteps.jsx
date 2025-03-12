import React from 'react';
import { Card, CardContent } from '../ui/card';
import NamespaceBasicInfo from './NamespaceBasicInfo';
import NamespaceMembers from './NamespaceMembers';
import NamespaceConfirmation from './NamespaceConfirmation';
import { StepNavigation } from '../shared/templates/StepNavigation';

const steps = [
  { name: 'Namespace Details' },
  { name: 'Members & Permissions' },
  { name: 'Confirmation' }
];

export default function NamespaceSteps({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  members,
  setMembers,
  currentUser,
  isSubmitting,
  handleSubmit,
  isEditMode = false,
  finalStepText = "Create Namespace"
}) {
  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(e);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <Card className="w-full">
      <CardContent>
        <form onSubmit={(e) => {
          if (currentStep !== steps.length - 1) {
            e.preventDefault();
            handleNext(e);
          } else {
            handleSubmit(e);
          }
        }} className="space-y-8">
          {currentStep === 0 && (
            <NamespaceBasicInfo 
              formData={formData} 
              setFormData={setFormData} 
              isEditMode={isEditMode}
            />
          )}
          
          {currentStep === 1 && (
            <NamespaceMembers 
              members={members} 
              setMembers={setMembers} 
              currentUser={currentUser}
              isEditMode={isEditMode}
            />
          )}
          
          {currentStep === 2 && (
            <NamespaceConfirmation
              formData={formData}
              members={members}
              isEditMode={isEditMode}
            />
          )}
          
          <div className="mt-8">
            <StepNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isSubmitting={isSubmitting}
              formData={formData}
              isStepValid={
                currentStep === 0 ? Boolean(formData.name?.trim()) : 
                currentStep === 1 ? members.length > 0 : 
                true
              }
              finalStepText={finalStepText}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
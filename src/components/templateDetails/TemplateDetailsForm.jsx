import React from 'react';
import { Save, Trash2 } from 'lucide-react';
import BasicInfoCard from './BasicInfoCard';
import CaptionSettingsCard from './CaptionSettingsCard';
import OutroSettingsCard from './OutroSettingsCard';

export default function TemplateDetailsForm({
  template,
  handleSubmit,
  handleInputChange,
  isSaving,
  isDeleting,
  successMessage,
  error,
  selectedTheme,
  setSelectedTheme,
  selectedCaptionStyle,
  setSelectedCaptionStyle,
  selectedOutroTheme,
  setSelectedOutroTheme,
  outroLogo,
  setOutroLogo,
  customOutroColor,
  setCustomOutroColor,
  outroText,
  setOutroText,
  outroTextColor,
  setOutroTextColor,
  showOutro,
  setShowOutro,
  setIsDeleteModalOpen,
  outroSectionRef
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicInfoCard 
        template={template}
        handleInputChange={handleInputChange}
      />
      
      <CaptionSettingsCard
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        selectedCaptionStyle={selectedCaptionStyle}
        setSelectedCaptionStyle={setSelectedCaptionStyle}
      />
      
      <div ref={outroSectionRef} id="outro-section">
        <OutroSettingsCard
          selectedOutroTheme={selectedOutroTheme}
          setSelectedOutroTheme={setSelectedOutroTheme}
          outroLogo={outroLogo}
          setOutroLogo={setOutroLogo}
          customOutroColor={customOutroColor}
          setCustomOutroColor={setCustomOutroColor}
          outroText={outroText}
          setOutroText={setOutroText}
          outroTextColor={outroTextColor}
          setOutroTextColor={setOutroTextColor}
          showOutro={showOutro}
          setShowOutro={setShowOutro}
        />
      </div>

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

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete Template
            </>
          )}
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
} 
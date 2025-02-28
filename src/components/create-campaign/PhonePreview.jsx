import React from 'react';
import { Upload } from 'lucide-react';
import { Iphone15Pro } from '../ui/iphone';

export function PhonePreview({ 
  selectedTheme, 
  themes, 
  previewImage, 
  formData, 
  surveyQuestions 
}) {
  return (
    <div className="hidden lg:block sticky top-6 h-[calc(100vh-3rem)] w-[500px] xl:block">
      <div className="flex flex-col items-center">
        <div className="scale-[0.8] origin-top xl:scale-[0.85]">
          <Iphone15Pro>
            <div className={`h-full ${themes[selectedTheme].background} transition-colors duration-200`}>
              <div className="flex flex-col h-full">
                {/* Add padding to avoid camera area */}
                <div className="h-[120px]" />
                
                {/* Logo or Campaign Image */}
                <div className="flex justify-center mb-8">
                  {previewImage ? (
                    <img src={previewImage} alt="Campaign" className="w-20 h-20 rounded-full object-cover ring-4 ring-white/20" />
                  ) : (
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${themes[selectedTheme].border} border-2`}>
                      <Upload className={`w-8 h-8 ${themes[selectedTheme].text} opacity-50`} />
                    </div>
                  )}
                </div>
                
                {/* Campaign Name */}
                <div className="text-center mb-4">
                  <h1 className={`text-2xl font-bold ${themes[selectedTheme].text} mb-2`}>
                    {formData.name || 'Campaign Name'}
                  </h1>
                  <p className={`${themes[selectedTheme].subtext} text-sm`}>
                    {formData.businessName || 'Business Name'}
                  </p>
                </div>
                
                {/* Current Question Display */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <h2 className={`text-3xl font-bold ${themes[selectedTheme].text} mb-6 leading-tight`}>
                    {surveyQuestions[0]?.question || "What inspired you to join our cause?"}
                  </h2>
                  
                  <div className={`w-32 h-32 rounded-full ${themes[selectedTheme].border} border-2 flex items-center justify-center mb-8`}>
                    <div className={`w-28 h-28 rounded-full ${themes[selectedTheme].input} flex items-center justify-center`}>
                      <svg className={`w-12 h-12 ${themes[selectedTheme].text}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  <button 
                    className={`px-8 py-3 rounded-full ${themes[selectedTheme].text} ${themes[selectedTheme].border} border-2 font-medium hover:bg-white/10 transition-colors`}
                  >
                    Begin Recording
                  </button>
                </div>
                
                {/* Progress Indicator */}
                <div className="mt-auto pt-6 flex justify-center gap-2">
                  {surveyQuestions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${index === 0 ? themes[selectedTheme].text : `${themes[selectedTheme].border} bg-white/20`}`}
                    />
                  ))}
                </div>
                
                {/* Footer */}
                <div className="mt-6 pb-6 text-center">
                  <p className={`text-sm ${themes[selectedTheme].subtext}`}>
                    Question 1 of {surveyQuestions.length}
                  </p>
                </div>
              </div>
            </div>
          </Iphone15Pro>
        </div>
      </div>
    </div>
  );
}
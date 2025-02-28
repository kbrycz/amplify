import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { X, ChevronDown } from 'lucide-react';
import { SERVER_URL } from '../../lib/firebase';

export function LocationForm({ formData, handleInputChange, theme, themes, onRepsLoaded }) {
  const [showReps, setShowReps] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [representatives, setRepresentatives] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const isFormValid = formData.zipCode?.match(/^\d{5}$/);

  const handleFindReps = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please enter a valid 5-digit zip code');
      onRepsLoaded(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${SERVER_URL}/representatives/${formData.zipCode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch representatives');
      }
      const data = await response.json();
      setRepresentatives(data);
      setShowReps(true);
      onRepsLoaded(true); // Signal that reps were loaded successfully
      onRepsLoaded(true); // Signal that reps were loaded successfully
    } catch (err) {
      console.error('Error fetching representatives:', err);
      setError('Failed to fetch representatives. Please try again.');
      onRepsLoaded(false); // Signal that reps failed to load
      onRepsLoaded(false); // Signal that reps failed to load
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearZipCode = () => {
    handleInputChange({ target: { name: 'zipCode', value: '' } });
    setShowReps(false);
    setRepresentatives(null);
    onRepsLoaded(false); // Reset reps loaded state
    onRepsLoaded(false); // Reset reps loaded state
    setError(null);
    setExpandedSection(null);
  };

  const RepresentativeCard = ({ name, party, office, phones, urls }) => (
    <div className={`p-4 rounded-lg ${theme ? themes[theme].input : 'bg-white dark:bg-gray-800'} ${theme ? themes[theme].border : 'border border-gray-200 dark:border-gray-700'}`}>
      <h4 className={`font-medium ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>{name}</h4>
      <p className={`text-sm mt-1 ${theme ? themes[theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
        {office || party}
      </p>
      {phones?.[0] && (
        <p className={`text-sm mt-2 ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>
          📞 {phones[0]}
        </p>
      )}
      {urls?.[0] && (
        <a
          href={urls[0]}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm mt-1 block hover:underline ${theme ? themes[theme].text : 'text-blue-600 dark:text-blue-400'}`}
        >
          🌐 Official Website
        </a>
      )}
    </div>
  );

  return (
    <div>
      <h2 className={`text-2xl font-bold ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>Location</h2>
      <p className={`mt-2 text-sm ${theme ? themes[theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
        Please provide your zip code to help us understand our community better.
      </p>

      <div className="mt-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="zipCode" className={theme ? themes[theme].text : undefined}>Zip code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              required
              value={formData.zipCode}
              onChange={handleInputChange}
              maxLength={5}
              pattern="[0-9]*"
              placeholder="Enter zip code"
              className={`mt-2 ${theme ? `${themes[theme].border} ${themes[theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
            />
          </div>
          <div className="flex items-end gap-2">
            {formData.zipCode && (
              <button
                onClick={handleClearZipCode}
                className={`mb-[2px] p-2.5 rounded-lg ${
                  theme 
                    ? `${themes[theme].border} border-2 ${themes[theme].text} hover:bg-white/10` 
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleFindReps}
              disabled={!isFormValid}
              className={`mb-[2px] px-4 py-2.5 rounded-lg font-medium ${
                theme 
                  ? `${themes[theme].border} border-2 ${themes[theme].text} hover:bg-white/10` 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loading...' : 'Find Representatives'}
            </button>
          </div>
        </div>

        {error && (
          <div className={`mt-4 rounded-lg border p-4 ${
            theme 
              ? `${themes[theme].border} bg-black/20` 
              : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/50'
          }`}>
            <div className="flex items-start">
              <div className={`mr-3 flex-shrink-0 ${
                theme 
                  ? themes[theme].text 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                <X className="h-5 w-5" />
              </div>
              <div>
                <h3 className={`text-sm font-medium ${
                  theme 
                    ? themes[theme].text 
                    : 'text-red-800 dark:text-red-200'
                }`}>Error</h3>
                <div className={`mt-2 text-sm ${
                  theme 
                    ? themes[theme].subtext 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {showReps && representatives && (
          <div className="mt-8 space-y-6">
            {/* Federal Representatives */}
            <div>
              {(representatives.federal.senators.length > 0 || representatives.federal.representatives.length > 0) && (
                <>
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'federal' ? null : 'federal')}
                    className={`flex items-center justify-between w-full text-left p-4 rounded-lg ${
                      theme 
                        ? `${themes[theme].border} border-2 ${themes[theme].text}` 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <span className="font-medium">Federal Representatives</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'federal' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSection === 'federal' && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {representatives.federal.senators.map((senator, index) => (
                        <RepresentativeCard key={`senator-${index}`} {...senator} office="U.S. Senator" />
                      ))}
                      {representatives.federal.representatives.map((rep, index) => (
                        <RepresentativeCard key={`rep-${index}`} {...rep} office="U.S. Representative" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* State Representatives */}
            <div>
              {(representatives.state.senators.length > 0 || representatives.state.representatives.length > 0) && (
                <>
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'state' ? null : 'state')}
                    className={`flex items-center justify-between w-full text-left p-4 rounded-lg ${
                      theme 
                        ? `${themes[theme].border} border-2 ${themes[theme].text}` 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <span className="font-medium">State Representatives</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'state' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSection === 'state' && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {representatives.state.senators.map((senator, index) => (
                        <RepresentativeCard key={`state-senator-${index}`} {...senator} office="State Senator" />
                      ))}
                      {representatives.state.representatives.map((rep, index) => (
                        <RepresentativeCard key={`state-rep-${index}`} {...rep} office="State Representative" />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Local Representatives */}
            <div>
              {representatives.local.length > 0 && (
                <>
                  <button
                    onClick={() => setExpandedSection(expandedSection === 'local' ? null : 'local')}
                    className={`flex items-center justify-between w-full text-left p-4 rounded-lg ${
                      theme 
                        ? `${themes[theme].border} border-2 ${themes[theme].text}` 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <span className="font-medium">Local Representatives</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedSection === 'local' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedSection === 'local' && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {representatives.local.map((official, index) => (
                        <RepresentativeCard key={`local-${index}`} {...official} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
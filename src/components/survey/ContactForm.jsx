import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

export function ContactForm({ formData, handleInputChange, theme, themes }) {
  return (
    <div>
      <h2 className={`text-2xl font-bold ${theme ? themes[theme].text : 'text-gray-900 dark:text-white'}`}>Contact Information</h2>
      <p className={`mt-2 text-sm ${theme ? themes[theme].subtext : 'text-gray-600 dark:text-gray-400'}`}>
        Please provide your contact details. This information will be kept private.
      </p>
      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="firstName" className={theme ? themes[theme].text : undefined}>First name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className={`mt-2 ${theme ? `${themes[theme].border} ${themes[theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
            />
          </div>
          <div>
            <Label htmlFor="lastName" className={theme ? themes[theme].text : undefined}>Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className={`mt-2 ${theme ? `${themes[theme].border} ${themes[theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email" className={theme ? themes[theme].text : undefined}>Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={`mt-2 ${theme ? `${themes[theme].border} ${themes[theme].input} text-white placeholder:text-white/50 focus:ring-white/20` : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'}`}
          />
        </div>
      </div>
    </div>
  );
}
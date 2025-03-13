import React, { useEffect } from 'react';
import { Card } from '../../ui/card';
import { Building2, Users, GraduationCap, LandmarkIcon, Church, Vote, CheckCircle2 } from 'lucide-react';
import { Label } from '../../ui/label';

export function CategorySelection({ formData, setFormData, handleNext }) {
  // Add a useEffect to log the current category when the component mounts or formData changes
  useEffect(() => {
    console.log('CategorySelection rendered with category:', formData.category);
    
    // We no longer reset the category to null when it's 'other'
    // This helps preserve the subcategory selection when navigating back and forth
  }, [formData.category]);

  const categories = [
    {
      id: 'political',
      name: 'Political Campaigns',
      icon: <Vote className="w-8 h-8 text-white" />,
      description: 'For candidates, PACs, and ballot initiatives.',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      id: 'government',
      name: 'Government Offices & Legislatures',
      icon: <LandmarkIcon className="w-8 h-8 text-white" />,
      description: 'For Congressional, State, & Local Offices highlighting constituent services and policy impact.',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      id: 'trade',
      name: 'Trade & Professional Associations',
      icon: <Building2 className="w-8 h-8 text-white" />,
      description: 'For Trade Associations, Unions, and Professional Groups',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      id: 'advocacy',
      name: 'Advocacy Groups',
      icon: <Users className="w-8 h-8 text-white" />,
      description: 'For Cause-Based Organizations, Grassroots Movements, and Public Policy Groups.',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      id: 'religious',
      name: 'Churches & Faith-Based Organizations',
      icon: <Church className="w-8 h-8 text-white" />,
      description: 'For religious groups engaging members, sharing faith stories, and driving involvement.',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      id: 'education',
      name: 'Universities, Schools, & Alumni Groups',
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      description: 'For educational institutions engaging students, alumni, and donors.',
      color: 'bg-primary-500 hover:bg-primary-600'
    }
  ];

  const handleCategorySelect = (categoryId) => {
    // Toggle selection - if already selected, deselect it
    if (formData.category === categoryId) {
      setFormData(prev => ({
        ...prev,
        category: null
      }));
    } else {
      // If selecting a different category, reset the subcategory
      const shouldResetSubcategory = formData.category !== null && formData.category !== categoryId;
      
      setFormData(prev => ({
        ...prev,
        category: categoryId,
        // Only reset subcategory if changing to a different category
        ...(shouldResetSubcategory ? { subcategory: null } : {})
      }));
      
      if (shouldResetSubcategory) {
        console.log('Category changed, resetting subcategory');
      }
    }
  };

  const handleContinue = () => {
    if (formData.category) {
      // If a category is selected, go to the template selection step
      handleNext();
    } else {
      // If no category is selected, set a default category of "other" and skip to the design step
      setFormData(prev => ({
        ...prev,
        category: 'other'
      }));
      
      // Skip the template step and go directly to the design step
      handleNext();
      handleNext();
    }
  };

  const handleSkipTemplate = () => {
    // Set category to "other" if not already set
    if (!formData.category) {
      setFormData(prev => ({
        ...prev,
        category: 'other'
      }));
    }
    
    // Skip the template step and go directly to the design step
    handleNext();
    handleNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Campaign Category</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Choose a category that best fits your organization or campaign. This will help us provide relevant templates and questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all duration-200 border-2 ${
              formData.category === category.id 
                ? 'border-primary-500 dark:border-primary-400 shadow-md bg-primary-50 dark:bg-primary-900/20' 
                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-md'
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            <div className="p-6 flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                formData.category === category.id 
                  ? 'bg-primary-600 dark:bg-primary-700' 
                  : category.color
              }`}>
                {category.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${
                    formData.category === category.id 
                      ? 'text-primary-700 dark:text-primary-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>{category.name}</h3>
                  {formData.category === category.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
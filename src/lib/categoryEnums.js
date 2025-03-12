// Category and subcategory enums for use in form submissions
// These match the keys in the campaignQuestions.js file

// Category enum
export const CATEGORIES = {
  POLITICAL: 'political',
  GOVERNMENT: 'government',
  TRADE: 'trade',
  ADVOCACY: 'advocacy',
  RELIGIOUS: 'religious',
  EDUCATION: 'education',
  OTHER: 'other'
};

// Subcategory enums by category
export const SUBCATEGORIES = {
  // Political subcategories
  POLITICAL: {
    VOTER_TESTIMONIALS: 'voter_testimonials',
    CALL_TO_ACTION: 'call_to_action',
    ENDORSEMENTS: 'endorsements',
    ISSUE_SPOTLIGHTS: 'issue_spotlights',
    CUSTOM: 'custom'
  },
  
  // Government subcategories
  GOVERNMENT: {
    SUCCESS_STORIES: 'success_stories',
    LEGISLATIVE_IMPACT: 'legislative_impact',
    PUBLIC_SERVICE: 'public_service',
    COMMUNITY_RECOGNITION: 'community_recognition',
    CUSTOM: 'custom'
  },
  
  // Trade subcategories
  TRADE: {
    MEMBER_TESTIMONIALS: 'member_testimonials',
    POLICY_IMPACT: 'policy_impact',
    CAREER_SPOTLIGHTS: 'career_spotlights',
    ADVOCACY_OUTREACH: 'advocacy_outreach',
    CUSTOM: 'custom'
  },
  
  // Advocacy subcategories
  ADVOCACY: {
    IMPACT_STORIES: 'impact_stories',
    AWARENESS_APPEALS: 'awareness_appeals',
    CALL_TO_GOVERNMENT: 'call_to_government',
    FUNDRAISING: 'fundraising',
    CUSTOM: 'custom'
  },
  
  // Religious subcategories
  RELIGIOUS: {
    TESTIMONIES: 'testimonies',
    VOLUNTEER_SPOTLIGHTS: 'volunteer_spotlights',
    FUNDRAISING_APPEALS: 'fundraising_appeals',
    EVENT_PROMOTION: 'event_promotion',
    CUSTOM: 'custom'
  },
  
  // Education subcategories
  EDUCATION: {
    TESTIMONIALS: 'testimonials',
    FUNDRAISING_APPEALS: 'fundraising_appeals',
    EVENT_RECAPS: 'event_recaps',
    CAREER_SUCCESS: 'career_success',
    POLICY_ADVOCACY: 'policy_advocacy',
    CUSTOM: 'custom'
  }
};

// Helper function to get all category values
export function getAllCategoryValues() {
  return Object.values(CATEGORIES);
}

// Helper function to get all subcategory values for a given category
export function getSubcategoryValues(category) {
  if (!category || !SUBCATEGORIES[category.toUpperCase()]) {
    return [];
  }
  return Object.values(SUBCATEGORIES[category.toUpperCase()]);
}

// Helper function to validate if a category is valid
export function isValidCategory(category) {
  return getAllCategoryValues().includes(category);
}

// Helper function to validate if a subcategory is valid for a given category
export function isValidSubcategory(category, subcategory) {
  if (!category || !subcategory) return false;
  
  const validSubcategories = getSubcategoryValues(category);
  return validSubcategories.includes(subcategory);
} 
import React, { useEffect } from 'react';
import { Card } from '../../ui/card';
import { MessageSquare, Users, Award, FileText, CheckCircle2 } from 'lucide-react';

export function SubcategorySelection({ formData, setFormData, handleNext }) {
  // Add a useEffect to log the current subcategory when the component mounts or formData changes
  useEffect(() => {
    console.log('SubcategorySelection rendered with subcategory:', formData.subcategory);
    
    // If we're coming back to this step and subcategory is 'custom', reset it to null
    // This ensures the button shows "Continue without example questions"
    if (formData.subcategory === 'custom' || formData.subcategory === undefined) {
      console.log('Resetting subcategory to null to show "Continue without example questions" button');
      setFormData(prev => ({
        ...prev,
        subcategory: null
      }));
    }
  }, []);  // Only run on mount

  // Define subcategories for each main category
  const subcategories = {
    political: [
      {
        id: 'voter_testimonials',
        name: 'Voter & Supporter Testimonials',
        icon: <Users className="w-8 h-8 text-white" />,
        description: 'Collect testimonials from supporters about why they support your candidate or ballot measure.',
        questions: [
          'Why do you support [Candidate Name] or [Ballot Measure]?',
          'What issue is most important to you in this election?',
          'How do you think [Candidate Name] will make a difference?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'call_to_action',
        name: 'Call-to-Action Videos',
        icon: <MessageSquare className="w-8 h-8 text-white" />,
        description: 'Encourage voters to take action with compelling video messages.',
        questions: [
          'Why is it important for people to vote in this election?',
          'What message would you send to undecided voters?',
          'What would you say to encourage others to sign the petition or get involved?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'endorsements',
        name: 'Endorsement Videos',
        icon: <Award className="w-8 h-8 text-white" />,
        description: 'Showcase endorsements from community leaders and supporters.',
        questions: [
          'Why are you endorsing [Candidate Name]?',
          'What qualities make [Candidate Name] the right choice for this position?',
          'What impact do you believe [Candidate Name] will have on our community?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'issue_spotlights',
        name: 'Campaign Issue Spotlights',
        icon: <FileText className="w-8 h-8 text-white" />,
        description: 'Highlight specific issues that matter to your campaign and voters.',
        questions: [
          'Why is [specific issue] so important to you?',
          'How has this issue impacted your life or community?',
          'What change would you like to see regarding this issue?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      }
    ],
    government: [
      {
        id: 'success_stories',
        name: 'Constituent Success Stories',
        icon: <Users className="w-8 h-8 text-white" />,
        description: 'Share stories of how government services have helped constituents.',
        questions: [
          'What government service or program helped you?',
          'How did it make a difference in your life?',
          'What would you say to others who may need this service?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'legislative_impact',
        name: 'Legislative Impact Stories',
        icon: <FileText className="w-8 h-8 text-white" />,
        description: 'Highlight the real-world impact of legislation and policies.',
        questions: [
          'How has [specific law or policy] affected you?',
          'What changes have you seen because of this policy?',
          'Why is it important for lawmakers to hear stories like yours?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'public_service',
        name: 'Public Service Announcements',
        icon: <MessageSquare className="w-8 h-8 text-white" />,
        description: 'Create announcements about important government services and programs.',
        questions: [
          'What is one important message you\'d like to share with our community?',
          'What do people need to know about [specific program or service]?',
          'How can people take advantage of [government program]?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'community_recognition',
        name: 'Community Recognition & Spotlights',
        icon: <Award className="w-8 h-8 text-white" />,
        description: 'Recognize community members and organizations making a difference.',
        questions: [
          'Who in your community deserves recognition for their work?',
          'How has this person or organization positively impacted your area?',
          'What would you say to encourage others to support their efforts?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      }
    ],
    trade: [
      {
        id: 'member_testimonials',
        name: 'Member Testimonials',
        icon: <Users className="w-8 h-8 text-white" />,
        description: 'Showcase testimonials from association members about the value of membership.',
        questions: [
          'What impact has [Association Name] had on your career or business?',
          'How has being a member helped you navigate challenges in your industry?',
          'Why would you encourage others to join [Association Name]?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'policy_impact',
        name: 'Policy Impact Stories',
        icon: <FileText className="w-8 h-8 text-white" />,
        description: 'Highlight how policies and regulations affect your industry.',
        questions: [
          'How has [specific legislation or regulation] affected your work?',
          'What challenges does your industry face due to current policies?',
          'What would you say to lawmakers about improving industry regulations?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'career_spotlights',
        name: 'Career Spotlights',
        icon: <Award className="w-8 h-8 text-white" />,
        description: 'Feature professionals in your industry and their career journeys.',
        questions: [
          'What inspired you to join this industry?',
          'What advice would you give to someone considering a career in your field?',
          'What\'s one thing you love about your profession?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'advocacy_outreach',
        name: 'Advocacy & Legislative Outreach',
        icon: <MessageSquare className="w-8 h-8 text-white" />,
        description: 'Create content to advocate for your industry with policymakers.',
        questions: [
          'What policy changes would benefit your industry the most?',
          'Why is it important for professionals like you to have a voice in policymaking?',
          'What would you say to lawmakers about supporting your industry?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      }
    ],
    advocacy: [
      {
        id: 'impact_stories',
        name: 'Personal Impact Stories',
        icon: <Users className="w-8 h-8 text-white" />,
        description: 'Share personal stories about how issues affect individuals and families.',
        questions: [
          'How has [specific issue] affected you or your family?',
          'Why is this cause important to you?',
          'What message do you want to share with others about this issue?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'awareness_appeals',
        name: 'Awareness & Action Appeals',
        icon: <MessageSquare className="w-8 h-8 text-white" />,
        description: 'Create content to raise awareness and encourage action on important issues.',
        questions: [
          'What do people need to know about [cause or issue]?',
          'Why is it urgent to take action now?',
          'What simple action can people take today to make a difference?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'call_to_government',
        name: 'Call-to-Government',
        icon: <FileText className="w-8 h-8 text-white" />,
        description: 'Encourage supporters to contact elected officials about important issues.',
        questions: [
          'What message would you like to send to lawmakers about [issue]?',
          'How has this policy affected your life?',
          'Why should elected officials take action on this?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'fundraising',
        name: 'Fundraising & Grassroots Mobilization',
        icon: <Award className="w-8 h-8 text-white" />,
        description: 'Create content to support fundraising and volunteer recruitment efforts.',
        questions: [
          'Why is it important to support this cause financially?',
          'How has donor support made a difference in this movement?',
          'What would you say to encourage someone to contribute or volunteer?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      }
    ],
    religious: [
      {
        id: 'testimonies',
        name: 'Testimonies & Sermon Reflections',
        icon: <MessageSquare className="w-8 h-8 text-white" />,
        description: 'Collect testimonies and reflections on faith messages.',
        questions: [
          'What\'s one takeaway from today\'s message that spoke to you?',
          'How has your faith journey been impacted by [Church Name]?',
          'Why is [specific biblical message] meaningful to you?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'volunteer_spotlights',
        name: 'Volunteer & Ministry Spotlights',
        icon: <Users className="w-8 h-8 text-white" />,
        description: 'Highlight volunteers and ministries making a difference.',
        questions: [
          'Why do you serve at [Church Name]?',
          'What\'s one memorable experience you\'ve had while volunteering?',
          'How has serving others deepened your faith?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'fundraising_appeals',
        name: 'Fundraising & Giving Appeals',
        icon: <Award className="w-8 h-8 text-white" />,
        description: 'Create content to support fundraising and stewardship initiatives.',
        questions: [
          'Why do you give to [Church Name]?',
          'How has your generosity made an impact in the church or community?',
          'What would you say to encourage others to support this ministry?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'event_promotion',
        name: 'Event Promotion & Invitations',
        icon: <FileText className="w-8 h-8 text-white" />,
        description: 'Promote church events and encourage attendance.',
        questions: [
          'Why are you excited about [upcoming event] at [Church Name]?',
          'What can people expect when they attend this event?',
          'Who would you invite to join you and why?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      }
    ],
    education: [
      {
        id: 'testimonials',
        name: 'Student & Alumni Testimonials',
        icon: <Users className="w-8 h-8 text-white" />,
        description: 'Collect testimonials from students and alumni about their experiences.',
        questions: [
          'How has [School Name] shaped your life or career?',
          'What\'s one unforgettable experience from your time at [School Name]?',
          'Why would you recommend [School Name] to others?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'fundraising_appeals',
        name: 'Fundraising & Donor Appeals',
        icon: <Award className="w-8 h-8 text-white" />,
        description: 'Create content to support fundraising and development efforts.',
        questions: [
          'Why do you support [School Name] as a donor?',
          'What impact has financial aid or scholarships had on students?',
          'What would you say to inspire others to give back?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'event_recaps',
        name: 'Event Recaps & Invitations',
        icon: <FileText className="w-8 h-8 text-white" />,
        description: 'Promote school events and share recaps of past events.',
        questions: [
          'What made [recent event] a memorable experience for you?',
          'Why should alumni and students attend [upcoming event]?',
          'How did this event strengthen the [School Name] community?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        id: 'career_success',
        name: 'Career & Internship Success Stories',
        icon: <MessageSquare className="w-8 h-8 text-white" />,
        description: 'Highlight career successes and internship experiences of students and alumni.',
        questions: [
          'How did [School Name] prepare you for your career?',
          'What advice would you give to students entering your field?',
          'What opportunities did you gain through your university connections?'
        ],
        color: 'bg-blue-500 hover:bg-blue-600'
      }
    ]
  };

  // Get the current category from formData
  const currentCategory = formData.category;
  
  // Get subcategories for the current category
  const currentSubcategories = subcategories[currentCategory] || [];
  
  console.log('Current category:', currentCategory);
  console.log('Available subcategories:', currentSubcategories.map(s => s.id));

  const handleSubcategorySelect = (subcategoryId, questions) => {
    console.log('Selecting subcategory:', subcategoryId);
    console.log('Current subcategory:', formData.subcategory);
    console.log('Questions:', questions);
    
    // Toggle selection - if already selected, deselect it
    if (formData.subcategory === subcategoryId) {
      console.log('Deselecting subcategory');
      setFormData({
        ...formData,
        subcategory: null,
        surveyQuestions: [] // Clear survey questions when deselecting
      });
      return;
    }
    
    // Update both subcategory and survey questions in a single call
    if (questions && questions.length > 0) {
      console.log('Setting subcategory with questions');
      const surveyQuestionsData = questions.map((question, index) => ({
        id: index + 1,
        question
      }));
      
      console.log('Survey questions data:', surveyQuestionsData);
      
      // Update the form data with the new subcategory and survey questions
      setFormData({
        ...formData,
        subcategory: subcategoryId,
        surveyQuestions: surveyQuestionsData
      });
    } else {
      console.log('Setting subcategory without questions');
      setFormData({
        ...formData,
        subcategory: subcategoryId
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Campaign Template</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Choose a template that best fits your campaign goals. Each template includes suggested survey questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentSubcategories.map((subcategory) => (
          <Card 
            key={subcategory.id}
            className={`cursor-pointer transition-all duration-200 border-2 ${
              formData.subcategory === subcategory.id 
                ? 'border-blue-500 dark:border-blue-400 shadow-md bg-blue-50 dark:bg-blue-900/20' 
                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-md'
            }`}
            onClick={() => handleSubcategorySelect(subcategory.id, subcategory.questions)}
          >
            <div className="p-6 flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                formData.subcategory === subcategory.id 
                  ? 'bg-blue-600 dark:bg-blue-700' 
                  : subcategory.color
              }`}>
                {subcategory.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`font-medium ${
                    formData.subcategory === subcategory.id 
                      ? 'text-blue-700 dark:text-blue-400' 
                      : 'text-gray-900 dark:text-white'
                  }`}>{subcategory.name}</h3>
                  {formData.subcategory === subcategory.id && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subcategory.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Note about customizing questions later */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Note: You'll be able to add, delete, or modify these questions in the next steps.
        </p>
      </div>
    </div>
  );
} 
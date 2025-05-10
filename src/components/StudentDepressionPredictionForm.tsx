import React, { useState } from 'react';
import axios from 'axios';

interface DepressionFormData {
  Gender: string;
  Age: number;
  Profession: string;
  'Academic Pressure': number;
  'Work Pressure': number;
  CGPA: number;
  'Study Satisfaction': number;
  'Job Satisfaction': number;
  'Sleep Duration': string;
  'Dietary Habits': string;
  Degree: string;
  'Have you ever had suicidal thoughts ?': string;
  'Work/Study Hours': number;
  'Financial Stress': number;
  'Family History of Mental Illness': string;
}

// Define API response type
interface PredictionResponse {
  result_text: string;
}

// Define ranges and help text for each field
const fieldConfig = {
  Age: {
    min: 18,
    max: 65,
    step: 1,
    unit: 'years',
    helpText: 'Your current age'
  },
  'Academic Pressure': {
    min: 1,
    max: 5,
    step: 1,
    unit: 'scale',
    helpText: 'Level of academic pressure (1-5)'
  },
  'Work Pressure': {
    min: 0,
    max: 5,
    step: 1,
    unit: 'scale',
    helpText: 'Level of work pressure (0-5)'
  },
  CGPA: {
    min: 0,
    max: 10,
    step: 0.01,
    unit: '',
    helpText: 'Cumulative Grade Point Average'
  },
  'Study Satisfaction': {
    min: 1,
    max: 5,
    step: 1,
    unit: 'scale',
    helpText: 'Satisfaction with studies (1-5)'
  },
  'Job Satisfaction': {
    min: 0,
    max: 5,
    step: 1,
    unit: 'scale',
    helpText: 'Satisfaction with job (0-5)'
  },
  'Work/Study Hours': {
    min: 1,
    max: 16,
    step: 1,
    unit: 'hours',
    helpText: 'Daily hours of work/study'
  },
  'Financial Stress': {
    min: 1,
    max: 5,
    step: 1,
    unit: 'scale',
    helpText: 'Level of financial stress (1-5)'
  }
};

// Healthcare recommendations based on prediction
const healthcareRecommendations = {
  positive: {
    title: "Managing Depression Risk",
    summary: "Your assessment suggests you may be at risk for depression. Here are some steps to take care of your mental health.",
    steps: [
      {
        title: "Consult a Mental Health Professional",
        description: "Consider speaking with a psychologist, psychiatrist, or counselor who can provide proper evaluation and guidance.",
        icon: "🩺"
      },
      {
        title: "Develop a Support System",
        description: "Reach out to trusted friends, family members, or support groups who can provide emotional support.",
        icon: "👥"
      },
      {
        title: "Practice Self-Care",
        description: "Prioritize sleep, healthy eating, exercise, and activities that bring you joy and relaxation.",
        icon: "🧘‍♀️"
      },
      {
        title: "Manage Academic/Work Stress",
        description: "Use time management techniques, set boundaries, and break large tasks into smaller, manageable pieces.",
        icon: "📚"
      },
      {
        title: "Consider Mental Health Resources",
        description: "Utilize campus counseling services, online therapy options, or mental health apps for additional support.",
        icon: "📱"
      }
    ],
    resources: [
      { name: "National Institute of Mental Health", url: "https://www.nimh.nih.gov/" },
      { name: "AASRA helpline", url: "http://www.aasra.info/helpline.html" },
      { name: "Active Minds", url: "https://www.activeminds.org/" }
    ]
  },
  negative: {
    title: "Maintaining Mental Wellness",
    summary: "Your assessment suggests a lower risk for depression. Here are recommendations to maintain your mental wellbeing.",
    steps: [
      {
        title: "Maintain Social Connections",
        description: "Continue building and nurturing meaningful relationships with others.",
        icon: "🤝"
      },
      {
        title: "Practice Mindfulness",
        description: "Incorporate meditation, deep breathing, or other mindfulness practices into your routine.",
        icon: "🧠"
      },
      {
        title: "Regular Physical Activity",
        description: "Stay active with regular exercise, which has been shown to boost mood and reduce stress.",
        icon: "🏃‍♂️"
      },
      {
        title: "Healthy Sleep Habits",
        description: "Maintain a consistent sleep schedule and aim for 7-9 hours of quality sleep per night.",
        icon: "😴"
      },
      {
        title: "Monitor Stress Levels",
        description: "Check in with yourself regularly and implement stress management techniques as needed.",
        icon: "📊"
      }
    ],
    resources: [
      { name: "Active Minds", url: "https://www.activeminds.org/" },
      { name: "Headspace", url: "https://www.headspace.com/" },
      { name: "National Institute of Mental Health", url: "https://www.nimh.nih.gov/" }
    ]
  }
};

const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
const professionOptions = ["Student", "Working Professional", "Student & Working", "Unemployed"];
const sleepDurationOptions = ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"];
const dietaryHabitsOptions = ["Healthy", "Moderate", "Unhealthy"];
const degreeOptions = ["High School", "Associate's", "Bachelor's", "Master's", "PhD", "Others"];
const yesNoOptions = ["Yes", "No"];

const StudentDepressionPredictionForm: React.FC = () => {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState<DepressionFormData>({
    Gender: "Prefer not to say",
    Age: 22,
    Profession: "Student",
    'Academic Pressure': 3,
    'Work Pressure': 0,
    CGPA: 7.0,
    'Study Satisfaction': 3,
    'Job Satisfaction': 0,
    'Sleep Duration': "5-6 hours",
    'Dietary Habits': "Moderate",
    Degree: "Bachelor's",
    'Have you ever had suicidal thoughts ?': "No",
    'Work/Study Hours': 6,
    'Financial Stress': 3,
    'Family History of Mental Illness': "No"
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Helper function to convert between backend and frontend field names
  const fieldMappings = {
    'Academic_Pressure': 'Academic Pressure',
    'Work_Pressure': 'Work Pressure',
    'Study_Satisfaction': 'Study Satisfaction',
    'Job_Satisfaction': 'Job Satisfaction',
    'Sleep_Duration': 'Sleep Duration',
    'Dietary_Habits': 'Dietary Habits',
    'Suicidal_Thoughts': 'Have you ever had suicidal thoughts ?',
    'Work_Study_Hours': 'Work/Study Hours',
    'Financial_Stress': 'Financial Stress',
    'Family_History': 'Family History of Mental Illness'
  };

  // Reverse mapping for UI handling
  const reverseFieldMappings: {[key: string]: string} = {};
  Object.entries(fieldMappings).forEach(([frontendKey, backendKey]) => {
    reverseFieldMappings[backendKey] = frontendKey;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For UI displayed field names, we need to map them to the formData structure
    // This handles the HTML field name attributes which can't have spaces
    let formDataKey = name;
    if (Object.keys(fieldMappings).includes(name)) {
      formDataKey = fieldMappings[name as keyof typeof fieldMappings];
    }
    
    setFormData(prevState => ({
      ...prevState,
      [formDataKey]: e.target.type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);
    setShowRecommendations(false);

    try {
      // Map form data to the expected API format using the exact column names from the CSV
      const apiFormData = {
        Gender: formData.Gender,
        Age: formData.Age,
        Profession: formData.Profession,
        'Academic Pressure': formData['Academic Pressure'],
        'Work Pressure': formData['Work Pressure'], 
        CGPA: formData.CGPA,
        'Study Satisfaction': formData['Study Satisfaction'],
        'Job Satisfaction': formData['Job Satisfaction'],
        'Sleep Duration': formData['Sleep Duration'],
        'Dietary Habits': formData['Dietary Habits'],
        Degree: formData.Degree,
        'Have you ever had suicidal thoughts ?': formData['Have you ever had suicidal thoughts ?'],
        'Work/Study Hours': formData['Work/Study Hours'],
        'Financial Stress': formData['Financial Stress'],
        'Family History of Mental Illness': formData['Family History of Mental Illness']
      };

      // Add type for the response
      const response = await axios.post<PredictionResponse>(`${API_URL}/predict_student_depression`, apiFormData);
      console.log('Response: ', response);
      setPrediction(response.data.result_text);
      // Show recommendations after a short delay for better UX
      setTimeout(() => setShowRecommendations(true), 500);
    } catch (err) {
      setError('Error predicting depression. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get the HTML field name (without spaces) for a given display name
  const getFieldName = (displayName: string): string => {
    return reverseFieldMappings[displayName] || displayName;
  };

  // Render a number input field with min/max values
  const renderNumberField = (
    label: string,
    name: keyof DepressionFormData,
    min: number,
    max: number,
    step: number = 1,
    unit: string = '',
    helpText?: string
  ) => {
    // Convert name to a format that works as an HTML attribute (no spaces)
    const htmlFieldName = getFieldName(name as string);
    
    return (
      <div className="mb-4">
        <label htmlFor={htmlFieldName} className="block text-gray-700 text-sm font-bold mb-2">
          {label} {unit && <span className="font-normal">({unit})</span>}
        </label>
        {helpText && <p className="text-gray-600 text-xs mb-2">{helpText}</p>}
        <input
          type="number"
          id={htmlFieldName}
          name={htmlFieldName}
          value={formData[name]}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
        <div className="text-xs text-gray-500 mt-1">Range: {min} - {max}</div>
      </div>
    );
  };

  // Render a select dropdown field
  const renderSelectField = (
    label: string,
    name: keyof DepressionFormData,
    options: string[],
    helpText?: string
  ) => {
    // Convert name to a format that works as an HTML attribute (no spaces)
    const htmlFieldName = getFieldName(name as string);
    
    return (
      <div className="mb-4">
        <label htmlFor={htmlFieldName} className="block text-gray-700 text-sm font-bold mb-2">
          {label}
        </label>
        {helpText && <p className="text-gray-600 text-xs mb-2">{helpText}</p>}
        <select
          id={htmlFieldName}
          name={htmlFieldName}
          value={formData[name]}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Determine which recommendations to show based on prediction
  const getRecommendations = () => {
    if (!prediction) return null;
    return prediction.includes("No") ? 
      healthcareRecommendations.negative : healthcareRecommendations.positive;
  };

  const recommendationsData = getRecommendations();

  // Crisis resources
  const crisisResources = (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
      <h4 className="font-bold text-red-700 mb-2">Need immediate help?</h4>
      <p className="mb-2 text-gray-700">If you are experiencing thoughts of suicide or severe distress, please reach out for help immediately:</p>
      <ul className="list-disc pl-5 text-gray-700">
        <li><strong>National Suicide Prevention Lifeline:</strong> 988 or 1-800-273-8255</li>
        <li><strong>AASRA Helpline:</strong> 91-9820466726</li>
        <li><strong>Emergency Services:</strong> Call 108 or go to your nearest emergency room</li>
      </ul>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-800">Student Depression Risk Assessment</h2>
      <p className="text-center mb-6 text-gray-600">Complete the form below to evaluate potential depression risk factors based on academic and lifestyle factors.</p>
      
      {crisisResources}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-purple-800 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderSelectField('Gender', 'Gender', genderOptions, 'Your gender identity')}
            {renderNumberField('Age', 'Age', fieldConfig.Age.min, fieldConfig.Age.max, fieldConfig.Age.step, fieldConfig.Age.unit, fieldConfig.Age.helpText)}
            {renderSelectField('Profession', 'Profession', professionOptions, 'Your current occupation')}
          </div>
        </div>

        {/* Academic & Work Information */}
        <div className="p-4 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-indigo-800 border-b pb-2">Academic & Work Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderNumberField('Academic Pressure', 'Academic Pressure', fieldConfig['Academic Pressure'].min, fieldConfig['Academic Pressure'].max, fieldConfig['Academic Pressure'].step, fieldConfig['Academic Pressure'].unit, fieldConfig['Academic Pressure'].helpText)}
            {renderNumberField('Work Pressure', 'Work Pressure', fieldConfig['Work Pressure'].min, fieldConfig['Work Pressure'].max, fieldConfig['Work Pressure'].step, fieldConfig['Work Pressure'].unit, fieldConfig['Work Pressure'].helpText)}
            {renderNumberField('CGPA', 'CGPA', fieldConfig.CGPA.min, fieldConfig.CGPA.max, fieldConfig.CGPA.step, fieldConfig.CGPA.unit, fieldConfig.CGPA.helpText)}
            {renderNumberField('Study Satisfaction', 'Study Satisfaction', fieldConfig['Study Satisfaction'].min, fieldConfig['Study Satisfaction'].max, fieldConfig['Study Satisfaction'].step, fieldConfig['Study Satisfaction'].unit, fieldConfig['Study Satisfaction'].helpText)}
            {renderNumberField('Job Satisfaction', 'Job Satisfaction', fieldConfig['Job Satisfaction'].min, fieldConfig['Job Satisfaction'].max, fieldConfig['Job Satisfaction'].step, fieldConfig['Job Satisfaction'].unit, fieldConfig['Job Satisfaction'].helpText)}
            {renderSelectField('Degree', 'Degree', degreeOptions, 'Your highest level of education')}
            {renderNumberField('Daily Work/Study Hours', 'Work/Study Hours', fieldConfig['Work/Study Hours'].min, fieldConfig['Work/Study Hours'].max, fieldConfig['Work/Study Hours'].step, fieldConfig['Work/Study Hours'].unit, fieldConfig['Work/Study Hours'].helpText)}
          </div>
        </div>

        {/* Lifestyle & Health */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Lifestyle & Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderSelectField('Sleep Duration', 'Sleep Duration', sleepDurationOptions, 'Average hours of sleep per night')}
            {renderSelectField('Dietary Habits', 'Dietary Habits', dietaryHabitsOptions, 'Overall quality of your diet')}
            {renderNumberField('Financial Stress', 'Financial Stress', fieldConfig['Financial Stress'].min, fieldConfig['Financial Stress'].max, fieldConfig['Financial Stress'].step, fieldConfig['Financial Stress'].unit, fieldConfig['Financial Stress'].helpText)}
            {renderSelectField('Family History of Mental Illness', 'Family History of Mental Illness', yesNoOptions, 'Do you have a family history of mental illness?')}
          </div>
        </div>

        {/* Mental Health */}
        <div className="p-4 bg-pink-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-pink-800 border-b pb-2">Mental Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderSelectField('Have you ever had suicidal thoughts?', 'Have you ever had suicidal thoughts ?', yesNoOptions, 'This information is used for assessment purposes only')}
          </div>
          <p className="text-sm text-gray-500 mt-2">Note: This question is for assessment purposes only. If you are currently experiencing suicidal thoughts, please contact emergency services or a mental health professional immediately.</p>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            {loading ? 'Processing...' : 'Get Depression Risk Assessment'}
          </button>
        </div>
      </form>

      {prediction && (
        <div className="mt-8 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-center">Assessment Result</h3>
          <div
            className={`mt-4 p-4 text-center font-bold rounded-lg text-lg ${
              prediction === 'No Depression' 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}
          >
            {prediction}
          </div>
          <p className="mt-4 text-gray-600 text-center text-sm">
            This assessment is for informational purposes only and does not constitute a clinical diagnosis.
            Please consult with a mental health professional for proper evaluation and support.
          </p>
        </div>
      )}

      {/* Healthcare Recommendations Section */}
      {showRecommendations && recommendationsData && (
        <div className="mt-8 p-6 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-2 text-center text-purple-800">{recommendationsData.title}</h3>
          <p className="text-center mb-6 text-gray-700">{recommendationsData.summary}</p>
          
          <div className="space-y-4">
            {recommendationsData.steps.map((step, index) => (
              <div key={index} className="flex items-start p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="text-3xl mr-4">{step.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-800">{step.title}</h4>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="font-bold text-gray-800 mb-2">Additional Resources:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {recommendationsData.resources.map((resource, index) => (
                <a 
                  key={index} 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-2 px-4 rounded text-center transition-colors"
                >
                  {resource.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-100 text-red-800 text-center rounded-lg border border-red-300">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mt-8 text-center text-gray-500 text-xs">
        <p>Disclaimer: This tool provides an estimate based on known risk factors and should not be used as a diagnostic tool.</p>
        <p>If you're experiencing symptoms of depression, please consult with a mental health professional for proper evaluation and care.</p>
        <p>If you're in crisis, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).</p>
      </div>
    </div>
  );
};

export default StudentDepressionPredictionForm;

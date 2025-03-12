import React, { useState } from 'react';
import axios from 'axios';

interface DiabetesFormData {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

type PredictionResponse = {
  prediction: number;
  result_text: string;
};

// Define ranges and help text for each field
const fieldConfig = {
  Pregnancies: {
    min: 0,
    max: 20,
    step: 1,
    unit: '',
    helpText: 'Number of pregnancies'
  },
  Glucose: {
    min: 70,
    max: 200,
    step: 1,
    unit: 'mg/dL',
    helpText: 'Plasma glucose concentration (2 hours in an oral glucose tolerance test)'
  },
  BloodPressure: {
    min: 40,
    max: 200,
    step: 1,
    unit: 'mmHg',
    helpText: 'Diastolic blood pressure'
  },
  SkinThickness: {
    min: 0,
    max: 100,
    step: 1,
    unit: 'mm',
    helpText: 'Triceps skin fold thickness'
  },
  Insulin: {
    min: 0,
    max: 600,
    step: 1,
    unit: 'μU/ml',
    helpText: '2-Hour serum insulin'
  },
  BMI: {
    min: 15,
    max: 50,
    step: 0.1,
    unit: 'kg/m²',
    helpText: 'Body mass index'
  },
  DiabetesPedigreeFunction: {
    min: 0.05,
    max: 2.5,
    step: 0.01,
    unit: '',
    helpText: 'Diabetes pedigree function (genetic influence)'
  },
  Age: {
    min: 21,
    max: 100,
    step: 1,
    unit: 'years',
    helpText: 'Age in years'
  }
};

// Healthcare recommendations based on prediction
const healthcareRecommendations = {
  positive: {
    title: "Next Steps for Positive Diabetes Risk Assessment",
    summary: "Your assessment suggests an elevated risk for diabetes. It's important to take proactive steps for your health.",
    steps: [
      {
        title: "Consult a Healthcare Provider",
        description: "Schedule an appointment with your doctor to discuss these results and get formal diagnostic testing.",
        icon: "🩺"
      },
      {
        title: "Monitor Blood Glucose",
        description: "Your doctor may recommend regular blood glucose monitoring to track your levels.",
        icon: "📊"
      },
      {
        title: "Adopt a Diabetes-Friendly Diet",
        description: "Focus on a balanced diet rich in vegetables, lean proteins, and complex carbohydrates. Limit refined sugars and processed foods.",
        icon: "🥗"
      },
      {
        title: "Regular Physical Activity",
        description: "Aim for at least 150 minutes of moderate exercise per week to improve insulin sensitivity and manage your weight.",
        icon: "🏃‍♀️"
      },
      {
        title: "Weight Management",
        description: "If your BMI is elevated, even modest weight loss (5-10% of body weight) can significantly reduce diabetes risk.",
        icon: "⚖️"
      }
    ],
    resources: [
      { name: "American Heart Association", url: "https://www.heart.org/en/health-topics/diabetes/diabetes-tools--resources" },
      { name: "CDC Healthy Living", url: "https://www.cdc.gov/diabetes/living-with/index.html" },
      { name: "Healthline", url: "https://www.healthline.com/health/food-nutrition" }
    ]
  },
  negative: {
    title: "Maintaining Your Health",
    summary: "Your assessment suggests a lower risk for diabetes. Here are recommendations to maintain your health and further reduce risks.",
    steps: [
      {
        title: "Regular Health Check-ups",
        description: "Continue with regular medical check-ups to monitor your health status.",
        icon: "🏥"
      },
      {
        title: "Balanced Diet",
        description: "Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.",
        icon: "🍎"
      },
      {
        title: "Regular Physical Activity",
        description: "Stay active with at least 150 minutes of moderate exercise per week.",
        icon: "🚶‍♂️"
      },
      {
        title: "Healthy Weight",
        description: "Maintain a healthy weight for your height and body type.",
        icon: "⚖️"
      },
      {
        title: "Limit Alcohol and Avoid Smoking",
        description: "Moderate alcohol consumption and avoid tobacco products to reduce risk factors.",
        icon: "🚭"
      }
    ],
    resources: [
      { name: "American Heart Association", url: "https://www.heart.org/en/health-topics/diabetes/diabetes-tools--resources" },
      { name: "CDC Healthy Living", url: "https://www.cdc.gov/diabetes/living-with/index.html" },
      { name: "Healthline", url: "https://www.healthline.com/health/food-nutrition" }
    ]
  }
};

const DiabetesPredictionForm: React.FC = () => {

  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState<DiabetesFormData>({
    Pregnancies: 0,
    Glucose: 120,
    BloodPressure: 80,
    SkinThickness: 20,
    Insulin: 80,
    BMI: 25,
    DiabetesPedigreeFunction: 0.5,
    Age: 35
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);
    setShowRecommendations(false);

    try {
      const response = await axios.post<PredictionResponse>(`${API_URL}/predict_diabetes`, formData);
      console.log('Response: ', response);
      setPrediction(response.data.result_text);
      // Show recommendations after a short delay for better UX
      setTimeout(() => setShowRecommendations(true), 500);
    } catch (err) {
      setError('Error predicting diabetes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Render a number input field with min/max values
  const renderNumberField = (
    label: string,
    name: keyof DiabetesFormData,
    min: number,
    max: number,
    step: number = 1,
    unit: string = '',
    helpText?: string
  ) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
        {label} {unit && <span className="font-normal">({unit})</span>}
      </label>
      {helpText && <p className="text-gray-600 text-xs mb-2">{helpText}</p>}
      <input
        type="number"
        id={name}
        name={name}
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

  // Determine which recommendations to show based on prediction
  const getRecommendations = () => {
    if (!prediction) return null;
    return prediction.includes("Positive") ? 
      healthcareRecommendations.positive : healthcareRecommendations.negative;
  };

  const recommendationsData = getRecommendations();

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Diabetes Risk Assessment</h2>
      <p className="text-center mb-6 text-gray-600">Complete the form below to get a preliminary assessment of diabetes risk factors.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Demographic Information */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Demographic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderNumberField('Age', 'Age', fieldConfig.Age.min, fieldConfig.Age.max, fieldConfig.Age.step, fieldConfig.Age.unit, fieldConfig.Age.helpText)}
            {renderNumberField('Pregnancies', 'Pregnancies', fieldConfig.Pregnancies.min, fieldConfig.Pregnancies.max, fieldConfig.Pregnancies.step, fieldConfig.Pregnancies.unit, fieldConfig.Pregnancies.helpText)}
          </div>
        </div>

        {/* Clinical Measurements */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-purple-800 border-b pb-2">Clinical Measurements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderNumberField('Glucose', 'Glucose', fieldConfig.Glucose.min, fieldConfig.Glucose.max, fieldConfig.Glucose.step, fieldConfig.Glucose.unit, fieldConfig.Glucose.helpText)}
            {renderNumberField('Blood Pressure', 'BloodPressure', fieldConfig.BloodPressure.min, fieldConfig.BloodPressure.max, fieldConfig.BloodPressure.step, fieldConfig.BloodPressure.unit, fieldConfig.BloodPressure.helpText)}
            {renderNumberField('Skin Thickness', 'SkinThickness', fieldConfig.SkinThickness.min, fieldConfig.SkinThickness.max, fieldConfig.SkinThickness.step, fieldConfig.SkinThickness.unit, fieldConfig.SkinThickness.helpText)}
            {renderNumberField('Insulin', 'Insulin', fieldConfig.Insulin.min, fieldConfig.Insulin.max, fieldConfig.Insulin.step, fieldConfig.Insulin.unit, fieldConfig.Insulin.helpText)}
            {renderNumberField('BMI', 'BMI', fieldConfig.BMI.min, fieldConfig.BMI.max, fieldConfig.BMI.step, fieldConfig.BMI.unit, fieldConfig.BMI.helpText)}
            {renderNumberField('Diabetes Pedigree Function', 'DiabetesPedigreeFunction', fieldConfig.DiabetesPedigreeFunction.min, fieldConfig.DiabetesPedigreeFunction.max, fieldConfig.DiabetesPedigreeFunction.step, fieldConfig.DiabetesPedigreeFunction.unit, fieldConfig.DiabetesPedigreeFunction.helpText)}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            {loading ? 'Processing...' : 'Get Diabetes Risk Assessment'}
          </button>
        </div>
      </form>

      {prediction && (
        <div className="mt-8 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-center">Assessment Result</h3>
          <div
            className={`mt-4 p-4 text-center font-bold rounded-lg text-lg ${
              prediction === 'Diabetes Negative' 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}
          >
            {prediction}
          </div>
          <p className="mt-4 text-gray-600 text-center text-sm">
            This assessment is for informational purposes only and should not replace professional medical advice.
            Please consult with a healthcare provider for a proper diagnosis.
          </p>
        </div>
      )}

      {/* Healthcare Recommendations Section */}
      {showRecommendations && recommendationsData && (
        <div className="mt-8 p-6 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-bold mb-2 text-center text-blue-800">{recommendationsData.title}</h3>
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
                  className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded text-center transition-colors"
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
        <p>Always consult with a healthcare professional for proper medical advice and diagnosis.</p>
      </div>
    </div>
  );
};

export default DiabetesPredictionForm;
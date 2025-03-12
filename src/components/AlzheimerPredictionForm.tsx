import React, { useState } from 'react';
import axios from 'axios';

interface AlzheimerFormData {
    Age: number;
    Gender: number;
    Ethnicity: number;
    EducationLevel: number;
    BMI: number;
    Smoking: number;
    AlcoholConsumption: number;
    PhysicalActivity: number;
    DietQuality: number;
    SleepQuality: number;
    FamilyHistoryAlzheimers: number;
    CardiovascularDisease: number;
    Diabetes: number;
    Depression: number;
    HeadInjury: number;
    Hypertension: number;
    SystolicBP: number;
    DiastolicBP: number;
    CholesterolTotal: number;
    CholesterolLDL: number;
    CholesterolHDL: number;
    CholesterolTriglycerides: number;
    MMSE: number;
    FunctionalAssessment: number;
    MemoryComplaints: number;
    BehavioralProblems: number;
    ADL: number;
    Confusion: number;
    Disorientation: number;
    PersonalityChanges: number;
    DifficultyCompletingTasks: number;
    Forgetfulness: number;
}

type PredictionResponse = {
    prediction: number;
    result_text: string;
};

// Options for dropdown and radio fields
const options = {
    gender: [
        { value: 0, label: 'Male' },
        { value: 1, label: 'Female' }
    ],
    ethnicity: [
        { value: 0, label: 'Caucasian' },
        { value: 1, label: 'African American' },
        { value: 2, label: 'Asian' },
        { value: 3, label: 'Other' }
    ],
    educationLevel: [
        { value: 0, label: 'None' },
        { value: 1, label: 'High School' },
        { value: 2, label: 'Bachelor\'s' },
        { value: 3, label: 'Higher' }
    ],
    binaryOption: [
        { value: 0, label: 'No' },
        { value: 1, label: 'Yes' }
    ]
};

// Healthcare recommendations based on prediction
const healthcareRecommendations = {
    negative: {
        title: "Maintaining Cognitive Health",
        summary: "Your assessment suggests a lower risk for Alzheimer's disease. Here are recommendations to maintain your cognitive health and further reduce risks.",
        steps: [
            {
                title: "Regular Cognitive Check-ups",
                description: "Continue with regular cognitive assessments as part of your routine healthcare, especially after age 65.",
                icon: "🧠"
            },
            {
                title: "Stay Mentally Active",
                description: "Engage in mentally stimulating activities like puzzles, reading, learning new skills, or playing strategy games.",
                icon: "🧩"
            },
            {
                title: "Physical Exercise",
                description: "Maintain regular aerobic exercise (at least 150 minutes per week) which has been shown to support brain health.",
                icon: "🏃‍♀️"
            },
            {
                title: "Brain-Healthy Diet",
                description: "Follow a Mediterranean or MIND diet rich in vegetables, berries, whole grains, fish, and olive oil.",
                icon: "🥗"
            },
            {
                title: "Quality Sleep",
                description: "Prioritize 7-8 hours of quality sleep, as poor sleep is linked to increased risk of cognitive decline.",
                icon: "😴"
            },
            {
                title: "Social Engagement",
                description: "Maintain an active social life and strong connections with family and friends.",
                icon: "👪"
            }
        ],
        resources: [
            { name: "National Institute on Aging", url: "https://www.nia.nih.gov/health/brain-health" },
            { name: "Alzheimer's Association", url: "https://www.alz.org/help-support/brain_health" },
            { name: "Healthline", url: "https://www.healthline.com/nutrition/mind-diet" }
        ]
    },
    positive: {
        title: "Next Steps for Alzheimer's Risk Assessment",
        summary: "Your assessment suggests potential cognitive concerns. It's important to take proactive steps to address these issues.",
        steps: [
            {
                title: "Consult a Neurologist",
                description: "Schedule an appointment with a neurologist or memory specialist for a comprehensive cognitive assessment.",
                icon: "🩺"
            },
            {
                title: "Comprehensive Testing",
                description: "Ask about neuropsychological testing, brain imaging (MRI/PET), and biomarker tests to help confirm a diagnosis.",
                icon: "🔬"
            },
            {
                title: "Medication Review",
                description: "Review all current medications with your doctor, as some may affect cognitive function.",
                icon: "💊"
            },
            {
                title: "Cognitive Stimulation",
                description: "Engage in structured cognitive activities and consider cognitive rehabilitation therapy.",
                icon: "🧠"
            },
            {
                title: "Support Network",
                description: "Connect with family, friends, and support groups who can provide emotional support and practical assistance.",
                icon: "🤝"
            },
            {
                title: "Safety Planning",
                description: "Assess home safety needs and consider future care planning while you're able to participate in decisions.",
                icon: "🏠"
            }
        ],
        resources: [
            { name: "National Institute on Aging", url: "https://www.nia.nih.gov/health/brain-health" },
            { name: "Alzheimer's Association", url: "https://www.alz.org/help-support/brain_health" },
            { name: "Healthline", url: "https://www.healthline.com/nutrition/mind-diet" }
        ]
    }
};

const AlzheimerPredictionForm: React.FC = () => {

    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const [formData, setFormData] = useState<AlzheimerFormData>({
        Age: 60,
        Gender: 0,
        Ethnicity: 0,
        EducationLevel: 0,
        BMI: 25,
        Smoking: 0,
        AlcoholConsumption: 0,
        PhysicalActivity: 0,
        DietQuality: 5,
        SleepQuality: 7,
        FamilyHistoryAlzheimers: 0,
        CardiovascularDisease: 0,
        Diabetes: 0,
        Depression: 0,
        HeadInjury: 0,
        Hypertension: 0,
        SystolicBP: 120,
        DiastolicBP: 80,
        CholesterolTotal: 200,
        CholesterolLDL: 100,
        CholesterolHDL: 50,
        CholesterolTriglycerides: 150,
        MMSE: 20,
        FunctionalAssessment: 8,
        MemoryComplaints: 0,
        BehavioralProblems: 0,
        ADL: 8,
        Confusion: 0,
        Disorientation: 0,
        PersonalityChanges: 0,
        DifficultyCompletingTasks: 0,
        Forgetfulness: 0
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

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: parseInt(value, 10)
        }));
    };

    const handleRadioChange = (name: string, value: number) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: parseInt(value, 10)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setPrediction(null);
        setError(null);
        setShowRecommendations(false);

        try {
            const response = await axios.post<PredictionResponse>(`${API_URL}/predict_alzheimer`, formData);
            console.log('Response: ', response);
            setPrediction(response.data.result_text);
            // Show recommendations after a short delay for better UX
            setTimeout(() => setShowRecommendations(true), 500);
        } catch (err) {
            setError('Error predicting Alzheimer\'s status. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Render a dropdown select field
    const renderSelectField = (
        label: string,
        name: keyof AlzheimerFormData,
        optionsList: Array<{ value: number, label: string }>,
        helpText?: string
    ) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>
            {helpText && <p className="text-gray-600 text-xs mb-2">{helpText}</p>}
            <select
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleSelectChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
                {optionsList.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );

    // Render a number input field with min/max values
    const renderNumberField = (
        label: string,
        name: keyof AlzheimerFormData,
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

    // Render radio buttons for binary options (Yes/No)
    const renderRadioField = (
        label: string,
        name: keyof AlzheimerFormData,
        helpText?: string
    ) => (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>
            {helpText && <p className="text-gray-600 text-xs mb-2">{helpText}</p>}
            <div className="flex space-x-6">
                {options.binaryOption.map(option => (
                    <div key={option.value} className="flex items-center">
                        <input
                            type="radio"
                            id={`${name}_${option.value}`}
                            checked={formData[name] === option.value}
                            onChange={() => handleRadioChange(name, option.value)}
                            className="mr-2"
                        />
                        <label htmlFor={`${name}_${option.value}`} className="text-gray-700">
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    // Render a slider with a label showing current value
    const renderSliderField = (
        label: string,
        name: keyof AlzheimerFormData,
        min: number,
        max: number,
        helpText?: string
    ) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2">
                {label} <span className="font-normal text-blue-600">({formData[name]})</span>
            </label>
            {helpText && <p className="text-gray-600 text-xs mb-2">{helpText}</p>}
            <input
                type="range"
                id={name}
                name={name}
                min={min}
                max={max}
                value={formData[name]}
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );

    // Determine which recommendations to show based on prediction
    const getRecommendations = () => {
        if (!prediction) return null;
        return prediction === "Risk of Dementia" ? 
            healthcareRecommendations.positive : healthcareRecommendations.negative;
    };

    const recommendationsData = getRecommendations();

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Alzheimer's Disease Risk Assessment</h2>
            <p className="text-center mb-6 text-gray-600">Complete the form below to get a preliminary assessment of Alzheimer's risk factors.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Demographics Section */}
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">Demographic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderNumberField('Age', 'Age', 60, 90, 1, 'years', '')}
                        {renderSelectField('Gender', 'Gender', options.gender)}
                        {renderSelectField('Ethnicity', 'Ethnicity', options.ethnicity)}
                        {renderSelectField('Education Level', 'EducationLevel', options.educationLevel)}
                    </div>
                </div>

                {/* Lifestyle Section */}
                <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2">Lifestyle Factors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderNumberField('BMI', 'BMI', 15, 40, 0.1, 'kg/m²', 'Body Mass Index between 15-40')}
                        {renderRadioField('Smoking', 'Smoking', 'Current smoking status')}
                        {renderNumberField('Alcohol Consumption', 'AlcoholConsumption', 0, 20, 1, 'units/week', 'Weekly alcohol consumption in units')}
                        {renderNumberField('Physical Activity', 'PhysicalActivity', 0, 10, 0.5, 'hours/week', 'Weekly physical activity in hours')}
                        {renderSliderField('Diet Quality', 'DietQuality', 0, 10, 'Scale from 0 (poor) to 10 (excellent)')}
                        {renderSliderField('Sleep Quality', 'SleepQuality', 4, 10, 'Scale from 4 (poor) to 10 (excellent)')}
                    </div>
                </div>

                {/* Medical History Section */}
                <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-red-800 border-b pb-2">Medical History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderRadioField('Family History of Alzheimer\'s', 'FamilyHistoryAlzheimers')}
                        {renderRadioField('Cardiovascular Disease', 'CardiovascularDisease')}
                        {renderRadioField('Diabetes', 'Diabetes')}
                        {renderRadioField('Depression', 'Depression')}
                        {renderRadioField('Head Injury', 'HeadInjury')}
                        {renderRadioField('Hypertension', 'Hypertension')}
                    </div>
                </div>

                {/* Clinical Measurements Section */}
                <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-purple-800 border-b pb-2">Clinical Measurements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderNumberField('Systolic BP', 'SystolicBP', 90, 180, 1, 'mmHg')}
                        {renderNumberField('Diastolic BP', 'DiastolicBP', 60, 120, 1, 'mmHg')}
                        {renderNumberField('Total Cholesterol', 'CholesterolTotal', 150, 300, 1, 'mg/dL')}
                        {renderNumberField('LDL Cholesterol', 'CholesterolLDL', 50, 200, 1, 'mg/dL')}
                        {renderNumberField('HDL Cholesterol', 'CholesterolHDL', 20, 100, 1, 'mg/dL')}
                        {renderNumberField('Triglycerides', 'CholesterolTriglycerides', 50, 400, 1, 'mg/dL')}
                    </div>
                </div>

                {/* Cognitive and Functional Assessments Section */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-800 border-b pb-2">Cognitive and Functional Assessments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderNumberField('MMSE Score', 'MMSE', 0, 30, 1, '', 'Mini-Mental State Examination (0-30, lower scores indicate cognitive impairment)')}
                        {renderNumberField('Functional Assessment', 'FunctionalAssessment', 0, 10, 1, '', 'Functional assessment (0-10, lower scores indicate greater impairment)')}
                        {renderNumberField('ADL Score', 'ADL', 0, 10, 1, '', 'Activities of Daily Living (0-10, lower scores indicate greater impairment)')}
                        {renderRadioField('Memory Complaints', 'MemoryComplaints')}
                        {renderRadioField('Behavioral Problems', 'BehavioralProblems')}
                    </div>
                </div>

                {/* Symptoms Section */}
                <div className="p-4 bg-orange-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-orange-800 border-b pb-2">Symptoms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {renderRadioField('Confusion', 'Confusion')}
                        {renderRadioField('Disorientation', 'Disorientation')}
                        {renderRadioField('Personality Changes', 'PersonalityChanges')}
                        {renderRadioField('Difficulty Completing Tasks', 'DifficultyCompletingTasks')}
                        {renderRadioField('Forgetfulness', 'Forgetfulness')}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        {loading ? 'Processing...' : 'Get Alzheimer\'s Risk Assessment'}
                    </button>
                </div>
            </form>

            {prediction && (
                <div className="mt-8 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-center">Assessment Result</h3>
                    <div
                        className={`mt-4 p-4 text-center font-bold rounded-lg text-lg ${
                            prediction === 'Non-Demented' 
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

export default AlzheimerPredictionForm;
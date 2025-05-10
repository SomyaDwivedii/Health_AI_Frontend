import React from 'react';
import { Link } from 'react-router-dom';
import healthImage from '../assets/health-banner.jpeg';
import diabetesImage from '../assets/diabetes.jpeg';
import alzheimerImage from '../assets/alzheimer.jpg';
import depressionImage from '../assets/depression.png'; // You'll need to add this image

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-800 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Predict Health Risks with AI</h1>
            <p className="text-xl mb-8">Use our advanced machine learning tools to assess potential health conditions and take preventive action.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/diabetes-prediction" className="bg-white text-blue-800 hover:bg-blue-100 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Diabetes Assessment
              </Link>
              <Link to="/alzheimer-prediction" className="bg-transparent hover:bg-blue-700 border-2 border-white text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Alzheimer Assessment
              </Link>
              <Link to="/student-depression-prediction" className="bg-transparent hover:bg-blue-700 border-2 border-white text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                Student Depression Assessment
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src={healthImage}
              alt="Health monitoring illustration" 
              className="rounded-lg shadow-xl max-w-full h-65"
            />
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
            <path d="M0.00,49.99 C150.00,150.00 349.20,-49.99 500.00,49.99 L500.00,150.00 L0.00,150.00 Z" className="fill-white"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Assessment Tools Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Our Assessment Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Diabetes Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:translate-y-px">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <img 
                    src={diabetesImage}
                    alt="Diabetes prediction" 
                    className="max-w-full h-50 w-192 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-blue-800">Diabetes Risk Assessment</h3>
                  <p className="text-gray-600 mb-4">
                    Assess your risk of developing diabetes using health metrics and lifestyle information based on clinical factors.
                  </p>
                  <ul className="text-gray-600 mb-6 pl-5 list-disc">
                    <li>Uses glucose levels, BMI, and other factors</li>
                    <li>Based on extensive patient health parameters</li>
                    <li>Provides personalized health recommendations</li>
                  </ul>
                  <Link 
                    to="/diabetes-prediction" 
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full text-center transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Start Assessment
                  </Link>
                </div>
              </div>

              {/* Alzheimer Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:translate-y-px">
                <div className="h-48 bg-purple-100 flex items-center justify-center">
                  <img 
                    src={alzheimerImage} 
                    alt="Alzheimer prediction" 
                    className="max-w-full h-50 w-192 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-purple-800">Alzheimer's Risk Assessment</h3>
                  <p className="text-gray-600 mb-4">
                    Estimate your risk of Alzheimer's disease based on cognitive, genetic, and lifestyle factors.
                  </p>
                  <ul className="text-gray-600 mb-6 pl-5 list-disc">
                    <li>Evaluates age, family history, and cognitive indicators</li>
                    <li>Based on extensive patient health parameters</li>
                    <li>Offers preventative health strategies</li>
                  </ul>
                  <Link 
                    to="/alzheimer-prediction" 
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-full text-center transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Start Assessment
                  </Link>
                </div>
              </div>

              {/* Student Depression Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:translate-y-px">
                <div className="h-48 bg-teal-100 flex items-center justify-center">
                  <img 
                    src={depressionImage} 
                    alt="Student Depression prediction" 
                    className="max-w-full h-50 w-192 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-teal-800">Student Depression Assessment</h3>
                  <p className="text-gray-600 mb-4">
                    Evaluate depression risk factors among students based on academic, lifestyle, and environmental factors.
                  </p>
                  <ul className="text-gray-600 mb-6 pl-5 list-disc">
                    <li>Analyzes academic pressure, sleep patterns, and stress levels</li>
                    <li>Considers work-study balance and satisfaction</li>
                    <li>Provides coping strategies</li>
                  </ul>
                  <Link 
                    to="/student-depression-prediction" 
                    className="block w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-full text-center transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Start Assessment
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">Why Use Our Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4 text-blue-600">⚙️</div>
                <h3 className="text-xl font-bold mb-2">Advanced AI Models</h3>
                <p className="text-gray-600">Our predictions use machine learning models trained on extensive health datasets.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4 text-blue-600">🔒</div>
                <h3 className="text-xl font-bold mb-2">Privacy Focused</h3>
                <p className="text-gray-600">Your health data stays private and is never stored or shared with third parties.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4 text-blue-600">📋</div>
                <h3 className="text-xl font-bold mb-2">Actionable Insights</h3>
                <p className="text-gray-600">Get personalized recommendations based on your assessment results.</p>
              </div>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold mb-2 text-blue-800">Important Disclaimer</h2>
            <p className="text-gray-700">
              These prediction tools are for informational purposes only and should not be considered as medical advice. 
              The results are based on statistical models and do not constitute a diagnosis. 
              Always consult with a qualified healthcare professional for proper medical advice and treatment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

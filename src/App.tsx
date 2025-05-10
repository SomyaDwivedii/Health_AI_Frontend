import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AlzheimerPredictionForm from './components/AlzheimerPredictionForm';
import DiabetesPredictionForm from './components/DiabetesPredictionForm';
import StudentDepressionPredictionForm from './components/StudentDepressionPredictionForm';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <header 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HealthPredict
                </span>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-8">
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => 
                    `font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/diabetes-prediction" 
                  className={({ isActive }) => 
                    `font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Diabetes Assessment
                </NavLink>
                <NavLink 
                  to="/alzheimer-prediction" 
                  className={({ isActive }) => 
                    `font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Alzheimer Assessment
                </NavLink>
                <NavLink 
                  to="/student-depression-prediction" 
                  className={({ isActive }) => 
                    `font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  Student Depression
                </NavLink>
              </nav>
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button 
                  className="text-gray-700 hover:text-blue-600 focus:outline-none"
                  aria-label="Open menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="flex-grow pt-16">
          {/* Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diabetes-prediction" element={<DiabetesPredictionForm />} />
            <Route path="/alzheimer-prediction" element={<AlzheimerPredictionForm />} />
            <Route path="/student-depression-prediction" element={<StudentDepressionPredictionForm />} />
          </Routes>
        </main>
        
        {/* Fixed Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo and About */}
              <div className="md:col-span-1">
                <Link to="/" className="text-2xl font-bold text-white mb-4 block">HealthPredict</Link>
                <p className="text-gray-300 text-sm">
                  Using AI to help predict health risks and provide personalized recommendations.
                </p>
              </div>
              
              {/* Quick Links */}
              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/diabetes-prediction" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Diabetes Assessment
                    </Link>
                  </li>
                  <li>
                    <Link to="/alzheimer-prediction" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Alzheimer Assessment
                    </Link>
                  </li>
                  <li>
                    <Link to="/student-depression-prediction" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Student Depression Assessment
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Resources */}
              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="https://www.diabetes.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                      American Diabetes Association
                    </a>
                  </li>
                  <li>
                    <a href="https://www.alz.org/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Alzheimer's Association
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nimh.nih.gov/health/topics/depression" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                      NIMH - Depression
                    </a>
                  </li>
                  <li>
                    <a href="https://www.who.int/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300">
                      World Health Organization
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Contact */}
              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p className="text-gray-300 text-sm mb-2">
                  If you have any questions or feedback, please reach out to us.
                </p>
                <a href="mailto:contact@healthpredict.example" className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                  contact@healthpredict.example
                </a>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
              <p>© 2025 HealthPredict. All rights reserved.</p>
              <p className="mt-1">
                This tool is for educational purposes only and is not intended for medical diagnosis.
                Always consult a healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

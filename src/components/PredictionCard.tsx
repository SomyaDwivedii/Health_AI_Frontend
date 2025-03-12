import React from 'react';
import { Link } from 'react-router-dom';

interface PredictionCardProps {
  title: string;
  description: string;
  linkTo: string;
  isAvailable: boolean;
  imageUrl?: string;
  bgColor?: string;
  buttonColor?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  title,
  description,
  linkTo,
  isAvailable,
  imageUrl = "/api/placeholder/400/300",
  bgColor = "bg-blue-50",
  buttonColor = "bg-blue-600 hover:bg-blue-700"
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={`h-48 ${bgColor} flex items-center justify-center`}>
        <img 
          src={imageUrl} 
          alt={title} 
          className="max-w-full h-auto"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        {isAvailable ? (
          <Link 
            to={linkTo} 
            className={`block w-full ${buttonColor} text-white font-bold py-2 px-4 rounded-full text-center transition duration-300 ease-in-out transform hover:scale-105`}
          >
            Start Assessment
          </Link>
        ) : (
          <button 
            disabled
            className="block w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-full text-center cursor-not-allowed"
          >
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
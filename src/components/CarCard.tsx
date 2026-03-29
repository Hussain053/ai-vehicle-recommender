import React, { useState } from 'react';
import type { Vehicle } from '../types';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const FuelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
         <path d="M10.75 1.5a.75.75 0 00-1.5 0v2.51a3.245 3.245 0 00-1.8 3.115V11.25a.75.75 0 00.22.53l3.25 3.25a.75.75 0 001.06 0l3.25-3.25a.75.75 0 00.22-.53V7.125a3.245 3.245 0 00-1.8-3.115V1.5zM9.5 7.125a1.75 1.75 0 013.5 0V11h-3.5V7.125z" />
         <path d="M6 14.25a.75.75 0 000 1.5h8a.75.75 0 000-1.5H6z" />
    </svg>
);

const CompareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7.5 5.25A2.25 2.25 0 005.25 7.5v.754a3.243 3.243 0 000 3.992V13.5a2.25 2.25 0 002.25 2.25h.75a2.25 2.25 0 002.25-2.25v-.75a.75.75 0 00-1.5 0v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.754a4.742 4.742 0 010-5.492V7.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 001.5 0v-.75A2.25 2.25 0 007.5 5.25z" />
        <path d="M12.5 5.25a2.25 2.25 0 00-2.25 2.25v.754a4.742 4.742 0 010 5.492V13.5a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75a.75.75 0 00-1.5 0v.75a2.25 2.25 0 002.25 2.25h.75a2.25 2.25 0 002.25-2.25v-.754a3.243 3.243 0 000-3.992V7.5A2.25 2.25 0 0012.5 5.25z" />
    </svg>
);

const PlaceholderVehicleIcon = () => (
    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5l1.447-1.447A1 1 0 0113.172 3h1.656a1 1 0 01.707.293L17 5m-6 0h6m-6 0l-1.447-1.447A1 1 0 008.828 3H7.172a1 1 0 00-.707.293L5 5m12 0h-6m6 0l1.447 1.447A1 1 0 0117.172 7h1.656a1 1 0 01.707.293L21 9m-6-4v4m-6 0v4m-6-4v4m0 0v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
    </div>
);

const FuelBadge: React.FC<{ type: Vehicle['fuelType'] }> = ({ type }) => {
    const styles = {
        Petrol: 'bg-blue-600/80 border-blue-400',
        Diesel: 'bg-yellow-600/80 border-yellow-400',
        CNG: 'bg-green-600/80 border-green-400',
        Electric: 'bg-purple-600/80 border-purple-400',
        Hybrid: 'bg-teal-600/80 border-teal-400',
    };
    const badgeStyle = styles[type] || 'bg-gray-600/80 border-gray-400';
    return (
        <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full border ${badgeStyle} text-white`}>
            {type}
        </span>
    );
};

interface VehicleCardProps {
    vehicle: Vehicle;
    index: number;
    onCompare: (vehicle: Vehicle) => void;
    isComparing: boolean;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, index, onCompare, isComparing }) => {
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
      setImgError(true);
  };

  return (
    <div 
        className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-[1.03] transition-transform duration-300 ease-in-out fade-in-card backdrop-blur-sm flex flex-col"
        style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-full h-56 object-cover relative">
          {imgError ? <PlaceholderVehicleIcon /> : (
            <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
            />
          )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white leading-tight pr-2">{vehicle.name}</h3>
            {vehicle.fuelType && <FuelBadge type={vehicle.fuelType} />}
        </div>
        <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-4">
            <div className='text-left'>
                <p className="text-sm text-gray-400">Ex-Showroom</p>
                <p className="text-md font-semibold text-gray-200">{vehicle.price.exShowroom}</p>
                 <p className="text-sm text-gray-400 mt-1">On-Road (est.)</p>
                <p className="text-lg font-bold text-cyan-400">{vehicle.price.onRoad}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 text-sm text-gray-300">
                <div className='flex items-center gap-1.5'>
                    <FuelIcon />
                    <span>{vehicle.mileage}</span>
                </div>
            </div>
        </div>
        
        <div className="mb-4">
            <h4 className="font-semibold text-gray-200 mb-1.5">Why it's a good fit:</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{vehicle.reasoning}</p>
        </div>
        
        <div className="flex-grow">
            <h4 className="font-semibold text-gray-200 mb-2">Key Features:</h4>
            <ul className="space-y-2">
            {vehicle.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2">
                    <CheckIcon />
                    <span className="text-gray-300 text-sm">{pro}</span>
                </li>
            ))}
            </ul>
        </div>

        <div className="mt-6">
            <button
                onClick={() => onCompare(vehicle)}
                disabled={isComparing}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-cyan-700 text-cyan-400 rounded-md hover:bg-cyan-900/50 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
                <CompareIcon />
                <span>Compare Alternatives</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;

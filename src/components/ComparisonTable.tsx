import React from 'react';
import type { Vehicle } from '../types';

interface ComparisonTableProps {
    originalVehicle: Vehicle;
    competitors: Vehicle[];
    onClose: () => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ originalVehicle, competitors, onClose }) => {
    const allVehicles = [originalVehicle, ...competitors];

    const renderPros = (pros: string[]) => (
        <ul className="space-y-1.5">
            {pros.map((pro, idx) => (
                <li key={idx} className="flex items-start text-xs text-gray-300">
                    <span className="text-cyan-500 mr-2 mt-0.5 flex-shrink-0">✓</span>
                    <span>{pro}</span>
                </li>
            ))}
        </ul>
    );
    
    const renderValue = (vehicle: Vehicle, feature: string) => {
        switch(feature) {
            case 'On-Road Price': return <span className="font-bold text-lg text-cyan-400">{vehicle.price.onRoad}</span>;
            case 'Ex-Showroom': return vehicle.price.exShowroom;
            case 'Mileage': return vehicle.mileage;
            case 'Fuel Type': return vehicle.fuelType;
            case 'Reasoning': return <p className="text-sm leading-relaxed">{vehicle.reasoning}</p>;
            case 'Pros': return renderPros(vehicle.pros);
            default: return null;
        }
    };

    const features = ['On-Road Price', 'Ex-Showroom', 'Mileage', 'Fuel Type', 'Reasoning', 'Pros'];

    return (
        <div className="bg-gray-900/70 border border-gray-700 rounded-xl p-4 md:p-6 shadow-2xl backdrop-blur-xl mt-8 fade-in-card">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                    Comparison: <span className="text-cyan-400">{originalVehicle.name}</span> & Rivals
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close comparison"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-separate" style={{borderSpacing: '0 4px'}}>
                    <thead>
                        <tr>
                            <th className="sticky left-0 bg-gray-900/80 p-3 text-left font-semibold text-gray-300 w-[180px] z-10">Feature</th>
                            {allVehicles.map((v, i) => (
                                <th key={i} className={`p-3 text-left font-semibold border-l-2 border-gray-800 ${i === 0 ? 'bg-cyan-900/30 text-cyan-300' : 'bg-gray-800/50'}`}>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-full h-24 bg-gray-700 rounded-md mb-2 overflow-hidden">
                                          <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover"/>
                                        </div>
                                        <span className="font-bold">{v.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800/50">
                        {features.map((feature, featureIdx) => (
                            <tr key={featureIdx} className="group">
                                <td className="sticky left-0 bg-gray-800 group-hover:bg-gray-700/50 p-3 text-sm font-medium text-gray-300 w-[180px] z-10 transition-colors border-y border-gray-700">
                                    {feature}
                                </td>
                                {allVehicles.map((v, vehicleIdx) => (
                                    <td key={vehicleIdx} className={`p-3 align-top text-sm text-gray-200 border-l-2 border-y border-gray-700 group-hover:bg-gray-700/50 transition-colors ${vehicleIdx === 0 ? 'bg-cyan-900/20' : ''}`}>
                                        {renderValue(v, feature)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTable;

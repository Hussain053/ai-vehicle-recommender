import React from 'react';

interface RequirementSelectorProps {
  selectedRequirements: string[];
  setSelectedRequirements: (requirements: string[]) => void;
}

const ALL_BIKE_REQUIREMENTS = [
    "Good Mileage",
    "ABS (Safety)",
    "Digital Console",
    "Good for Long Rides",
    "Lightweight",
    "Powerful Performance",
    "Comfortable Pillion Seat",
    "Good for Beginners",
    "Classic/Retro look",
    "Modern Features",
    "Electric",
    "Good Off-road",
    "Bluetooth Connectivity",
    "LED Lighting",
    "Low Seat Height",
];

const BikeRequirementSelector: React.FC<RequirementSelectorProps> = ({ selectedRequirements, setSelectedRequirements }) => {
  
  const handleCheckboxChange = (requirement: string) => {
    if (selectedRequirements.includes(requirement)) {
      setSelectedRequirements(selectedRequirements.filter(r => r !== requirement));
    } else {
      setSelectedRequirements([...selectedRequirements, requirement]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Key Requirements (Select up to 7)</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {ALL_BIKE_REQUIREMENTS.map((req) => (
          <label
            key={req}
            className={`flex items-center space-x-2 cursor-pointer p-3 rounded-md transition-all duration-200 border ${
              selectedRequirements.includes(req)
                ? 'bg-cyan-600/30 border-cyan-500 text-white shadow-md'
                : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedRequirements.includes(req)}
              onChange={() => handleCheckboxChange(req)}
              disabled={!selectedRequirements.includes(req) && selectedRequirements.length >= 7}
              className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-600 focus:ring-cyan-500 disabled:opacity-50"
            />
            <span className="text-sm font-medium select-none">{req}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BikeRequirementSelector;

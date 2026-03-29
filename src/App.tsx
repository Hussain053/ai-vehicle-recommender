import React, { useState } from 'react';
import Header from './components/Header';
import CarRequirementSelector from './components/RequirementInput';
import BikeRequirementSelector from './components/BikeRequirementSelector';
import VehicleCard from './components/CarCard';
import Loader from './components/Loader';
import ComparisonTable from './components/ComparisonTable';
import { getVehicleRecommendations, getVehicleComparison } from './services/geminiService';
import type { Vehicle, UserInput } from './types';

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const initialUserInput: UserInput = {
  vehicleType: 'car',
  minBudget: 5,
  maxBudget: 15,
  city: 'Pune',
  state: 'Maharashtra',
  subType: 'Any',
  fuelType: 'Any',
  requirements: [],
};

function App() {
  const [userInput, setUserInput] = useState<UserInput>(initialUserInput);
  const [recommendedVehicles, setRecommendedVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [comparingVehicle, setComparingVehicle] = useState<Vehicle | null>(null);
  const [comparisonResult, setComparisonResult] = useState<Vehicle[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);


  const handleVehicleTypeChange = (type: 'car' | 'bike') => {
      setUserInput(prev => ({
          ...initialUserInput,
          vehicleType: type,
          minBudget: type === 'car' ? 5 : 0.8,
          maxBudget: type === 'car' ? 15 : 2,
      }));
      setRecommendedVehicles([]);
      setError(null);
      handleCloseComparison();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({ ...prev, [name]: name.includes('Budget') ? parseFloat(value) : value }));
  };

  const formatCurrency = (value: number) => {
    if (userInput.vehicleType === 'car') {
        if (value >= 100) return `₹ ${(value / 100).toFixed(1)} Cr`;
        return `₹ ${value} Lakh`;
    } else { // Bike
        if (value >= 1) return `₹ ${value.toFixed(2)} Lakh`;
        return `₹ ${Math.round(value * 100000) / 1000}k`;
    }
  };

  const handleReset = () => {
    handleVehicleTypeChange(userInput.vehicleType);
  };
  
  const handleCloseComparison = () => {
    setComparingVehicle(null);
    setComparisonResult([]);
    setComparisonError(null);
    setIsComparing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.minBudget > userInput.maxBudget) {
        setError("Minimum budget cannot be greater than maximum budget.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendedVehicles([]);
    handleCloseComparison();

    try {
      const cars = await getVehicleRecommendations(userInput);
      setRecommendedVehicles(cars);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompare = async (vehicle: Vehicle) => {
    handleCloseComparison();
    
    // Use a timeout to ensure the UI has time to reset before starting the new comparison
    setTimeout(async () => {
        setComparingVehicle(vehicle);
        setIsComparing(true);
        setComparisonError(null);
        setComparisonResult([]);
        
        const comparisonElement = document.getElementById('comparison-section');
        if (comparisonElement) {
            comparisonElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        try {
            const competitors = await getVehicleComparison(userInput, vehicle);
            if (competitors.length === 0) {
              setComparisonError("The AI could not find any direct competitors for the selected vehicle based on your criteria.");
            } else {
              setComparisonResult(competitors);
            }
        } catch (err) {
            setComparisonError(err instanceof Error ? err.message : 'An unknown error occurred while fetching comparison.');
        } finally {
            setIsComparing(false);
        }
    }, 100);
  };

  const isCar = userInput.vehicleType === 'car';
  
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-gray-800/30 border border-gray-700 rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
             <div className="flex justify-center">
                <div className="relative flex p-1 bg-gray-900/50 rounded-lg border border-gray-700">
                    <button type="button" onClick={() => handleVehicleTypeChange('car')} className={`relative w-28 py-2 text-sm font-medium transition-colors z-10 ${isCar ? 'text-white' : 'text-gray-400'}`}>Cars</button>
                    <button type="button" onClick={() => handleVehicleTypeChange('bike')} className={`relative w-28 py-2 text-sm font-medium transition-colors z-10 ${!isCar ? 'text-white' : 'text-gray-400'}`}>Bikes</button>
                    <span className={`absolute top-1 h-10 w-28 rounded-md bg-cyan-600 shadow-lg transition-transform duration-300 ease-in-out ${isCar ? 'translate-x-0' : 'translate-x-full'}`}></span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range (On-Road)</label>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-400 w-12">Min</span>
                            <input type="range" name="minBudget" min={isCar ? 1 : 0.5} max={isCar ? 150 : 20} step={isCar ? 1 : 0.1} value={userInput.minBudget} onChange={handleInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            <span className="font-semibold text-cyan-400 w-24 text-center">{formatCurrency(userInput.minBudget)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-400 w-12">Max</span>
                            <input type="range" name="maxBudget" min={isCar ? 1 : 0.5} max={isCar ? 150 : 20} step={isCar ? 1 : 0.1} value={userInput.maxBudget} onChange={handleInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                            <span className="font-semibold text-cyan-400 w-24 text-center">{formatCurrency(userInput.maxBudget)}</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">City</label>
                        <input type="text" id="city" name="city" value={userInput.city} onChange={handleInputChange} required className="w-full bg-gray-700/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">State</label>
                        <select id="state" name="state" value={userInput.state} onChange={handleInputChange} className="w-full bg-gray-700/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                           {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subType" className="block text-sm font-medium text-gray-300 mb-2">{isCar ? 'Car' : 'Bike'} Type</label>
                        <select id="subType" name="subType" value={userInput.subType} onChange={handleInputChange} className="w-full bg-gray-700/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            {isCar ? 
                                [<option key="any">Any</option>,<option key="suv">SUV</option>,<option key="sedan">Sedan</option>,<option key="hatch">Hatchback</option>,<option key="muv">MUV</option>,<option key="lux">Luxury</option>] :
                                [<option key="any">Any</option>,<option key="comm">Commuter</option>,<option key="cru">Cruiser</option>,<option key="sprt">Sports</option>,<option key="scoo">Scooter / Scooty</option>,<option key="adv">Adventure</option>]
                            }
                        </select>
                    </div>
                     <div>
                        <label htmlFor="fuelType" className="block text-sm font-medium text-gray-300 mb-2">Fuel Type</label>
                        <select id="fuelType" name="fuelType" value={userInput.fuelType} onChange={handleInputChange} className="w-full bg-gray-700/80 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                           <option>Any</option><option>Petrol</option>{isCar && <option>Diesel</option>}{isCar && <option>CNG</option>}<option>Electric</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {isCar ?
                <CarRequirementSelector selectedRequirements={userInput.requirements} setSelectedRequirements={(reqs) => setUserInput(prev => ({ ...prev, requirements: reqs }))} /> :
                <BikeRequirementSelector selectedRequirements={userInput.requirements} setSelectedRequirements={(reqs) => setUserInput(prev => ({ ...prev, requirements: reqs }))} />
            }


            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button type="submit" disabled={isLoading} className="w-full sm:w-auto flex-grow justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
                {isLoading ? 'Thinking...' : `Find My Perfect ${isCar ? 'Car' : 'Bike'}`}
              </button>
               <button type="button" onClick={handleReset} disabled={isLoading} className="w-full sm:w-auto justify-center py-3 px-8 border border-gray-600 rounded-md shadow-sm text-lg font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors">
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12">
          {isLoading && <Loader />}
          {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg max-w-2xl mx-auto">{error}</div>}
          
          {recommendedVehicles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recommendedVehicles.map((vehicle, index) => (
                <VehicleCard
                    key={`${vehicle.name}-${index}`}
                    vehicle={vehicle}
                    index={index}
                    onCompare={handleCompare}
                    isComparing={isComparing}
                />
              ))}
            </div>
          )}
        </div>
        
        <div id="comparison-section" className="mt-8 min-h-[150px]">
            {isComparing && <Loader />}
            {comparisonError && !isComparing && (
                <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg max-w-2xl mx-auto">
                    <p className="font-bold">Could Not Fetch Comparison</p>
                    <p className="text-sm mt-1">{comparisonError}</p>
                </div>
            )}
            {!isComparing && !comparisonError && comparingVehicle && comparisonResult.length > 0 && (
                <ComparisonTable 
                    originalVehicle={comparingVehicle}
                    competitors={comparisonResult}
                    onClose={handleCloseComparison}
                />
            )}
        </div>
      </main>
    </div>
  );
}

export default App;

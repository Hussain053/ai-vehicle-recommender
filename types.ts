export interface Vehicle {
  name: string;
  price: {
    exShowroom: string;
    onRoad: string;
  };
  mileage: string;
  reasoning: string;
  pros: string[];
  imageUrl: string;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
}

export interface UserInput {
  vehicleType: 'car' | 'bike';
  minBudget: number;
  maxBudget: number;
  city: string;
  state: string;
  subType: string;
  fuelType: string;
  requirements: string[];
}

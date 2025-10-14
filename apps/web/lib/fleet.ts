export interface FleetCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'luxury' | 'sport' | 'suv' | 'electric' | 'supercar';
  transmission: 'automatic' | 'manual';
  seats: number;
  pricePerDay: number;
  featured: boolean;
  specs: {
    engine?: string;
    power?: string;
    acceleration?: string;
    topSpeed?: string;
  };
  images: {
    primary: string;
    gallery: string[];
  };
  video?: string;
}

export const FLEET_DATA: FleetCar[] = [
  {
    id: 'ferrari-sf90-stradale',
    brand: 'Ferrari',
    model: 'SF90 Stradale',
    year: 2024,
    category: 'supercar',
    transmission: 'automatic',
    seats: 2,
    pricePerDay: 2999,
    featured: true,
    specs: {
      engine: '4.0L Twin-Turbo V8 + Electric',
      power: '986 HP',
      acceleration: '0-60 mph in 2.5s',
      topSpeed: '211 mph'
    },
    images: {
      primary: '/SF90-1.jpg',
      gallery: [
        '/SF90-1.jpg',
        '/SF90-2.jpg',
        '/SF90-3.jpg',
        '/SF90-4.jpg',
        '/SF90-5.jpg',
        '/SF90-6.jpg'
      ]
    }
  },
  {
    id: 'bentley-continental-gt-speed',
    brand: 'Bentley',
    model: 'Continental GT Speed W12',
    year: 2024,
    category: 'luxury',
    transmission: 'automatic',
    seats: 4,
    pricePerDay: 1799,
    featured: true,
    specs: {
      engine: '6.0L Twin-Turbo W12',
      power: '650 HP',
      acceleration: '0-60 mph in 3.5s',
      topSpeed: '208 mph'
    },
    images: {
      primary: '/Bentley Continental Speed W12 - 1.jpg',
      gallery: [
        '/Bentley Continental Speed W12 - 1.jpg',
        '/Bentley Continental Speed W12 - 2.jpg',
        '/Bentley Continental Speed W12 - 3.jpg',
        '/Bentley Continental Speed W12 - 4.jpg'
      ]
    }
  },
  {
    id: 'bentley-bentayga-w12',
    brand: 'Bentley',
    model: 'Bentayga W12',
    year: 2024,
    category: 'suv',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 1599,
    featured: true,
    specs: {
      engine: '6.0L Twin-Turbo W12',
      power: '626 HP',
      acceleration: '0-60 mph in 3.9s',
      topSpeed: '190 mph'
    },
    images: {
      primary: '/Bentley Bentayga W12 - 1.jpg',
      gallery: [
        '/Bentley Bentayga W12 - 1.jpg',
        '/Bentley Bentayga W12 - 2.jpg',
        '/Bentley Bentayga W12 - 3.jpg',
        '/Bentley Bentayga W12 - 4.jpg'
      ]
    }
  },
  {
    id: 'mercedes-benz-s580',
    brand: 'Mercedes-Benz',
    model: 'S580 4MATIC',
    year: 2024,
    category: 'luxury',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 999,
    featured: true,
    specs: {
      engine: '4.0L Twin-Turbo V8',
      power: '496 HP',
      acceleration: '0-60 mph in 4.4s',
      topSpeed: '155 mph'
    },
    images: {
      primary: '/Mercedes-Benz-S580-1.jpg',
      gallery: [
        '/Mercedes-Benz-S580-1.jpg',
        '/Mercedes-Benz-S580-2.jpg',
        '/Mercedes-Benz-S580-3.jpg'
      ]
    }
  },
  {
    id: 'rolls-royce-dawn',
    brand: 'Rolls-Royce',
    model: 'Dawn Black Badge',
    year: 2024,
    category: 'luxury',
    transmission: 'automatic',
    seats: 4,
    pricePerDay: 2499,
    featured: true,
    specs: {
      engine: '6.6L Twin-Turbo V12',
      power: '593 HP',
      acceleration: '0-60 mph in 4.3s',
      topSpeed: '155 mph'
    },
    images: {
      primary: '/Rolls-Royce-Dawn.jpg',
      gallery: [
        '/Rolls-Royce-Dawn.jpg'
      ]
    },
    video: '/Rolls-Royce-Dawn-Video.mp4'
  },
  {
    id: 'lamborghini-urus',
    brand: 'Lamborghini',
    model: 'Urus S',
    year: 2024,
    category: 'suv',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 1399,
    featured: true,
    specs: {
      engine: '4.0L Twin-Turbo V8',
      power: '666 HP',
      acceleration: '0-60 mph in 3.5s',
      topSpeed: '190 mph'
    },
    images: {
      primary: '/lamborghini-urus-1.jpg',
      gallery: [
        '/lamborghini-urus-1.jpg',
        '/lamborghini-urus-2.jpg',
        '/lamborghini-urus-3.jpg',
        '/lamborghini-urus-4.jpg',
        '/lamborghini-urus-5.jpg',
        '/lamborghini-urus-6.jpg',
        '/lamborghini-urus-7.jpg'
      ]
    },
    video: '/Lamborghini-Urus-Video.mp4'
  }
];
export interface FleetCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'luxury' | 'sport' | 'suv' | 'electric';
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
    id: 'mercedes-cla-amg-2024',
    brand: 'Mercedes-Benz',
    model: 'CLA AMG',
    year: 2024,
    category: 'luxury',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 385,
    featured: true,
    specs: {
      engine: '2.0L Turbo I4',
      power: '382 HP',
      acceleration: '0-60 mph in 4.0s',
      topSpeed: '168 mph'
    },
    images: {
      primary: '/Mercedes-CLA-AMG-2024.jpg',
      gallery: [
        '/Mercedes-CLA-AMG-2024.jpg',
        '/Mercedes-CLA-AMG-2024-2.jpg'
      ]
    },
    video: '/Mercedes-CLA-AMG-2024.mp4'
  },
  {
    id: 'mercedes-c43-amg',
    brand: 'Mercedes-Benz',
    model: 'C43 AMG',
    year: 2023,
    category: 'luxury',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 425,
    featured: true,
    specs: {
      engine: '2.0L Turbo I4 + Electric',
      power: '402 HP',
      acceleration: '0-60 mph in 4.6s',
      topSpeed: '155 mph'
    },
    images: {
      primary: '/C43Silver-1.jpg',
      gallery: [
        '/C43Silver-1.jpg',
        '/C43Silver-2.jpg',
        '/C43Silver-Interior-1.jpg'
      ]
    }
  },
  {
    id: 'mercedes-cla-250-2018',
    brand: 'Mercedes-Benz',
    model: 'CLA 250',
    year: 2018,
    category: 'luxury',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 225,
    featured: false,
    specs: {
      engine: '2.0L Turbo I4',
      power: '208 HP',
      acceleration: '0-60 mph in 6.9s',
      topSpeed: '130 mph'
    },
    images: {
      primary: '/2018-CLA250.jpg',
      gallery: [
        '/2018-CLA250.jpg'
      ]
    }
  },
  {
    id: 'porsche-cayenne-white',
    brand: 'Porsche',
    model: 'Cayenne',
    year: 2024,
    category: 'suv',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 525,
    featured: true,
    specs: {
      engine: '3.0L Turbo V6',
      power: '335 HP',
      acceleration: '0-60 mph in 5.9s',
      topSpeed: '152 mph'
    },
    images: {
      primary: '/PorscheCayenneWhite-1.jpg',
      gallery: [
        '/PorscheCayenneWhite-1.jpg',
        '/PorscheCayenneWhite-2.jpg',
        '/PorscheCayenneWhite-3.jpg',
        '/PorscheCayenneWhite-4.jpg',
        '/PorscheCayenneWhite-5.jpg',
        '/PorscheCayenneWhite-6.jpg',
        '/PorscheCayenneWhite-7.jpg',
        '/PorscheCayenneWhite-8.jpg'
      ]
    },
    video: '/PorscheCayenneWhite.mp4'
  }
];

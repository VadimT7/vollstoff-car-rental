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
    id: 'audi-s5-sportback',
    brand: 'Audi',
    model: 'S5 Sportback',
    year: 2020,
    category: 'sport',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 220,
    featured: true,
    specs: {
      engine: '3.0L Turbo V6',
      power: '349 HP',
      acceleration: '0-60 mph in 4.7s',
      topSpeed: '155 mph'
    },
    images: {
      primary: '/AudiS5-1.jpg',
      gallery: [
        '/AudiS5-1.jpg',
        '/AudiS5-2.jpg',
        '/AudiS5-3.jpg',
        '/AudiS5-4.jpg',
        '/AudiS5-5.jpg',
        '/AudiS5-6.jpg',
        '/AudiS5-7.jpg'
      ]
    },
    video: '/AudiS5-Video.mp4'
  },
  {
    id: 'audi-s3-sedan',
    brand: 'Audi',
    model: 'S3 Sedan',
    year: 2019,
    category: 'sport',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 200,
    featured: true,
    specs: {
      engine: '2.0L Turbo I4',
      power: '288 HP',
      acceleration: '0-60 mph in 4.8s',
      topSpeed: '155 mph'
    },
    images: {
      primary: '/AudiS3-1.jpg',
      gallery: [
        '/AudiS3-1.jpg',
        '/AudiS3-2.jpg',
        '/AudiS3-3.jpg'
      ]
    },
    video: '/AudiS3-Video.mp4'
  }
];

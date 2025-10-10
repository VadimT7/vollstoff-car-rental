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
    id: 'lamborghini-huracan-yellow',
    brand: 'Lamborghini',
    model: 'Huracán',
    year: 2023,
    category: 'sport',
    transmission: 'automatic',
    seats: 2,
    pricePerDay: 999,
    featured: true,
    specs: {
      engine: '5.2L V10',
      power: '631 HP',
      acceleration: '0-60 mph in 2.9s',
      topSpeed: '202 mph'
    },
    images: {
      primary: '/Lamborghini-Huracan-Yellow.jpg',
      gallery: [
        '/Lamborghini-Huracan-Yellow.jpg'
      ]
    },
    video: '/lamborghini-driving.mp4'
  },
  {
    id: 'lamborghini-urus-green',
    brand: 'Lamborghini',
    model: 'Urus',
    year: 2023,
    category: 'suv',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 1199,
    featured: true,
    specs: {
      engine: '4.0L Twin-Turbo V8',
      power: '641 HP',
      acceleration: '0-60 mph in 3.6s',
      topSpeed: '190 mph'
    },
    images: {
      primary: '/Lamborghini-Urus-Green.png',
      gallery: [
        '/Lamborghini-Urus-Green.png'
      ]
    },
    video: '/lamborghini-driving2.mp4'
  },
  {
    id: 'mercedes-amg-sl63',
    brand: 'Mercedes-Benz',
    model: 'AMG SL63',
    year: 2023,
    category: 'luxury',
    transmission: 'automatic',
    seats: 2,
    pricePerDay: 899,
    featured: true,
    specs: {
      engine: '4.0L Twin-Turbo V8',
      power: '577 HP',
      acceleration: '0-60 mph in 3.5s',
      topSpeed: '196 mph'
    },
    images: {
      primary: '/Mercedes-AMG-SL63.png',
      gallery: [
        '/Mercedes-AMG-SL63.png'
      ]
    }
  },
  {
    id: 'porsche-911-gt3-rs',
    brand: 'Porsche',
    model: '911 GT3 RS',
    year: 2023,
    category: 'sport',
    transmission: 'automatic',
    seats: 2,
    pricePerDay: 949,
    featured: true,
    specs: {
      engine: '4.0L Flat-6',
      power: '518 HP',
      acceleration: '0-60 mph in 3.2s',
      topSpeed: '184 mph'
    },
    images: {
      primary: '/Porsche-GT3RS-Grey-Black.jpg',
      gallery: [
        '/Porsche-GT3RS-Grey-Black.jpg'
      ]
    }
  }
];


import React from 'react';
import { Product } from './types';

export const LOGO_SVG = (
  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4"/>
    <path d="M35 25C35 36.0457 41.7157 45 50 45C58.2843 45 65 36.0457 65 25" stroke="white" strokeWidth="4"/>
    <path d="M35 75C35 63.9543 41.7157 55 50 55C58.2843 55 65 63.9543 65 75" stroke="white" strokeWidth="4"/>
    <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="4"/>
  </svg>
);

export const products: Product[] = [
  {
    id: 1,
    name: 'Madrid Home Jersey',
    price: 25.00,
    category: 'La Liga',
    images: [
      'https://picsum.photos/seed/madrid1/800/800',
      'https://picsum.photos/seed/madrid2/800/800',
      'https://picsum.photos/seed/madrid3/800/800',
    ],
    options: {
      sizes: ['S', 'M', 'L', 'XL'],
      versions: ['Fan Version', 'Player Version'],
      sleeves: ['Short Sleeve', 'Long Sleeve'],
      patches: ['Champions League', 'La Liga', 'No Patch'],
    }
  },
  {
    id: 2,
    name: 'Barca Home Jersey',
    price: 25.00,
    category: 'La Liga',
    images: [
      'https://picsum.photos/seed/barca1/800/800',
      'https://picsum.photos/seed/barca2/800/800',
    ],
     options: {
      sizes: ['S', 'M', 'L', 'XL'],
      versions: ['Fan Version', 'Player Version'],
      sleeves: ['Short Sleeve', 'Long Sleeve'],
      patches: ['Champions League', 'La Liga', 'No Patch'],
    }
  },
  {
    id: 3,
    name: 'Malaga Home Jersey',
    price: 25.00,
    category: 'Segunda División',
    images: [
      'https://picsum.photos/seed/malaga1/800/800',
    ],
     options: {
      sizes: ['S', 'M', 'L', 'XL'],
      versions: ['Fan Version', 'Player Version'],
      sleeves: ['Short Sleeve', 'Long Sleeve'],
      patches: ['Segunda División', 'No Patch'],
    }
  },
  {
    id: 4,
    name: 'Madrid Away Jersey',
    price: 25.00,
    category: 'La Liga',
    images: [
      'https://picsum.photos/seed/madridaway/800/800',
    ],
     options: {
      sizes: ['S', 'M', 'L', 'XL'],
      versions: ['Fan Version', 'Player Version'],
      sleeves: ['Short Sleeve', 'Long Sleeve'],
      patches: ['Champions League', 'La Liga', 'No Patch'],
    }
  },
  {
    id: 5,
    name: 'Santos F.C. Jersey',
    price: 25.00,
    category: 'Brasileirão',
    images: [
      'https://picsum.photos/seed/santos/800/800',
      'https://picsum.photos/seed/santos2/800/800',
      'https://picsum.photos/seed/santos3/800/800',
      'https://picsum.photos/seed/santos4/800/800',
    ],
    options: {
      sizes: ['S', 'M', 'L', 'XL'],
      versions: ['Fan Version', 'Player Version'],
      sleeves: ['Short Sleeve', 'Long Sleeve'],
      patches: ['Brasileirão', 'No Patch'],
    }
  }
];

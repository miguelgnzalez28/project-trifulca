
import React from 'react';
import { products } from '../constants';
import ProductCard from './ProductCard';
import { Product, View } from '../types';

interface ProductListPageProps {
  onNavigate: (view: View, product?: Product) => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl text-white font-heading tracking-wider">NOMBRE DE COLECCIÓN</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => onNavigate('detail', product)} />
          ))}
        </div>
        <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
                <a href="#" className="px-4 py-2 text-white bg-gray-800 rounded-md">1</a>
                <a href="#" className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">2</a>
                <a href="#" className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md">3</a>
            </nav>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

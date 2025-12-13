
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="bg-[#E7E9E4] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-black font-heading tracking-wide">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">DESDE ${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;

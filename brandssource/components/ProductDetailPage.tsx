
import React, { useState } from 'react';
import { Product } from '../types';
import { products as topProducts } from '../constants';

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.options.sizes[0] || null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(product.options.versions[0] || null);
  const [selectedSleeve, setSelectedSleeve] = useState<string | null>(product.options.sleeves[0] || null);
  const [selectedPatch, setSelectedPatch] = useState<string | null>(product.options.patches[2] || 'No Patch');
  const [quantity, setQuantity] = useState(1);

  const OptionButton: React.FC<{ value: string; selectedValue: string | null; onClick: (value: string) => void; }> = ({ value, selectedValue, onClick }) => (
    <button
      onClick={() => onClick(value)}
      className={`px-4 py-2 border rounded-md text-sm transition-colors duration-200 ${
        selectedValue === value
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
    >
      {value}
    </button>
  );

  return (
    <div className="bg-[#E7E9E4] text-black pt-28 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-w-1 aspect-h-1 mb-4 rounded-lg overflow-hidden">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${mainImage === img ? 'border-[#3D7F5D]' : 'border-transparent'}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details & Options */}
          <div>
            <h1 className="text-3xl font-heading tracking-wide">{product.name}</h1>
            <p className="text-2xl text-gray-800 my-4">${product.price.toFixed(2)}</p>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-sm mb-2 font-heading">TALLAS</h3>
                <div className="flex flex-wrap gap-2">
                  {product.options.sizes.map(size => (
                    <OptionButton key={size} value={size} selectedValue={selectedSize} onClick={setSelectedSize} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-2 font-heading">PARCHES</h3>
                <div className="flex flex-wrap gap-2">
                  {product.options.patches.map(patch => (
                    <OptionButton key={patch} value={patch} selectedValue={selectedPatch} onClick={setSelectedPatch} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-2 font-heading">VERSIÓN</h3>
                <div className="flex flex-wrap gap-2">
                  {product.options.versions.map(version => (
                    <OptionButton key={version} value={version} selectedValue={selectedVersion} onClick={setSelectedVersion} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-2 font-heading">MANGAS</h3>
                <div className="flex flex-wrap gap-2">
                  {product.options.sleeves.map(sleeve => (
                    <OptionButton key={sleeve} value={sleeve} selectedValue={selectedSleeve} onClick={setSelectedSleeve} />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <input type="text" placeholder="NOMBRE Y DORSAL" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3D7F5D] focus:border-[#3D7F5D]"/>
                <input type="text" placeholder="NÚMERO DORSAL" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3D7F5D] focus:border-[#3D7F5D]"/>
            </div>

            <div className="flex items-center space-x-4 mt-8">
              <h3 className="font-bold text-sm font-heading">CANTIDAD</h3>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 text-lg">-</button>
                <span className="px-4 py-1 border-l border-r border-gray-300">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 text-lg">+</button>
              </div>
            </div>

            <button className="w-full mt-8 bg-[#3D7F5D] text-white py-4 rounded-md font-heading text-lg tracking-wider hover:bg-opacity-90 transition-colors duration-300">
              AGREGAR AL CARRITO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

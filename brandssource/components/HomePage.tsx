
import React from 'react';
import { products } from '../constants';
import { Product, View } from '../types';

interface HomePageProps {
  onNavigate: (view: View, product?: Product) => void;
}

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FFC71F]" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.13,3.87a2.6,2.6,0,0,0-3.75,0L12,5.25,10.62,3.87a2.6,2.6,0,0,0-3.75,0,2.6,2.6,0,0,0,0,3.75L8.25,9,2,9A1,1,0,0,0,1,10v2a1,1,0,0,0,1,1H3v5a1,1,0,0,0,1,1H16a1,1,0,0,0,1-1V13h2a1,1,0,0,0,1-1V10a1,1,0,0,0-1-1H11.75l1.38-1.38a2.6,2.6,0,0,0,0-3.75Z"/>
    </svg>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-center justify-center space-x-4 mb-8">
        <TrophyIcon />
        <h2 className="text-3xl md:text-4xl text-white font-heading tracking-wider">{children}</h2>
        <TrophyIcon />
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const topSellers = products.slice(0, 5);

  return (
    <div className="text-white bg-gradient-to-b from-[#1a1a1a] to-[#111]">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <img src="https://picsum.photos/seed/hero/1920/1080" alt="Hero background" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="relative z-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-widest">ULTIMATE KITS</h1>
          <p className="text-xl md:text-2xl mt-4 font-light">Your Source for Iconic Jerseys</p>
        </div>
      </div>

      {/* Top Sellers Section */}
      <section className="py-20 bg-[#1e1e1e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/football.png')] opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle>NUESTRO TOP VENTAS</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {topSellers.map(product => (
                    <div key={product.id} 
                         className="bg-[#E7E9E4] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-[#FFC71F]"
                         onClick={() => onNavigate('detail', product)}
                    >
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden p-2">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-md"/>
                        </div>
                        <div className="p-3 text-center bg-white">
                            <h3 className="text-black font-heading text-sm uppercase tracking-wide truncate">{product.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionTitle>COLECCIONES</SectionTitle>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div onClick={() => onNavigate('list')} className="h-48 bg-gray-800 rounded-lg flex items-center justify-center font-heading text-2xl tracking-wider cursor-pointer hover:bg-[#3D7F5D] transition-colors duration-300">LA LIGA</div>
                <div onClick={() => onNavigate('list')} className="h-48 bg-gray-800 rounded-lg flex items-center justify-center font-heading text-2xl tracking-wider cursor-pointer hover:bg-[#3D7F5D] transition-colors duration-300">PREMIER LEAGUE</div>
                <div onClick={() => onNavigate('list')} className="h-48 bg-gray-800 rounded-lg flex items-center justify-center font-heading text-2xl tracking-wider cursor-pointer hover:bg-[#3D7F5D] transition-colors duration-300">SERIE A</div>
            </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#1e1e1e]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionTitle>PREGUNTAS FRECUENTES</SectionTitle>
            <div className="max-w-3xl mx-auto text-left space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold font-heading">What are the shipping times?</h3>
                    <p className="text-gray-400 mt-2">Shipping usually takes 5-7 business days for domestic orders and 10-15 for international orders.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold font-heading">What is your return policy?</h3>
                    <p className="text-gray-400 mt-2">We accept returns within 30 days of purchase for a full refund, provided the item is in its original condition.</p>
                </div>
                 <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-bold font-heading">Do you offer customization?</h3>
                    <p className="text-gray-400 mt-2">Yes, most of our jerseys can be customized with a name and number. See the product page for details.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

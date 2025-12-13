
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4"/>
                <path d="M35 25C35 36.0457 41.7157 45 50 45C58.2843 45 65 36.0457 65 25" stroke="white" strokeWidth="4"/>
                <path d="M35 75C35 63.9543 41.7157 55 50 55C58.2843 55 65 63.9543 65 75" stroke="white" strokeWidth="4"/>
                <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="4"/>
            </svg>
            <span className="ml-3 text-white text-lg font-heading tracking-wider">ULTIMATE KITS</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a onClick={() => onNavigate('list')} className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer font-heading text-sm">COLECCIONES</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 font-heading text-sm">TOP VENTAS</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 font-heading text-sm">PREGUNTAS FRECUENTES</a>
          </nav>
          <div className="flex items-center">
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center font-heading text-sm">
              CARRITO
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

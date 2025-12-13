
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            <a href="#" className="hover:text-white transition-colors duration-300 font-heading text-xs">INSTAGRAM</a>
            <a href="#" className="hover:text-white transition-colors duration-300 font-heading text-xs">WHATSAPP</a>
            <a href="#" className="hover:text-white transition-colors duration-300 font-heading text-xs">GMAIL</a>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="flex items-center">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="4"/>
                    <path d="M35 25C35 36.0457 41.7157 45 50 45C58.2843 45 65 36.0457 65 25" stroke="white" strokeWidth="4"/>
                    <path d="M35 75C35 63.9543 41.7157 55 50 55C58.2843 55 65 63.9543 65 75" stroke="white" strokeWidth="4"/>
                    <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="4"/>
                </svg>
                <span className="ml-3 text-white text-lg font-heading tracking-wider">ULTIMATE KITS</span>
            </div>
            <p className="text-xs mt-2">2025</p>
          </div>
          <div className="flex items-center space-x-6">
            {/* Placeholder for right side icons from mockup */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

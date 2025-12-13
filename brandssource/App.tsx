
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProductListPage from './components/ProductListPage';
import ProductDetailPage from './components/ProductDetailPage';
import { Product, View } from './types';
import SmartAssistant from './components/SmartAssistant';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleNavigate = (view: View, product: Product | undefined = undefined) => {
    window.scrollTo(0, 0); // Scroll to top on page change
    if (view === 'detail' && product) {
      setSelectedProduct(product);
      setCurrentView('detail');
    } else if (view === 'list') {
      setCurrentView('list');
      setSelectedProduct(null);
    } else {
      setCurrentView('home');
      setSelectedProduct(null);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'list':
        return <ProductListPage onNavigate={handleNavigate} />;
      case 'detail':
        return selectedProduct ? <ProductDetailPage product={selectedProduct} /> : <HomePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <Header onNavigate={handleNavigate} />
      <main>
        {renderView()}
      </main>
      <Footer />
      <SmartAssistant />
    </div>
  );
};

export default App;

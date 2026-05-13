import { useEffect } from 'react';
import { useLenis } from './hooks/useLenis';
import { BrandProvider, useBrand } from './context/BrandContext';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Menu from './sections/Menu';
import OrderForm from './sections/OrderForm';
import Gallery from './sections/Gallery';
import Footer from './sections/Footer';
import { siteConfig, twcSiteConfig } from './config';

function AppContent() {
  useLenis();
  const { isTWC } = useBrand();

  const config = isTWC ? twcSiteConfig : siteConfig;

  useEffect(() => {
    document.title = config.siteTitle || '';
    document.documentElement.lang = config.language || '';

    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = config.siteDescription || '';
  }, [config]);

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Menu />
        <OrderForm />
        <Gallery />
        <Footer />
      </main>
    </>
  );
}

function App() {
  return (
    <BrandProvider>
      <AppContent />
    </BrandProvider>
  );
}

export default App;


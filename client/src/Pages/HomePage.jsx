import React from 'react';
import Hero from '../Components/Hero/Hero';
import Feature from '../Components/Feature/Feature';
import Menu from '../Components/Menu/Menu';
import PromoSection from '../Components/PromoSection/PromoSection';
import TopSellingItems from '../Components/TopSellingItems/TopSellingItems';

const HomePage = () => {
  return (
    <>
      <Hero />
      <TopSellingItems />
      <Feature />
      <Menu />
      <PromoSection />
    </>
  );
};

export default HomePage;

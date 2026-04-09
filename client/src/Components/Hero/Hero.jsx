import React from 'react';
import './Hero.css';
import { useAppContext } from '../../Context/AppContext';

const Hero = () => {
  const { currentHero, navigate } = useAppContext();

  return (
    <div className='hero-container section'>
      <div className="container">
        {currentHero ? (
          <div className="hero-content">
            <div className="hero-text">
              <h1>{currentHero.title}</h1>
              <p>{currentHero.paragraph}</p>
              <button className="hero-btn" onClick={() => navigate('/menu')}>Order Now</button>
            </div>
            <div className="hero-img-wrapper">
              <img src={currentHero.image} alt={currentHero.title} className="hero-img" />
            </div>
          </div>
        ) : (
          
          /* THE NUCLEAR OPTION SKELETON: No shared classes */
          <div className="skeleton-wrapper">
            <div className="skeleton-left">
              <div className="skel-element skel-title"></div>
              <div className="skel-element skel-text"></div>
              <div className="skel-element skel-text skel-short"></div>
              <div className="skel-element skel-btn"></div>
            </div>
            <div className="skeleton-right">
              <div className="skel-element skel-circle"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;
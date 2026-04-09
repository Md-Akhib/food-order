import React from 'react'
import './About.css'
import about from '../../assets/about/about.webp'
import aboutSm from '../../assets/about/about-sm.webp'

// Inline SVGs for icons to ensure it works without external dependencies
const ForkKnifeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
)

const BadgeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f15b22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
)

const ChefHatIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f15b22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-4a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v4" />
    <path d="M6 15V9" />
    <path d="M18 15V9" />
    <path d="M6 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M12 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  </svg>
)

const About = () => {
  return (
    <>
      {/* First Div: About Us Section */}
      <div className='container section about-us-container'>
        <div className='about-us-left'>
          <div className='about-img-wrapper'>
            {/* User will add src later */}
            <img src={about} alt='' className='about-main-img' />
          </div>
        </div>

        <div className='about-us-right'>
          <div className='about-subtitle'>
            <span className='icon'><ForkKnifeIcon /></span> ABOUT US <span className='icon'><ForkKnifeIcon /></span>
          </div>
          <h2 className='about-title'>Variety Of Flavours From American Cuisine</h2>
          <p className='about-desc'>
            Every dish is not just prepared it is a crafted with a savor the a utmost precision and a deep understanding sdf of flavor harmony. The experienced hands of our chefs
          </p>

          <div className='about-features'>
            <div className='feature-item'>
              <div className='feature-icon'><BadgeIcon /></div>
              <div className='feature-content'>
                <h4>Super Quality Food</h4>
                <p>Served our Testy Food & good food by friendly</p>
              </div>
            </div>
            <div className='feature-item'>
              <div className='feature-icon'><ChefHatIcon /></div>
              <div className='feature-content'>
                <h4>Qualified Chef</h4>
                <p>Served our Testy Food & good food by friendly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Div: Special Food Banner Section */}
      <div className='special-banner-wrapper'>
        <div className='container special-banner-container'>
          <div className='special-banner-left'>
            <h5 className='banner-subtitle'>WELCOME FRESHEAT</h5>
            <h1 className='abotu-banner-title'>TODAY SPACIAL FOOD</h1>
            <h3 className='banner-limit'>Limits Time Offer</h3>
            <button className='order-now-btn'>ORDER NOW <span className='arrow'>&rarr;</span></button>
          </div>
          <div className='special-banner-right'>
            <div className='banner-item-wrapper'>
              {/* User will add item img src later */}
              <img src={aboutSm} alt='' className='banner-item-img' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About

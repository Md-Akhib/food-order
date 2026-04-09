import React from 'react';
import './PromoSection.css'; 
import deliveryMan from '../../assets/delivery-man.png'

const PromoSection = () => {
    return (
        <div className="section container">
            <div className="promo-wrapper">

                {/* Left Side Content */}
                <div className="promo-content">
                    <span className="promo-subtitle">Crispy, Every Bite Taste</span>
                    <h2 className="promo-heading">
                        30 Minutes Fast <br />
                        <span className="highlighted-text">Delivery</span> Challenge
                    </h2>
                    <button className="promo-btn">
                        ORDER NOW
                    </button>
                </div>

                {/* Right Side Image */}
                <div className="promo-visual">
                    <img src={deliveryMan} alt="Delivery Rider" className="delivery-rider-img" />
                </div>

            </div>
        </div>
    );
};

export default PromoSection;
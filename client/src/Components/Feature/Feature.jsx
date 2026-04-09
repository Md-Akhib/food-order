import React from 'react';
import './Feature.css';

import f1 from '../../assets/feature/f1.webp';
import f2 from '../../assets/feature/f2.webp';
import f3 from '../../assets/feature/f3.webp';
import f4 from '../../assets/feature/f4.webp';

const featuresData = [
    {
        id: 1,
        title: "Best Quality Food",
        desc: "Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.",
        img: f1,
        imageTop: true,
    },
    {
        id: 2,
        title: "Home delivery",
        desc: "Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.",
        img: f2,
        imageTop: false,
    },
    {
        id: 3,
        title: "Real Taste",
        desc: "Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.",
        img: f3,
        imageTop: true,
    },
    {
        id: 4,
        title: "Traditional food",
        desc: "Excellence projecting is devonshire dispatched remarkably on estimating. Side in so life past.",
        img: f4,
        imageTop: false,
    }
];

const Feature = () => {
    return (
        <section className="features-section">
            <div className="features-flex-container">
                {featuresData.map((feature) => (
                    <div key={feature.id} className="features-item">
                        <div className="feature-card">
                            {feature.imageTop ? (
                                <>
                                    <div className="image-wrapper margin-bottom">
                                        <img src={feature.img} alt={feature.title} className="feature-img" loading="lazy" />
                                    </div>
                                    <div className="text-content justify-start">
                                        <h3 className="feature-title title-margin-small">{feature.title}</h3>
                                        <p className="feature-desc">{feature.desc}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-content justify-end">
                                        <p className="feature-desc desc-margin">{feature.desc}</p>
                                        <h3 className="feature-title title-margin-large">{feature.title}</h3>
                                    </div>
                                    <div className="image-wrapper margin-top-auto">
                                        <img src={feature.img} alt={feature.title} className="feature-img" loading="lazy" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Feature;
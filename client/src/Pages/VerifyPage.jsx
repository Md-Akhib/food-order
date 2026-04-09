import React, { useEffect } from 'react';
import { useAppContext } from '../Context/AppContext';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyPage = () => {
    const { axios, navigate, clearCart, fetchUser } = useAppContext();
    const [searchParams] = useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const verifyPayment = async () => {
        try {
            const { data } = await axios.post('/api/order/verify', {
                success,
                orderId,
            });

            if (data.success) {
                await clearCart();
                await fetchUser();
                navigate('/orders');
                toast.success(data.message);
            } else {
                toast.error(data.message);
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        verifyPayment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="verify-page-container">
            <div className="verify-card">
                <div className="loader-wrapper">
                    <div className="modern-spinner"></div>
                    {/* Optional: A subtle pulse ring behind the spinner */}
                    <div className="spinner-pulse"></div>
                </div>

                <h2 className="verify-title">Verifying Payment</h2>
                <p className="verify-subtitle">
                    Please wait a moment while we securely confirm your transaction...
                </p>
            </div>

            {/* --- INJECTED CSS --- */}
            <style>{`
                /* --- Full Page Container --- */
                .verify-page-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
                    font-family: 'Inter', system-ui, sans-serif;
                    padding: 1rem;
                }

                /* --- Modern Glass/Shadow Card --- */
                .verify-card {
                    background: #ffffff;
                    padding: 3rem 2rem;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
                    text-align: center;
                    max-width: 420px;
                    width: 100%;
                    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }

                /* --- Typography --- */
                .verify-title {
                    margin: 0 0 0.8rem 0;
                    color: #1a1a1a;
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }

                .verify-subtitle {
                    color: #636e72;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin: 0;
                }

                /* --- Modern Loader Setup --- */
                .loader-wrapper {
                    position: relative;
                    width: 70px;
                    height: 70px;
                    margin: 0 auto 2rem auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                /* The actual spinning ring */
                .modern-spinner {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    border: 4px solid #f0f0f0;
                    border-top: 4px solid #ff4757; /* Matches your brand color */
                    border-radius: 50%;
                    animation: smoothSpin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    z-index: 2;
                }

                /* A soft pulsing glow behind the spinner */
                .spinner-pulse {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    background: rgba(255, 71, 87, 0.2);
                    border-radius: 50%;
                    animation: pulseGlow 2s ease-in-out infinite;
                    z-index: 1;
                }

                /* --- Keyframe Animations --- */
                @keyframes smoothSpin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                @keyframes pulseGlow {
                    0% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.4);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                }

                @keyframes slideUpFade {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default VerifyPage;
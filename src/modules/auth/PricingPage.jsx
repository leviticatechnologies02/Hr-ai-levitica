import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { getUserRole } from "../../shared/utils/auth";
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';

const PricingPage = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Subscription form states
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    const userRole = getUserRole();
    if (userRole === 'superadmin') {
      navigate('/super-admin');
    }
    setIsLoaded(true);
  }, [navigate]);

  useEffect(() => {
    if (selectedPlan && address && city && country) {
      const subtotal = getSubtotal();
      if (country.toLowerCase() === 'india') {
        setTaxRate(0.18);
        setTaxAmount(subtotal * 0.18);
      } else {
        setTaxRate(0.10);
        setTaxAmount(subtotal * 0.10);
      }
    } else {
      setTaxRate(0);
      setTaxAmount(0);
    }
  }, [address, city, country, selectedPlan, isYearly]);

  useEffect(() => {
    let timer;
    if (showSuccess && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    } else if (showSuccess && redirectCountdown === 0) {
      navigate('/dashboard');
    }
    return () => clearTimeout(timer);
  }, [showSuccess, redirectCountdown, navigate]);

  const pricingPlans = [
    {
      name: 'FREE',
      color: '#E8B4F8',
      monthlyPrice: '₹0',
      yearlyPrice: '₹500',
      features: [
        { text: '50 GB Bandwidth', included: true },
        { text: 'Financial Analysis', included: true },
        { text: '24 hour support', included: false },
        { text: 'Customer Management', included: false },
        { text: 'Advanced Analytics', included: false }
      ]
    },
    {
      name: 'BASIC',
      color: '#FF69B4',
      monthlyPrice: '₹799',
      yearlyPrice: '₹7,990',
      features: [
        { text: '50 GB Bandwidth', included: true },
        { text: 'Financial Analysis', included: true },
        { text: '24 hour support', included: true },
        { text: 'Customer Management', included: false },
        { text: 'Advanced Analytics', included: false }
      ]
    },
    {
      name: 'STANDARD',
      color: '#8B5CF6',
      monthlyPrice: '₹1,199',
      yearlyPrice: '₹11,990',
      features: [
        { text: '50 GB Bandwidth', included: true },
        { text: 'Financial Analysis', included: true },
        { text: '24 hour support', included: true },
        { text: 'Customer Management', included: true },
        { text: 'Advanced Analytics', included: false }
      ]
    }
   
  ];

  const comparisonFeatures = [
    { name: 'Projects', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Storage', free: '10GB', pro: '100GB', enterprise: 'Unlimited' },
    { name: 'Team Members', free: '1', pro: '10', enterprise: 'Unlimited' },
    { name: 'Analytics', free: 'Basic', pro: 'Advanced', enterprise: 'Custom' },
    { name: 'Support', free: 'Community', pro: 'Priority', enterprise: 'Dedicated' },
    { name: 'API Access', free: false, pro: true, enterprise: true },
    { name: 'Custom Branding', free: false, pro: true, enterprise: true },
    { name: 'SSO/SAML', free: false, pro: false, enterprise: true },
    { name: 'SLA', free: false, pro: false, enterprise: true },
    { name: 'Custom Integrations', free: false, pro: false, enterprise: true }
  ];

  const faqs = [
    {
      q: 'Can I change plans at any time?',
      a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we will prorate any differences in cost.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for Enterprise plans.'
    },
    {
      q: 'Is there a long-term contract?',
      a: 'No, all our plans are month-to-month with no long-term contracts required. You can cancel anytime without penalties.'
    },
    {
      q: 'Do you offer refunds?',
      a: 'Yes, we offer a 30-day money-back guarantee. If you are not satisfied within the first 30 days, we will provide a full refund.'
    },
    {
      q: 'What happens to my data if I cancel?',
      a: 'Your data remains accessible for 60 days after cancellation. You can export it at any time during this period.'
    }
  ];

  const handleGetStarted = (plan) => {
    const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const numericPrice = parseFloat(currentPrice.replace(/[₹,]/g, ''));
    
    if (numericPrice === 0) {
      navigate('/dashboard');
    } else {
      setSelectedPlan(plan);
      setShowSubscription(true);
    }
  };

  const handleBackToPricing = () => {
    setShowSubscription(false);
    setSelectedPlan(null);
    setAddress('');
    setCity('');
    setState('');
    setZipCode('');
    setCountry('');
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
  };

  const getSubtotal = () => {
    if (!selectedPlan) return 0;
    const priceStr = isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
    return parseFloat(priceStr.replace(/[₹,]/g, ''));
  };

  const subtotal = getSubtotal();
  const totalDue = subtotal + taxAmount;

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    setTimeout(() => {
      setProcessingPayment(false);
      setShowSuccess(true);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    navigate('/dashboard');
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .slide-in-left {
            animation: slideInLeft 0.6s ease-out forwards;
          }
          .slide-in-right {
            animation: slideInRight 0.6s ease-out forwards;
          }
          .scale-in {
            animation: scaleIn 0.5s ease-out forwards;
          }
          .payment-card {
            transition: all 0.3s ease;
          }
          .payment-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          }
          .input-focus-effect:focus {
            border-color: #8B5CF6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
            outline: none;
          }
          .spinner {
            animation: spin 1s linear infinite;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
          }
          .modal-content {
            max-width: 450px;
            width: 90%;
          }
        `}
      </style>
      <Navbar/>
      <div className="min-vh-100" style={{ 
        background: 'linear-gradient(135deg, #28197bff 0%, #eff1f4ff 100%)' 
      }}>
        <div className="container py-5 mt-20">
          {!showSubscription ? (
            /* Pricing Page Content */
            <>
              {/* Header */}
              <div 
                className={`text-center text-white mb-5 ${isLoaded ? 'fade-in-up' : ''}`}
                style={{ opacity: isLoaded ? 1 : 0 }}
              >
                <h1 className="display-4 fw-bold mb-3">Our Pricing & Plans</h1>
                
                {/* Toggle Switch */}
                <div className="d-flex justify-content-center mb-5">
                  <div 
                    className="position-relative d-flex align-items-center"
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '25px',
                      padding: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {/* Sliding Background */}
                    <div
                      className="position-absolute"
                      style={{
                        backgroundColor: '#3B82F6',
                        borderRadius: '20px',
                        height: '36px',
                        width: '50%',
                        left: isYearly ? '50%' : '4px',
                        top: '4px',
                        transition: 'left 0.3s ease',
                        zIndex: 1
                      }}
                    />
                    
                    {/* Monthly Option */}
                    <button
                      className={`position-relative border-0 bg-transparent px-4 py-2 fw-bold text-uppercase ${
                        !isYearly ? 'text-white' : 'text-dark'
                      }`}
                      style={{
                        borderRadius: '20px',
                        fontSize: '14px',
                        zIndex: 2,
                        transition: 'color 0.3s ease'
                      }}
                      onClick={() => setIsYearly(false)}
                    >
                      MONTHLY
                    </button>
                    
                    {/* Yearly Option */}
                    <button
                      className={`position-relative border-0 bg-transparent px-4 py-2 fw-bold text-uppercase ${
                        isYearly ? 'text-white' : 'text-dark'
                      }`}
                      style={{
                        borderRadius: '20px',
                        fontSize: '14px',
                        zIndex: 2,
                        transition: 'color 0.3s ease'
                      }}
                      onClick={() => setIsYearly(true)}
                    >
                      YEARLY
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className='row g-4 justify-content-center px-3'>
          {pricingPlans.map((plan, index) => {
            // Get current price to determine if it's truly free
            const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const numericPrice = parseFloat(currentPrice.replace(/[₹,]/g, ''));
            const isTrulyFree = numericPrice === 0;
            
            return (
              <div 
                key={index} 
                className='col-12 col-sm-6 col-lg-3'
                style={{
                  opacity: isLoaded ? 1 : 0,
                  animation: isLoaded ? `fadeInUp 0.6s ease-out ${index * 0.15}s forwards` : 'none'
                }}
              >
                <div 
                  className='card h-100 border-0 shadow-lg position-relative' 
                  style={{ 
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    transform: 'translateY(0)',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Colored Tab */}
                  <div 
                    className='position-absolute top-0 start-0 px-3 py-2 text-white fw-bold'
                    style={{ 
                      backgroundColor: plan.color,
                      borderRadius: '20px 0 20px 0',
                      fontSize: '14px',
                      zIndex: 1
                    }}
                  >
                    {plan.name}
                  </div>
                  
                  <div className='card-body p-4 pt-5'>
                    {/* Price */}
                    <div className='text-center mb-4'>
                      <h4 className='display-6 fw-semibold text-dark mb-0'>
                        {currentPrice}
                        <span className='fs-6 text-muted'>/{isYearly ? 'year' : 'mon'}</span>
                      </h4>
                    </div>

                    {/* Features */}
                    <div className='mb-4'>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className='d-flex align-items-center mb-3'>
                          <div className='me-3'>
                            {feature.included ? (
                              <i className='ri-check-line text-success fs-5'></i>
                            ) : (
                              <i className='ri-close-line text-danger fs-5'></i>
                            )}
                          </div>
                          <span className='text-dark'>{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Buy Now Button */}
                    <div className='mt-auto'>
                      <button 
                        onClick={() => handleGetStarted(plan)}
                        className='btn w-100 py-3 text-white fw-bold'
                        style={{ 
                          backgroundColor: isTrulyFree ? '#10B981' : '#8B5CF6',
                          borderRadius: '10px',
                          border: 'none',
                          transition: 'all 0.3s ease',
                          transform: 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                          if (isTrulyFree) {
                            e.currentTarget.style.backgroundColor = '#059669';
                          } else {
                            e.currentTarget.style.backgroundColor = '#7C3AED';
                          }
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = `0 8px 16px ${isTrulyFree ? 'rgba(16, 185, 129, 0.4)' : 'rgba(139, 92, 246, 0.4)'}`;
                        }}
                        onMouseLeave={(e) => {
                          if (isTrulyFree) {
                            e.currentTarget.style.backgroundColor = '#10B981';
                          } else {
                            e.currentTarget.style.backgroundColor = '#8B5CF6';
                          }
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {isTrulyFree ? 'GET STARTED FREE' : 'BUY NOW'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div><br></br>

               
          


          {/* Comparison Table */}
<div 
  className="container pb-5 px-3"
  style={{
    opacity: isLoaded ? 1 : 0,
    animation: isLoaded ? 'fadeInUp 0.6s ease-out 0.5s forwards' : 'none'
  }}
>
  <h2 className="h2 fw-bold text-white text-center mb-5">
    Compare Plans
  </h2>
  <div className="bg-white bg-opacity-5 rounded-3 border border-white-10" style={{ backdropFilter: 'blur(4px)' }}>
    <div className="table-responsive">
      <table className="table mb-0" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th className="text-start p-4 text-black fw-semibold" style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '2px solid #dee2e6',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: '2px solid #dee2e6',
              borderBottom: '2px solid #dee2e6'
            }}>Features</th>
            <th className="text-center p-4 text-black fw-semibold" style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '2px solid #dee2e6',
              borderTop: 'none',
              borderRight: '2px solid #dee2e6',
              borderBottom: '2px solid #dee2e6'
            }}>Free</th>
            <th className="text-center p-4 text-black fw-semibold" style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '2px solid #dee2e6',
              borderTop: 'none',
              borderRight: '2px solid #dee2e6',
              borderBottom: '2px solid #dee2e6'
            }}>Pro</th>
            <th className="text-center p-4 text-black fw-semibold" style={{ 
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '2px solid #dee2e6',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: '2px solid #dee2e6'
            }}>Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {comparisonFeatures.map((feature, idx) => (
            <tr 
              key={idx}
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <td className="p-4 text-black-50" style={{ 
                textAlign: 'left',
                border: '1px solid #dee2e6',
                borderLeft: 'none',
                borderRight: '1px solid #dee2e6',
                borderBottom: idx === comparisonFeatures.length - 1 ? '1px solid #dee2e6' : '1px solid #dee2e6',
                borderTop: idx === 0 ? 'none' : '1px solid #dee2e6'
              }}>
                {feature.name}
              </td>
              <td className="p-4 text-center text-black-50" style={{ 
                border: '1px solid #dee2e6',
                borderRight: '1px solid #dee2e6',
                borderBottom: idx === comparisonFeatures.length - 1 ? '1px solid #dee2e6' : '1px solid #dee2e6',
                borderTop: idx === 0 ? 'none' : '1px solid #dee2e6'
              }}>
                {typeof feature.free === 'boolean' ? (
                  <div className="d-flex justify-content-center align-items-center">
                    {feature.free ? <Check size={20} color="#34D399" /> : <X size={20} color="#6B7280" />}
                  </div>
                ) : (
                  <div className="text-center">{feature.free}</div>
                )}
              </td>
              <td className="p-4 text-center text-black-50" style={{ 
                border: '1px solid #dee2e6',
                borderRight: '1px solid #dee2e6',
                borderBottom: idx === comparisonFeatures.length - 1 ? '1px solid #dee2e6' : '1px solid #dee2e6',
                borderTop: idx === 0 ? 'none' : '1px solid #dee2e6'
              }}>
                {typeof feature.pro === 'boolean' ? (
                  <div className="d-flex justify-content-center align-items-center">
                    {feature.pro ? <Check size={20} color="#34D399" /> : <X size={20} color="#6B7280" />}
                  </div>
                ) : (
                  <div className="text-center">{feature.pro}</div>
                )}
              </td>
              <td className="p-4 text-center text-black-50" style={{ 
                border: '1px solid #dee2e6',
                borderRight: 'none',
                borderBottom: idx === comparisonFeatures.length - 1 ? '1px solid #dee2e6' : '1px solid #dee2e6',
                borderTop: idx === 0 ? 'none' : '1px solid #dee2e6'
              }}>
                {typeof feature.enterprise === 'boolean' ? (
                  <div className="d-flex justify-content-center align-items-center">
                    {feature.enterprise ? <Check size={20} color="#34D399" /> : <X size={20} color="#6B7280" />}
                  </div>
                ) : (
                  <div className="text-center">{feature.enterprise}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

              {/* FAQ Section */}
              <div 
                className="container pb-5 px-3"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  animation: isLoaded ? 'fadeInUp 0.6s ease-out 0.7s forwards' : 'none'
                }}
              >
                <h2 className="h2 fw-bold text-white text-center mb-5">
                  Frequently Asked Questions
                </h2>
                <div className="d-flex flex-column gap-3">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-3 border"
                      style={{ 
                        backgroundColor: 'rgba(11, 9, 9, 0.08)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(11, 9, 9, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(11, 9, 9, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-100 p-4 text-start d-flex justify-content-between align-items-center border-0 bg-transparent"
                        style={{ borderRadius: '12px' }}
                      >
                        <span className="fs-5 fw-semibold text-dark">{faq.q}</span>
                        <ChevronDown
                          size={20}
                          color="#ffffff"
                          style={{ 
                            transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                      </button>
                      {openFaq === idx && (
                        <div 
                          className="px-4 pb-4 text-white" 
                          style={{ 
                            fontSize: '18px', 
                            lineHeight: '1.6',
                            animation: 'fadeIn 0.3s ease-out'
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Final CTA */}
              <div 
                className="container pb-5 text-center px-3"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  animation: isLoaded ? 'fadeInUp 0.6s ease-out 0.9s forwards' : 'none'
                }}
              >
                <div 
                  className="bg-primary bg-opacity-20 rounded-3 border border-primary border-opacity-30 p-4 p-md-5" 
                  style={{ 
                    backdropFilter: 'blur(4px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.3)';
                    e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(147, 51, 234, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.3)';
                  }}
                >
                  <h2 className="h3 fw-bold text-white mb-3">
                    Ready to get started?
                  </h2>
                  <p className="text-white-50 mb-4">
                    Join thousands of teams already using CloudFlow to streamline their workflow.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <button 
                      className="btn btn-primary px-4 py-3 rounded-3 fw-semibold" 
                      style={{ 
                        background: 'linear-gradient(90deg, #9333ea, #ec4899)',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(147, 51, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Start Free Trial
                    </button>
                    <button 
                      className="btn btn-outline-light px-4 py-3 rounded-3 fw-semibold"
                      style={{
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Subscription Page Content */
            <>
              {/* Back Button */}
              <button
                onClick={handleBackToPricing}
                className="btn btn-link text-white text-decoration-none mb-4 d-flex align-items-center gap-2"
                style={{ 
                  opacity: isLoaded ? 1 : 0,
                  animation: isLoaded ? 'slideIn 0.5s ease-out forwards' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} />
                Back 
              </button>

              <div className="row g-4">
                {/* Left Column - Subscription Details */}
                <div 
                  className="col-lg-7"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    animation: isLoaded ? 'fadeIn 0.5s ease-out 0.2s forwards' : 'none'
                  }}
                >
                  <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="card-body p-4 p-md-5">
                      <h4 className="h3 fw-bold mb-4" style={{ color: '#1a1f36' }}>
                        Subscribe to {selectedPlan.name} Plan
                      </h4>
                      
                      {/* Price Display */}
                      <div className="bg-light rounded-3 p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">{selectedPlan.name} Plan</span>
                          <span className="fw-bold fs-4" style={{ color: '#8B5CF6' }}>
                            {isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                          <span>Billed {isYearly ? 'yearly' : 'monthly'}</span>
                          <span>{isYearly ? '₹' + (subtotal/12).toFixed(0) + '/mo' : selectedPlan.monthlyPrice + '/mo'}</span>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="mb-4">
                        <h5 className="fw-semibold mb-3">Contact Information</h5>
                        <div className="mb-3">
                          <label className="form-label text-muted small fw-semibold">Email</label>
                          <input
                            type="email"
                            className="form-control form-control-lg input-focus-effect"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                          />
                        </div>
                      </div>

                      {/* Billing Address */}
                      <div className="mb-4">
                        <h5 className="fw-semibold mb-3">Billing Address</h5>
                        <div className="row g-3">
                          <div className="col-12">
                            <input
                              type="text"
                              className="form-control input-focus-effect"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Street address"
                              style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                            />
                          </div>
                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control input-focus-effect"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="City"
                              style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                            />
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control input-focus-effect"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              placeholder="State"
                              style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                            />
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              className="form-control input-focus-effect"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              placeholder="ZIP code"
                              style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                            />
                          </div>
                          <div className="col-12">
                            <select
                              className="form-select input-focus-effect"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                            >
                              <option value="">Select country</option>
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Canada">Canada</option>
                              <option value="Australia">Australia</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="mb-4">
                        <h5 className="fw-semibold mb-3">Payment Method</h5>
                        
                        {/* Payment Method Tabs */}
                        <div className="d-flex gap-2 mb-4">
                          <button
                            className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-4 d-flex align-items-center justify-content-center`}
                            onClick={() => setPaymentMethod('card')}
                            style={{
                              backgroundColor: paymentMethod === 'card' ? '#8B5CF6' : 'transparent',
                              borderColor: paymentMethod === 'card' ? '#8B5CF6' : '#e2e8f0',
                              color: paymentMethod === 'card' ? 'white' : '#64748b',
                              transition: 'all 0.3s ease',
                              gap: '8px'
                            }}
                          >
                            <CreditCard size={16} />
                            <span>Card</span>
                          </button>

                          <button
                            className={`btn ${paymentMethod === 'upi' ? 'btn-primary' : 'btn-outline-secondary'} rounded-pill px-4 d-flex align-items-center`}
                            onClick={() => setPaymentMethod('upi')}
                            style={{
                              backgroundColor: paymentMethod === 'upi' ? '#10B981' : 'transparent',
                              borderColor: paymentMethod === 'upi' ? '#10B981' : '#e2e8f0',
                              color: paymentMethod === 'upi' ? 'white' : '#64748b',
                              gap: '6px'
                            }}
                          >
                            <i className="bi bi-wallet2"></i>
                            UPI
                          </button>
                        </div>

                        {paymentMethod === 'card' && (
                          <div className="payment-card p-4 rounded-3" style={{ backgroundColor: '#f8fafc' }}>
                            {/* Card Logos */}
                            <div className="d-flex gap-3 mb-4 flex-wrap align-items-center">
                              <img 
                                src="https://img.icons8.com/color/48/visa.png"
                                alt="Visa"
                                height="28"
                              />
                              <img 
                                src="https://img.icons8.com/color/48/mastercard-logo.png"
                                alt="Mastercard"
                                height="28"
                              />
                              <img 
                                src="https://img.icons8.com/color/48/amex.png"
                                alt="Amex"
                                height="28"
                              />
                              <img 
                                src="https://img.icons8.com/color/48/discover.png"
                                alt="Discover"
                                height="28"
                              />
                              <img 
                                src="https://img.icons8.com/color/48/jcb.png"
                                alt="JCB"
                                height="28"
                              />
                            </div>

                            <div className="row g-3">
                              <div className="col-12">
                                <label className="form-label text-muted small fw-semibold">Card Number</label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg input-focus-effect"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                  placeholder="1234 5678 9012 3456"
                                  maxLength="19"
                                  style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                />
                              </div>
                              <div className="col-12">
                                <label className="form-label text-muted small fw-semibold">Cardholder Name</label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg input-focus-effect"
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                  placeholder="Name on card"
                                  style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label text-muted small fw-semibold">Expiry Date</label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg input-focus-effect"
                                  value={expiryDate}
                                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                  placeholder="MM/YY"
                                  maxLength="5"
                                  style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label text-muted small fw-semibold">CVV</label>
                                <input
                                  type="text"
                                  className="form-control form-control-lg input-focus-effect"
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                                  placeholder="123"
                                  maxLength="4"
                                  style={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {paymentMethod === 'upi' && (
                          <div 
                            className="p-4 rounded-3 shadow-sm"
                            style={{ backgroundColor: '#f8fafc' }}
                          >
                            <h6 className="fw-bold mb-3 text-center">Pay Using UPI</h6>
                            <div className="mb-3">
                              <label className="form-label">Enter UPI ID</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="example@upi"
                              />
                            </div>
                            <div className="text-center mb-3">
                              <small className="text-muted">
                                You will receive a payment request in your UPI app.
                              </small>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Security Badge */}
                      <div className="d-flex align-items-center gap-2 text-muted small mb-4">
                        <Lock size={14} />
                        <span>Your payment information is encrypted and secure</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div 
                  className="col-lg-5"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    animation: isLoaded ? 'fadeIn 0.5s ease-out 0.3s forwards' : 'none'
                  }}
                >
                  <div className="card border-0 shadow-lg rounded-4 sticky-top" style={{ top: '20px' }}>
                    <div className="card-body p-4 p-md-5">
                      <h5 className="fw-bold mb-4">Order Summary</h5>
                      
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">{selectedPlan.name} Plan</span>
                          <span className="fw-semibold">{isYearly ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
                          <span>Billed {isYearly ? 'yearly' : 'monthly'}</span>
                          <span>{isYearly ? '₹' + (subtotal/12).toFixed(0) + '/mo' : selectedPlan.monthlyPrice + '/mo'}</span>
                        </div>
                      </div>

                      <hr className="my-4" />

                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Subtotal</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">
                            Tax
                            {country && (
                              <small className="d-block text-muted">
                                {taxRate * 100}% {country === 'India' ? 'GST' : 'VAT'}
                              </small>
                            )}
                          </span>
                          <span>
                            {address ? formatCurrency(taxAmount) : 'Enter address to calculate'}
                          </span>
                        </div>
                      </div>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <span className="fw-bold fs-5">Total due today</span>
                        <span className="fw-bold fs-4" style={{ color: '#8B5CF6' }}>
                          {address ? formatCurrency(totalDue) : formatCurrency(subtotal)}
                        </span>
                      </div>

                      {/* Features included */}
                      <div className="mb-4">
                        <p className="text-muted small fw-semibold mb-3">This plan includes:</p>
                        {selectedPlan.features.map((feature, idx) => (
                          feature.included && (
                            <div key={idx} className="d-flex align-items-center gap-2 mb-2 text-muted small">
                              <Check size={14} color="#10B981" />
                              <span>{feature.text}</span>
                            </div>
                          )
                        ))}
                      </div>

                      {/* Subscribe Button */}
                      <button
                        onClick={handleSubmit}
                        disabled={processingPayment}
                        className="btn btn-primary w-100 py-3 fw-bold rounded-3"
                        style={{
                          background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                          border: 'none',
                          transition: 'all 0.3s ease',
                          transform: 'scale(1)',
                          opacity: processingPayment ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!processingPayment) {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {processingPayment ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          'Subscribe Now'
                        )}
                      </button>

                      <p className="text-center text-muted small mt-3 mb-0">
                        By subscribing, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer/>
      {/* Payment Success Modal */}
      {showSuccess && (
        <div className="modal-overlay scale-in">
          <div className="modal-content bg-white rounded-4 p-4 text-center">
            <button
              onClick={closeSuccessModal}
              className="btn position-absolute top-0 end-0 m-3 p-1"
              style={{ background: 'none', border: 'none' }}
            >
              <X size={20} />
            </button>
            
            <div className="py-4">
              <div className="mb-4 d-flex align-items-center justify-content-center gap-2">
                <CheckCircle size={28} color="#10B981" />
                <h5 className="fw-semibold mb-0 text-success">
                  Payment Successful!
                </h5>
              </div>
              
              <div className="bg-light rounded-3 p-4 mb-4">
                <p className="text-muted mb-2">Payment Details</p>
                <p className="fw-bold fs-5 mb-2" style={{ color: '#8B5CF6' }}>
                  {formatCurrency(totalDue)}
                </p>
                <p className="text-muted small mb-0">
                  {selectedPlan.name} Plan • {isYearly ? 'Yearly' : 'Monthly'} Billing
                </p>
              </div>
              
              <p className="text-muted mb-4">
                Thank you for subscribing! A confirmation email has been sent to<br />
                <span className="fw-semibold text-dark">{email}</span>
              </p>
              
              <div className="mb-4">
                <div className="spinner-border text-primary spinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted small mt-2">
                  Redirecting to dashboard in {redirectCountdown} seconds...
                </p>
              </div>
              
              <button
                onClick={closeSuccessModal}
                className="btn btn-primary w-100 py-2 fw-semibold"
                style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                  border: 'none'
                }}
              >
                Go to Dashboard Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingPage;
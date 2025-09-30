'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaCreditCard, 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaRocket,
  FaShieldAlt,
  FaHeadset,
  FaMobile,
  FaStar,
  FaCheck,
  FaSpinner,
  FaExchangeAlt
} from 'react-icons/fa';

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [notification, setNotification] = useState(null);

  // Plan data with currency support
  const planData = {
    INR: [
      {
        id: 'starter',
        name: 'Starter',
        price: 999,
        period: 'month',
        description: 'Perfect for small cafes and food stalls',
        popular: false,
        features: [
          'Up to 50 menu items',
          '1 restaurant location', 
          'Basic POS system',
          'Table management (up to 20 tables)',
          'Kitchen order tracking',
          'Mobile app access',
          'Email support'
        ]
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 2499,
        period: 'month',
        description: 'Ideal for growing restaurants',
        popular: true,
        features: [
          'Unlimited menu items',
          'Up to 3 restaurant locations',
          'Advanced POS with payments',
          'Unlimited tables & floors',
          'Real-time kitchen display',
          'Staff management',
          'Analytics & reports',
          'Priority support',
          'Custom branding'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 4999,
        period: 'month',
        description: 'For restaurant chains and large operations',
        popular: false,
        features: [
          'Everything in Professional',
          'Unlimited locations',
          'Multi-restaurant dashboard',
          'Advanced analytics',
          'Inventory management',
          'Customer loyalty programs',
          'API access',
          '24/7 phone support',
          'Custom integrations'
        ]
      }
    ],
    USD: [
      {
        id: 'starter',
        name: 'Starter',
        price: 12,
        period: 'month',
        description: 'Perfect for small cafes and food stalls',
        popular: false,
        features: [
          'Up to 50 menu items',
          '1 restaurant location',
          'Basic POS system',
          'Table management (up to 20 tables)',
          'Kitchen order tracking',
          'Mobile app access',
          'Email support'
        ]
      },
      {
        id: 'professional',
        name: 'Professional', 
        price: 30,
        period: 'month',
        description: 'Ideal for growing restaurants',
        popular: true,
        features: [
          'Unlimited menu items',
          'Up to 3 restaurant locations',
          'Advanced POS with payments',
          'Unlimited tables & floors',
          'Real-time kitchen display',
          'Staff management',
          'Analytics & reports',
          'Priority support',
          'Custom branding'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 60,
        period: 'month',
        description: 'For restaurant chains and large operations',
        popular: false,
        features: [
          'Everything in Professional',
          'Unlimited locations',
          'Multi-restaurant dashboard',
          'Advanced analytics',
          'Inventory management',
          'Customer loyalty programs',
          'API access',
          '24/7 phone support',
          'Custom integrations'
        ]
      }
    ]
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          
          // Check if user is owner/admin - only they can access billing
          if (parsedUser.role !== 'owner' && parsedUser.role !== 'admin') {
            showNotification('error', 'Access denied. Only owners can access billing.');
            router.push('/dashboard');
            return;
          }
          
          setUser(parsedUser);
          
          // Fetch subscription data from backend (only for owners/admins)
          if (parsedUser.uid || parsedUser.id) {
            try {
              const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
              showNotification('info', 'Loading billing information...');
              
              // First try to get existing subscription
              console.log('Fetching subscription for user:', parsedUser.uid || parsedUser.id);
              const response = await fetch(`${API_BASE_URL}/api/payments/subscription/${parsedUser.uid || parsedUser.id}`);
              
              if (response.ok) {
                const data = await response.json();
                if (data.success && data.subscription) {
                  setCurrentSubscription({
                    plan: data.subscription.planName || 'Starter',
                    status: data.subscription.status || 'active',
                    nextBillingDate: data.subscription.endDate || null,
                    lastPaymentDate: data.subscription.startDate || null,
                    amount: 999, // Default amount
                    currency: 'INR'
                  });
                  showNotification('success', 'Billing information loaded!');
                } else {
                  throw new Error('No subscription data');
                }
              } else if (response.status === 404) {
                // User doesn't exist in billing DB - create them once
                console.log('User not found in billing DB, creating new billing user');
                showNotification('info', 'Setting up your billing account...');
                
                const createUserResponse = await fetch(`${API_BASE_URL}/api/payments/create-user`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: parsedUser.uid || parsedUser.id,
                    email: parsedUser.email || parsedUser.phoneNumber || '',
                    phone: parsedUser.phoneNumber || parsedUser.phone || '',
                    role: parsedUser.role,
                    planId: 'starter',
                    restaurantInfo: {
                      name: parsedUser.restaurantName || 'My Restaurant',
                      id: parsedUser.restaurantId || null
                    }
                  })
                });
                
                if (createUserResponse.ok) {
                  const createResult = await createUserResponse.json();
                  console.log('New billing user created:', createResult);
                  
                  if (createResult.success && createResult.data.subscription) {
                    setCurrentSubscription({
                      plan: createResult.data.subscription.planName || 'Starter',
                      status: createResult.data.subscription.status || 'active',
                      nextBillingDate: createResult.data.subscription.endDate || null,
                      lastPaymentDate: createResult.data.subscription.startDate || null,
                      amount: 999,
                      currency: 'INR'
                    });
                    showNotification('success', 'Billing account created successfully!');
                  }
                } else {
                  throw new Error('Failed to create billing user');
                }
              } else {
                throw new Error('Failed to fetch subscription');
              }
            } catch (error) {
              console.error('Error loading billing information:', error);
              showNotification('error', 'Error loading billing information');
              // Set default subscription as fallback
              setCurrentSubscription({
                plan: 'Starter',
                status: 'active',
                nextBillingDate: null,
                lastPaymentDate: null,
                amount: 999,
                currency: 'INR'
              });
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const formatCurrency = (amount, curr = currency) => {
    if (curr === 'INR') {
      return `₹${amount.toLocaleString()}`;
    } else {
      return `$${amount}`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'NA') return 'NA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };


  const handlePayment = async (plan) => {
    if (!window.Razorpay) {
      // Load Razorpay script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    try {
      setPaymentProcessing(true);
      
      if (!user) {
        showNotification('error', 'User data not available');
        return;
      }
      
      console.log('Current user data:', user);
      console.log('Selected plan:', plan);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      
      // Prepare payment data with validation
      const userEmail = user.email || user.phoneNumber || user.phone || `user-${user.uid || user.id}@example.com`;
      const userPhone = user.phoneNumber || user.phone || '';
      
      const paymentData = {
        planId: plan.id,
        amount: plan.price,
        currency: currency,
        email: userEmail,
        userId: user.uid || user.id,
        phone: userPhone
      };
      
      console.log('Payment data being sent:', paymentData);
      
      // Validate required fields
      if (!paymentData.amount || !paymentData.planId || !paymentData.email || !paymentData.userId) {
        showNotification('error', 'Missing payment information. Please try again.');
        console.error('Missing required payment fields:', paymentData);
        return;
      }
      
      // Create order
      const orderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('Order creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      const orderData = await orderResponse.json();
      
      // Initialize Razorpay
      const options = {
        key: 'rzp_live_lMZVjvewP7tKIL', // Replace with your Razorpay key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'DineFlow',
        description: `${plan.name} Subscription - DineFlow`,
        order_id: orderData.order.id,
        prefill: {
          name: user.displayName || '',
          email: user.email || user.phoneNumber || '',
          contact: user.phoneNumber || ''
        },
        theme: {
          color: '#ef4444'
        },
        handler: function (response) {
          verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            planId: plan.id,
            userId: user.uid || user.id
          });
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        showNotification('error', 'Payment failed. Please try again.');
      });
      razorpay.open();
      
    } catch (error) {
      console.error('Payment initialization error:', error);
      showNotification('error', 'Payment initialization failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      setPaymentProcessing(true);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
      
      const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (data.success) {
        showNotification('success', 'Payment successful! Your plan has been upgraded.');
        
        // Update current subscription
        const plan = planData[currency].find(p => p.id === paymentData.planId);
        setCurrentSubscription({
          plan: plan?.name || 'Professional',
          status: 'active',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastPaymentDate: new Date().toISOString(),
          amount: plan?.price || 2499,
          currency: currency
        });
        
        // Refresh the page after a short delay
        setTimeout(() => window.location.reload(), 2000);
      } else {
        showNotification('error', 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showNotification('error', 'Payment verification failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const currentPlans = planData[currency] || planData.INR;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh' 
        }}>
          <FaSpinner className="animate-spin" size={32} color="#ef4444" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaCheckCircle size={16} />
            {notification.message}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {paymentProcessing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <FaSpinner className="animate-spin" size={32} color="#ef4444" />
            <p style={{ marginTop: '16px', color: '#374151' }}>Processing payment...</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '16px' 
          }}>
            Billing & Subscription
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Subscription Status */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          padding: '32px', 
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <FaCreditCard size={24} color="#ef4444" />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Current Subscription
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {/* Current Plan */}
            <div style={{
              padding: '20px',
              backgroundColor: '#fef7f0',
              borderRadius: '12px',
              border: '1px solid #fed7aa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FaCheckCircle size={16} color="#10b981" />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Current Plan
                </span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {currentSubscription?.plan || 'Starter'}
              </h3>
              <p style={{ fontSize: '14px', color: '#ef4444', margin: '4px 0 0 0' }}>
                {formatCurrency(currentSubscription?.amount || 999)} / month
              </p>
            </div>

            {/* Next Billing */}
            <div style={{
              padding: '20px',
              backgroundColor: '#f0f9ff',
              borderRadius: '12px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FaCalendarAlt size={16} color="#3b82f6" />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Next Billing
                </span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {formatDate(currentSubscription?.nextBillingDate)}
              </h3>
            </div>

            {/* Last Payment */}
            <div style={{
              padding: '20px',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FaCheckCircle size={16} color="#10b981" />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Last Payment
                </span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {formatDate(currentSubscription?.lastPaymentDate)}
              </h3>
            </div>
          </div>
        </div>

        {/* Currency Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            gap: '4px'
          }}>
            <button
              onClick={() => setCurrency('INR')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: currency === 'INR' ? '#ef4444' : 'transparent',
                color: currency === 'INR' ? 'white' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaExchangeAlt size={12} />
              INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: currency === 'USD' ? '#ef4444' : 'transparent',
                color: currency === 'USD' ? 'white' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaExchangeAlt size={12} />
              USD ($)
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            Choose Your Plan
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '24px' 
          }}>
            {currentPlans.map((plan) => {
              const isCurrentPlan = currentSubscription?.plan === plan.name;
              
              return (
                <div
                  key={plan.id}
                  style={{
                    position: 'relative',
                    padding: '32px 24px',
                    border: plan.popular ? '2px solid #ef4444' : '1px solid #e5e7eb',
                    borderRadius: '16px',
                    backgroundColor: isCurrentPlan ? '#fef7f0' : 'white',
                    boxShadow: plan.popular ? '0 8px 32px rgba(239, 68, 68, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '6px 20px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      Most Popular
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      Current Plan
                    </div>
                  )}

                  {/* Plan Header */}
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h3 style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      color: '#1f2937',
                      margin: '0 0 8px 0'
                    }}>
                      {plan.name}
                    </h3>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ 
                        fontSize: '36px', 
                        fontWeight: 'bold', 
                        color: '#1f2937' 
                      }}>
                        {formatCurrency(plan.price)}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '16px' }}>
                        /{plan.period}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px 0'
                  }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 0',
                        fontSize: '14px',
                        color: '#374151'
                      }}>
                        <FaCheck size={12} color="#10b981" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => !isCurrentPlan && handlePayment(plan)}
                    disabled={isCurrentPlan || paymentProcessing}
                    style={{
                      width: '100%',
                      padding: '14px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: isCurrentPlan 
                        ? '#d1d5db' 
                        : plan.popular 
                          ? '#ef4444' 
                          : 'transparent',
                      color: isCurrentPlan 
                        ? '#6b7280' 
                        : plan.popular 
                          ? 'white' 
                          : '#ef4444',
                      border: !plan.popular && !isCurrentPlan ? '2px solid #ef4444' : 'none',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: isCurrentPlan ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isCurrentPlan ? (
                      <>
                        <FaCheckCircle size={16} />
                        Current Plan
                      </>
                    ) : (
                      <>
                        <FaRocket size={16} />
                        Upgrade Now
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose DineFlow */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            Why Choose DineFlow?
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#fef7f0',
                borderRadius: '12px',
                color: '#ef4444'
              }}>
                <FaMobile size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Mobile First Design
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Optimized for smartphones and tablets with intuitive interface
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                color: '#10b981'
              }}>
                <FaShieldAlt size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Secure & Reliable
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Bank-level security with 99.9% uptime guarantee
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#f0f9ff',
                borderRadius: '12px',
                color: '#3b82f6'
              }}>
                <FaHeadset size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  24/7 Support
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Round-the-clock customer support to help your business
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#fdf4ff',
                borderRadius: '12px',
                color: '#8b5cf6'
              }}>
                <FaStar size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Easy Integration
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Quick setup and seamless integration with existing systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
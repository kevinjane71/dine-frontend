'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaUtensils, 
  FaPlus, 
  FaArrowRight, 
  FaSeedling,
  FaCoffee,
  FaHamburger,
  FaPizzaSlice,
  FaCarrot,
  FaStar
} from 'react-icons/fa';

const EmptyMenuPrompt = ({ restaurantName, onAddMenu }) => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAddMenu = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push('/menu');
    }, 300);
  };

  const sampleCategories = [
    { name: 'Appetizers', icon: FaSeedling, color: '#10b981' },
    { name: 'Main Course', icon: FaHamburger, color: '#f59e0b' },
    { name: 'Beverages', icon: FaCoffee, color: '#8b5cf6' },
    { name: 'Desserts', icon: FaPizzaSlice, color: '#ef4444' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.3s ease'
      }}>
        {/* Animated Icon */}
        <div style={{
          position: 'relative',
          display: 'inline-block',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            position: 'relative',
            animation: 'bounce 2s infinite'
          }}>
            <FaUtensils size={48} style={{ color: '#f59e0b' }} />
            
            {/* Floating sparkles */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '10px',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <FaStar size={20} style={{ color: '#fbbf24' }} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '5px',
              left: '-5px',
              animation: 'float 3s ease-in-out infinite 1.5s'
            }}>
              <FaStar size={16} style={{ color: '#f59e0b' }} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#1f2937',
          margin: '0 0 16px 0',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Ready to Create Your Menu? 🍽️
        </h2>
        
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          margin: '0 0 32px 0',
          lineHeight: '1.6'
        }}>
          Welcome to <strong style={{ color: '#1f2937' }}>{restaurantName || 'Your Restaurant'}</strong>! 
          <br />
          Let&apos;s start by adding some delicious menu items for your customers.
        </p>

        {/* Feature Preview */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '2px solid #fbbf24',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            What you can add:
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px'
          }}>
            {sampleCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={category.name} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: `${category.color}10`,
                  border: `1px solid ${category.color}30`,
                  animation: `fadeInUp 0.6s ease ${index * 0.1}s both`
                }}>
                  <Icon size={24} style={{ color: category.color, marginBottom: '8px' }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: category.color
                  }}>
                    {category.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddMenu}
          disabled={isAnimating}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            padding: '20px 32px',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '18px',
            border: 'none',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
            transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
            opacity: isAnimating ? 0.8 : 1
          }}
          onMouseEnter={(e) => {
            if (!isAnimating) {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 12px 32px rgba(245, 158, 11, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isAnimating) {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.3)';
            }
          }}
        >
          {isAnimating ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Opening Menu Manager...
            </>
          ) : (
            <>
              <FaPlus size={18} />
              Add Your First Menu Items
              <FaArrowRight size={16} />
            </>
          )}
        </button>

        {/* Help Text */}
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          margin: '24px 0 0 0',
          fontStyle: 'italic'
        }}>
          💡 You can always add more items later from the Menu Management page
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-8px);
          }
          70% {
            transform: translateY(-4px);
          }
          90% {
            transform: translateY(-2px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EmptyMenuPrompt;
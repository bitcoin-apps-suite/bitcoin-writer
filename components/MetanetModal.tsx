/**
 * Compelling MetaNet Identity Modal
 */

import React from 'react';

interface MetanetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupIdentity: () => void;
}

export const MetanetModal: React.FC<MetanetModalProps> = ({ 
  isOpen, 
  onClose, 
  onSetupIdentity 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          animation: 'fadeIn 0.3s ease'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
        border: '2px solid transparent',
        borderRadius: '20px',
        padding: '0',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 100px rgba(247, 147, 26, 0.1)',
        zIndex: 100000,
        animation: 'slideUp 0.4s ease',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%), 
                         linear-gradient(135deg, #F7931A 0%, #FF6B35 100%)`,
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box'
      }}>
        {/* Animated Border Glow */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          background: 'linear-gradient(45deg, #F7931A, #FF6B35, #F7931A, #FF6B35)',
          backgroundSize: '400% 400%',
          borderRadius: '20px',
          opacity: 0.8,
          animation: 'gradientShift 3s ease infinite',
          zIndex: -1
        }} />

        {/* Header with Close Button */}
        <div style={{
          padding: '24px 32px 20px',
          borderBottom: '1px solid rgba(247, 147, 26, 0.2)',
          position: 'relative',
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(244, 67, 54, 0.3)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            ×
          </button>

          {/* Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #F7931A, #FF6B35)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 20px rgba(247, 147, 26, 0.4)'
            }}>
              🔐
            </div>
            <h2 style={{
              margin: 0,
              color: '#fff',
              fontSize: '22px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              MetaNet Identity Required
            </h2>
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '32px'
        }}>
          <div style={{
            background: 'rgba(247, 147, 26, 0.05)',
            border: '1px solid rgba(247, 147, 26, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <p style={{
              margin: 0,
              color: '#e0e0e0',
              fontSize: '15px',
              lineHeight: '1.6',
              textAlign: 'center'
            }}>
              <span style={{ color: '#F7931A', fontWeight: '600' }}>Unlock the full power of Bitcoin Writer</span>
              <br />
              To complete this operation, you need a MetaNet identity. This enables:
            </p>
          </div>

          {/* Features List */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '28px'
          }}>
            {[
              { icon: '🔗', text: 'Blockchain Storage' },
              { icon: '🔒', text: 'End-to-End Encryption' },
              { icon: '💰', text: 'Micropayments' },
              { icon: '📝', text: 'Digital Signatures' },
              { icon: '🌐', text: 'Decentralized Publishing' },
              { icon: '🎯', text: 'True Ownership' }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(247, 147, 26, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(247, 147, 26, 0.3)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '18px' }}>{feature.icon}</span>
                <span style={{ 
                  color: '#b0b0b0', 
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px 24px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#888',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#aaa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#888';
              }}
            >
              Maybe Later
            </button>

            <button
              onClick={onSetupIdentity}
              style={{
                flex: 2,
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #F7931A, #FF6B35)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(247, 147, 26, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(247, 147, 26, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(247, 147, 26, 0.3)';
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                Set Up MetaNet Identity →
              </span>
              {/* Shine effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'shine 3s infinite'
              }} />
            </button>
          </div>

          {/* Trust Badge */}
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(76, 175, 80, 0.05)',
            border: '1px solid rgba(76, 175, 80, 0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#4CAF50', fontSize: '14px' }}>✓</span>
            <span style={{
              color: '#888',
              fontSize: '12px'
            }}>
              Secure • Private • No personal data required
            </span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          20% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default MetanetModal;
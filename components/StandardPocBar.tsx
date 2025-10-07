'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Bitcoin } from 'lucide-react';

interface PocBarProps {
  appName: string;
  primaryColor: string;
  secondaryColor: string;
  isDismissible?: boolean;
  showBitcoinLogo?: boolean;
  customText?: string;
  links?: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}

export default function StandardPocBar({ 
  appName,
  primaryColor, 
  secondaryColor,
  isDismissible = true,
  showBitcoinLogo = true,
  customText,
  links = []
}: PocBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (isDismissible && typeof window !== 'undefined') {
      const saved = localStorage.getItem(`pocBar_${appName}_visible`);
      const visible = saved !== null ? saved === 'true' : true;
      setIsVisible(visible);
    }
  }, [appName, isDismissible]);

  useEffect(() => {
    if (mounted && isDismissible && typeof window !== 'undefined') {
      localStorage.setItem(`pocBar_${appName}_visible`, isVisible.toString());
    }
  }, [isVisible, mounted, appName, isDismissible]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Calculate text color based on background brightness
  const getTextColor = (bgColor: string): string => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const textColor = getTextColor(primaryColor);
  const defaultText = `${appName} | Proof-of-Concept Version | Built on Bitcoin SV | By THE BITCOIN CORPORATION LTD`;

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div 
      className="poc-banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '40px',
        background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 9999,
        fontSize: '13px',
        fontWeight: '500',
        color: textColor,
        letterSpacing: '0.5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        padding: '0 16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {showBitcoinLogo && (
          <Bitcoin 
            size={16} 
            style={{ 
              color: textColor,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
            }} 
          />
        )}
        
        <span style={{ 
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {customText || defaultText}
        </span>

        {links.length > 0 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            marginLeft: '16px'
          }}>
            {links.map((link, index) => (
              <React.Fragment key={index}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: textColor,
                      textDecoration: 'none',
                      fontSize: '12px',
                      opacity: 0.9,
                      transition: 'opacity 0.2s ease',
                      borderBottom: `1px solid transparent`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.borderBottomColor = textColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.borderBottomColor = 'transparent';
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    style={{
                      color: textColor,
                      textDecoration: 'none',
                      fontSize: '12px',
                      opacity: 0.9,
                      transition: 'opacity 0.2s ease',
                      borderBottom: `1px solid transparent`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.borderBottomColor = textColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.borderBottomColor = 'transparent';
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {isDismissible && (
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: textColor,
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease',
            marginLeft: '12px',
            opacity: 0.8
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.opacity = '0.8';
          }}
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
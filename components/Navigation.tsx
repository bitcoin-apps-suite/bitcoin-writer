'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { href: '/', label: 'Editor', icon: '📝' },
    { href: '/features', label: 'Features', icon: '⚡' },
    { href: '/exchange', label: 'Exchange', icon: '💱' },
    { href: '/token', label: 'Token', icon: '🪙' },
    { href: '/captable', label: 'Cap Table', icon: '📊' },
    { href: '/contracts', label: 'Contracts', icon: '📋' },
    { href: '/grants', label: 'Grants', icon: '🌸' },
    { href: '/changelog', label: 'Changelog', icon: '📝' },
  ];

  return (
    <nav className="bitcoin-navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <span className="bitcoin-logo">₿</span>
          <span className="nav-title">Bitcoin Writer</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger"></span>
        </button>

        {/* Mobile Menu */}
        {showMenu && (
          <>
            <div className="mobile-menu-overlay" onClick={() => setShowMenu(false)} />
            <div className="mobile-menu">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-nav-link ${pathname === item.href ? 'active' : ''}`}
                  onClick={() => setShowMenu(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
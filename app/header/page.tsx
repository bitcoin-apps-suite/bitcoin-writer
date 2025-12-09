/**
 * Bitcoin Writer - A blockchain-based writing application
 * Copyright (C) 2025 The Bitcoin Corporation LTD
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * For commercial licensing options, please contact The Bitcoin Corporation LTD.
 */

'use client';

export default function HeaderPage() {
  return (
    <div className="app-header">
      <div className="header-content">
        <div className="header-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="200" rx="40" fill="url(#gradient)"/>
              <path d="M50 150 Q80 40 150 50 Q120 80 100 120 L90 130 Q70 140 50 150 Z" fill="#2D3748" stroke="#2D3748" strokeWidth="2"/>
              <path d="M70 100 Q90 80 110 90" stroke="#2D3748" strokeWidth="1.5" fill="none"/>
              <path d="M80 120 Q95 105 115 110" stroke="#2D3748" strokeWidth="1.5" fill="none"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#FF8C00", stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#FF6B35", stopOpacity:1}} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">Bitcoin</span>
          <span className="logo-writer">Writer</span>
        </div>
        <p className="header-tagline">Encrypt, publish and sell shares in your work</p>
      </div>
    </div>
  );
}
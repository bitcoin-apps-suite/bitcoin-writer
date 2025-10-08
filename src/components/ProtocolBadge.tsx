import React from 'react';
import './ProtocolBadge.css';

export interface ProtocolBadgeProps {
  protocol: 'b' | 'd' | 'bcat' | 'bico' | 'local' | 'unknown';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const ProtocolBadge: React.FC<ProtocolBadgeProps> = ({
  protocol,
  size = 'medium',
  showLabel = true
}) => {
  const getProtocolInfo = () => {
    switch (protocol) {
      case 'b':
        return {
          icon: '🅱️',
          label: 'B://',
          title: 'B:// Protocol - Standard blockchain storage',
          color: '#f7931a'
        };
      case 'd':
        return {
          icon: '🔄',
          label: 'D://',
          title: 'D:// Protocol - Dynamic references',
          color: '#22c55e'
        };
      case 'bcat':
        return {
          icon: '📚',
          label: 'Bcat',
          title: 'Bcat Protocol - Large file storage',
          color: '#8b5cf6'
        };
      case 'bico':
        return {
          icon: '🌐',
          label: 'Bico',
          title: 'Bico.Media - CDN with templating',
          color: '#3b82f6'
        };
      case 'local':
        return {
          icon: '💾',
          label: 'Local',
          title: 'Stored locally in browser',
          color: '#6b7280'
        };
      default:
        return {
          icon: '❓',
          label: 'Unknown',
          title: 'Unknown storage method',
          color: '#9ca3af'
        };
    }
  };

  const info = getProtocolInfo();

  return (
    <span 
      className={`protocol-badge protocol-badge--${size}`}
      title={info.title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'small' ? '2px 6px' : size === 'large' ? '6px 12px' : '4px 8px',
        borderRadius: '12px',
        backgroundColor: `${info.color}20`,
        border: `1px solid ${info.color}40`,
        color: info.color,
        fontSize: size === 'small' ? '10px' : size === 'large' ? '14px' : '12px',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      }}
    >
      <span className="protocol-icon" style={{ fontSize: size === 'small' ? '10px' : '12px' }}>
        {info.icon}
      </span>
      {showLabel && (
        <span className="protocol-label">
          {info.label}
        </span>
      )}
    </span>
  );
};

export default ProtocolBadge;
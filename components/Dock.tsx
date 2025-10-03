import React, { useState, useEffect } from 'react';
import { Wallet, Mail, Music, FileText, HardDrive, Calendar, Search, Table, Share2, Briefcase, Store, Wifi, Volume2, Battery, Clock, TrendingUp, Building2, Shield, Palette, GraduationCap, Paintbrush, Video } from 'lucide-react';
import './Dock.css';

interface DockApp {
  id?: string;
  name: string;
  icon: any;
  color: string;
  url?: string;
  disabled?: boolean;
  current?: boolean;
  isImage?: boolean;
}

const Dock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getIconColor = (colorClass: string): string => {
    const colorMap: { [key: string]: string } = {
      'text-orange-500': '#f97316',
      'text-bitcoin-orange': '#f7931a',
      'text-yellow-500': '#eab308',
      'text-red-500': '#ef4444',
      'text-purple-500': '#a855f7',
      'text-fuchsia-500': '#d946ef',
      'text-green-500': '#22c55e',
      'text-blue-500': '#3b82f6',
      'text-gray-500': '#6b7280',
      'text-sky-400': '#38bdf8',
      'text-cyan-500': '#06b6d4',
      'text-cyan-400': '#22d3ee',
      'text-emerald-500': '#10b981',
      'text-rose-500': '#f43f5e',
      'text-pink-500': '#ec4899',
      'text-indigo-500': '#6366f1',
      'text-amber-500': '#f59e0b',
      'text-violet-500': '#8b5cf6'
    };
    return colorMap[colorClass] || '#ffffff';
  };

  const dockApps: DockApp[] = [
    { name: 'Bitcoin Apps Store', icon: Store, color: 'text-orange-500', url: 'https://www.bitcoinapps.store/' },
    { name: 'Bitcoin Wallet', icon: Wallet, color: 'text-yellow-500', url: 'https://bitcoin-wallet-sable.vercel.app' },
    { name: 'Bitcoin Email', icon: Mail, color: 'text-red-500', url: 'https://bitcoin-email.vercel.app' },
    { name: 'Bitcoin Music', icon: Music, color: 'text-purple-500', url: 'https://bitcoin-music.vercel.app' },
    { name: 'Bitcoin Writer', icon: FileText, color: 'text-orange-500', url: 'https://bitcoin-writer.vercel.app', current: true },
    { name: 'Bitcoin Drive', icon: HardDrive, color: 'text-green-500', url: 'https://bitcoin-drive.vercel.app' },
    { name: 'Bitcoin Calendar', icon: Calendar, color: 'text-fuchsia-500', url: 'https://bitcoin-calendar.vercel.app' },
    { name: 'Bitcoin Exchange', icon: TrendingUp, color: 'text-emerald-500', url: '/exchange' },
    { name: 'Bitcoin Search', icon: Search, color: 'text-blue-500', url: 'https://bitcoin-search.vercel.app' },
    { name: 'Bitcoin Spreadsheet', icon: Table, color: 'text-blue-500', url: 'https://bitcoin-spreadsheet.vercel.app' },
    { name: 'Bitcoin Shares', icon: Share2, color: 'text-rose-500', url: 'https://bitcoin-shares.vercel.app', disabled: true },
    { name: 'Bitcoin Jobs', icon: Briefcase, color: 'text-cyan-400', url: 'https://bitcoin-jobs.vercel.app/' },
    { name: 'Bitcoin Art', icon: Palette, color: 'text-pink-500', url: 'https://bitcoin-art.vercel.app' },
    { name: 'Bitcoin Education', icon: GraduationCap, color: 'text-indigo-500', url: 'https://bitcoin-education-theta.vercel.app/' },
    { name: 'Bitcoin Paint', icon: Paintbrush, color: 'text-amber-500', url: 'https://bitcoin-paint.vercel.app' },
    { name: 'Bitcoin Video', icon: Video, color: 'text-violet-500', url: 'https://bitcoin-video-nine.vercel.app/' },
  ];

  const handleAppClick = (app: DockApp) => {
    if (!app.disabled && app.url && !app.current) {
      window.location.href = app.url;
    }
  };

  return (
    <div className="bitcoin-dock">
      <div className="dock-container">
        {/* App icons on the left */}
        <div className="dock-apps">
          {dockApps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.name}
              className={`dock-app ${app.current ? 'active' : ''} ${app.disabled ? 'disabled' : ''}`}
              onClick={() => handleAppClick(app)}
              title={app.name}
              disabled={app.disabled}
            >
              <Icon className="dock-app-icon" style={{ color: getIconColor(app.color) }} />
              {app.current && <span className="dock-indicator" />}
            </button>
          );
        })}
        </div>
        
        {/* Status icons on the right */}
        <div className="dock-status">
          <div className="dock-divider" />
          <button className="status-button" title="Connected">
            <Wifi className="status-icon connected" />
          </button>
          <button className="status-button" title="Volume">
            <Volume2 className="status-icon" />
          </button>
          <button className="status-button" title="Battery: 100%">
            <Battery className="status-icon connected" />
          </button>
          <div className="status-time" title={mounted ? currentTime.toLocaleDateString() : ''}>
            <Clock className="status-icon" />
            <span>{mounted ? currentTime.toLocaleTimeString() : '12:00:00 AM'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dock;
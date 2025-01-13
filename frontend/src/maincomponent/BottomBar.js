
import React from 'react';
import './BottomBar.css';

import { Home, Package, Zap, MessageCircle, Grid,Search } from 'lucide-react';

const BottomBar = () => {
  const navItems = [
    { icon: <Home size={24} />, label: 'Home' }, 
    { icon: <Package size={24} />, label: 'Hot Deal' },
    { icon: <Zap size={24} />, label: 'Trending' },
    { icon: <MessageCircle size={24} />, label: 'Get help' },
    { icon: <Grid size={24} />, label: 'Others' }
  ];





  return (
    <nav className="navigation" style={{marginLeft:'-15px',borderTopLeftRadius:'40px',borderTopRightRadius:'40px'}}>
      {navItems.map((item, index) => (
        <button key={index} className="nav-item">
          <div className={`icon-wrapper ${item.label === 'Trending' ? 'highlight' : ''}`}>
            {item.icon}
          </div>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomBar;
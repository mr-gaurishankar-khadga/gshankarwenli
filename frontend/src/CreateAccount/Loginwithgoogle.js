import React, { useState, useEffect } from 'react';
import { Button, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import './Loginwithgoogle.css'; 

const Loginwithgoogle = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/profile', {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Not authenticated');
        const profile = await response.json();
        setUser(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const login = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const loginWindow = window.open(
      'http://localhost:8000/auth/google',
      '_blank',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const checkPopup = setInterval(() => {
      if (loginWindow.closed) {
        clearInterval(checkPopup);
        window.location.reload();
      }
    }, 500);
  };

  const logout = () => {
    fetch('http://localhost:8000/logout', {
      method: 'GET',
      credentials: 'include',
    }).then(() => {
      setUser(null);
    });
  };

  return (
    <div className="login-container">
      {user ? (
        <div className="user-details">
          <Typography variant="h4" gutterBottom>
            Hello, {user.displayName}
          </Typography>
          <Button 
            variant="contained" 
            onClick={logout} 
            style={{ color: 'black' }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div className="google-login-btn" onClick={login} style={{ marginTop: '-10px' }}>
          <Button
            variant="outlined"
            startIcon={<GoogleIcon style={{ color: 'rgb(112,112,112)' }} />}
            className="google-button"
          >
            Login with Google
          </Button>
        </div>
      )}
    </div>
  );
};

export default Loginwithgoogle;

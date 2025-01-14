import React, { useEffect, useState } from "react";
import './Profile.css';
import { Box, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import UserOrders from './UserOrders';
import UserReturns from './UserReturns';
import Likes from './Likes';
import ShoppingCartView from '../maincomponent/ShoppingCartView';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState('UserOrders');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://mrrapo.onrender.com/profile', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  const renderContent = () => {
    switch (selectedItem) {
      case 'UserOrders':
        return <UserOrders />;
      case 'UserReturns':
        return <UserReturns />;
      case 'Likes':
        return <Likes />;
      case 'ShoppingCartView':
        return <ShoppingCartView />;
      default:
        return <UserOrders />;
    }
  };

  return (
    <div className='create' style={{ marginLeft: '-20px' }}>
      <Box sx={{ display: 'flex', backgroundColor: '' }}>
        <Box sx={{ height: '150vh', width: '240px', backgroundColor: '', color: 'black', padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', position: 'fixed' }}>
          <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
            <Avatar src="" alt={user.displayName} sx={{ width: 140, height: 110, borderRadius: '10%' }} />
            <Typography variant="body2" sx={{ color: 'black' }}>{user.displayName}</Typography>
            <Typography variant="body2" sx={{ color: 'black' }}>{user.email}</Typography>
          </Box>

          <List component="nav" sx={{ overflow: 'auto', height: '100%', marginTop: '10px', width: '170px' }}>
            <ListItem button onClick={() => handleItemClick('UserOrders')}>
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItem>

            <ListItem button onClick={() => handleItemClick('UserReturns')}>
              <ListItemIcon>
                <AssignmentReturnIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Return" />
            </ListItem>

            <ListItem button onClick={() => handleItemClick('Likes')}>
              <ListItemIcon>
                <FavoriteIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Likes" />
            </ListItem>

            <ListItem button onClick={() => handleItemClick('ShoppingCartView')}>
              <ListItemIcon>
                <ShoppingCartIcon sx={{ color: 'black' }} />
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ flex: 1, marginTop: '16px', marginLeft: '300px' }}>
          <div className="divider" style={{ borderTop: '1px solid #333', width: '100%', marginTop: '-20px' }}></div>
          {renderContent()}
        </Box>
      </Box>
    </div>
  );
};

export default Profile;

import React from 'react';
import { Grid, Typography, Box, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './FeatureSection.css';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Box className="feature-card">
      <Avatar className="feature-avatar">
        {icon}
      </Avatar>
      <Box>
        <Typography fontWeight="bold">{title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: <StarIcon color="primary" />,
      title: 'Trending Styles',
      description: 'from Top Brands',
    },
    {
      icon: <LocalOfferIcon color="primary" />,
      title: 'Best Prices',
      description: 'on Top Products',
    },
    {
      icon: <CheckCircleIcon color="primary" />,
      title: 'Easy Returns',
      description: 'on every order',
    },
    // Add more features here if needed
  ];

  return (
    <div className="featurecontainer">
      <div
        sx={{
          maxwidth:'500px',
        }}
      >
        <div style={{display:'flex',width:'300px'}}>
          {features.map((feature, index) => (
            <div item key={index} style={{margin:'10px',width:'300px'}}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;

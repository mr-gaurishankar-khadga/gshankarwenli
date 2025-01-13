// src/components/ShoppingCartIcon.js

import React from 'react'; // Ensure React is imported
import { AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import Badge from '@mui/material/Badge';

const ShoppingCartIcon = ({ itemCount }) => {
  return (
    <Badge
      badgeContent={itemCount}
      color="primary"
      invisible={itemCount === 0}
    >
      <AddShoppingCartIcon titleAccess="ShoppingCart" style={{ cursor: 'pointer' }} />
    </Badge>
  );
};

export default ShoppingCartIcon;

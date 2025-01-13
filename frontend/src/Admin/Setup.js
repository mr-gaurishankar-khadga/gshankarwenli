
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { Box, IconButton, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, VideoLibrary, Analytics, Comment, Subtitles, Copyright, Settings, Feedback, People,ThumbDown,ThumbUp} from '@mui/icons-material';
import VideoCallSharpIcon from '@mui/icons-material/VideoCallSharp';
import ProductUpload from './ProductUpload';
import ImageUploader from './ImageUploader';
import Return from './Return';
import MyProduct from './MyProduct';


import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import InventoryIcon from '@mui/icons-material/Inventory';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import Message from './Message';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import Users from './Users';
import Orders from './Orders';


const Setup = () => {
    const [selectedItem, setSelectedItem] = useState('Dashboard');

    const handleItemClick = (item) => {
      setSelectedItem(item);
    };
  
    const renderContent = () => {
      switch (selectedItem) {
        case 'ProductUpload' :
          return <> <ProductUpload/> </>;
          
        case 'Slide':
          return <> <ImageUploader /> </> ;

        case 'Orders':
          return <> <Orders/> </>;

        case 'Dashbord':
          return <Typography variant="h6">this is my dashboard</Typography>;

        case 'Users':
          return <> <Users/> </>;

        case 'Return':
          return <> <Return/> </>;

        case 'Message':
          return <> <Message/> </>;

        case 'MyProduct':
          return <> <MyProduct/> </>;

        default:
          return <> <ProductUpload/> </>
      }
    };


  return (
    <>

      <div className='create' style={{marginLeft:'-20px',height:''}}>
      
    <Box sx={{ display: 'flex', backgroundColor:''}}>
      <Box sx={{height: '150vh',width: '240px',backgroundColor: '',color: 'black',padding: '10px 20px',display: 'flex',flexDirection: 'column',alignItems: 'center',boxShadow: '2px 0 5px rgba(0,0,0,0.1)',position:'fixed'}}>
        <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
          <Avatar src=" " alt="Gauri Shankar Khadga" sx={{ width: 140, height: 110 }} style={{marginLeft:'',margin:'10px',borderRadius:'10%'}}/>

          <Typography variant="body2" sx={{ color: 'gray' }}>
            ADMIN
          </Typography>
        </Box>


        <List component="nav" style={{overflow:'auto',height:'1000px',scrollbarWidth:'none',marginTop:'10px',backgroundColor:'',width:'170px'}}>
          <ListItem button onClick={() => handleItemClick('ProductUpload')}>
            <ListItemIcon>
              <VideoCallSharpIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Product" />
          </ListItem>


          

          <ListItem button onClick={() => handleItemClick('Orders')}>
            <ListItemIcon>
              <ShoppingCartIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>

          <ListItem button onClick={() => handleItemClick('Return')}>
            <ListItemIcon>
              <AssignmentReturnIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Return" />
          </ListItem>


          <ListItem button onClick={() => handleItemClick('Users')}>
            <ListItemIcon>
              <PersonIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>

          <ListItem button onClick={() => handleItemClick('Message')}>
            <ListItemIcon>
              <SendIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Message" />
          </ListItem>

          <ListItem button onClick={() => handleItemClick('Slide')}>
            <ListItemIcon>
              <LinearScaleIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Slide" />
          </ListItem>

          <ListItem button onClick={() => handleItemClick('MyProduct')}>
            <ListItemIcon>
              <InventoryIcon sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="MyProduct" />
          </ListItem>

          <ListItem button onClick={() => handleItemClick('Dashbord')}>
            <ListItemIcon>
              <Analytics sx={{ color: 'black' }} />
            </ListItemIcon>
            <ListItemText primary="Dashbord" />
          </ListItem>

        </List>
      </Box>



      <Box sx={{ flex: 1, marginTop: '16px', backgroundColor: '',width:'1300px',position:'static',height:'',marginLeft:'300px' }}>
      <div className="divider" style={{borderTop:'1px solid #333',width:'100%',marginLeft:'-40px',marginTop:'-20px'}}></div>
        {renderContent()}
      </Box>
    </Box>

      </div>

    </>
  )
}
export default Setup


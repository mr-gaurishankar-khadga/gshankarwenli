
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { IconButton, InputBase, AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Popover, Paper, Divider, Avatar } from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import './App.css';
import SalesPage from './maincomponent/pages/SalesPage';
import MensWearPage from './maincomponent/pages/MensWearPage';
import WomensWearPage from './maincomponent/pages/WomensWearPage';
import ContactPage from './maincomponent/pages/ContactPage';
import CompleteView from '../src/maincomponent/CompleteView';
import ShoppingCart from '../src/maincomponent/ShoppingCart';


import ProductDetail from '../src/maincomponent/ProductDetail';

import Signup from './CreateAccount/Signup';
import CartItem from '../src/maincomponent/CartItem';
import Setup from './Admin/Setup';
import ProfileMenu from './maincomponent/ProfileMenu';


import slider1 from './maincomponent/images/sl2.webp';

import Payment from './maincomponent/Payment';

import Logout from './CreateAccount/Logout';

import ShoppingCartView from './maincomponent/ShoppingCartView';
import LoginPage from './CreateAccount/LoginPage';
import Profile from './User/Profile';


import Logo from './images/WENLI.svg';

import TextSlider from './maincomponent/TextSlider';
import Loginwithgoogle from './CreateAccount/Loginwithgoogle';
import Search from './maincomponent/Search';
import MainHome from './maincomponent/MainHome';
import HomePage from './maincomponent/pages/HomePage';
import SearchIngine from './maincomponent/SearchIngine';
import ShoppingCartIcon from './maincomponent/ShoppingCartIcon';
import MensSlider from './maincomponent/pages/MensSlider';
import OtpVerification from './OtpVerification';
import PaymentStatus from './maincomponent/PaymentStatus ';
import CircleComponent from './maincomponent/CircleComponent';
import BottomBar from './maincomponent/BottomBar';
import ContactInfo from './maincomponent/ContactInfo';
import CustomerReviews from './maincomponent/CustomerReviews';



import { Search as LucideSearch } from 'lucide-react';

import { User } from 'lucide-react';

import { ShoppingCart as LucidShoppingCart } from 'lucide-react';

import { AlignJustify as LucidMenuIcon } from 'lucide-react';
import PaymentSelector from './maincomponent/PaymentSelector';
import CashFree from './Cashfree';





const App = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const [accountAnchor, setAccountAnchor] = useState(null);

  const [ shopAnchor, setShopAnchor ] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSearch = () => setIsActive(!isActive);

  const [token, setToken] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);


  //visible or not visible of bottom bar
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setVisible(lastScrollY > currentScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);


  const handleAccountClick = (event) => {
    setAccountAnchor(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchor(null);
  };


  const handleShopClick = (event) => {
    setShopAnchor(event.currentTarget);
  };

  const handleShopClose = () => {
    setShopAnchor(null);
  };

  const [totalProducts, setTotalProducts] = useState(0);
 
  useEffect(() => {
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const total = savedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    setTotalProducts(total);
  }, []);






  //search box show and hide funcanality
  const [showSearch, setShowSearch] = useState(false);

  const handleSearches = () => {
    setShowSearch(!showSearch);
  };




  return (

    <>

    <Router>
        <div className="logocontainer" style={{width:'',display:'flex',justifyContent:'center',backgroundColor:'black',color:'white',letterSpacing:'2px',marginTop:'-1px'}}>
          <TextSlider/>
        </div>

      <nav className="navbar" style={{background:'',height:'70px'}}>

        {/* Desktop View */}
        <div className="nav-desktop" style={{height:'70px'}}>
          <img src={Logo} alt="" className="" style={{ height: '180px', width: '250px', marginTop: '0', marginLeft: '20px' }} />
          <ul className="nav-links">
            <li><Link to="/ContactPage" style={{justifyContent:'space-between',letterSpacing:'2px'}}>Contact</Link></li>
            <li><Link to="/HomePage" style={{justifyContent:'space-between',letterSpacing:'2px'}}>Home</Link></li>
            <li><Link to="/MensWearPage" style={{justifyContent:'space-between',letterSpacing:'2px'}}>MensWear</Link></li>
            <li><Link to="/WomensWearPage" style={{justifyContent:'space-between',letterSpacing:'2px'}}>WomensWear</Link></li>
          </ul>
        
        <ul className="nav-icons">
          <li>
            <SearchIngine/>
          </li>

          <li style={{marginTop:'-10px',marginLeft:'0'}}>
            <User style={{ color: 'black', cursor: 'pointer',height:'26px',width:'26px',opacity:'70%',fontWeight:'400' }} onClick={handleAccountClick} />
          </li>

          <li onClick={handleShopClick} style={{marginTop:'-10px',marginRight:'50px'}}>
            <LucidShoppingCart itemCount={totalProducts} titleAccess='ShoppingCart' style={{ cursor: 'pointer',height:'26px',width:'26px',opacity:'70%' }}/>
          </li>
        </ul>
      </div>





      <Popover open={Boolean(accountAnchor)} anchorEl={accountAnchor} onClose={handleAccountClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }} transformOrigin={{     vertical: 'top',     horizontal: 'right', }} >
        <Paper style={{ maxWidth: 300, padding: 10, color:'white',backgroundColor:'rgb(15,15,15)' }}>
            
            {/* <Box display="flex" alignItems="center" mb={2}>
                <Avatar alt="User Avatar" src={slider1} style={{border:'2px solid white'}}/> 
                <Box ml={2}>
                    <Typography variant="h6">
                        gshankar
                    </Typography>
                    <Typography variant="subtitle1">
                        MRGAURISHANKAR
                    </Typography>
                </Box>
            </Box> */}

            <div className="divider"></div>
            <List>
              <ListItem button component={Link} to="/LoginPage">
                  <ListItemIcon style={{color:'white'}}>
                      <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
              </ListItem>
              <ListItem button component={Link} to="/Logout">
                  <ListItemIcon style={{color:'white'}}>
                      <ArrowCircleLeftIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
              </ListItem>
              <ListItem button component={Link} to="/Profile">
                  <ListItemIcon style={{color:'white'}}>
                      <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
              </ListItem>
            </List>
          </Paper>
        </Popover>
        <Popover open={Boolean(shopAnchor)} onClose={handleShopClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} PaperProps={{ style: {color: 'white',maxHeight:'' } }} > 
          <Paper style={{color: 'white',backgroundColor: '',overflowY: 'scroll',scrollbarWidth: 'none', }} >
            
            <style>
              {`
                /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
                ::-webkit-scrollbar {
                  width: 0px;
                  background: transparent; /* Optional: just in case it's visible */
                  }
                  `}
            </style>

          </Paper>
            <ShoppingCart />
        </Popover>







        {/* Mobile View */}
        <div className="nav-mobile" style={{width:'100%',marginTop:''}}>
          {!isActive && (



            <li style={{ listStyleType: 'none', fontSize: '30px', display: 'flex', width: '100%', backgroundColor: '', height: '60px', alignItems: 'center', justifyContent: 'space-between', padding: '0 5px' }}>
              {!showSearch && (
                <LucidMenuIcon 
                  onClick={toggleSidebar} 
                  style={{ color: 'rgb(17, 18, 21)', width: '30px', height: '30px' }}
                />
              )}
              
              {!showSearch && (
                <img 
                  src={Logo} 
                  alt="offline..." 
                  style={{ height: '170px', width: '200px' }}
                />
              )}
              
              {showSearch && (
                <input placeholder="Search..."style={{ paddingLeft: '25px', height: '20px',minWidth:'120px',maxWidth:'auto', padding: '10px', backgroundColor: 'rgb(212,214,218)', borderRadius: '120px', border: 'none', outline: 'none', transition: 'width 7.8s ease', width: '100%' }}autoFocus/>)}

              <IconButton onClick={handleSearches}style={{ color: 'black', width: '40px', height: '40px' }} >
                <LucideSearch style={{ color: 'black', width: '46px', height: '46px' }}/>
              </IconButton>
            </li>


          )}







          

          <div className="rightside" style={{textAlign:'right',width:'100%'}}> 


          <IconButton className="more-button">
            <AddShoppingCartIcon style={{color:'black',color: 'black',  width: '30px',  height: '30px'}}/>
          </IconButton>
          </div>



          {/* <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', padding: '1rem', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', transition: 'transform 0.5s ease-in-out', transform: visible ? 'translateY(0)' : 'translateY(260%)', zIndex: 1000 }}>
            <BottomBar/>
          </div> */}










          <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar} variant="temporary" sx={{ '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box', }, }}>
            <div className="sidebar" style={{color:'black'}}>
              <List>
                <ListItem button component={Link} to="/" onClick={toggleSidebar}>
                  <ListItemIcon><HomeIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Home" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/LoginPage" onClick={toggleSidebar} >
                  <ListItemIcon><LoginIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Login" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/ContactPage" onClick={toggleSidebar}>
                  <ListItemIcon><AddIcCallIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Contact" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/WomensWearPage" onClick={toggleSidebar}>
                  <ListItemIcon><SubscriptionsIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="WomensWear" style={{color:'black'}}/>
                </ListItem>

                <ListItem button component={Link} to="/MensWearPage" onClick={toggleSidebar}>
                  <ListItemIcon><SubscriptionsIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="MensWear" style={{color:'black'}}/>
                </ListItem> 

                <ListItem button component={Link} to="/Profile" onClick={toggleSidebar}>
                  <ListItemIcon><PersonIcon style={{color:'black'}}/></ListItemIcon>
                  <ListItemText primary="Profile" style={{color:'black'}}/>
                </ListItem>
              </List>
            </div>
          </Drawer>
        </div>
      </nav>

        <div className="divider">
      
      </div>





      

      <div className="maincontent" style={{height:'',backgroundColor:'',marginTop:''}}>
      
        <Routes>
          {/* <Route path="/" element={<OtpVerification/>} /> */}
          <Route path="/" element={<MainHome/>} />
          <Route path="/ContactPage" element={<ContactPage />} />
          <Route path="/CompleteView" element={<CompleteView />} />
          <Route path="/ProductDetail" element={<ProductDetail />} />
          <Route path="/CartItem" element={<CartItem />} />
          <Route path="/SearchIngine" element={<SearchIngine />} />
          <Route path="/Setup" element={<Setup />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/SalesPage" element={<SalesPage />} />
          <Route path="/MensWearPage" element={<MensWearPage />} />
          <Route path="/WomensWearPage" element={<WomensWearPage />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/ProfileMenu" element={<ProfileMenu />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/ShoppingCartView" element={<ShoppingCartView />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/TextSlider" element={<TextSlider />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/PaymentSelector" element={<PaymentSelector />} />
          <Route path ="CirlceComponent" element={<CircleComponent/>}/>
          <Route path ="BottomBar" element={<BottomBar/>}/>
          <Route path ="CustomerReviews" element={<CustomerReviews/>}/>
          <Route path ="Cashfree" element={<CashFree/>}/>

          
          
          <Route path="/MensSlider" element={<MensSlider />} />
          <Route path="/Loginwithgoogle" element={<Loginwithgoogle />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/LoginPage" element={<LoginPage setToken={setToken} setIsAdmin={setIsAdmin}/>} />
        </Routes>
      </div>
    </Router>




     {/* bottom bar all code templete here available         */}
     {/* <div>
      <ContactInfo/>
     </div> */}

    </>
  



  );
};

export default App;














import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as LucideSearch } from 'lucide-react';

const SearchIngine = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query.trim()}`);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };

  const styles = {
    searchContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '',
      borderRadius: '50px',
      width: isExpanded ? '500px' : '48px',
      height: '45px',
      transition: 'all 0.5s ease-in-out',
      overflow: 'hidden',
      position: 'relative',
      
      // backgroundColor:'red'
    },
    searchInput: {
      backgroundColor: 'rgb(212,214,218)',
      flex: 1,
      border: 'none',
      outline: 'none',
      padding: '0 15px',
      fontSize: '14px',
      height: '90%',  
      letterSpacing: '2px',
      color: '#333',
      display: isExpanded ? 'block' : 'none',
      transition: 'all 0.3s ease-in-out',
      position: 'relative',  
      top: '0', 
      margin: '0',
      borderRadius: '120px', 
    },
    searchButton: {
      border: 'none',
      padding: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease-in-out',
      marginLeft: isExpanded ? '0' : '-3px',
      borderRadius: '0%',
      height: '60px', 
      width: '60px',
      background:'none'
    },
    searchIcon: {
      width: '23px',
      height: '23px',
      opacity: '0.5',
      transition: 'all 0.3s ease-in-out',
    },
    form: {
      margin: '0',
      padding: '0'
    }
  };

  return (
    <form onSubmit={handleSearch} style={styles.form}>
      <div style={styles.searchContainer} className='searchBox'>
        {isExpanded && (
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.searchInput}
            autoFocus
          />
        )}
        <button
          type="button"
          onClick={toggleSearch}
          style={styles.searchButton}
          onMouseEnter={(e) => {
            if (isExpanded) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LucideSearch style={{backgroundColor:'',marginTop:'-8px',opacity:'70%'}}/>
        </button>
      </div>
    </form>
  );
};

export default SearchIngine;
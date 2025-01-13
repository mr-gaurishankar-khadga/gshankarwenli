import React from 'react';

const Loading = () => {
  return (
    <div className="loader-container">
      <div className="custom-loader" />
      <style>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(17, 24, 39, 0.5);  /* semi-transparent dark background */
        }

        .custom-loader {
          width: 80px;
          height: 80px;
          position: relative;
          background-color: #3b82f6;  /* blue color */
        }
        
        .custom-loader::before,
        .custom-loader::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: 
            no-repeat linear-gradient(#fff 0 0),
            no-repeat linear-gradient(#fff 0 0);
          background-size: 25% 50%;
          animation: loader 1.5s infinite linear;
        }
        
        .custom-loader::after {
          transform: scale(-1);
        }
        
        @keyframes loader {
          0%, 5% {
            background-position: 33.4% 100%, 66.6% 100%;
          }
          25% {
            background-position: 33.4% 100%, 100% 0;
          }
          50% {
            background-position: 0 0, 100% 0;
          }
          75% {
            background-position: 0 0, 66.6% 100%;
          }
          95%, 100% {
            background-position: 33.4% 100%, 66.6% 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
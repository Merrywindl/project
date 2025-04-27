import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ marginTop: '20px', textAlign: 'center', padding: '10px 0', backgroundColor: '#f8f9fa', width: '100%' }}>
      <p>&copy; {new Date().getFullYear()} Landover Labs All rights reserved. Pay Calculator V1.4</p>
    </footer>
  );
};

export default Footer;
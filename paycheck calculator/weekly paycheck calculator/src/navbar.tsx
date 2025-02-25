import React from 'react';

const Navbar: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button type="button" className="btn btn-primary btn-lg">Paycheck Calculator</button>
        <button type="button" className="btn btn-primary btn-lg">True Hourly Wage Calculator</button>
      </nav>
    </div>
  );
};

export default Navbar;
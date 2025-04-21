import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <Link to="/">
          <button type="button" className="btn btn-primary btn-lg">Paycheck Calculator</button>
        </Link>
        <Link to="/hourly-wage-calculator">
          <button type="button" className="btn btn-primary btn-lg">True Hourly Wage Calculator</button>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
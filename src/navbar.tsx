import React from 'react';
import { Link } from 'react-router-dom';

// Toggle this value to show/hide the button
const SHOW_PAYCHECK_BUTTON = false;

const Navbar: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {SHOW_PAYCHECK_BUTTON && (
          <Link to="/paycheck-form">
            <button type="button" className="btn btn-primary btn-lg">
              Paycheck Calculator
            </button>
          </Link>
        )}
        <Link to="/">
          <button type="button" className="btn btn-primary btn-lg">True Hourly Wage Calculator</button>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
import { useState } from 'react';
import '../paycheckForm.css';

export function HourlyWageCalculator() {
  const OVERTIME_RATE = 1.5; // Overtime rate multiplier
  const [hourlyWage, setHourlyWage] = useState('');
  const [regularHours, setTotalHours] = useState('');
  const [overtimeHours, setOvertimeHours] = useState('');
  const [footagePay, setFootagePay] = useState('');
  const [results, setResults] = useState<{ regularPay: string; overtimePay: string; grosspay: string } | null>(null);

  const isValidNumber = (value: string) => !isNaN(parseFloat(value)) && isFinite(parseFloat(value));

  const calculateOvertimePay = (hourlyRate: number, overtimeHours: number) => {
    return hourlyRate * OVERTIME_RATE * overtimeHours;
  };

  const handleCalculate = () => {
    if (!isValidNumber(hourlyWage) || !isValidNumber(regularHours) || !isValidNumber(overtimeHours) || !isValidNumber(footagePay)) {
      alert('Please enter valid numbers for all fields.');
      return;
    }

    const hourlyRate = parseFloat(hourlyWage);
    const regularHoursWorked = parseFloat(regularHours);
    const overtime = parseFloat(overtimeHours);
    const productionPay = parseFloat(footagePay);

    const totalHoursWorked = regularHoursWorked + overtime;
    const overtimePay = calculateOvertimePay(hourlyRate, overtime);
    const regularPay = regularHoursWorked * hourlyRate;
    const grosspay = regularPay + overtimePay + productionPay;

    // Adjust True Regular Hourly Pay based on Production Pay
    const trueRegularHourlyPay = productionPay > 0
      ? (regularPay + (productionPay * (regularHoursWorked / totalHoursWorked))) / regularHoursWorked
      : hourlyRate;

    // True Overtime Hourly Pay includes only overtime pay and proportional production pay
    const trueOvertimeHourlyPay = overtime > 0
      ? (overtimePay + (productionPay * (overtime / totalHoursWorked))) / overtime
      : 0;

    // Set the results in state
    setResults({
      regularPay: trueRegularHourlyPay.toFixed(2),
      overtimePay: trueOvertimeHourlyPay.toFixed(2),
      grosspay: grosspay.toFixed(2),
    });
  };

  return (
    <div className="hourly-rate-calculator">
      <h1>Hourly Wage Calculator</h1>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
        onSubmit={e => {
          e.preventDefault();
          handleCalculate();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="hourlyWage" style={{ width: '170px' }}>Hourly Wage:</label>
          <input id="hourlyWage" type="text" value={hourlyWage} onChange={(e) => setHourlyWage(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="regularHours" style={{ width: '170px' }}>Total Regular Hours:</label>
          <input id="regularHours" type="text" value={regularHours} onChange={(e) => setTotalHours(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="overtimeHours" style={{ width: '170px' }}>Overtime Hours:</label>
          <input id="overtimeHours" type="text" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="footagePay" style={{ width: '170px' }}>Commisions, tips, etc..:</label>
          <input id="footagePay" type="text" value={footagePay} onChange={(e) => setFootagePay(e.target.value)} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-primary" type="submit">
            Calculate True Hourly Pay
          </button>
        </div>
      </form>
      {results && (
        <div className="results">
          <h2>Results</h2>
          <p>Gross Pay: <strong>${results.grosspay}</strong></p>
          <p>Your True Regular Hourly Pay: <strong>${results.regularPay}</strong></p>
          <p>Your True Overtime Hourly Pay: <strong>${results.overtimePay}</strong></p>
        </div>
      )}
    </div>
  );
}
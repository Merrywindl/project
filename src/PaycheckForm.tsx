import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assuming you have Bootstrap installed
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './paycheckForm.css'; // Import the CSS file for additional styles

export default function PaycheckForm() {
  const [jobType, setJobType] = useState('TelCom');
  const [footage, setFootage] = useState('');
  const [machinebury, setMachinebury] = useState('');
  const [handbury, setHandbury] = useState('');
  const [hours, setHours] = useState('');
  const [totalWorkingHours, setTotalWorkingHours] = useState('');
  const [inputTotalWorkingHours, setInputTotalWorkingHours] = useState(''); // New state for input value
  const [paycheck, setPaycheck] = useState(0);
  const [commission, setCommission] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [rows, setRows] = useState<{ jobType: string; footage: number; commission: number; earnings: number; hours: number }[]>([]);
  const [totalWorkingHoursPay, setTotalWorkingHoursPay] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  const REGULAR_PAY_RATE = 10;
  const OVERTIME_RATE = 1.5;
  const TELCOM_MACHINEBURY_RATE = 0.4;
  const TELCOM_HANDBURY_RATE = 0.5;
  const TELCOM_HANDBURY_ONLY_RATE = 0.75;
  const FRONTIER_BASE_RATE = 160;
  const FRONTIER_RATE = 0.4;

  useEffect(() => {
    // Load data from local storage when the component mounts
    const savedRows = localStorage.getItem('rows');
    const savedPaycheck = localStorage.getItem('paycheck');
    const savedCommission = localStorage.getItem('commission');
    const savedEarnings = localStorage.getItem('earnings');
    const savedTotalWorkingHoursPay = localStorage.getItem('totalWorkingHoursPay');
    const savedJobType = localStorage.getItem('jobType');
    const savedFootage = localStorage.getItem('footage');
    const savedMachinebury = localStorage.getItem('machinebury');
    const savedHandbury = localStorage.getItem('handbury');
    const savedHours = localStorage.getItem('hours');
    const savedTotalWorkingHours = localStorage.getItem('totalWorkingHours');

    console.log('Loading data from localStorage');
    if (savedRows) setRows(JSON.parse(savedRows));
    if (savedPaycheck) setPaycheck(parseFloat(savedPaycheck));
    if (savedCommission) setCommission(parseFloat(savedCommission));
    if (savedEarnings) setEarnings(parseFloat(savedEarnings));
    if (savedTotalWorkingHoursPay) setTotalWorkingHoursPay(parseFloat(savedTotalWorkingHoursPay));
    if (savedJobType) setJobType(savedJobType);
    if (savedFootage) setFootage(savedFootage);
    if (savedMachinebury) setMachinebury(savedMachinebury);
    if (savedHandbury) setHandbury(savedHandbury);
    if (savedHours) setHours(savedHours);
    if (savedTotalWorkingHours) setTotalWorkingHours(savedTotalWorkingHours);

    setDataLoaded(true); // Set dataLoaded to true after loading data
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      // Save data to local storage whenever it changes
      console.log('Saving data to localStorage');
      localStorage.setItem('rows', JSON.stringify(rows));
      localStorage.setItem('paycheck', paycheck.toString());
      localStorage.setItem('commission', commission.toString());
      localStorage.setItem('earnings', earnings.toString());
      localStorage.setItem('totalWorkingHoursPay', totalWorkingHoursPay.toString());
      localStorage.setItem('jobType', jobType);
      localStorage.setItem('footage', footage);
      localStorage.setItem('machinebury', machinebury);
      localStorage.setItem('handbury', handbury);
      localStorage.setItem('hours', hours);
      localStorage.setItem('totalWorkingHours', totalWorkingHours);
    }
  }, [rows, paycheck, commission, earnings, totalWorkingHoursPay, jobType, footage, machinebury, handbury, hours, totalWorkingHours, dataLoaded]);

  useEffect(() => {
    // Recalculate paycheck whenever totalCommission, totalActiveHourPay, or totalWorkingHoursPay changes
    const totalCommission = rows.reduce((acc, row) => acc + row.commission, 0);
    const totalActiveHourPay = rows.reduce((acc, row) => {
      const regularPay = row.hours <= 40 ? row.hours * REGULAR_PAY_RATE : 40 * REGULAR_PAY_RATE + (row.hours - 40) * REGULAR_PAY_RATE * OVERTIME_RATE;
      return acc + regularPay;
    }, 0);
    const totalEarnings = rows.reduce((acc, row) => acc + row.earnings, 0);
    const totalPay = totalCommission + Math.max(totalActiveHourPay, totalWorkingHoursPay);
    setPaycheck(parseFloat(totalPay.toFixed(2)));
    setEarnings(parseFloat(totalEarnings.toFixed(2)));
  }, [rows, totalWorkingHoursPay]);

  const calculatePaycheck = () => {
    console.log('calculatePaycheck called');
    const hoursNum = parseFloat(hours) || 0;
    const regularPay = hoursNum <= 40 ? hoursNum * REGULAR_PAY_RATE : 40 * REGULAR_PAY_RATE + (hoursNum - 40) * REGULAR_PAY_RATE * OVERTIME_RATE;
    let commissionValue = 0;
    let totalFootage = 0;

    if (jobType === 'TelCom') {
      const machineburyNum = parseFloat(machinebury) || 0;
      const handburyNum = parseFloat(handbury) || 0;
      commissionValue = machineburyNum * TELCOM_MACHINEBURY_RATE + handburyNum * TELCOM_HANDBURY_RATE;
      totalFootage = machineburyNum + handburyNum;
    } else if (jobType === 'TelCom Handbury') {
      const handburyNum = parseFloat(handbury) || 0;
      commissionValue = handburyNum * TELCOM_HANDBURY_ONLY_RATE;
      totalFootage = handburyNum;
    } else if (jobType === 'Frontier') {
      const footageNum = parseFloat(footage) || 0;
      commissionValue = FRONTIER_BASE_RATE + ((footageNum - 250) * FRONTIER_RATE);
      totalFootage = footageNum;
    }

    const totalPay = regularPay + commissionValue;

    setPaycheck(parseFloat(totalPay.toFixed(2)));
    setCommission(parseFloat(commissionValue.toFixed(2)));

    // Append new row to the table
    setRows([...rows, { jobType, footage: totalFootage, commission: parseFloat(commissionValue.toFixed(2)), earnings: parseFloat(totalPay.toFixed(2)), hours: hoursNum }]);

    // Clear input fields
    setJobType('TelCom');
    setFootage('');
    setMachinebury('');
    setHandbury('');
    setHours('');
    setTotalWorkingHours('');
  };

  const calculateTotalWorkingHoursPay = () => {
    const totalWorkingHoursNum = parseFloat(inputTotalWorkingHours) || 0;
    const regularPay = totalWorkingHoursNum <= 40 ? totalWorkingHoursNum * REGULAR_PAY_RATE : 40 * REGULAR_PAY_RATE + (totalWorkingHoursNum - 40) * REGULAR_PAY_RATE * OVERTIME_RATE;
    setTotalWorkingHoursPay(parseFloat(regularPay.toFixed(2)));
    setTotalWorkingHours(totalWorkingHoursNum.toFixed(2)); // Update totalWorkingHours state
    setInputTotalWorkingHours(''); // Clear inputTotalWorkingHours state
  };

  const totalActiveHours = rows.reduce((acc, row) => acc + row.hours, 0);
  const lazyHours = (parseFloat(totalWorkingHours) || 0) - totalActiveHours;
  const totalCommission = rows.reduce((acc, row) => acc + row.commission, 0).toFixed(2);
  const totalEarnings = rows.reduce((acc, row) => acc + row.earnings, 0).toFixed(2);
  const totalActiveHourPay = rows.reduce((acc, row) => {
    const regularPay = row.hours <= 40 ? row.hours * REGULAR_PAY_RATE : 40 * REGULAR_PAY_RATE + (row.hours - 40) * REGULAR_PAY_RATE * OVERTIME_RATE;
    return acc + regularPay;
  }, 0).toFixed(2);

  const exportToPDF = () => {
    const input = document.getElementById('paycheck-table');
    html2canvas(input!).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('paycheck_data.pdf');
    });
  };

  const clearData = () => {
    localStorage.removeItem('rows');
    localStorage.removeItem('paycheck');
    localStorage.removeItem('commission');
    localStorage.removeItem('earnings');
    localStorage.removeItem('totalWorkingHoursPay');
    localStorage.removeItem('jobType');
    localStorage.removeItem('footage');
    localStorage.removeItem('machinebury');
    localStorage.removeItem('handbury');
    localStorage.removeItem('hours');
    localStorage.removeItem('totalWorkingHours');
    setRows([]);
    setPaycheck(0);
    setCommission(0);
    setEarnings(0);
    setTotalWorkingHoursPay(0);
    setJobType('TelCom');
    setFootage('');
    setMachinebury('');
    setHandbury('');
    setHours('');
    setTotalWorkingHours('');
  };

  return (
    <div className="paycheck-form">
      <h1>Weekly Paycheck Calculator</h1>
      <p className="bold-text">Paycheck: ${paycheck}</p>
      <p className="bold-text">Total Commission: ${totalCommission}</p>
      <p className="bold-text">Total Active Hour Pay: ${totalActiveHourPay}</p>
      <p className="bold-text">Total Working Hours Pay: ${totalWorkingHoursPay}</p>
      <p className="bold-text">Total Earnings: ${totalEarnings}</p>
      <div className="input-group text-center bold-text">
        You Actually Worked: {totalWorkingHours} hours. You Got Paid to do nothing for {lazyHours} hours.
        <label htmlFor="totalWorkingHours">Total Working Hours:</label>
        <input
          type="text"
          id="totalWorkingHours"
          value={inputTotalWorkingHours} // Use inputTotalWorkingHours for input value
          onChange={(e) => setInputTotalWorkingHours(e.target.value)} // Update inputTotalWorkingHours on change
        />
        <button type="button" onClick={calculateTotalWorkingHoursPay} className="btn btn-primary">
          Calculate Total Working Hours Pay
        </button>
      </div>
      <form className="form-group">
        <div className="input-group">
          <label htmlFor="jobType">Job Type:</label>
          <select
            id="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="TelCom">Telcom</option>
            <option value="Frontier">Frontier</option>
            <option value="TelCom Handbury">Telcom Handbury</option>
          </select>
        </div>
        {jobType === 'TelCom' && (
          <div className="input-group">
            <label htmlFor="machinebury">Machinebury:</label>
            <input
              type="text"
              id="machinebury"
              value={machinebury}
              onChange={(e) => setMachinebury(e.target.value)}
            />
          </div>
        )}
        {(jobType === 'TelCom' || jobType === 'TelCom Handbury') && (
          <div className="input-group">
            <label htmlFor="handbury">Handbury:</label>
            <input
              type="text"
              id="handbury"
              value={handbury}
              onChange={(e) => setHandbury(e.target.value)}
            />
          </div>
        )}
        {jobType === 'Frontier' && (
          <div className="input-group">
            <label htmlFor="footage">Footage:</label>
            <input
              type="text"
              id="footage"
              value={footage}
              onChange={(e) => setFootage(e.target.value)}
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="hours">Hours worked:</label>
          <input
            type="text"
            id="hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <div className="input-group">
          <button type="button" onClick={calculatePaycheck} className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <button type="button" onClick={exportToPDF} className="btn btn-secondary">
        Export to PDF
      </button>
      <table id="paycheck-table" className="table table-striped">
        <thead>
          <tr>
            <th>Contract</th>
            <th>Footage</th>
            <th>Commission</th>
            <th>Earnings</th>
            <th>ActiveHours</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.jobType}</td>
              <td>{row.footage}</td>
              <td>{row.commission}</td>
              <td>{row.earnings}</td>
              <td>{row.hours}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="bold-text">Expected Paycheck</td>
            <td colSpan={2} className="bold-text">${paycheck}</td>
          </tr>
        </tbody>
      </table>
      <button type="button" onClick={clearData} className="btn btn-danger">
        Start New Week
      </button>
    </div>
  );
}
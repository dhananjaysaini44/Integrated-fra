import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [reportData] = useState([
    { month: 'Jan', claims: 20, approved: 15, rejected: 5 },
    { month: 'Feb', claims: 25, approved: 20, rejected: 5 },
    { month: 'Mar', claims: 30, approved: 25, rejected: 5 },
    { month: 'Apr', claims: 35, approved: 28, rejected: 7 },
  ]);

  const [selectedReport, setSelectedReport] = useState('claims');

  const handleExport = (format) => {
    // Mock export
    alert(`Exporting ${selectedReport} report as ${format.toUpperCase()}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
      </div>

      <div className="mb-4">
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          className="border p-2 rounded mr-4"
        >
          <option value="claims">Claims Report</option>
          <option value="alerts">Alerts Report</option>
          <option value="landcover">Land Cover Report</option>
        </select>
        <button onClick={() => handleExport('csv')} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Export CSV
        </button>
        <button onClick={() => handleExport('pdf')} className="bg-red-500 text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Claims Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="claims" fill="#8884d8" />
            <Bar dataKey="approved" fill="#82ca9d" />
            <Bar dataKey="rejected" fill="#ff7c7c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Reports;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin } from 'lucide-react';
import alertsService from '../services/alertsService';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await alertsService.getAlerts();
        setAlerts(data);
      } catch (e) {
        setError(e.message || 'Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredAlerts = alerts.filter(alert =>
    (alert.type || '').toLowerCase().includes(filter.toLowerCase()) ||
    (alert.location || '').toLowerCase().includes(filter.toLowerCase()) ||
    (alert.severity || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by type, location, or severity"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading && <div className="mb-4 text-gray-600">Loading...</div>}

      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <div key={alert.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className={`mr-4 ${
                alert.severity?.toLowerCase() === 'high' ? 'text-red-500' :
                alert.severity?.toLowerCase() === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`} size={24} />
              <div>
                <h3 className="font-semibold">{alert.type}</h3>
                <p className="text-gray-600">{alert.location} - {new Date(alert.created_at).toLocaleString()}</p>
                <span className={`px-2 py-1 rounded text-sm ${
                  alert.severity?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {alert.severity}
                </span>
              </div>
            </div>
            <Link to={`/map?alert=${alert.id}`} className="flex items-center text-blue-500 hover:underline">
              <MapPin size={16} className="mr-1" />
              View on Map
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;

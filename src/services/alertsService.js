import authService from './authService';

class AlertsService {
  constructor() {
    this.api = authService.api; // includes auth headers if logged in
  }

  async getAlerts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state) params.append('state', filters.state);
    if (filters.severity) params.append('severity', filters.severity);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    const res = await this.api.get(`/alerts?${params.toString()}`);
    return res.data;
  }

  async createAlert(alert) {
    const res = await this.api.post('/alerts', alert);
    return res.data;
  }

  async updateAlert(id, alert) {
    const res = await this.api.put(`/alerts/${id}`, alert);
    return res.data;
  }

  async deleteAlert(id) {
    const res = await this.api.delete(`/alerts/${id}`);
    return res.data;
  }
}

export default new AlertsService();

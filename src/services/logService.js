import authService from './authService';

class LogService {
  constructor() {
    this.api = authService.api;
  }

  async getRecentLogs(limit = 20) {
    try {
      const response = await this.api.get(`/logs?limit=${limit}`);
      return response.data.logs || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch logs');
    }
  }

  async exportAllLogsAsBlob() {
    try {
      const response = await this.api.get('/logs/export', { responseType: 'blob' });
      const dispo = response.headers?.['content-disposition'] || '';
      let filename = '';
      const match = dispo.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
      if (match) {
        filename = decodeURIComponent(match[1] || match[2] || '').trim();
      }
      if (!filename) {
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        filename = `system-logs-${ts}.csv`;
      }
      return { blob: response.data, filename };
    } catch (error) {
      // If server returned JSON error, try to parse
      try {
        const text = await error?.response?.data?.text?.();
        const msg = JSON.parse(text)?.message;
        throw new Error(msg || 'Failed to export logs');
      } catch (_) {
        throw new Error(error.response?.data?.message || 'Failed to export logs');
      }
    }
  }
}

export default new LogService();

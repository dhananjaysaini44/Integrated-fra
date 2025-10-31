import axios from 'axios';
import { API_BASE_URL } from '../config/api';

class ClaimService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getClaims(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.state) params.append('state', filters.state);
      if (filters.search) params.append('search', filters.search);
      
      const response = await this.api.get(`/claims?${params.toString()}`);
      return response.data.map(claim => ({
        ...claim,
        claimId: `FRA-2024-${claim.id.toString().padStart(3, '0')}`,
        claimantName: claim.claimant_name,
        submissionDate: new Date(claim.created_at).toISOString().split('T')[0],
        documents: JSON.parse(claim.documents || '[]'),
        polygon: JSON.parse(claim.polygon || '[]')
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch claims');
    }
  }

  async getClaimById(id) {
    try {
      const response = await this.api.get(`/claims/${id}`);
      const claim = response.data;
      return {
        ...claim,
        claimId: `FRA-2024-${claim.id.toString().padStart(3, '0')}`,
        claimantName: claim.claimant_name,
        submissionDate: new Date(claim.created_at).toISOString().split('T')[0],
        documents: JSON.parse(claim.documents || '[]'),
        polygon: JSON.parse(claim.polygon || '[]')
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Claim not found');
    }
  }

  async createClaim(claimData) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        claimant_name: claimData.claimantName,
        village: claimData.village,
        state: claimData.state,
        district: claimData.district,
        polygon: claimData.polygon || [],
        documents: claimData.files ? claimData.files.map(f => f.name) : [],
        user_id: user.id
      };
      
      const response = await this.api.post('/claims', payload);
      const claim = response.data;
      return {
        ...claim,
        claimId: `FRA-2024-${claim.id.toString().padStart(3, '0')}`,
        claimantName: claim.claimant_name,
        submissionDate: new Date(claim.created_at).toISOString().split('T')[0],
        documents: JSON.parse(claim.documents || '[]'),
        polygon: JSON.parse(claim.polygon || '[]')
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create claim');
    }
  }

  async createClaimWithDocs(claimData) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const form = new FormData();
      form.append('claimant_name', claimData.claimantName || '');
      form.append('village', claimData.village || '');
      form.append('state', claimData.state || '');
      form.append('district', claimData.district || '');
      form.append('polygon', JSON.stringify(claimData.polygon || []));
      form.append('user_id', user.id || '');
      (claimData.files || []).forEach(f => form.append('documents', f, f.name));

      const response = await this.api.post('/claims/submit', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const claim = response.data;
      return {
        ...claim,
        claimId: `FRA-2024-${claim.id.toString().padStart(3, '0')}`,
        claimantName: claim.claimant_name,
        submissionDate: new Date(claim.created_at).toISOString().split('T')[0],
        documents: JSON.parse(claim.documents || '[]'),
        polygon: JSON.parse(claim.polygon || '[]'),
        modelResult: claim.model_result ? JSON.parse(claim.model_result) : null,
        modelStatus: claim.model_status || null
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit claim with documents');
    }
  }

  async updateClaim(id, updateData) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        claimant_name: updateData.claimantName,
        village: updateData.village,
        state: updateData.state,
        district: updateData.district,
        status: updateData.status,
        polygon: updateData.polygon || [],
        documents: updateData.documents || [],
        actor_user_id: user.id,
        rejection_reason: updateData.rejection_reason,
      };
      
      const response = await this.api.put(`/claims/${id}`, payload);
      const claim = response.data;
      return {
        ...claim,
        claimId: `FRA-2024-${claim.id.toString().padStart(3, '0')}`,
        claimantName: claim.claimant_name,
        submissionDate: new Date(claim.created_at).toISOString().split('T')[0],
        documents: JSON.parse(claim.documents || '[]'),
        polygon: JSON.parse(claim.polygon || '[]')
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update claim');
    }
  }

  async approveClaim(id) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await this.api.post(`/claims/${id}/approve`, { actor_user_id: user.id });
      const claim = response.data;
      return {
        ...claim,
        claimId: `FRA-2024-${claim.id.toString().padStart(3, '0')}`,
        claimantName: claim.claimant_name,
        submissionDate: new Date(claim.created_at).toISOString().split('T')[0],
        documents: JSON.parse(claim.documents || '[]'),
        polygon: JSON.parse(claim.polygon || '[]')
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to approve claim');
    }
  }

  async rejectClaim(id, reason) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await this.api.post(`/claims/${id}/reject`, { actor_user_id: user.id, reason });
      const claim = response.data;
      return {
        ...claim,
        claimId: `FRA-2024-${claim.id.toString().padStart(3, '0')}`,
        claimantName: claim.claimant_name,
        submissionDate: new Date(claim.created_at).toISOString().split('T')[0],
        documents: JSON.parse(claim.documents || '[]'),
        polygon: JSON.parse(claim.polygon || '[]')
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject claim');
    }
  }

  async deleteClaim(id) {
    try {
      const response = await this.api.delete(`/claims/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete claim');
    }
  }

  async getClaimStats() {
    try {
      const response = await this.api.get('/claims/stats/summary');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }

  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await this.api.post('/claims/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload document');
    }
  }

  async getDocuments(claimId) {
    try {
      const response = await this.api.get(`/claims/${claimId}/documents`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch documents');
    }
  }

  async downloadDocument(documentId) {
    try {
      const response = await this.api.get(`/claims/documents/${documentId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to download document');
    }
  }
}

export default new ClaimService();

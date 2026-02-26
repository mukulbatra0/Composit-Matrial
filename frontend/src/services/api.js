import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchFibers = async () => {
  const response = await api.get('/materials/fibers');
  return response.data;
};

export const fetchMatrices = async () => {
  const response = await api.get('/materials/matrices');
  return response.data;
};

export const fetchFiberById = async (id) => {
  const response = await api.get(`/materials/fibers/${id}`);
  return response.data;
};

export const fetchMatrixById = async (id) => {
  const response = await api.get(`/materials/matrices/${id}`);
  return response.data;
};

// Experimental data API
export const fetchFiberTypes = async () => {
  const response = await api.get('/composites/fiber-types');
  return response.data;
};

export const fetchMatrixTypes = async () => {
  const response = await api.get('/composites/matrix-types');
  return response.data;
};

export const fetchOrientations = async () => {
  const response = await api.get('/composites/orientations');
  return response.data;
};

export const fetchCompositeData = async (fiberType, matrixType, orientation) => {
  const params = new URLSearchParams();
  if (fiberType) params.append('fiber_type', fiberType);
  if (matrixType) params.append('matrix_type', matrixType);
  if (orientation) params.append('orientation', orientation);
  
  const response = await api.get(`/composites/data?${params.toString()}`);
  return response.data;
};

export const fetchCompositeStats = async (fiberType, matrixType, orientation) => {
  const params = new URLSearchParams();
  if (fiberType) params.append('fiber_type', fiberType);
  if (matrixType) params.append('matrix_type', matrixType);
  if (orientation) params.append('orientation', orientation);
  
  const response = await api.get(`/composites/stats?${params.toString()}`);
  return response.data;
};

// Load-Deflection API
export const fetchLoadDeflectionCurve = async (fiberType, matrixType, fvf) => {
  const response = await api.get('/load-deflection/curve', {
    params: { fiber_type: fiberType, matrix_type: matrixType, fvf }
  });
  return response.data;
};

export const fetchLoadDeflectionComparison = async (fiberType, matrixType, fvfList) => {
  const response = await api.get('/load-deflection/compare', {
    params: { fiber_type: fiberType, matrix_type: matrixType, fvf_list: fvfList }
  });
  return response.data;
};

export const fetchLoadDeflectionSummary = async (fiberType, matrixType) => {
  const response = await api.get('/load-deflection/summary', {
    params: { fiber_type: fiberType, matrix_type: matrixType }
  });
  return response.data;
};

export default api;

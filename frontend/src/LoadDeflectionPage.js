import React, { useState, useEffect } from 'react';
import LoadDeflectionChart from './components/LoadDeflectionChart';
import LoadDeflectionComparison from './components/LoadDeflectionComparison';
import LoadDeflectionTable from './components/LoadDeflectionTable';
import {
  fetchFiberTypes,
  fetchMatrixTypes,
  fetchLoadDeflectionCurve,
  fetchLoadDeflectionComparison,
  fetchLoadDeflectionSummary
} from './services/api';

function LoadDeflectionPage() {
  const [fiberTypes, setFiberTypes] = useState([]);
  const [matrixTypes, setMatrixTypes] = useState([]);
  const [selectedFiber, setSelectedFiber] = useState('Glass');
  const [selectedMatrix, setSelectedMatrix] = useState('Epoxy');
  const [selectedFVF, setSelectedFVF] = useState(40);
  const [curveData, setCurveData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch fiber and matrix types
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [fibers, matrices] = await Promise.all([
          fetchFiberTypes(),
          fetchMatrixTypes()
        ]);
        setFiberTypes(fibers);
        setMatrixTypes(matrices);
        setLoading(false);
      } catch (err) {
        setError('Failed to load material types');
        setLoading(false);
      }
    };
    loadOptions();
  }, []);

  // Fetch load-deflection data when selections change
  useEffect(() => {
    const loadData = async () => {
      if (!selectedFiber || !selectedMatrix) return;

      try {
        const [curve, comparison, summary] = await Promise.all([
          fetchLoadDeflectionCurve(selectedFiber, selectedMatrix, selectedFVF),
          fetchLoadDeflectionComparison(selectedFiber, selectedMatrix, '10,20,30,40,50,60'),
          fetchLoadDeflectionSummary(selectedFiber, selectedMatrix)
        ]);

        setCurveData(curve);
        setComparisonData(comparison);
        setSummaryData(summary);
      } catch (err) {
        console.error('Error loading load-deflection data:', err);
      }
    };

    loadData();
  }, [selectedFiber, selectedMatrix, selectedFVF]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Integrated Composite Material Characterization System
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Three-point bending test simulation for composite materials
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Test Parameters
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiber Type
                </label>
                <select
                  value={selectedFiber}
                  onChange={(e) => setSelectedFiber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fiberTypes.map((fiber) => (
                    <option key={fiber} value={fiber}>
                      {fiber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matrix Type
                </label>
                <select
                  value={selectedMatrix}
                  onChange={(e) => setSelectedMatrix(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {matrixTypes.map((matrix) => (
                    <option key={matrix} value={matrix}>
                      {matrix}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiber Volume Fraction: {selectedFVF}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={selectedFVF}
                  onChange={(e) => setSelectedFVF(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((selectedFVF - 10) / 50) * 100}%, #e5e7eb ${((selectedFVF - 10) / 50) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>35%</span>
                  <span>60%</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">
                  Specimen Dimensions
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Width: 25 mm</p>
                  <p>Thickness: 3 mm</p>
                  <p>Span Length: 50 mm</p>
                  <p>Test: Three-point bending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Single curve for selected FVF */}
            {curveData && <LoadDeflectionChart data={curveData} />}

            {/* Comparison of multiple FVFs */}
            {comparisonData && <LoadDeflectionComparison comparisonData={comparisonData} />}

            {/* Summary table */}
            {summaryData && <LoadDeflectionTable summaryData={summaryData} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoadDeflectionPage;

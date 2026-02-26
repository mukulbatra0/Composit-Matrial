import React, { useState, useEffect } from 'react';
import MaterialSelector from './components/MaterialSelector';
import PropertyCard from './components/PropertyCard';
import PropertyVsFractionChart from './components/PropertyVsFractionChart';
import StressStrainChart from './components/StressStrainChart';
import LoadDeflectionChart from './components/LoadDeflectionChart';
import LoadDeflectionComparison from './components/LoadDeflectionComparison';
import LoadDeflectionTable from './components/LoadDeflectionTable';
import { 
  fetchFiberTypes, 
  fetchMatrixTypes, 
  fetchOrientations,
  fetchCompositeData,
  fetchCompositeStats,
  fetchLoadDeflectionCurve,
  fetchLoadDeflectionComparison,
  fetchLoadDeflectionSummary
} from './services/api';

function AppExperimental() {
  const [fiberTypes, setFiberTypes] = useState([]);
  const [matrixTypes, setMatrixTypes] = useState([]);
  const [orientations, setOrientations] = useState([]);
  const [selectedFiber, setSelectedFiber] = useState('');
  const [selectedMatrix, setSelectedMatrix] = useState('');
  const [selectedOrientation, setSelectedOrientation] = useState('');
  const [compositeData, setCompositeData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load-deflection states
  const [selectedFVF, setSelectedFVF] = useState(40);
  const [loadDeflectionCurve, setLoadDeflectionCurve] = useState(null);
  const [loadDeflectionComparison, setLoadDeflectionComparison] = useState(null);
  const [loadDeflectionSummary, setLoadDeflectionSummary] = useState(null);
  const [showLoadDeflectionColumns, setShowLoadDeflectionColumns] = useState(true);

  // Fetch initial options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [fibers, matrices, orients] = await Promise.all([
          fetchFiberTypes(),
          fetchMatrixTypes(),
          fetchOrientations()
        ]);
        
        setFiberTypes(fibers);
        setMatrixTypes(matrices);
        setOrientations(orients);
        
        // Set defaults
        if (fibers.length > 0) setSelectedFiber(fibers[0]);
        if (matrices.length > 0) setSelectedMatrix(matrices[0]);
        if (orients.length > 0) setSelectedOrientation(orients[0]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading options:', err);
        setError(`Failed to load data: ${err.message}. Please ensure the backend server is running on http://localhost:5000 and the database has been seeded with 'npm run seed-experimental'.`);
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  // Fetch composite data when selections change
  useEffect(() => {
    const loadCompositeData = async () => {
      if (!selectedFiber || !selectedMatrix || !selectedOrientation) return;
      
      try {
        const [data, statistics] = await Promise.all([
          fetchCompositeData(selectedFiber, selectedMatrix, selectedOrientation),
          fetchCompositeStats(selectedFiber, selectedMatrix, selectedOrientation)
        ]);
        
        setCompositeData(data);
        setStats(statistics);
      } catch (err) {
        console.error('Error loading composite data:', err);
      }
    };

    loadCompositeData();
  }, [selectedFiber, selectedMatrix, selectedOrientation]);

  // Fetch load-deflection data when fiber and matrix change
  useEffect(() => {
    const loadLoadDeflectionData = async () => {
      if (!selectedFiber || !selectedMatrix) return;

      try {
        const [curve, comparison, summary] = await Promise.all([
          fetchLoadDeflectionCurve(selectedFiber, selectedMatrix, selectedFVF),
          fetchLoadDeflectionComparison(selectedFiber, selectedMatrix, '10,20,30,40,50,60'),
          fetchLoadDeflectionSummary(selectedFiber, selectedMatrix)
        ]);

        setLoadDeflectionCurve(curve);
        setLoadDeflectionComparison(comparison);
        setLoadDeflectionSummary(summary);
      } catch (err) {
        console.error('Error loading load-deflection data:', err);
      }
    };

    loadLoadDeflectionData();
  }, [selectedFiber, selectedMatrix, selectedFVF]);

  // Transform data for charts
  const propertyVsFractionData = compositeData.map(d => ({
    volumeFraction: d.fiber_content,
    tensileStrength: d.tensile_strength,
    youngsModulus: d.youngs_modulus || 0
  }));

  // Generate stress-strain approximation
  const generateStressStrainData = (maxStrain = 5) => {
    if (compositeData.length === 0) return [];
    
    // Use average properties
    const avgModulus = stats?.youngs_modulus?.avg || 0;
    const avgStrength = stats?.tensile_strength?.avg || 0;
    
    const data = [];
    const points = 50;
    const strainAtFailure = avgModulus > 0 ? (avgStrength / (avgModulus * 1000)) * 100 : maxStrain;
    
    for (let i = 0; i <= points; i++) {
      const strain = (strainAtFailure * i) / points;
      const stress = avgModulus * strain * 10; // GPa to MPa conversion
      data.push({ 
        strain: strain, 
        stress: Math.min(stress, avgStrength) 
      });
    }
    
    return data;
  };

  const stressStrainData = generateStressStrainData();

  // Helper function to calculate load-deflection properties for a given FVF
  const calculateLoadDeflectionForFVF = (fiberType, matrixType, fvf) => {
    const baseMaxLoad = 50;
    const fiberFactors = {
      'Glass': { loadFactor: 15, stiffnessFactor: 1.2 },
      'E-Glass': { loadFactor: 15, stiffnessFactor: 1.2 },
      'Carbon': { loadFactor: 25, stiffnessFactor: 1.5 },
      'Basalt': { loadFactor: 12, stiffnessFactor: 1.15 },
      'Natural Fiber': { loadFactor: 5, stiffnessFactor: 0.9 },
      'Sisal': { loadFactor: 4, stiffnessFactor: 0.85 },
      'Jute': { loadFactor: 4.5, stiffnessFactor: 0.88 }
    };

    const factor = fiberFactors[fiberType] || { loadFactor: 10, stiffnessFactor: 1.0 };
    const fvfDecimal = fvf / 100;
    
    const maxLoad = baseMaxLoad + (factor.loadFactor * fvfDecimal * 100);
    const maxDeflection = 8 * (1 - fvfDecimal * 0.4);
    
    // Calculate flexural strength: σ = (3 * P * L) / (2 * b * h²)
    const span = 50, width = 25, thickness = 3;
    const flexuralStrength = (3 * maxLoad * span) / (2 * width * Math.pow(thickness, 2));
    
    return {
      maxLoad: maxLoad.toFixed(1),
      maxDeflection: maxDeflection.toFixed(2),
      flexuralStrength: flexuralStrength.toFixed(1)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experimental data...</p>
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
            Experimental data (2013-2025) + Load-Deflection Analysis
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Material Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Material Selection
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiber Orientation
                </label>
                <select
                  value={selectedOrientation}
                  onChange={(e) => setSelectedOrientation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {orientations.map((orientation) => (
                    <option key={orientation} value={orientation}>
                      {orientation}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Info */}
              {stats && stats.count > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Dataset Information
                  </h4>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p>Data Points: {stats.count}</p>
                    <p>Fiber Content Range: {stats.fiber_content_range?.min}% - {stats.fiber_content_range?.max}%</p>
                  </div>
                </div>
              )}

              {/* Load-Deflection FVF Slider */}
              {selectedFiber && selectedMatrix && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-900 mb-3">
                    Load-Deflection Analysis
                  </h4>
                  <label className="block text-xs font-medium text-purple-800 mb-2">
                    Fiber Volume Fraction: {selectedFVF}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={selectedFVF}
                    onChange={(e) => setSelectedFVF(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((selectedFVF - 10) / 50) * 100}%, #e9d5ff ${((selectedFVF - 10) / 50) * 100}%, #e9d5ff 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-purple-700 mt-1">
                    <span>10%</span>
                    <span>35%</span>
                    <span>60%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results and Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Cards */}
            {stats && stats.count > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PropertyCard
                  title="Avg Tensile Strength"
                  value={stats.tensile_strength?.avg || 0}
                  unit="MPa"
                  description={`Range: ${stats.tensile_strength?.min?.toFixed(1)} - ${stats.tensile_strength?.max?.toFixed(1)} MPa`}
                />
                <PropertyCard
                  title="Avg Young's Modulus"
                  value={stats.youngs_modulus?.avg || 0}
                  unit="GPa"
                  description={`Range: ${stats.youngs_modulus?.min?.toFixed(1)} - ${stats.youngs_modulus?.max?.toFixed(1)} GPa`}
                />
              </div>
            )}

            {/* Data Table */}
            {compositeData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Experimental Data Points {showLoadDeflectionColumns && '+ Load-Deflection Properties'}
                  </h3>
                  <button
                    onClick={() => setShowLoadDeflectionColumns(!showLoadDeflectionColumns)}
                    className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                  >
                    {showLoadDeflectionColumns ? 'Hide' : 'Show'} Load-Deflection Columns
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiber volume fraction %</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tensile Strength (MPa)</th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Young's Modulus (GPa)</th>
                        {showLoadDeflectionColumns && (
                          <>
                            <th className="px-3 py-3 text-left text-xs font-medium text-purple-600 uppercase">Max Load (N)</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-purple-600 uppercase">Max Deflection (mm)</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-purple-600 uppercase">Flexural Strength (MPa)</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {compositeData.map((data, idx) => {
                        // Calculate load-deflection properties for this fiber content
                        const ldProps = showLoadDeflectionColumns ? calculateLoadDeflectionForFVF(
                          selectedFiber,
                          selectedMatrix,
                          data.fiber_content
                        ) : null;
                        
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-3 text-sm text-gray-900">{data.publish_year}</td>
                            <td className="px-3 py-3 text-sm text-gray-900">{data.fiber_content}%</td>
                            <td className="px-3 py-3 text-sm text-gray-900">{data.tensile_strength}</td>
                            <td className="px-3 py-3 text-sm text-gray-900">{data.youngs_modulus || 'N/A'}</td>
                            {showLoadDeflectionColumns && ldProps && (
                              <>
                                <td className="px-3 py-3 text-sm text-purple-700 font-medium">{ldProps.maxLoad}</td>
                                <td className="px-3 py-3 text-sm text-purple-700 font-medium">{ldProps.maxDeflection}</td>
                                <td className="px-3 py-3 text-sm text-purple-700 font-medium">{ldProps.flexuralStrength}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {showLoadDeflectionColumns && (
                  <div className="mt-3 p-2 bg-purple-50 rounded text-xs text-purple-800">
                    <strong>Note:</strong> Load-deflection properties (purple columns) are calculated based on three-point bending test mechanics for the given fiber volume fraction.
                  </div>
                )}
              </div>
            )}

            {/* Charts */}
            {propertyVsFractionData.length > 0 && (
              <>
                <PropertyVsFractionChart data={propertyVsFractionData} />
                {stressStrainData.length > 0 && (
                  <StressStrainChart
                    compositeData={stressStrainData}
                  />
                )}
              </>
            )}

            {compositeData.length === 0 && stats && stats.count === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">
                  No experimental data available for this combination. Try selecting different materials or orientation.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Selected: {selectedFiber} + {selectedMatrix} + {selectedOrientation}
                </p>
              </div>
            )}

            {compositeData.length === 0 && (!stats || stats.count === undefined) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800">
                  Loading data...
                </p>
              </div>
            )}

            {/* Load-Deflection Analysis Section */}
            {selectedFiber && selectedMatrix && (
              <>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Load-Deflection Analysis
                  </h2>
                  <p className="text-sm text-gray-600">
                    Three-point bending test simulation for {selectedFiber} + {selectedMatrix}
                  </p>
                </div>

                {loadDeflectionCurve && (
                  <LoadDeflectionChart data={loadDeflectionCurve} />
                )}

                {loadDeflectionComparison && (
                  <LoadDeflectionComparison comparisonData={loadDeflectionComparison} />
                )}

                {loadDeflectionSummary && (
                  <LoadDeflectionTable summaryData={loadDeflectionSummary} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppExperimental;

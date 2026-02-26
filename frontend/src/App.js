import React, { useState, useEffect } from 'react';
import MaterialSelector from './components/MaterialSelector';
import FractionSlider from './components/FractionSlider';
import PropertyCard from './components/PropertyCard';
import PropertyVsFractionChart from './components/PropertyVsFractionChart';
import StressStrainChart from './components/StressStrainChart';
import { fetchFibers, fetchMatrices } from './services/api';
import {
  volumeToWeightFraction,
  weightToVolumeFraction,
  calculateCompositeDensity,
  calculateLongitudinalModulus,
  calculateTransverseModulus,
  generatePropertyVsFractionData,
  generateStressStrainData
} from './utils/calculations';

function App() {
  const [fibers, setFibers] = useState([]);
  const [matrices, setMatrices] = useState([]);
  const [selectedFiberId, setSelectedFiberId] = useState('');
  const [selectedMatrixId, setSelectedMatrixId] = useState('');
  const [volumeFraction, setVolumeFraction] = useState(50);
  const [weightFraction, setWeightFraction] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch materials on mount
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const [fibersData, matricesData] = await Promise.all([
          fetchFibers(),
          fetchMatrices()
        ]);
        setFibers(fibersData);
        setMatrices(matricesData);
        
        // Set default selections
        if (fibersData.length > 0) setSelectedFiberId(fibersData[0]._id);
        if (matricesData.length > 0) setSelectedMatrixId(matricesData[0]._id);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load materials. Please ensure the backend server is running.');
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  const selectedFiber = fibers.find(f => f._id === selectedFiberId);
  const selectedMatrix = matrices.find(m => m._id === selectedMatrixId);

  // Update weight fraction when volume fraction changes
  const handleVolumeFractionChange = (newVolumeFraction) => {
    setVolumeFraction(newVolumeFraction);
    if (selectedFiber && selectedMatrix) {
      const newWeightFraction = volumeToWeightFraction(
        newVolumeFraction / 100,
        selectedFiber.density,
        selectedMatrix.density
      ) * 100;
      setWeightFraction(newWeightFraction);
    }
  };

  // Update volume fraction when weight fraction changes
  const handleWeightFractionChange = (newWeightFraction) => {
    setWeightFraction(newWeightFraction);
    if (selectedFiber && selectedMatrix) {
      const newVolumeFraction = weightToVolumeFraction(
        newWeightFraction / 100,
        selectedFiber.density,
        selectedMatrix.density
      ) * 100;
      setVolumeFraction(newVolumeFraction);
    }
  };

  // Calculate composite properties
  const compositeDensity = selectedFiber && selectedMatrix
    ? calculateCompositeDensity(
        volumeFraction / 100,
        selectedFiber.density,
        selectedMatrix.density
      )
    : 0;

  const longitudinalModulus = selectedFiber && selectedMatrix
    ? calculateLongitudinalModulus(
        volumeFraction / 100,
        selectedFiber.elastic_modulus,
        selectedMatrix.elastic_modulus
      )
    : 0;

  const transverseModulus = selectedFiber && selectedMatrix
    ? calculateTransverseModulus(
        volumeFraction / 100,
        selectedFiber.elastic_modulus,
        selectedMatrix.elastic_modulus
      )
    : 0;

  // Generate chart data
  const propertyVsFractionData = selectedFiber && selectedMatrix
    ? generatePropertyVsFractionData(
        selectedFiber.elastic_modulus,
        selectedMatrix.elastic_modulus
      )
    : [];

  const fiberStressStrainData = selectedFiber
    ? generateStressStrainData('fiber', volumeFraction / 100, selectedFiber, selectedMatrix)
    : [];

  const matrixStressStrainData = selectedMatrix
    ? generateStressStrainData('matrix', volumeFraction / 100, selectedFiber, selectedMatrix)
    : [];

  const compositeStressStrainData = selectedFiber && selectedMatrix
    ? generateStressStrainData('composite', volumeFraction / 100, selectedFiber, selectedMatrix)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading materials...</p>
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
            Theoretical calculations using Rule of Mixtures
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Material Selection and Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Material Selection
              </h2>
              
              <MaterialSelector
                label="Fiber Material"
                materials={fibers}
                selectedId={selectedFiberId}
                onChange={setSelectedFiberId}
              />

              <MaterialSelector
                label="Matrix Material"
                materials={matrices}
                selectedId={selectedMatrixId}
                onChange={setSelectedMatrixId}
              />

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Composition Control
                </h3>
                
                <FractionSlider
                  label="Volume Fraction (Vf)"
                  value={volumeFraction}
                  onChange={handleVolumeFractionChange}
                />

                <FractionSlider
                  label="Weight Fraction (Wf)"
                  value={weightFraction}
                  onChange={handleWeightFractionChange}
                />
              </div>

              {/* Material Properties Display */}
              {selectedFiber && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    {selectedFiber.name}
                  </h4>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p>Density: {selectedFiber.density} g/cm³</p>
                    <p>E-Modulus: {selectedFiber.elastic_modulus} GPa</p>
                    <p>Tensile Strength: {selectedFiber.tensile_strength} MPa</p>
                  </div>
                </div>
              )}

              {selectedMatrix && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-orange-900 mb-2">
                    {selectedMatrix.name}
                  </h4>
                  <div className="text-xs text-orange-800 space-y-1">
                    <p>Density: {selectedMatrix.density} g/cm³</p>
                    <p>E-Modulus: {selectedMatrix.elastic_modulus} GPa</p>
                    <p>Tensile Strength: {selectedMatrix.tensile_strength} MPa</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results and Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Composite Properties Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PropertyCard
                title="Composite Density"
                value={compositeDensity}
                unit="g/cm³"
                description="ρc = ρf·Vf + ρm·Vm"
              />
              <PropertyCard
                title="Longitudinal Modulus"
                value={longitudinalModulus}
                unit="GPa"
                description="Ec = Ef·Vf + Em·Vm"
              />
              <PropertyCard
                title="Transverse Modulus"
                value={transverseModulus}
                unit="GPa"
                description="1/Ec = Vf/Ef + Vm/Em"
              />
            </div>

            {/* Property vs Fraction Chart */}
            <PropertyVsFractionChart data={propertyVsFractionData} />

            {/* Stress-Strain Chart */}
            <StressStrainChart
              fiberData={fiberStressStrainData}
              matrixData={matrixStressStrainData}
              compositeData={compositeStressStrainData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

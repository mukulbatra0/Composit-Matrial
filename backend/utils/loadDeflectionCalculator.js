/**
 * Load-Deflection Curve Calculator for Composite Materials
 * Based on three-point bending test mechanics
 */

/**
 * Calculate flexural strength
 * σ = (3 * P * L) / (2 * b * h²)
 * where P = load, L = span, b = width, h = thickness
 */
function calculateFlexuralStrength(load, span, width, thickness) {
  return (3 * load * span) / (2 * width * Math.pow(thickness, 2));
}

/**
 * Calculate flexural modulus
 * E = (L³ * m) / (4 * b * h³)
 * where m = slope of load-deflection curve in linear region
 */
function calculateFlexuralModulus(span, width, thickness, slope) {
  return (Math.pow(span, 3) * slope) / (4 * width * Math.pow(thickness, 3));
}

/**
 * Generate load-deflection curve data points
 * Includes linear region and nonlinear region
 */
function generateLoadDeflectionCurve(params) {
  const {
    maxLoad,
    maxDeflection,
    linearRegionEnd = maxDeflection * 0.6, // Linear up to 60% of max deflection
    points = 100
  } = params;

  const data = [];
  
  for (let i = 0; i <= points; i++) {
    const deflection = (maxDeflection * i) / points;
    let load;

    if (deflection <= linearRegionEnd) {
      // Linear region: Load proportional to deflection
      load = (maxLoad * 0.85) * (deflection / linearRegionEnd);
    } else {
      // Nonlinear region: Progressive damage and fiber failure
      const normalizedDeflection = (deflection - linearRegionEnd) / (maxDeflection - linearRegionEnd);
      const nonlinearFactor = 1 - Math.pow(normalizedDeflection, 2) * 0.15;
      load = (maxLoad * 0.85) + (maxLoad * 0.15) * normalizedDeflection * nonlinearFactor;
    }

    data.push({
      deflection: parseFloat(deflection.toFixed(3)),
      load: parseFloat(load.toFixed(2))
    });
  }

  return data;
}

/**
 * Calculate load-deflection properties based on fiber volume fraction
 * Higher FVF = higher stiffness and strength
 */
function calculatePropertiesFromFVF(fiberType, matrixType, fvf, dimensions) {
  const { thickness = 3, width = 25, span = 50 } = dimensions;

  // Base properties (matrix-dominated at 0% FVF)
  let baseMaxLoad = 50; // N
  let baseMaxDeflection = 8; // mm
  let baseLinearEnd = 4; // mm

  // Fiber reinforcement factors
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
  
  // Calculate properties based on FVF
  const fvfDecimal = fvf / 100;
  const maxLoad = baseMaxLoad + (factor.loadFactor * fvfDecimal * 100);
  const maxDeflection = baseMaxDeflection * (1 - fvfDecimal * 0.4); // Higher FVF = less deflection
  const linearRegionEnd = maxDeflection * (0.5 + fvfDecimal * 0.2); // More linear with higher FVF

  // Calculate flexural properties
  const slope = (maxLoad * 0.85) / linearRegionEnd; // Slope in linear region
  const flexuralStrength = calculateFlexuralStrength(maxLoad, span, width, thickness);
  const flexuralModulus = calculateFlexuralModulus(span, width, thickness, slope) / 1000; // Convert to GPa

  return {
    maxLoad: parseFloat(maxLoad.toFixed(2)),
    maxDeflection: parseFloat(maxDeflection.toFixed(2)),
    linearRegionEnd: parseFloat(linearRegionEnd.toFixed(2)),
    flexuralStrength: parseFloat(flexuralStrength.toFixed(2)),
    flexuralModulus: parseFloat(flexuralModulus.toFixed(2)),
    thickness,
    width,
    span
  };
}

module.exports = {
  calculateFlexuralStrength,
  calculateFlexuralModulus,
  generateLoadDeflectionCurve,
  calculatePropertiesFromFVF
};

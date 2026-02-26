/**
 * Composite Material Mechanics Calculations
 */

/**
 * Convert volume fraction to weight fraction
 * Wf = (ρf * Vf) / (ρf * Vf + ρm * Vm)
 */
export const volumeToWeightFraction = (volumeFraction, fiberDensity, matrixDensity) => {
  const Vf = volumeFraction;
  const Vm = 1 - Vf;
  const numerator = fiberDensity * Vf;
  const denominator = fiberDensity * Vf + matrixDensity * Vm;
  return denominator !== 0 ? numerator / denominator : 0;
};

/**
 * Convert weight fraction to volume fraction
 * Vf = (Wf / ρf) / (Wf / ρf + Wm / ρm)
 */
export const weightToVolumeFraction = (weightFraction, fiberDensity, matrixDensity) => {
  const Wf = weightFraction;
  const Wm = 1 - Wf;
  const numerator = Wf / fiberDensity;
  const denominator = Wf / fiberDensity + Wm / matrixDensity;
  return denominator !== 0 ? numerator / denominator : 0;
};

/**
 * Calculate composite density
 * ρc = ρf * Vf + ρm * Vm
 */
export const calculateCompositeDensity = (volumeFraction, fiberDensity, matrixDensity) => {
  const Vf = volumeFraction;
  const Vm = 1 - Vf;
  return fiberDensity * Vf + matrixDensity * Vm;
};

/**
 * Calculate Longitudinal Modulus (Rule of Mixtures - Iso-strain)
 * Ec = Ef * Vf + Em * Vm
 */
export const calculateLongitudinalModulus = (volumeFraction, fiberModulus, matrixModulus) => {
  const Vf = volumeFraction;
  const Vm = 1 - Vf;
  return fiberModulus * Vf + matrixModulus * Vm;
};

/**
 * Calculate Transverse Modulus (Inverse Rule of Mixtures - Iso-stress)
 * 1/Ec = Vf/Ef + Vm/Em
 */
export const calculateTransverseModulus = (volumeFraction, fiberModulus, matrixModulus) => {
  const Vf = volumeFraction;
  const Vm = 1 - Vf;
  
  if (fiberModulus === 0 || matrixModulus === 0) return 0;
  
  const inverseEc = Vf / fiberModulus + Vm / matrixModulus;
  return inverseEc !== 0 ? 1 / inverseEc : 0;
};

/**
 * Calculate composite tensile strength (longitudinal)
 */
export const calculateCompositeTensileStrength = (volumeFraction, fiberStrength, matrixStrength) => {
  const Vf = volumeFraction;
  const Vm = 1 - Vf;
  return fiberStrength * Vf + matrixStrength * Vm;
};

/**
 * Generate data for Property vs Fraction chart
 */
export const generatePropertyVsFractionData = (fiberModulus, matrixModulus) => {
  const data = [];
  for (let vf = 0; vf <= 1; vf += 0.05) {
    data.push({
      volumeFraction: vf * 100,
      longitudinal: calculateLongitudinalModulus(vf, fiberModulus, matrixModulus),
      transverse: calculateTransverseModulus(vf, fiberModulus, matrixModulus)
    });
  }
  return data;
};

/**
 * Generate stress-strain curve data
 */
export const generateStressStrainData = (
  material,
  volumeFraction,
  fiber,
  matrix
) => {
  const points = 50;
  const data = [];

  if (material === 'fiber') {
    const maxStrain = fiber.max_strain_to_failure / 100;
    for (let i = 0; i <= points; i++) {
      const strain = (maxStrain * i) / points;
      const stress = fiber.elastic_modulus * strain * 1000; // Convert GPa to MPa
      data.push({ strain: strain * 100, stress: Math.min(stress, fiber.tensile_strength) });
    }
  } else if (material === 'matrix') {
    const maxStrain = matrix.max_strain_to_failure / 100;
    for (let i = 0; i <= points; i++) {
      const strain = (maxStrain * i) / points;
      const stress = matrix.elastic_modulus * strain * 1000;
      data.push({ strain: strain * 100, stress: Math.min(stress, matrix.tensile_strength) });
    }
  } else if (material === 'composite') {
    const Vf = volumeFraction;
    const compositeModulus = calculateLongitudinalModulus(Vf, fiber.elastic_modulus, matrix.elastic_modulus);
    const compositeStrength = calculateCompositeTensileStrength(Vf, fiber.tensile_strength, matrix.tensile_strength);
    const compositeMaxStrain = (fiber.max_strain_to_failure * Vf + matrix.max_strain_to_failure * (1 - Vf)) / 100;
    
    for (let i = 0; i <= points; i++) {
      const strain = (compositeMaxStrain * i) / points;
      const stress = compositeModulus * strain * 1000;
      data.push({ strain: strain * 100, stress: Math.min(stress, compositeStrength) });
    }
  }

  return data;
};

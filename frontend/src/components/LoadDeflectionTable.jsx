import React from 'react';

const LoadDeflectionTable = ({ summaryData }) => {
  if (!summaryData || !summaryData.summary || summaryData.summary.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Flexural Properties Summary
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {summaryData.fiber_type} + {summaryData.matrix_type} | Specimen: {summaryData.specimen_dimensions.width}×{summaryData.specimen_dimensions.thickness} mm, Span: {summaryData.specimen_dimensions.span} mm
      </p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                FVF (%)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Load (N)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Deflection (mm)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flexural Strength (MPa)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flexural Modulus (GPa)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Linear Region End (mm)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaryData.summary.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {row.fiber_volume_fraction}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.max_load}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.max_deflection}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.flexural_strength}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.flexural_modulus}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {row.linear_region_end}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> The curves show linearity up to the linear region end, followed by a nonlinear portion due to progressive damage, fiber-matrix debonding, and uneven distribution of reinforcement in the through-thickness direction.
        </p>
      </div>
    </div>
  );
};

export default LoadDeflectionTable;

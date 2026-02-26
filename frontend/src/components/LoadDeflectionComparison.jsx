import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const LoadDeflectionComparison = ({ comparisonData }) => {
  if (!comparisonData || comparisonData.comparisons.length === 0) {
    return null;
  }

  // Combine all curve data with FVF labels
  const combinedData = [];
  const maxPoints = Math.max(...comparisonData.comparisons.map(c => c.curve_data.length));

  for (let i = 0; i < maxPoints; i++) {
    const point = { deflection: null };
    
    comparisonData.comparisons.forEach(comparison => {
      if (i < comparison.curve_data.length) {
        point.deflection = comparison.curve_data[i].deflection;
        point[`fvf_${comparison.fvf}`] = comparison.curve_data[i].load;
      }
    });
    
    if (point.deflection !== null) {
      combinedData.push(point);
    }
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Load-Deflection Curves Comparison
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {comparisonData.fiber_type} + {comparisonData.matrix_type} at different Fiber Volume Fractions
      </p>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="deflection"
            label={{ value: 'Deflection (mm)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: 'Load (N)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => value ? value.toFixed(2) + ' N' : 'N/A'}
            labelFormatter={(label) => `Deflection: ${label} mm`}
          />
          <Legend />
          
          {comparisonData.comparisons.map((comparison, idx) => (
            <Line
              key={comparison.fvf}
              type="monotone"
              dataKey={`fvf_${comparison.fvf}`}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              name={`FVF ${comparison.fvf}%`}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadDeflectionComparison;

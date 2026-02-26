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

const PropertyVsFractionChart = ({ data }) => {
  // Check if data has theoretical or experimental format
  const hasLongitudinal = data.length > 0 && 'longitudinal' in data[0];
  const hasTensileStrength = data.length > 0 && 'tensileStrength' in data[0];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {hasLongitudinal ? 'Elastic Modulus vs Fiber Volume Fraction' : 'Properties vs Fiber Content'}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="volumeFraction"
            label={{ value: 'Fiber Content (%)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: hasLongitudinal ? 'Elastic Modulus (GPa)' : 'Value', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => value ? value.toFixed(2) : 'N/A'}
            labelFormatter={(label) => `Fiber: ${label}%`}
          />
          <Legend />
          
          {hasLongitudinal && (
            <>
              <Line
                type="monotone"
                dataKey="longitudinal"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Longitudinal (Iso-strain)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="transverse"
                stroke="#ef4444"
                strokeWidth={2}
                name="Transverse (Iso-stress)"
                dot={false}
              />
            </>
          )}
          
          {hasTensileStrength && (
            <>
              <Line
                type="monotone"
                dataKey="tensileStrength"
                stroke="#10b981"
                strokeWidth={2}
                name="Tensile Strength (MPa)"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="youngsModulus"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Young's Modulus (GPa)"
                dot={{ r: 4 }}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PropertyVsFractionChart;

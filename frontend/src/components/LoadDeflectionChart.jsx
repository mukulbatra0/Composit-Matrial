import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const LoadDeflectionChart = ({ data, showLinearRegion = true }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <p className="text-gray-500">No load-deflection data available</p>
      </div>
    );
  }

  // Find the linear region end point if available
  const linearEndDeflection = data.properties?.linearRegionEnd;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Load-Deflection Curve
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Three-point bending test: {data.fiber_type} + {data.matrix_type} (FVF: {data.fiber_volume_fraction}%)
      </p>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data.curve_data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="deflection"
            label={{ value: 'Deflection (mm)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: 'Load (N)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === 'load') return [value.toFixed(2) + ' N', 'Load'];
              return [value, name];
            }}
            labelFormatter={(label) => `Deflection: ${label} mm`}
          />
          <Legend />
          
          {showLinearRegion && linearEndDeflection && (
            <ReferenceLine
              x={linearEndDeflection}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: 'Linear Region End', position: 'top', fill: '#ef4444', fontSize: 12 }}
            />
          )}
          
          <Line
            type="monotone"
            dataKey="load"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Flexural Load"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {data.properties && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-xs text-blue-600 font-medium">Max Load</p>
            <p className="text-lg font-bold text-blue-900">{data.properties.maxLoad} N</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-xs text-green-600 font-medium">Max Deflection</p>
            <p className="text-lg font-bold text-green-900">{data.properties.maxDeflection} mm</p>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <p className="text-xs text-purple-600 font-medium">Flexural Strength</p>
            <p className="text-lg font-bold text-purple-900">{data.properties.flexuralStrength} MPa</p>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <p className="text-xs text-orange-600 font-medium">Flexural Modulus</p>
            <p className="text-lg font-bold text-orange-900">{data.properties.flexuralModulus} GPa</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadDeflectionChart;

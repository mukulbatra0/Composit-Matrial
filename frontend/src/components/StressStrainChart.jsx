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

const StressStrainChart = ({ fiberData, matrixData, compositeData }) => {
  // Handle both theoretical (3 datasets) and experimental (1 dataset) modes
  const isExperimental = !fiberData && !matrixData && compositeData;
  
  if (isExperimental) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Stress-Strain Behavior (Estimated)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={compositeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="strain"
              label={{ value: 'Strain (%)', position: 'insideBottom', offset: -5 }}
              tickFormatter={(value) => value?.toFixed(1)}
            />
            <YAxis
              label={{ value: 'Stress (MPa)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value) => (value ? value.toFixed(2) + ' MPa' : 'N/A')}
              labelFormatter={(label) => `Strain: ${label?.toFixed(2)}%`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Composite"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  // Theoretical mode with 3 datasets
  const maxLength = Math.max(
    fiberData?.length || 0,
    matrixData?.length || 0,
    compositeData?.length || 0
  );

  const combinedData = [];
  for (let i = 0; i < maxLength; i++) {
    combinedData.push({
      strain: i,
      fiber: fiberData?.[i]?.stress,
      matrix: matrixData?.[i]?.stress,
      composite: compositeData?.[i]?.stress,
      strainValue: fiberData?.[i]?.strain || matrixData?.[i]?.strain || compositeData?.[i]?.strain
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Stress-Strain Behavior Comparison
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="strainValue"
            label={{ value: 'Strain (%)', position: 'insideBottom', offset: -5 }}
            tickFormatter={(value) => value?.toFixed(1)}
          />
          <YAxis
            label={{ value: 'Stress (MPa)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) => (value ? value.toFixed(2) + ' MPa' : 'N/A')}
            labelFormatter={(label) => `Strain: ${label?.toFixed(2)}%`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="fiber"
            stroke="#10b981"
            strokeWidth={2}
            name="Pure Fiber"
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="matrix"
            stroke="#f59e0b"
            strokeWidth={2}
            name="Pure Matrix"
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="composite"
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Composite"
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StressStrainChart;

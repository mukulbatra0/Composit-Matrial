import React from 'react';

const PropertyCard = ({ title, value, unit, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </p>
        <span className="ml-2 text-lg text-gray-600">{unit}</span>
      </div>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default PropertyCard;

import React from 'react';

const DataCardMonitoring = ({ value, description, warningIcon }) => {
  const hasValidValue = value && value !== "No data available";

  return (
    <div className="w-full bg-white rounded-md shadow-md flex flex-col justify-center items-center text-center p-4">
      <p className="text-[56px] font-bold">{value}</p>
      {/* Only display description and warningIcon if value is valid */}
      {hasValidValue && description && (
        <div className="flex items-center mt-2">
          <p className="text-[24px]">{description}</p>
          {warningIcon && (
            <img src={warningIcon} alt="Warning Icon" className="w-10 h-10 ml-2" />
          )}
        </div>
      )}
    </div>
  );
};

export default DataCardMonitoring;

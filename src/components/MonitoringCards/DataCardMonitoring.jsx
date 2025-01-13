import React from 'react';

const DataCardMonitoring = ({ value, description, warningIcon }) => {
  return (
    <div className="h-56 w-80 bg-blue rounded-md shadow-md flex flex-col justify-center items-center text-center p-4">
      <p className="text-[32px] font-bold">{value}</p>
      {description && <p className="text-[18px] mt-2">{description}</p>}
      {warningIcon && (
        <img src={warningIcon} alt="Warning Icon" className="w-10 h-10 mt-4" />
      )}
    </div>
  );
};

export default DataCardMonitoring;

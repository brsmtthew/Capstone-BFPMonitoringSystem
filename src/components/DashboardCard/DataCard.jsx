import React from 'react';

const DataCard = ({ children, className }) => {
  return (
    <div className={`border-2 border-white rounded-xl h-44 w-96 p-4 bg-white flex flex-col shadow-2xl items-center justify-center text-center ${className}`}>
      {children}
    </div>
  );
};

export default DataCard;

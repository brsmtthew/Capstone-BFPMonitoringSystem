import React from 'react';

const OverviewCard = ({ title, description, children, className }) => {
  return (
    <div className={`bg-white relative flex flex-col rounded-lg shadow h-72 w-112 ${className}`}>
      <div className="p-4 bg-bfpNavy rounded-lg text-white">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
      <div className="relative grow flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default OverviewCard;

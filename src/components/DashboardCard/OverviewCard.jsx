import React from 'react';

const OverviewCard = ({ title, description, children, className }) => {
  return (
    <div className={`bg-white relative flex flex-col rounded-lg shadow h-44 sm:h-48 md:h-56 lg:h-64 xl:h-64 2xl:h-64 w-112 ${className}`}>
      <div className="p-4 bg-bfpNavy rounded-lg text-white">
        <h3 className="text-[12px] sm:text-[14px] md:text-[14px] lg:text-[16px] xl:text-[16px] 2xl:text-[18px] font-montserrat font-bold">{title}</h3>
        <p className="text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] xl:text-[12px] 2xl:text-[14px]">{description}</p>
      </div>
      <div className="relative grow flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default OverviewCard;

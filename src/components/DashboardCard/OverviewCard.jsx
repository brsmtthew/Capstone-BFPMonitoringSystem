import React from 'react';

const OverviewCard = ({ title, description, children, className }) => {
  return (
    <div className={`bg-white relative flex flex-col rounded-lg shadow h-auto w-112 ${className}`}>
      <div className="p-4 bg-bfpNavy rounded-lg text-white">
        <h3 className="text-[10px] sm:text-[16px] md:text-[17px] lg:text-[18px] xl:text-[19px] 2xl:text-[20px] font-medium">{title}</h3>
        <p className="text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] xl:text-[13px] 2xl:text-[14px]">{description}</p>
      </div>
      <div className="relative grow flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default OverviewCard;

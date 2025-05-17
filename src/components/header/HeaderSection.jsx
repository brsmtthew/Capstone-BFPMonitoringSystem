import React from 'react';

function HeaderSection({ title, className, extraContent }) {
  return (
    <div className={`flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40 ${className}`}>
      <div className="flex items-center">
        <div className="h-9 w-2 rounded-full bg-bfpOrange mr-2"></div>
        <p className="sm:text-[18px] md:text-[24px] lg:text-[24px] font-bold font-montserrat">{title}</p>
      </div>
      {extraContent && <div className="ml-4 flex items-center">{extraContent}</div>}
    </div>
  );
}

export default HeaderSection;

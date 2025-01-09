import React from 'react';

function HeaderSection({ title, className, extraContent }) {
  return (
    <div className={`flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40 ${className}`}>
      <div className="flex items-center">
        <div className="h-10 w-2 rounded-full bg-bfpOrange mr-2"></div>
        <p className="text-[26px] font-bold">{title}</p>
      </div>
      {extraContent && <div className="ml-4 flex items-center">{extraContent}</div>}
    </div>
  );
}

export default HeaderSection;

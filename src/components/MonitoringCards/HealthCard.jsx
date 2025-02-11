import React from 'react';

const HealthCard = ({ icon, title, value, description, warningIcon, children }) => {
  const hasValidValue = value && typeof value === 'string';

  return (
    <div className="h-auto w-full bg-white rounded-lg shadow-md">
      <div className="bg-bfpNavy p-4 rounded-md flex items-center justify-between text-white">
        <div className="flex items-center">
          <img src={icon} alt={title} className="w-8 h-8 mr-2" draggable="false" />
          <p className="font-bold sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[24px]">{title}</p>
        </div>
        <button 
          className={`md:px-1 lg:px-2 xl:px-3 2xl:px-4 py-1 rounded-2xl sm:text-[12px] md:text-[14px] lg:[16px] xl:text-[16px] 2xl:text-[18px] ${
            hasValidValue ? 'bg-btnActive text-btnFontActive' : 'bg-gray text-lightGray'
          }`}
        >
          {hasValidValue ? 'Active' : 'Inactive'}
        </button>
      </div>
      <div className="mt-4 flex flex-col justify-center items-center text-center p-4">
        <p className="sm:text-[24px] md:text-[30px] lg:text-[38px] xl:text-[40px] 2xl:text-[56px] font-bold">{value}</p>
        {hasValidValue && description && (
          <div className="flex items-center mt-2">
            <p className="sm:[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[24px]">{description}</p>
            {warningIcon && (
              <img src={warningIcon} alt="Warning Icon" className="w-10 h-10 ml-2" draggable="false" />
            )}
          </div>
        )}
      </div>
      <div className="mt-0">{children}</div>
    </div>
  );
};

export default HealthCard;
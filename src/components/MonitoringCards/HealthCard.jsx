import React from 'react';

const HealthCard = ({ icon, title, value, description, warningIcon, children }) => {
  const hasValidValue = value && typeof value === 'string';

  return (
    <div className="h-auto w-full bg-white rounded-lg shadow-md">
      <div className="bg-bfpNavy p-4 rounded-md flex items-center justify-between text-white">
        <div className="flex items-center">
          <img src={icon} alt={title} className="w-8 h-8 mr-2" draggable="false" />
          <p className="font-bold text-[8px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[24px]">{title}</p>
        </div>
        <button className="flex items-center justify-center rounded-2xl">
          {/* Small screens: show only a colored circle */}
          <span
            className={`md:hidden inline-block w-4 h-4 rounded-full ${
              hasValidValue ? 'bg-green' : 'bg-gray'
            }`}
          ></span>

          {/* Medium screens and above: show full text button */}
          <span
            className={`hidden md:inline px-2 py-1 rounded-2xl ${
              hasValidValue ? 'bg-btnActive text-btnFontActive' : 'bg-gray text-lightGray'
            }`}
          >
            {hasValidValue ? 'Active' : 'Inactive'}
          </span>
        </button>
      </div>
      <div className="mt-4 flex flex-col justify-center items-center text-center p-4">
        <p className="sm:text-[24px] md:text-[30px] lg:text-[38px] xl:text-[40px] 2xl:text-[56px] font-bold">{value}</p>
        {hasValidValue && description && (
          <div className="flex items-center mt-2">
            <p className="text-[8px] sm:[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[24px]">{description}</p>
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
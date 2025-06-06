import React from 'react';

const HealthCard = ({ icon, title, value, description, warningIcon, children }) => {
  const hasValidValue = value && typeof value === 'string';

  return (
    <div className="h-auto w-full bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ease-in-out">
      <div className="bg-bfpNavy p-2 rounded-t-md flex items-center justify-between text-white">
        <div className="flex items-center">
          <img src={icon} alt={title} className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-6 2xl:h-6 mr-2" draggable="false" />
          <p className="font-bold hidden sm:block text-[8px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[24px]">{title}</p>
        </div>
        <button className="flex items-center justify-center rounded-2xl">
          {/* Small screens: show only a colored circle */}
          <span
            className={`md:hidden inline-block w-3 h-3 rounded-full ${
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
      <div className="mt-4 flex flex-col justify-center items-center text-center p-1 sm:p-2 md:p-2 lg:p-3 xl:p-2 2xl:p-2">
        <p className="text-[16px] sm:text-[24px] md:text-[30px] lg:text-[36px] xl:text-[38px] 2xl:text-[48px] font-bold">{value}</p>
        {hasValidValue && description && (
          <div className="flex items-center mt-2">
            <p className="text-[8px] sm:[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[18px]">{description}</p>
            {warningIcon && (
              <>
                <img src={warningIcon} alt="Warning Icon" className="w-4 h-4 sm:hidden" draggable="false"/>
                <img src={warningIcon} alt="Warning Icon" className="hidden sm:block sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-10 2xl:h-10" draggable="false"/>
              </>
            )}
          </div>
        )}
      </div>
      <div className="mt-0">{children}</div>
    </div>
  );
};

export default HealthCard;
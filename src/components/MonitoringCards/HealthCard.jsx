import React from 'react';
import Button from '../button/Button';

const HealthCard = ({ icon, title, value, description, warningIcon, children }) => {
  const hasValidValue = value && value !== "Waiting for data";

  return (
    <div className="h-auto w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg shadow-md">
      <div className="bg-bfpNavy p-4 rounded-md flex items-center justify-between text-white">
        <div className="flex items-center">
          <img src={icon} alt={title} className="w-8 h-8 mr-2" />
          <p className="font-bold text-[20px]">{title}</p>
        </div>
        <button 
          className={`px-4 py-1 rounded-2xl text-[18px] ${
            hasValidValue ? 'bg-btnActive text-btnFontActive' : 'bg-gray text-lightGray'
          }`}
        >
          {hasValidValue ? 'Active' : 'Inactive'}
        </button>
      </div>
      <div className="mt-4 flex flex-col justify-center items-center text-center p-4">
        <p className="text-[56px] font-bold">{value}</p>
        {hasValidValue && description && (
          <div className="flex items-center mt-2">
            <p className="text-[24px]">{description}</p>
            {warningIcon && (
              <img src={warningIcon} alt="Warning Icon" className="w-10 h-10 ml-2" />
            )}
          </div>
        )}
      </div>
      <div className="mt-0">{children}</div>
    </div>
  );
};

export default HealthCard;
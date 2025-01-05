import React from 'react';

const MonitoringCard = ({ icon, title, value, description, warningIcon }) => {
  // Determine if the status should be 'Active' or 'Inactive' based on whether a value is present
  const isActive = value !== null && value !== 'Loading...' && value !== 'No data available';

  // Conditionally render the description based on "Loading..." or "No data available"
  const renderDescription = () => {
    if (value === 'Loading...' || value === 'No data available') {
      return null;
    }
    return description;  // Otherwise return the description
  };

  return (
    <div className="rounded-2xl shadow bg-bfpNavy mx-4 flex flex-col items-center justify-center h-72 w-auto">
      <div className="p-4 rounded-lg text-white flex flex-col items-center justify-center w-full h-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            {/* Always render the first icon */}
            <img src={icon} alt={title} className="w-10 h-10" />
            <span className="font-semibold text-[18px]">{title}</span>
          </div>
          <div className="flex space-x-2 items-center">
            {/* Conditionally render "Active" or "Inactive" */}
            <button className={`px-4 py-1 rounded-2xl text-[18px] ${isActive ? 'bg-btnActive text-btnFontActive' : 'bg-gray text-lightGray'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>

        <div className="my-4 h-[1px] bg-separatorLine w-full" />

        <div className="flex flex-col justify-center items-center h-full text-center">
          <p className="text-[42px] font-bold">{value}</p>
          <div className="flex items-center justify-center text-[24px] text-yellow mt-2">
            {/* Conditionally render description */}
            {renderDescription() && <p className="mr-2">{renderDescription()}</p>}
            {/* Conditionally render the warning icon */}
            {value !== 'Loading...' && value !== 'No data available' && warningIcon && (
              <img src={warningIcon} alt="Status Icon" className="w-10 h-10" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringCard;

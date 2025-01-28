import React from 'react';
import Button from '../button/Button';

const EnviCard = ({ icon, title, value, children }) => {
  return (
    <div className="h-auto w-full bg-white rounded-lg shadow-md">
      <div className="bg-bfpNavy p-4 rounded-md flex items-center justify-between text-white">
        <div className="flex items-center">
          <img src={icon} alt={title} className="w-8 h-8 mr-2" />
          <p className="font-bold text-[20px]">{title}</p>
        </div>
        <Button value={value} /> {/* Button to indicate active/inactive state */}
      </div>
      <div className="mt-0">{children}</div>
    </div>
  );
};

export default EnviCard;
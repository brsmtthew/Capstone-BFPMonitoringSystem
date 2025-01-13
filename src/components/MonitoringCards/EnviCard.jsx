import React from 'react';

const EnviCard = ({ icon, title, children }) => {
  return (
    <div className="h-72 w-96 bg-white rounded-lg shadow-md p-4">
      <div className="bg-bfpNavy p-4 rounded-md flex items-center text-white">
        <img src={icon} alt={title} className="w-8 h-8 mr-2" />
        <p className="font-bold text-[20px]">{title}</p>
      </div>
      <div className="mt-0">{children}</div>
    </div>
  );
};

export default EnviCard;

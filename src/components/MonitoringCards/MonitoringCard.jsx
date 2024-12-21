// MonitoringCard.js
import React from 'react';

const MonitoringCard = ({ icon, title, value, description, warningIcon }) => (
  <div className="rounded-2xl shadow bg-bfpNavy mx-4 flex flex-col items-center justify-start h-72 w-auto">
    <div className="p-4 rounded-lg text-white flex flex-col items-center w-full">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <img src={icon} alt={title} className="w-10 h-10" />
          <span className="font-semibold text-[18px]">{title}</span>
        </div>
        <div className="flex space-x-2 items-center">
          <button className="bg-btnActive text-btnFontActive px-4 py-1 rounded-2xl text-[18px]">Active</button>
          <img src={warningIcon} alt="Question Mark" className="w-8 h-8" />
        </div>
      </div>

      <div className="my-4 h-[1px] bg-separatorLine w-full" />

      <div className="text-center">
        <p className="text-[42px] font-bold">{value}</p>
        <div className="flex items-center justify-center text-[24px] text-yellow">
          <p className="mr-2">{description}</p>
          <img src={warningIcon} alt="Status Icon" className="w-10 h-10" />
        </div>
      </div>
    </div>
  </div>
);

export default MonitoringCard;

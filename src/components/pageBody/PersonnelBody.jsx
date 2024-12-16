import React from 'react';

function PersonnelBody() {
  // Example personnel data
  const personnel = [
    { name: 'John Doe', role: 'Firefighter' },
    { name: 'Jane Smith', role: 'Paramedic' },
    { name: 'Mike Johnson', role: 'Safety Officer' },
  ];

  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40">
        {/* Left Column */}
        <div className="flex items-center">
          <div className="h-10 w-2 rounded-full bg-separator mr-2"></div>
          <p className="text-[26px] font-bold">PERSONNEL LIST</p>            
        </div>
      </div>
      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Grid for Personnel Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 mx-40">
        {personnel.map((member) => (
          <div key={member.name} className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-lg text-gray-700">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonnelBody;

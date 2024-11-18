import React from 'react';

function PersonnelBody() {
  // Example personnel data
  const personnel = [
    { name: 'John Doe', role: 'Firefighter' },
    { name: 'Jane Smith', role: 'Paramedic' },
    { name: 'Mike Johnson', role: 'Safety Officer' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-semibold mb-6">Personnel List</h2>
      <ul className="space-y-4">
        {personnel.map((member) => (
          <li key={member.name} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-lg text-gray-700">{member.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PersonnelBody;

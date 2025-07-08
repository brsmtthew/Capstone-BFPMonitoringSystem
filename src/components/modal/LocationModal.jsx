import React, { useState } from 'react';
import logo from '../login/LoginAssets/smarthardhatAsset 1.svg';

function LocationModal({ onClose, onSelectLocation }) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const barangayList = [
    'Apokon',
    'Bincungan',
    'Busaon',
    'Canocotan',
    'Cuambogan',
    'La Filipina',
    'Liboganon',
    'Madaum',
    'Magdum',
    'Magugpo Central',
    'Magugpo East',
    'Magugpo North',
    'Magugpo South',
    'Magugpo West',
    'Mankilam',
    'New Balamban',
    'Nueva Fuerza',
    'Pagsabangan',
    'Pandapan',
    'San Agustin',
    'San Isidro',
    'San Miguel',
    'Visayan Village'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLocation) return;

    setIsLoading(true);
    // Return selected location back to parent
    onSelectLocation(selectedLocation);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-start pt-28 justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md">
        <div className="p-8 relative">
          {/* Logo */}
          <div className="absolute top-4 left-4 flex items-center">
            <img src={logo} alt="logo" className="h-10 w-10 mr-2" />
            <p className="font-semibold text-lg">
              <span className="text-bfpOrange font-bold">BFP</span>
              <span className="text-bfpNavy">SmartTrack</span>
            </p>
          </div>

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-red text-2xl font-bold hover:text-bfpNavy">
            ✕
          </button>

          {/* Modal Header */}
          <div className="mt-12">
            <h2 className="text-2xl text-center text-bfpNavy font-bold mb-4">Incident Location</h2>
            <p className="text-center text-sm text-bfpNavy mb-6">Select the barangay where the firefighter is responding.</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray">
                  Responding Barangay
                </label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  required
                >
                  <option value="" disabled>Select your barangay</option>
                  {barangayList.map((barangay, index) => (
                    <option key={index} value={barangay}>{barangay}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue text-white font-semibold rounded-md hover:bg-hoverBtn transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Select Location'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;

import React, { useState } from 'react';

function AddPersonnelModal({ isOpen, closeModal }) {
  const [personnelInfo, setPersonnelInfo] = useState({
    name: '',
    position: '',
    age: '',
    birthdate: '',
    phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonnelInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can process the data here (e.g., send it to a server or save it locally)
    console.log('Personnel Info Submitted:', personnelInfo);
    closeModal(); // Close modal after submission
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${!isOpen && 'hidden'}`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <button onClick={closeModal} className="absolute top-2 right-2 text-black">
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Add Personnel Information</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={personnelInfo.name}
              onChange={handleInputChange}
              className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={personnelInfo.position}
              onChange={handleInputChange}
              className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
              placeholder="Enter position"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={personnelInfo.age}
              onChange={handleInputChange}
              className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Birthdate</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={personnelInfo.birthdate}
              onChange={handleInputChange}
              className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={personnelInfo.phone}
              onChange={handleInputChange}
              className="w-full mt-1 px-2 py-1 border border-gray-300 rounded-md"
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={closeModal}  // Cancel button closes the modal
              className="w-1/2 py-2 bg-cardHolderColor text-white font-semibold rounded-full hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 bg-cardHolderColor text-white font-semibold rounded-full hover:bg-blue-600"
            >
              Save Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPersonnelModal;

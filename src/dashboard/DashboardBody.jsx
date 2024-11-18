import React, { useState } from 'react';
import AddPersonnelModal from '../modal/addPersonnelModal';  // Import the modal
import addBtn from "./dashboardAssets/plus.png";
import bfpPro from "./dashboardAssets/bfpPersonnel.jpg";
import arrow from "./dashboardAssets/right-arrow.png";

function DashboardBody() {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const openModal = () => setIsModalOpen(true); // Function to open the modal
  const closeModal = () => setIsModalOpen(false); // Function to close the modal

  return (
    <div className="p-4 h-screen flex flex-col lg:bg-white">
      
      {/* Header Section */}
      <div className="flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40">
        {/* Left Column */}
        <div className="flex items-center">
          <div className="h-10 w-2 rounded-full bg-separator mr-2"></div> 
          <p className="text-[26px] font-bold">PERSONNEL DETAILS</p>            
        </div>

        {/* Right Column */}
        <div className="ml-4 flex items-center">
          <img
            src={addBtn}
            alt="Add Button"
            className="w-10 h-10 mr-2 cursor-pointer"
            onClick={openModal}  // Open the modal when clicked
          />
          <p className="text-xl font-semibold">Add personnel</p>
        </div>
      </div>

      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      {/* Main container with responsive grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_16rem] gap-4 text-white h-full">
        {/* Column 1 - Profile with centered image, name, age, and helmet status */}
        <div className="bg-gray-100 p-4 rounded-2xl shadow bg-gradient-to-br from-start-gradient to-end-gradient h-full flex flex-col justify-center items-center">
          <img src={bfpPro} alt="Profile" className='h-72 w-72 rounded-full mb-4' />
          <p className='text-[28px] text-white font-montserrat font-bold'>Name</p>
          
          {/* Row for Age and Helmet Status */}
          <div className="flex justify-evenly w-full mt-4 text-[18px] text-white">
            <p>Age</p>
            <p>Helmet Status</p>
          </div>

          <div className="my-4 w-3/4 h-px bg-separator"></div>

          {/* Row for Actual Age and Helmet Status Data */}
          <div className="flex justify-evenly w-full text-[18px] text-white">
            <p>32</p>
            <p>Inactive</p>
          </div>
        </div>

        {/* Column 2 with individual cards */}
        <div className="flex flex-col h-full">
          <div className="flex-grow grid grid-rows-2 gap-4"> {/* Ensure this takes available height */}
            <div className="p-4 rounded-2xl shadow bg-gradient-to-tr from-start-gradient to-end-gradient pt-14 text-white flex flex-col">
              <p className='font-bold text-[28px]'>Name: Acer Nitro</p>

              {/* Row for ID, Date of Birth, and Contact Number Labels */}
              <div className="flex justify-between w-full pt-20 text-[16px] text-white">
                <div className="flex flex-col items-center">
                  <p>ID</p>
                  <p className="text-white">12082342</p>
                </div>

                <div className="h-16 w-1 rounded-full bg-separator mr-2"></div> 

                <div className="flex flex-col items-center">
                  <p>Date of Birth</p>
                  <p className="text-white">September 24, 2024</p>
                </div>

                <div className="h-16 w-1 rounded-full bg-separator mr-2"></div> 

                <div className="flex flex-col items-center">
                  <p>Contact Number</p>
                  <p className="text-white">09123456789</p>
                </div>
              </div>
            </div>

            {/* Analytics Preview Section */}
            <div className="bg-gray-100 p-4 rounded-2xl shadow bg-gradient-to-tl from-start-gradient to-end-gradient">
              <div className="flex justify-between">
                <p className="text-white font-bold text-[28px]">Analytics Preview</p>
                <button className="text-black bg-white px-4 py-2 rounded-lg flex items-center">See All Analytics
                  <img src={arrow} alt="Arrow Icon" className="w-4 h-4 ml-2"/>
                </button>
              </div>
              <p className='mt-4'>Previous Reading</p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-black items-center">
                <div className="bg-white p-4 rounded shadow text-center">
                  <p className="text-blue font-bold text-[24px]">70 BPM</p>
                  <div className="my-4 w-full h-px bg-separator"></div>
                  <p className="text-[14px]">Heart Rate</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                  <p className="text-blue font-bold text-[24px]">37°C</p>
                  <div className="my-4 w-full h-px bg-separator"></div>
                  <p className="text-[14px">Body Temp</p>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                  <p className="text-blue font-bold text-[24px]">60°F</p>
                  <div className="my-4 w-full h-px bg-separator"></div>
                  <p className="text-[14px]">Environment Temp</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 - Fixed width column */}
        <div className="flex flex-col h-full justify-end w-64">
          <div className="flex-grow grid grid-rows-[auto_1fr_1fr] gap-4 justify-self-end">
            <div className="p-4 rounded-lg shadow bg-gradient-to-tl from-start-gradient to-end-gradient h-fit">
              <p className="font-bold text-[26px]">Other Personnel</p>
            </div>

            {/* Row 2 */}
            <div className="bg-gray-100 p-4 rounded-2xl shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col items-center justify-center">
              <img src={bfpPro} alt="Profile Icon" className='w-36 h-36 rounded-full' />
              <button className='bg-white text-black px-8 py-1 rounded-lg mt-4 flex items-center'>See All
                <img src={arrow} alt="Arrow Icon" className="w-4 h-4 ml-2"/>
              </button>
            </div>

            {/* Row 3 */}
            <div className="bg-gray-100 p-4 rounded-2xl shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col items-center justify-center">
              <img src={bfpPro} alt="Profile Icon" className='w-36 h-36 rounded-full' />
              <button className='bg-white text-black px-8 py-1 rounded-lg mt-4 flex items-center'>See All
                <img src={arrow} alt="Arrow Icon" className="w-4 h-4 ml-2"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddPersonnelModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
}

export default DashboardBody;

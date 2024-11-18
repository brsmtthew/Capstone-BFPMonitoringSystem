import React from 'react';
import heartIcon from "./dashboardAssets/heart-attack.png";
import enviTemp from "./dashboardAssets/room-temperature.png"
import toxicSmoke from "./dashboardAssets/mask.png"
import bodytem from "./dashboardAssets/measure.png"
import bfpPro from "./dashboardAssets/bfpPersonnel.jpg";
import toxicIcon from "./dashboardAssets/toxic.png";
import quesmarkIcon from "./dashboardAssets/question-mark.png";
import warningIcon from "./dashboardAssets/warning.png";
import flamesIcon from "./dashboardAssets/flames.png";
import likeIcon from "./dashboardAssets/like.png"


function MonitoringBody() {
  return (
    <div className="p-4 min-h-screen flex flex-col lg:bg-white">

      {/* Header Section */}
      <div className="flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40">
        {/* Left Column */}
        <div className="flex items-center">
          <div className="h-10 w-2 rounded-full bg-separator mr-2"></div> 
          <p className="text-[26px] font-bold">PERSONNEL MONITORING</p>            
        </div>

        {/* Right Column with Dropdown */}
        <div className="ml-4 flex items-center">
          <select className="text-xl text-white bg-primeColor font-semibold border border-gray-300 rounded-lg px-4 py-2">
            <option>Select Personnel</option>
            <option>Personnel 1</option>
            <option>Personnel 2</option>
            {/* Add more personnel options as needed */}
          </select>
        </div>
      </div>

      <div className="my-4 h-[2px] bg-separatorLine w-[80%] mx-auto" />

      <div className="flex justify-between items-center gap-x-40 text-black px-4 sm:px-10 md:px-20 lg:px-40 mb-4">
        <div className="flex items-center">
          <img src={bfpPro} alt="Profile Icon" className='w-24 h-24 rounded-full' /> 
          <p className='ml-4 text-[28px] font-bold'>Acer Nitro</p>
        </div>

        <button className='px-8 py-3 text-[18px] bg-primeColor rounded-2xl text-white'>Save Recordings</button>
      </div>

      {/* Main container with 2 equal columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-white min-h-full pb-2">
        
        {/* Column 1 - Same structure as column 3 in DashboardBody */}
        <div className="flex flex-col h-full justify-end">
          <div className="flex-grow grid grid-rows-[auto_1fr_1fr] gap-4">

            <div className="p-4 rounded-lg shadow bg-primeColor h-fit">
              <p className="font-bold text-[26px] text-center">Health Monitoring Section</p>
            </div>

            {/* Row 2 */}
            <div className="rounded-2xl shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col items-center justify-start h-[250px]">
            <div className="p-4 rounded-lg text-white flex flex-col items-center w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <img src={heartIcon} alt="Heart Rate" className="w-10 h-10" />
                    <span className="font-semibold text-[18px]">Body Temperature</span>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <button className="bg-btnActive text-btnFontActive px-4 py-1 rounded-2xl text-[18px]">Active</button>
                    <img src={quesmarkIcon} alt="Question Mark" className='w-8 h-8' />
                  </div>
                </div>

                {/* Divider Line */}
                <div className="my-4 h-[1px] bg-separatorLine w-full" /> {/* Alternative to <hr /> */}

                {/* Centered Heart Rate and Status */}
                <div className="text-center">
                  <p className="text-[42px] font-bold">120BPM</p>
                  <div className="flex items-center justify-center text-[24px] text-yellow">
                    <p className="mr-2">Elevated Heart Rate</p>
                    <img src={warningIcon} alt="Warning Icon" className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>



            {/* Row 3 */}
            <div className="rounded-2xl shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col items-center justify-start">
              <div className="p-4 bg-gray-900 rounded-lg text-white flex flex-col items-center w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <img src={bodytem} alt="Heart Rate" className="w-10 h-10" />
                    <span className="font-semibold text-[18px]">Body Temperature</span>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <button className="bg-btnActive text-btnFontActive px-4 py-1 rounded-2xl text-[18px]">Active</button>
                    <img src={quesmarkIcon} alt="Question Mark" className='w-8 h-8' />
                  </div>
                </div>

                {/* Divider Line */}
                <div className="my-4 h-[1px] bg-separatorLine w-full" /> {/* Alternative to <hr /> */}

                {/* Centered Heart Rate and Status */}
                <div className="text-center">
                  <p className="text-[42px] font-bold">50°C</p>
                  <div className="flex items-center justify-center text-[24px] text-yellow">
                    <p className="mr-2">Critical Temperature</p>
                    <img src={flamesIcon} alt="Warning Icon" className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Column 2 - Duplicate of Column 1 for a balanced two-column layout */}
        <div className="flex flex-col h-full justify-end">
          <div className="flex-grow grid grid-rows-[auto_1fr_1fr] gap-4">

            <div className="p-4 rounded-lg shadow bg-primeColor h-fit">
              <p className="font-bold text-[26px] text-center">Environment Monitoring Section</p>
            </div>

            
            {/* Row 2 */}
              <div className="rounded-2xl shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col items-center justify-start">
                <div className="p-4 rounded-lg text-white flex flex-col items-center w-full">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <img src={toxicSmoke} alt="Gas and Smoke" className="w-10 h-10" />
                      <span className="font-semibold text-[18px]">Gas and Smoke</span>
                    </div>

                    <div className="flex items-center justify-center">
                      <img src={toxicIcon} alt="Toxic Icon" className="w-10 h-10" />
                      <span className="font-semibold text-[18px]">Toxic Gas</span>
                    </div>

                    <div className="flex space-x-2 items-center">
                      <button className="bg-btnActive text-btnFontActive px-4 py-1 rounded-2xl text-[18px]">Active</button>
                      <img src={quesmarkIcon} alt="Question Mark" className='w-8 h-8' />
                  </div>
                  </div>

                  {/* Divider Line */}
                  <div className="my-4 h-[1px] bg-separatorLine w-full" /> {/* Alternative to <hr /> */}

                  {/* Centered Heart Rate and Status */}
                  
                  <div className="flex justify-between items-center text-center">
                    <div className="flex items-center gap-32"> {/* Space between 5PPM and 0PPM */}
                      <div className="flex flex-col items-center">
                        <p className="text-[42px] font-bold">5PPM</p>
                        <div className="flex items-center justify-center text-[24px] text-yellow">
                          <p className="mr-2">Optimal Range</p>
                          <img src={likeIcon} alt="Like Icon" className='w-10 h-10' />
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-[42px] font-bold">0PPM</p>
                        <div className="flex items-center justify-center text-[24px] text-yellow">
                          <p className="mr-2">Optimal Range</p>
                          <img src={likeIcon} alt="Like Icon" className='w-10 h-10' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            {/* Row 3 */}
            <div className="rounded-2xl shadow bg-gradient-to-tl from-start-gradient to-end-gradient flex flex-col items-center justify-start">
            <div className="p-4 rounded-lg text-white flex flex-col items-center w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <img src={enviTemp} alt="Heart Rate" className="w-10 h-10" />
                    <span className="font-semibold text-[18px]">Environmental Temperature</span>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <button className="bg-btnActive text-btnFontActive px-4 py-1 rounded-2xl text-[18px]">Active</button>
                    <img src={quesmarkIcon} alt="Question Mark" className='w-8 h-8' />
                  </div>
                </div>

                {/* Divider Line */}
                <div className="my-4 h-[1px] bg-separatorLine w-full" /> {/* Alternative to <hr /> */}

                {/* Centered Heart Rate and Status */}
                <div className="text-center">
                  <p className="text-[42px] font-bold">50°C</p>
                  <div className="flex items-center justify-center text-[24px] text-yellow">
                    <p className="mr-2">Critical Temperature</p>
                    <img src={flamesIcon} alt="Warning Icon" className="w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default MonitoringBody;

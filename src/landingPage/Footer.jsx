import React from 'react';
import fblogo from "./landingAssets/facebook (1).png";
import gmaillogo from "./landingAssets/gmail.png";

const Footer = () => {
  return (
    <footer className="lg:bg-backgroundColor py-5 ">
      <div className="flex flex-col md:flex-row justify-between mx-4 md:mx-10 gap-4 text-white">
        
      <div>
        <a
              href="https://www.facebook.com/BFP"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src={fblogo} alt="Facebook" className="h-6 w-6 mr-2" />
              <span className="text-complimentary text-[12px] md:text-[16px]">
              Bureau of Fire Protection
              </span>
            </a>
        </div>
        <div>
        <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src={gmaillogo} alt="Gmail" className="h-6 w-6 mr-2" />
              <span className="text-complimentary text-[12px] md:text-[16px]">
              Bureau of Fire Protection
              </span>
            </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

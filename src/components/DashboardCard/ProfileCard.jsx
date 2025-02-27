import React, { useState, useEffect } from 'react';

const ProfileCard = ({
  name,
  position,
  image,
  onPrevious,
  onNext,
  fetchImageUrl,
}) => {
  const [animationState, setAnimationState] = useState(''); // For fade-in/out animation
  const [isImageLoaded, setIsImageLoaded] = useState(false); // Track image load state

  // Handle previous button click
  const handlePrevious = () => {
    setAnimationState('fade-out');
    setIsImageLoaded(false); // Reset loading state for image
    setTimeout(() => {
      onPrevious(); // Update to the previous profile
      setAnimationState('fade-in');
    }, 300); // Matches the animation duration
  };

  // Handle next button click
  const handleNext = () => {
    setAnimationState('fade-out');
    setIsImageLoaded(false); // Reset loading state for image
    setTimeout(() => {
      onNext(); // Update to the next profile
      setAnimationState('fade-in');
    }, 300); // Matches the animation duration
  };

  // Handle image loading state
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Dynamically resolve image URL
  const resolvedImageUrl = image.startsWith('https') ? image : fetchImageUrl?.(image);

  return (
    <div className="relative lg:row-span-2 flex flex-col bg-gray-100 rounded-lg shadow bg-white ">
      {/* Header */}
      <div className="absolute top-0 left-0 bg-bfpNavy w-full p-4 text-white rounded-t-lg">
        <h4
          className={`text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] font-semibold transition-transform duration-300 ${
            animationState === 'fade-out' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          {name || 'Unknown'}
        </h4>
        <p
          className={`text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] transition-transform duration-300 ${
            animationState === 'fade-out' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          {position || 'Position Unavailable'}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 mt-20 text-black">
        <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[21px]">Swipe to view different personnel profiles.</p>
      </div>

      {/* Image */}
      <div className="relative flex items-center justify-center mt-4">
        <img
          className={`h-36 w-36 sm:h-48 sm:w-48 lg:h-52 lg:w-52 xl:h-56 xl:w-56 2xl:h-56 2xl:w-56 rounded-full object-cover transition-all duration-300 ${
            animationState === 'fade-out' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
          } ${!isImageLoaded ? 'opacity-0' : 'opacity-100'}`}
          src={resolvedImageUrl}
          alt={`Personnel`}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between p-5 mt-4">
        <button
          className="text-sm text-white bg-gray px-5 py-3 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-hoverBtn"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          className="text-sm text-white bg-bfpNavy px-5 py-3 rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg hover:bg-hoverBtn"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
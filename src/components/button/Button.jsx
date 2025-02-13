import React from 'react';

const Button = ({ value }) => {
  const isActive =
    value !== null &&
    value !== undefined &&
    value !== '' && // Handle empty string
    !(typeof value === 'string' && ['Loading...', 'No data available'].includes(value.trim()));

  return (
    <button
      className={`px-4 py-1 rounded-2xl text-[18px] ${
        isActive ? 'bg-btnActive text-btnFontActive' : 'bg-gray text-lightGray'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </button>
  );
};

export default Button;

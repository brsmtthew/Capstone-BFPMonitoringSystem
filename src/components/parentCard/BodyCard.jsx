import React from 'react';

function ParentCard({ children, className }) {
  return (
    <div className={`bg-lightGray shadow-md m-0 sm:m-2 md:m-3 lg:m-3 xl:m-4 2xl:m-4 rounded-xl p-4 lg:p-6 h-full ${className}`}>
      {children}
    </div>
  );
}

export default ParentCard;

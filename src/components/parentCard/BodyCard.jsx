import React from 'react';

function ParentCard({ children, className }) {
  return (
    <div className={`bg-lightGray shadow-md m-0 sm:m-2 md:m-3 lg:m-4 xl:m-5 2xl:m-6 rounded-xl p-6 lg:p-10 h-full ${className}`}>
      {children}
    </div>
  );
}

export default ParentCard;

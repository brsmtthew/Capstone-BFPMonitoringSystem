import React from 'react';

function ParentCard({ children, className }) {
  return (
    <div className={`bg-lightGray shadow-md m-6 rounded-xl p-6 lg:p-10 h-full ${className}`}>
      {children}
    </div>
  );
}

export default ParentCard;

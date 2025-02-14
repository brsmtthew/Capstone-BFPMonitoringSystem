import React from 'react';

function DeletePersonnelModal({ isOpen, closeModal, onConfirm, personnel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-bfpNavy rounded-lg shadow dark:bg-gray-700">
          <div className="p-4 md:p-5 text-center">
            <svg
              className="mx-auto mb-4 text-white w-12 h-12"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="Yellow"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-white dark:text-gray-400">
              Are you sure you want to delete this record?
            </h3>
            <button
              type="button"
              className="text-white bg-red hover:bg-hoverBtn focus:ring-4 focus:outline-none focus:ring-red dark:focus:ring-red font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={() => onConfirm(personnel)}
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              className="text-white py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-gray rounded-lg border border-gray hover:bg-hoverBtn hover:text-blue focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              onClick={closeModal}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeletePersonnelModal;

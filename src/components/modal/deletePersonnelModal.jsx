import React from 'react';
import { useNavigate } from 'react-router-dom';

function DeletePersonnelModal({ isOpen, closeModal, handleDelete }) {
  const navigate = useNavigate();

  const onDelete = async () => {
    try {
      // Perform the delete action (assuming handleDelete is an async function)
      await handleDelete();

      // Close the modal
      closeModal();

      // Optionally, navigate back to the previous page or to another route
      navigate(''); // default route or the current page.
    } catch (error) {
      console.error('Error deleting personnel:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-modalCard rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={closeModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <svg
              className="mx-auto mb-4 text-white w-12 h-12 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-white dark:text-gray-400">
              Are you sure you want to delete this personnel record?
            </h3>
            <button
              type="button"
              className="text-white bg-red hover:bg-gray focus:ring-4 focus:outline-none focus:ring-red dark:focus:ring-red font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={onDelete} // Trigger delete and close actions
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              className="text-white py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-modalButton rounded-lg border border-gray hover:bg-gray hover:text-blue focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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

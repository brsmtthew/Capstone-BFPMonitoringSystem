import React from 'react';

function NotificationCard({ notifications }) {
  return (
    <div className="h-96 w-80 bg-white rounded-lg shadow-lg flex flex-col">
      {/* Navbar Section (Static Title and Description) */}
      <div className="p-2 bg-bfpNavy rounded-lg text-white flex flex-col items-start">
        <h3 className="text-lg font-bold">Notification</h3>
        <p className="text-sm text-gray-300">This is a sample notification description</p>
      </div>

      {/* Content Section */}
      <div className="flex-grow p-4 flex flex-col items-center justify-start">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="flex items-center mb-2 p-2 bg-red text-white rounded-lg w-full">
              <span>{notification.message}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No notifications at the moment</div>
        )}
      </div>
    </div>
  );
}

export default NotificationCard;

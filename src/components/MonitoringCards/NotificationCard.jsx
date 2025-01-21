import React from 'react';
import { useStore } from '../store/useStore';

function NotificationCard({ personnel }) {
  const { notifications, clearNotifications, selectedPersonnel } = useStore();

  // Function to format timestamp to desired format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day}/${year} time ${hour}:${minute}`;
  };

  // Filter notifications based on the personnel's gearId
  const filteredNotifications = notifications.filter(
    (notification) => notification.gearId === personnel.gearId
  );

  return (
    <div className="h-96 w-80 bg-white rounded-lg shadow-lg flex flex-col">
      <div className="p-4 bg-bfpNavy rounded-lg text-white flex justify-between items-center">
        <h3 className="text-[20px] font-bold">Notification</h3>
        <button
          className="text-xs text-white bg-red px-6 py-3 rounded-lg hover:bg-bfpOrange"
          onClick={clearNotifications}
        >
          Clear
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 p-2 bg-red text-white rounded-lg"
            >
              <span>{notification.message}</span>
              <span className="text-xs text-white">
                {formatTimestamp(notification.timestamp)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray">No notifications for the selected personnel</div>
        )}
      </div>
    </div>
  );
}

export default NotificationCard;

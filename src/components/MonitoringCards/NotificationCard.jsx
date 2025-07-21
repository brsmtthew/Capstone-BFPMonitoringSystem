import React from 'react';
import { useStore } from '../store/useStore';

function NotificationCard({ personnel }) {
  const { notifications, clearNotifications } = useStore();

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

  // Function to compute severity ratio as a percentage
  const computeSeverityRatio = () => {
    const totalSensors = 4;
    if (filteredNotifications.length === 0) return 0;

    // Group notifications by sensorType and keep only the latest notification for each sensor
    const sensorLatest = {};
    filteredNotifications.forEach(notification => {
      const sensor = notification.sensor;
      // If there isn't an entry yet or the current notification is newer, update it
      if (
        !sensorLatest[sensor] ||
        sensorLatest[sensor].timestamp < notification.timestamp
      ) {
        sensorLatest[sensor] = notification;
      }
    });

    // Count how many sensors are in a critical state based on their latest notification
    const criticalCount = Object.values(sensorLatest).filter(
      n => n.isCritical
    ).length;

    // Each sensor accounts for 20% (i.e. 1/5 of 100%)
    const ratio = (criticalCount / totalSensors) * 100;
    return Math.min(Math.round(ratio), 100);
  };

  const severityRatio = computeSeverityRatio();

  //Determining the color of the severity ratio bar
  const getSeverityColor = () => {
    if (severityRatio === 0) return 'bg-green';
    if (severityRatio <= 25) return 'bg-yellow';
    if (severityRatio <= 75) return 'bg-bfpOrange';
    return 'bg-red';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col 
                    h-80 w-full sm:w-full md:w-full lg:w-full xl:w-96 2xl:w-96 font-montserrat">
      <div className="p-3 bg-bfpNavy rounded-t-lg text-white flex justify-between items-center">
        <h3 className="text-[18px] font-bold">Notification</h3>
        {/* <button
          className="text-xs text-white bg-red px-6 py-3 rounded-lg hover:bg-bfpOrange"
          onClick={clearNotifications}
        >
          Clear
        </button> */}
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <div
              key={index}
              className={`flex justify-between items-center mb-2 p-2 rounded-lg ${
                notification.isCritical ? 'bg-red text-white' : 'bg-green text-white'
              }`}
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
      {/* Severity Ratio Section */}
      <div className="p-2 border-t border-black">
        <div className="w-full rounded-full h-1">
        <div
          className={`h-full p-1 rounded-full ${getSeverityColor()}`}
          style={{ width: `${severityRatio}%` }}
        ></div>
        </div>
        <p className="text-md font-bold text-center mt-1">
          Severity Ratio of {severityRatio}%
        </p>
      </div>
    </div>
  );
}

export default NotificationCard;

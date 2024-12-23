import React, { useState, useEffect, useRef } from 'react';

function NotificationCard({ temperature, environmentalTemperature, lastUpdatedTemp, lastUpdatedEnvTemp }) {
  const [notifications, setNotifications] = useState([]);
  const notificationSetRef = useRef(new Set()); // Tracks added notifications to prevent duplicates

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`;
  };

  // Monitor body temperature timeout
  useEffect(() => {
    if (lastUpdatedTemp) {
      const timer = setInterval(() => {
        if (Date.now() - lastUpdatedTemp > 30000) {
          const message = 'No body temperature data received within 30 seconds';
          if (!notificationSetRef.current.has(message)) {
            notificationSetRef.current.add(message);
            setNotifications((prev) => [
              { message, timestamp: formatTimestamp(Date.now()) },
              ...prev,
            ]);
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lastUpdatedTemp]);

  // Monitor environmental temperature timeout
  useEffect(() => {
    if (lastUpdatedEnvTemp) {
      const timer = setInterval(() => {
        if (Date.now() - lastUpdatedEnvTemp > 30000) {
          const message = 'No environmental temperature data received within 30 seconds';
          if (!notificationSetRef.current.has(message)) {
            notificationSetRef.current.add(message);
            setNotifications((prev) => [
              { message, timestamp: formatTimestamp(Date.now()) },
              ...prev,
            ]);
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lastUpdatedEnvTemp]);

  // Monitor critical body temperature
  useEffect(() => {
    if (temperature >= 40) {
      const message = 'Critical Body Temperature Detected!';
      if (!notificationSetRef.current.has(message)) {
        notificationSetRef.current.add(message);
        setNotifications((prev) => [
          { message, timestamp: formatTimestamp(Date.now()) },
          ...prev,
        ]);
      }
    }
  }, [temperature]);

  // Monitor critical environmental temperature
  useEffect(() => {
    if (environmentalTemperature >= 40) {
      const message = 'Critical Environmental Temperature Detected!';
      if (!notificationSetRef.current.has(message)) {
        notificationSetRef.current.add(message);
        setNotifications((prev) => [
          { message, timestamp: formatTimestamp(Date.now()) },
          ...prev,
        ]);
      }
    }
  }, [environmentalTemperature]);

  return (
    <div className="h-96 w-80 bg-white rounded-lg shadow-lg flex flex-col">
      {/* Header Section */}
      <div className="p-2 bg-bfpNavy rounded-lg text-white">
        <h3 className="text-lg font-bold">Notification</h3>
      </div>

      {/* Scrollable Notifications Section */}
      <div className="flex-grow p-4 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-2 p-2 bg-red text-white rounded-lg"
            >
              <span>{notification.message}</span>
              <span className="text-xs text-white">{notification.timestamp}</span>
            </div>
          ))
        ) : (
          <div className="text-gray">No notifications at the moment</div>
        )}
      </div>
    </div>
  );
}

export default NotificationCard;

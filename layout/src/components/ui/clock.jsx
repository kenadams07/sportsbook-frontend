import React, { useEffect, useState } from 'react';

export const Clock = React.memo(() => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12 || 12;
      const paddedHour = hours.toString().padStart(2, '0');

      const formattedTime = `${paddedHour}:${minutes}:${seconds} ${ampm}`;
      setCurrentTime(formattedTime);
    };

    updateTime(); // Initial render
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-clock-bg text-white text-sm py-1 px-1 md:px-3 rounded-md border border-gray-500">
      {currentTime}
    </div>
  );
});

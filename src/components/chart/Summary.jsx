import React from 'react';

function Summary({
  name = '',
  date = '',
  time = '',
  HeartRate = [],
  temperatureData = [],
  smokeData = [],
  enviData = [],
  ToxicGas = []
}) {
  console.log('Sensor data', { HeartRate, temperatureData, smokeData, enviData, ToxicGas });

  // Helper to compute average
  const computeAverage = (series) => {
    if (!series.length) return 0;
    const sum = series.reduce((acc, item) => acc + item.value, 0);
    return sum / series.length;
  };

  // Helper to compute breach count and danger time based on fixed interval (5 seconds)
  const computeThresholdMetrics = (series, threshold) => {
    if (!series.length) return { breachCount: 0, dangerSeconds: 0 };

    let breachCount = 0;
    let wasBelow = true;
    const intervalSeconds = 5;
    let dangerCount = 0;

    series.forEach((item) => {
      if (item.value >= threshold) {
        // count every item for danger time
        dangerCount += 1;
        // count breach once per continuous sequence
        if (wasBelow) {
          breachCount += 1;
          wasBelow = false;
        }
      } else {
        wasBelow = true;
      }
    });

    const dangerSeconds = dangerCount * intervalSeconds;
    return { breachCount, dangerSeconds };
  };

  // Helper to format seconds into human-readable string
  const formatSeconds = (sec) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    const parts = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds) parts.push(`${seconds}s`);
    return parts.join(' ') || '0s';
  };

  // Define sensors and their thresholds
  const sensors = [
    { title: 'Heart Rate', series: HeartRate, threshold: 100 },
    { title: 'Body Temp', series: temperatureData, threshold: 40 },
    { title: 'Smoke Level', series: smokeData, threshold: 450 },
    { title: 'Env Temp', series: enviData, threshold: 40 },
    { title: 'Toxic Gas', series: ToxicGas, threshold: 350 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col text-left max-w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-black">{name || 'Unknown'}</h2>
          <p className="text-md text-black mt-1">
            {date} &bull; {time}
          </p>
        </div>
        <div className="flex items-center bg-bfpNavy px-4 py-2 rounded-lg shadow-inner">
          <h3 className="text-white text-lg font-bold">Sensors Overview</h3>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sensors.map((sensor, idx) => {
          const avg = computeAverage(sensor.series).toFixed(1);
          const { breachCount, dangerSeconds } = computeThresholdMetrics(sensor.series, sensor.threshold);
          const dangerTime = formatSeconds(dangerSeconds);

          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-bfpNavy/90 to-bfpNavy rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-200"
            >
              <h4 className="font-semibold mb-4 text-white flex items-center">
                {/* sensor icon placeholder: replace with actual icon component */}
                {sensor.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray p-4 text-center">
                  <p className="text-xs text-black uppercase">Average</p>
                  <p className="text-2xl font-bold text-black mt-1">{avg}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray p-4 text-center">
                  <p className="text-xs text-black uppercase">Breaches</p>
                  <p className="text-2xl font-bold text-black mt-1">{breachCount}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray p-4 text-center">
                  <p className="text-[10px] text-black uppercase">Risk Duration</p>
                  <p className="text-1xl font-bold text-black mt-1">{dangerTime}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Summary;
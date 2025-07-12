import React from "react";

function Summary({
  name = "",
  date = "",
  time = "",
  gearId = "",
  temperatureData = [],
  smokeData = [],
  enviData = [],
  ToxicGas = [],
  startMonth = "",
  endMonth = "",
  selectedMonth = "",
  outliers = { smoke: [], envi: [], toxic: [], temp: [] },
}) {
  console.log("Sensor data", {
    temperatureData,
    smokeData,
    enviData,
    ToxicGas,
  });

  // Helper to compute min and max values
  const computeRange = (series) => {
    if (!series.length) return { min: 0, max: 0 };
    const values = series.map((item) => item.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const computeStandardDeviation = (series) => {
    if (!series.length) return 0;
    const values = series.map((item) => item.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance =
      squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(variance);
  };

  // Helper to compute breach count and danger time based on fixed interval (5 seconds)
  const computeThresholdMetrics = (series, threshold) => {
    let breachCount = 0;
    let dangerMs = 0;
    let inBreach = false;

    const sorted = series
      .slice()
      .sort(
        (a, b) =>
          new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`)
      );

    sorted.forEach((item) => {
      const value = item.value;

      if (value >= threshold) {
        dangerMs += 5000; // Every breach data point counts as 5 seconds
        if (!inBreach) {
          breachCount += 1;
          inBreach = true;
        }
      } else {
        inBreach = false;
      }
    });

    return { breachCount, dangerSeconds: Math.round(dangerMs / 1000) };
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
    return parts.join(" ") || "0s";
  };

  const getSensorDescription = (
    title,
    dangerSeconds,
    dangerLevels,
    maxValue
  ) => {
    const { warn, danger } = dangerLevels;

    const baseMessage = () => {
      const suggestion = contextSuggestion();
      if (dangerSeconds >= danger) {
        switch (title) {
          case "Body Temp":
            return "🔥 Prolonged elevated body temperature — potential heatstroke risk. Recommend immediate medical assessment after the mission.";
          case "Env Temp":
            return "🌡️ Sustained exposure to extreme heat — may contribute to heat exhaustion. Recommend full recovery monitoring.";
          case "Smoke Level":
            return "🚨 Extended smoke exposure detected — high risk for respiratory irritation or injury. Strongly advise post-operation health screening.";
          case "Toxic Gas":
            return "☠️ High-level toxic gas exposure logged — potential risk of poisoning. Medical follow-up is essential.";
          default:
            return "⚠️ Prolonged exposure recorded — consider thorough medical evaluation.";
        }
      } else if (dangerSeconds >= warn) {
        switch (title) {
          case "Body Temp":
            return "🌡️ Elevated body temperature noted — recommend hydration and routine medical checkup.";
          case "Env Temp":
            return "🌞 High ambient temperature exposure — ensure proper rest and hydration post-operation.";
          case "Smoke Level":
            return "🚬 Noticeable smoke exposure — advisable to monitor for respiratory symptoms and consider clinic evaluation.";
          case "Toxic Gas":
            return "🧪 Brief toxic gas exposure recorded — recommend follow-up checkup depending on symptoms.";
          default:
            return "⚠️ Moderate exposure recorded — medical checkup may be beneficial.";
        }
      } else if (suggestion) {
        return "";
      } else {
        return "✅ No significant risk duration recorded for this sensor.";
      }
    };

    const contextSuggestion = () => {
      switch (title) {
        case "Body Temp":
          if (maxValue >= 39.6) {
            return "⚠️ Peak core temperature exceeded 39.6°C — risk of heat-related illness. Immediate cooling and monitoring advised.";
          }
          break;
        case "Env Temp":
          if (maxValue >= 272) {
            return "🔥 Environment reached up to 272°C — turnout gear performance may degrade. Ensure proper inspection of PPE.";
          }
          break;
        case "Smoke Level":
          if (maxValue >= 200) {
            return "🚨 Smoke levels reached 200 — exceeds NIOSH ceiling. Possible hypoxia or long-term respiratory effects.";
          }
          break;
        case "Toxic Gas":
          if (maxValue >= 200) {
            return "☣️ Toxic gas levels critical — potential interference with oxygen transport. Monitor for mental fatigue or low physical performance.";
          }
          break;
        default:
          return "";
      }
      return "";
    };

    const base = baseMessage();
    const context = contextSuggestion();

    if (base && context) {
      return (
        <ul className="list-disc list-inside text-left ml-5">
          <li>{context}</li>
          <li>{base}</li>
        </ul>
      );
    } else if (base) {
      return base;
    } else if (context) {
      return context;
    } else {
      return "";
    }
  };

  // Define sensors and their thresholds
  const sensors = [
    {
      title: "Body Temp",
      series: temperatureData,
      threshold: 45,
      dangerLevels: { warn: 20, danger: 50 },
    },
    {
      title: "Smoke Level",
      series: smokeData,
      threshold: 100,
      dangerLevels: { warn: 20, danger: 50 },
    },
    {
      title: "Env Temp",
      series: enviData,
      threshold: 50,
      dangerLevels: { warn: 20, danger: 50 },
    },
    {
      title: "Toxic Gas",
      series: ToxicGas,
      threshold: 150,
      dangerLevels: { warn: 10, danger: 20 },
    },
  ];

  const isLoading = !name && !date && !time;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col text-left max-w-full">
      {/* Header */}
      <div className="mb-4">
        {/* Centered Sensors Overview */}
        <div className="flex justify-center mb-3">
          <div className="bg-bfpNavy px-4 py-2 rounded-lg shadow-inner">
            <h3 className="text-white text-2xl font-bold">
              Sensor Exposure & Risk Summary
            </h3>
          </div>
        </div>

        {/* Left-aligned name and date/time */}
        <div className="ml-4 space-y-1">
          {isLoading ? (
            <>
              <div className="h-6 bg-gray rounded-md w-32 animate-pulse"></div>
              <div className="h-4 bg-gray rounded-md w-48 animate-pulse"></div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-black">
                {name || "Unknown"}{" "}
                <span className="text-sm text-gray">
                  ({gearId || "No Gear ID"})
                </span>
              </h2>
              {selectedMonth ? (
                <p className="text-md text-black mt-1">
                  Month: <strong>{selectedMonth}</strong>
                </p>
              ) : (
                <p className="text-md text-black mt-1">
                  Date: {date} • {time}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {sensors.map((sensor, idx) => {
          const { min, max } = computeRange(sensor.series);
          const { breachCount, dangerSeconds } = computeThresholdMetrics(
            sensor.series,
            sensor.threshold
          );
          const dangerTime = formatSeconds(dangerSeconds);
          const stdDev = computeStandardDeviation(sensor.series);

          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-bfpNavy/90 to-bfpNavy rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 transition-all duration-200">
              <h4 className="font-semibold mb-4 text-white flex items-center">
                {/* sensor icon placeholder: replace with actual icon component */}
                {sensor.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font">
                <div className="bg-white rounded-lg border border-gray p-4 text-center">
                  <p className="text-xs text-black uppercase">Range</p>
                  <p className="text-2xl font-bold text-black mt-1">
                    {min.toFixed(1)} - {max.toFixed(1)}
                  </p>
                </div>
                {/* <div className="bg-white rounded-lg border border-gray p-4 text-center">
                  <p className="text-xs text-black uppercase">Std Dev</p>
                  <p className="text-2xl font-bold text-black mt-1">{stdDev.toFixed(2)}</p>
                </div> */}
                <div className="bg-white rounded-lg border border-gray p-4 text-center">
                  <p className="text-xs text-black uppercase">Breaches</p>
                  <p className="text-2xl font-bold text-black mt-1">
                    {breachCount}
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-gray p-4 text-center">
                  <p className="text-[10px] text-black uppercase">
                    Risk Duration
                  </p>
                  <p className="text-1xl font-bold text-black mt-1">
                    {dangerTime}
                  </p>
                </div>
                {/* add a risk duration description here */}
                <div className="col-span-full mt-2 text-sm text-white text-center">
                  {getSensorDescription(
                    sensor.title,
                    dangerSeconds,
                    sensor.dangerLevels,
                    max
                  )}
                </div>
              </div>
              {/* Outlier Table */}
              {/* <div className="mt-10">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  📋 Outlier Records Summary
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300 text-sm">
                    <thead className="bg-bfpNavy text-white">
                      <tr>
                        <th className="py-2 px-4 border">Sensor</th>
                        <th className="py-2 px-4 border">Date</th>
                        <th className="py-2 px-4 border">Time</th>
                        <th className="py-2 px-4 border">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["temp", "smoke", "envi", "toxic"].flatMap((key) =>
                        outliers[key].map((item, idx) => (
                          <tr key={`${key}-${idx}`} className="text-center">
                            <td className="py-1 px-2 border font-medium">
                              {key === "temp"
                                ? "Body Temp"
                                : key === "smoke"
                                ? "Smoke"
                                : key === "envi"
                                ? "Env Temp"
                                : "Toxic Gas"}
                            </td>
                            <td className="py-1 px-2 border">{item.date}</td>
                            <td className="py-1 px-2 border">{item.time}</td>
                            <td className="py-1 px-2 border text-red-600 font-semibold">
                              {item.value}
                            </td>
                          </tr>
                        ))
                      )}
                      <tr className="bg-gray-100 font-semibold text-center">
                        <td className="py-2 px-4 border text-right" colSpan={3}>
                          Total Outliers:
                        </td>
                        <td className="py-2 px-4 border text-red-600">
                          {Object.values(outliers).reduce((acc, cur) => acc + cur.length, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Summary;

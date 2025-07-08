import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/Firebase";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-sm">
        <p className="font-bold">{label}</p>
        <p>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const BarangayChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [weekFilter, setWeekFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");

  const [yearOptions, setYearOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);
  const [dayOptions, setDayOptions] = useState([]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "personnelRecords"));
        const allRecords = snapshot.docs.map((doc) => {
          const record = doc.data();
          const date = record.date?.seconds
            ? new Date(record.date.seconds * 1000)
            : new Date(record.date);

          // Week of the month (Assuming Sunday is the first day of the week)
          const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          const dayOfMonth = date.getDate();
          const week = Math.ceil((dayOfMonth + firstDay.getDay()) / 7);

          return {
            location: record.location || "Unknown",
            date: date,
            year: date.getFullYear(),
            month: date.getMonth(), // 0 = January
            week: week,
            day: dayOfMonth,
          };
        });

        setData(allRecords);

        const years = Array.from(
          new Set(allRecords.map((item) => item.year))
        ).sort((a, b) => a - b);
        setYearOptions(years);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  useEffect(() => {
    if (yearFilter) {
      const monthsWithData = new Set(
        data
          .filter((item) => item.year === parseInt(yearFilter))
          .map((item) => item.month)
      );

      // Create an array of all 12 months with a disabled flag
      const allMonths = Array.from({ length: 12 }, (_, index) => ({
        value: index,
        label: new Date(0, index).toLocaleString("default", { month: "long" }),
        disabled: !monthsWithData.has(index),
      }));

      setMonthOptions(allMonths);

      setMonthFilter("");
      setWeekFilter("");
      setDayFilter("");
      setWeekOptions([]);
      setDayOptions([]);
    }
  }, [yearFilter, data]);

  useEffect(() => {
    if (yearFilter && monthFilter !== "") {
      const weeks = Array.from(
        new Set(
          data
            .filter(
              (item) =>
                item.year === parseInt(yearFilter) &&
                item.month === parseInt(monthFilter)
            )
            .map((item) => item.week)
        )
      ).sort((a, b) => a - b);
      setWeekOptions(weeks);
      setWeekFilter("");
      setDayFilter("");
      setDayOptions([]);
    }
  }, [monthFilter, yearFilter, data]);

  useEffect(() => {
    if (yearFilter && monthFilter !== "" && weekFilter !== "") {
      const daysInWeek = Array.from(
        new Set(
          data
            .filter(
              (item) =>
                item.year === parseInt(yearFilter) &&
                item.month === parseInt(monthFilter) &&
                item.week === parseInt(weekFilter)
            )
            .map((item) => item.day)
        )
      ).sort((a, b) => a - b);
      setDayOptions(daysInWeek);
      setDayFilter("");
    } else {
      setDayOptions([]);
      setDayFilter("");
    }
  }, [weekFilter, monthFilter, yearFilter, data]);

  useEffect(() => {
    applyFilter();
  }, [data, yearFilter, monthFilter, weekFilter, dayFilter]);

  const applyFilter = () => {
    let filtered = data;

    if (yearFilter) {
      filtered = filtered.filter((item) => item.year === parseInt(yearFilter));
    }
    if (monthFilter !== "") {
      filtered = filtered.filter(
        (item) => item.month === parseInt(monthFilter)
      );
    }
    if (weekFilter !== "") {
      filtered = filtered.filter((item) => item.week === parseInt(weekFilter));
    }
    if (dayFilter !== "") {
      filtered = filtered.filter((item) => item.day === parseInt(dayFilter));
    }

    const countMap = {};
    filtered.forEach((item) => {
      countMap[item.location] = (countMap[item.location] || 0) + 1;
    });

    const chartData = Object.entries(countMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);

    setFilteredData(chartData);
  };

  return (
    <div className="h-full max-h-full w-full bg-bfpNavy rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-3 bg-bfpNavy rounded-t-lg text-white text-center">
        <h3 className="text-lg font-bold">Incidents per Barangay</h3>
        <p className="text-sm">Number of Incidents per Barangay</p>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex justify-center flex-wrap gap-2 mt-2 mb-2">
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-3 py-1 rounded text-bfpNavy text-sm">
          <option value="">Select Year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="px-3 py-1 rounded text-bfpNavy text-sm"
          disabled={!yearFilter}>
          <option value="">Select Month</option>
          {monthOptions.map(({ value, label, disabled }) => (
            <option key={value} value={value} disabled={disabled}>
              {label}
            </option>
          ))}
        </select>

        {/* <select
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
          className="px-3 py-1 rounded text-bfpNavy text-sm"
          disabled={!yearFilter || monthFilter === ""}>
          <option value="">Select Week</option>
          {weekOptions.map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select> */}

        {/* <select
          value={dayFilter}
          onChange={e => setDayFilter(e.target.value)}
          className="px-3 py-1 rounded text-bfpNavy text-sm"
          disabled={!yearFilter || monthFilter === '' || weekFilter === ''}
        >
          <option value="">Select Day</option>
          {dayOptions.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select> */}
      </div>

      {/* Chart */}
      <div className="flex-grow p-4 h-72 w-auto">
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
              <XAxis
                dataKey="location"
                tick={{ fill: "#fff", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={30}
              />
              <YAxis tick={{ fill: "#fff" }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BarangayChart;

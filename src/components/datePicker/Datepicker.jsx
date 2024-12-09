import React, { useState } from "react";
import Datepicker from "./Datepicker";

function App() {
  const [birthdate, setBirthdate] = useState("");

  const handleDateChange = (date) => {
    setBirthdate(date);
    console.log("Selected Date:", date);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">React Date Picker Example</h1>
      <Datepicker label="Select Birthdate" value={birthdate} onChange={handleDateChange} />
      <p className="mt-4">Selected Date: {birthdate}</p>
    </div>
  );
}

export default App;

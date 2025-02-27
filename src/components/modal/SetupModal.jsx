import React, { useState } from 'react';

function SetupModal({ onClose, onSave }) {
  const [config, setConfig] = useState({
    heartRate: { normal: '', critical: '' },
    bodyTemperature: { normal: '', critical: '' },
    environmentalTemperature: { normal: '', critical: '' },
    smoke: { normal: '', critical: '' },
    toxic: { normal: '', critical: '' },
    saveInterval: ''
  });

  const handleChange = (sensor, field, value) => {
    if (sensor === 'saveInterval') {
      setConfig(prev => ({ ...prev, saveInterval: value }));
    } else {
      setConfig(prev => ({
        ...prev,
        [sensor]: { ...prev[sensor], [field]: value }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Configuration saved:', config);
    if (onSave) onSave(config);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-lightGray rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[24px] font-bold text-black">Sensor Threshold Setup</h2>
          <button onClick={onClose} aria-label="Close" className="text-black hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heart Rate */}
            <div className="space-y-4">
              <h3 className="text-[18px] font-semibold text-black">Heart Rate</h3>
              <p className="text-black text-[14px]">Ideal threshold: 60–100 BPM.</p>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-[14px] font-medium text-black">Normal (BPM)</label>
                  <input
                    type="number"
                    value={config.heartRate.normal}
                    onChange={(e) => handleChange('heartRate', 'normal', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-[14px] font-medium text-black">Critical (BPM)</label>
                  <input
                    type="number"
                    value={config.heartRate.critical}
                    onChange={(e) => handleChange('heartRate', 'critical', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Environmental Temperature */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Environmental Temperature</h3>
              <p className="text-black text-sm">Ideal threshold: 20°C–25°C.</p>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-black">Normal (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.environmentalTemperature.normal}
                    onChange={(e) => handleChange('environmentalTemperature', 'normal', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-black">Critical (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.environmentalTemperature.critical}
                    onChange={(e) => handleChange('environmentalTemperature', 'critical', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Body Temperature */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Body Temperature</h3>
              <p className="text-black text-sm">Ideal threshold: 36.5°C–37.5°C.</p>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-black">Normal (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.bodyTemperature.normal}
                    onChange={(e) => handleChange('bodyTemperature', 'normal', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-black">Critical (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.bodyTemperature.critical}
                    onChange={(e) => handleChange('bodyTemperature', 'critical', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Smoke */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Smoke</h3>
              <p className="text-black text-sm">Ideal threshold: Minimal levels (0–50 PPM).</p>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-black">Normal (PPM)</label>
                  <input
                    type="number"
                    value={config.smoke.normal}
                    onChange={(e) => handleChange('smoke', 'normal', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-black">Critical (PPM)</label>
                  <input
                    type="number"
                    value={config.smoke.critical}
                    onChange={(e) => handleChange('smoke', 'critical', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Save Interval */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Save Interval</h3>
              <p className="text-black text-sm">Ideal Saving Interval: 30 Seconds.</p>
              <div>
                <label className="block text-sm font-medium text-black">Interval (seconds)</label>
                <input
                  type="number"
                  value={config.saveInterval}
                  onChange={(e) => handleChange('saveInterval', null, e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                />
              </div>
            </div>

            {/* Toxic */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">Toxic</h3>
              <p className="text-black text-sm">Ideal threshold: Very low (0–10 PPM).</p>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-black">Normal (PPM)</label>
                  <input
                    type="number"
                    value={config.toxic.normal}
                    onChange={(e) => handleChange('toxic', 'normal', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-black">Critical (PPM)</label>
                  <input
                    type="number"
                    value={config.toxic.critical}
                    onChange={(e) => handleChange('toxic', 'critical', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 justify-center items-center">
            <button
              type="submit"
              className="w-1/2 py-2 bg-bfpNavy text-white font-semibold rounded-full hover:bg-hoverBtn"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SetupModal;
